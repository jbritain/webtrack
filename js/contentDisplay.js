function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var mainVideoDisplay = document.getElementById("mainVideoDisplay");
var mainVideoDisplaySource = document.getElementById("mainVideoDisplaySource");
var mainVideoCanvas = document.getElementById("mainVideoCanvas");
var mainVideoContainer = document.getElementById("mainVideoContainer");
var videoProgressBar = document.getElementById("videoProgress");
var videoProgressIndicator = document.getElementById("videoProgressIndicator");
var massSelector = document.getElementById("massSelector")
var massTrackButton = document.getElementById("massTrackButton")
var calibrationStickButton = document.getElementById("addCalibrationStick")

var mainVideoDisplayWidth;var mainVideoDisplayHeight
var mainVideoDisplayHeight;

var tabSelectors = document.getElementsByClassName("main-tab-selector");
var tabs = document.getElementsByClassName("main-tab");

var isPlaying = false;

var mainVideo;
var currentFrame = 0;
var frameCount;

canvasCTX = mainVideoCanvas.getContext("2d");

function updateSizes(){ // reset the sizes of elements if page is resized
    mainVideoDisplayHeight = mainVideoDisplay.getBoundingClientRect().bottom - mainVideoDisplay.getBoundingClientRect().top;
    mainVideoDisplayWidth = mainVideoDisplay.getBoundingClientRect().right - mainVideoDisplay.getBoundingClientRect().left;

    mainVideoCanvas.style.marginTop = "-" + mainVideoDisplayHeight + "px";
    mainVideoCanvas.style.height = mainVideoDisplayHeight + "px";
    mainVideoContainer.style.height = mainVideoDisplayHeight + "px";
    videoProgressBar.style.width = mainVideoDisplayWidth + "px";
    mainVideoCanvas.height = mainVideoDisplay.videoHeight;
    mainVideoCanvas.width = mainVideoDisplay.videoWidth;
}

function setMode(mode){
    massTrackButton.innerHTML = "Track Mass";
    massTrackButton.setAttribute("onclick", "setMode('mass')");

    calibrationStickButton.innerHTML = "Set Calibration Stick";
    calibrationStickButton.setAttribute("onclick", "setMode('calibration')");
    trackingMode = "none";

    switch (mode) {
        case "mass":
            trackingMode = "mass";
            massTrackButton.innerHTML = "Cancel";
            massTrackButton.setAttribute("onclick", "setMode('none')");
            break;

        case "calibration":
            trackingMode = "calibration";
            calibrationStickButton.innerHTML = "Cancel";
            calibrationStickButton.setAttribute("onclick", "setMode('none')");
        
        case "none":
            break;
    }
}

function setTab(tabName){ // change tabs
    for (let tabSelector of tabSelectors) {
        tabSelector.removeAttribute("aria-current");
    }

    for (let tab of tabs) {
        tab.style.display="none";
    }
    
    document.getElementById(tabName + "TabSelector").ariaCurrent = "page";
    document.getElementById(tabName + "Tab").style.display = "";

    try{ // this is the only place I could make it do this when the video loads. It just means it will try to do it when you swap tabs, which sometimes doesn't work because we haven't loaded the video yet
        updateFrame();
        updateSizes();
        frameCount = Math.floor(mainVideo.framerate * mainVideoDisplay.duration);
        videoProgressIndicator.max = frameCount;
        updateFrame();
    } catch(error) {
        return
    }
}

function setVideoStatus(status) { // what is currently being done with the vidoe
    switch(status) {
        case "finished": // final stuff
            document.getElementById("videoUploaderSection").style.display = "none";
            document.getElementById("videoFrameRateSection").style.display = "none";
            document.getElementById("videoFinishedSection").style.display = "";
            mainVideo.framerate = parseFloat(document.getElementById("framerateInput").value);

            mainVideoDisplay.load();
            for(let e of document.getElementsByClassName("videoMissing")){
                e.style.display = "none";
            }

            mainVideo.duration = mainVideoDisplay.duration;

            updateFrame();
            break;

        case "uploaded": // video has been 'uploaded'
            
            loadVideoData();

            if(! mainVideoDisplay.canPlayType(mainVideo.data.type)){
                alert("Video cannot be loaded")
                document.getElementById("videoUploadStatus").style.display = "none";
                break
            }

            document.getElementById("videoUploaderSection").style.display = "none";
            document.getElementById("videoFrameRateSection").style.display = "";

            break;

        case "uploading": // duh
            document.getElementById("videoUploadStatus").style.display = "";
            break;

        default:
            console.error(status + " is not a valid status")
    }

}

function playVideo(){ // duh
    isPlaying = true;
    
    mainVideoDisplay.play();

    document.getElementById("pauseIcon").style.display = "initial";
    document.getElementById("playIcon").style.display = "none";
}

function pauseVideo(){ // duh
    isPlaying = false;

    mainVideoDisplay.pause();

    document.getElementById("pauseIcon").style.display = "none";
    document.getElementById("playIcon").style.display = "initial";
}

function togglePlaying(){ // duh
    if (isPlaying) {
        pauseVideo();
    } else {
        playVideo();
    }
}

function loadVideoData() { // duh
    mainVideo = new Video(document.getElementById("videoUploader").files[0], URL.createObjectURL(document.getElementById("videoUploader").files[0]), 0, 0);
    mainVideoDisplaySource.src = mainVideo.path;
}

function nextFrame(){ // duh
    if(currentFrame < frameCount){
        currentFrame = currentFrame + 1;
        updateFrame();
    }
}

function previousFrame(){ // duh
    if(currentFrame > 0){
        currentFrame = currentFrame - 1;
        updateFrame();
    }
}

function setFrame(frame){ // duh
    currentFrame = parseInt(frame);
    updateFrame();
}

function updateFrame(){ // updates the frame if it is changed
    mainVideoDisplay.currentTime = currentFrame / mainVideo.framerate;
    videoProgressIndicator.value = currentFrame;
    document.getElementById("frameCounter").innerHTML = ("Frame " + currentFrame + " of " + frameCount);
    drawCanvas();
}

var frameUpdater = setInterval( // updates the frame counter as video plays
    function(){
        if(isPlaying){
            currentFrame = Math.round(mainVideoDisplay.currentTime * mainVideo.framerate);
            videoProgressIndicator.value = currentFrame;
            document.getElementById("frameCounter").innerHTML = ("Frame " + currentFrame + " of " + frameCount);
            drawCanvas();

            if(currentFrame >= frameCount){
                pauseVideo();
            }
        }
    }, 10
)

window.onresize = updateSizes;

updateSizes();

setTab("upload") // upload tab by default