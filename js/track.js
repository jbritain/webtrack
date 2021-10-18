function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var mainVideo;
var currentFrame = 0;
var frameCount;

var masses = [];



class Video {
    constructor(data, path, framerate, duration) {
        this.data = data;
        this.framerate = framerate;
        this.path = path;
    }
}

class Mass {
    constructor(name){
        this.name = name;
        this.data = []
    }
}

class Position {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

function addMass(){
    newMassName = prompt("Enter mass name", "Mass" + (masses.length + 1));
    masses.push(new Mass(newMassName));
    massSelector.disabled = false;

    newMass = document.createElement("option");
    newMass.value = newMassName;
    newMass.innerText = newMassName;

    massSelector.appendChild(newMass);
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