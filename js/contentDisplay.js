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

    updateFrame();
    updateSizes();
    frameCount = Math.floor(mainVideo.framerate * mainVideoDisplay.duration);
    updateFrame();
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
            console.log("???")
    }

}

async function playVideo(){
    while((currentFrame < frameCount) && isPlaying){
        nextFrame();
        await sleep(1000 / mainVideo.framerate);
    }
}

function togglePlaying(){
    if (isPlaying) {
        isPlaying = false;
        document.getElementById("pauseIcon").style.display = "none";
        document.getElementById("playIcon").style.display = "initial";
    } else {
        isPlaying = true;
        document.getElementById("pauseIcon").style.display = "initial";
        document.getElementById("playIcon").style.display = "none";
        playVideo();
    }
}

window.onresize = updateSizes;

updateSizes();

setTab("upload")