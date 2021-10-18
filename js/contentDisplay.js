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

var mainVideoDisplayWidth;var mainVideoDisplayHeight
var mainVideoDisplayHeight;

var tabSelectors = document.getElementsByClassName("main-tab-selector");
var tabs = document.getElementsByClassName("main-tab");

var isPlaying = false;

var mainVideo;
var currentFrame = 0;
var frameCount;

function updateSizes(){
    mainVideoDisplayHeight = mainVideoDisplay.getBoundingClientRect().bottom - mainVideoDisplay.getBoundingClientRect().top;
    mainVideoDisplayWidth = mainVideoDisplay.getBoundingClientRect().right - mainVideoDisplay.getBoundingClientRect().left;

    mainVideoCanvas.style.marginTop = "-" + mainVideoDisplayHeight + "px";
    mainVideoCanvas.style.height = mainVideoDisplayHeight + "px";
    mainVideoContainer.style.height = mainVideoDisplayHeight + "px";
    videoProgressBar.style.width = mainVideoDisplayWidth + "px";
}


function setTab(tabName){
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

function setVideoStatus(status) {
    switch(status) {
        case "finished":
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

        case "uploaded":
            
            loadVideoData();

            if(! mainVideoDisplay.canPlayType(mainVideo.data.type)){
                alert("Video cannot be loaded")
                document.getElementById("videoUploadStatus").style.display = "none";
                break
            }

            document.getElementById("videoUploaderSection").style.display = "none";
            document.getElementById("videoFrameRateSection").style.display = "";

            break;

        case "uploading":
            document.getElementById("videoUploadStatus").style.display = "";
            break;

        default:
            console.error(status + " is not a valid status")
    }

}

function playVideo(){
    isPlaying = true;
    document.getElementById("pauseIcon").style.display = "initial";
    document.getElementById("playIcon").style.display = "none";
    
    mainVideoDisplay.play();
}

function pauseVideo(){
    isPlaying = false;
    document.getElementById("pauseIcon").style.display = "none";
    document.getElementById("playIcon").style.display = "initial";

    mainVideoDisplay.pause();
}

function togglePlaying(){
    if (isPlaying) {
        pauseVideo();
    } else {
        playVideo();
    }
}

function loadVideoData() {
    mainVideo = new Video(document.getElementById("videoUploader").files[0], URL.createObjectURL(document.getElementById("videoUploader").files[0]), 0, 0);
    mainVideoDisplaySource.src = mainVideo.path;
}

function nextFrame(){
    if(currentFrame < frameCount){
        currentFrame = currentFrame + 1;
        updateFrame();
    }
}

function previousFrame(){
    if(currentFrame > 0){
        currentFrame = currentFrame - 1;
        updateFrame();
    }
}

function setFrame(frame){
    currentFrame = parseInt(frame);
    updateFrame();
}

function updateFrame(){
    mainVideoDisplay.currentTime = currentFrame / mainVideo.framerate;
    videoProgressIndicator.value = currentFrame;
    document.getElementById("frameCounter").innerHTML = ("Frame " + currentFrame + " of " + frameCount);
}

var frameUpdater = setInterval(
    function(){
        if(isPlaying){
            currentFrame = Math.round(mainVideoDisplay.currentTime * mainVideo.framerate);
            videoProgressIndicator.value = currentFrame;
            document.getElementById("frameCounter").innerHTML = ("Frame " + currentFrame + " of " + frameCount);

            if(currentFrame > frameCount){
                pauseVideo();
            }
        }
    }, 10
)

window.onresize = updateSizes;

updateSizes();

setTab("upload")