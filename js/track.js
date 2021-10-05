var mainVideo;
var mainVideoDisplay = document.getElementById("mainVideoDisplay");
var mainVideoDisplaySource = document.getElementById("mainVideoDisplaySource");
var mainVideoCanvas = document.getElementById("mainVideoCanvas");

var currentFrame;

class Video {
    constructor(data, path, framerate) {
        this.data = data;
        this.framerate = framerate;
        this.path = path;
    }
}

function loadVideoData() {
    mainVideo = new Video(document.getElementById("videoUploader").files[0], URL.createObjectURL(document.getElementById("videoUploader").files[0]), 0);
    mainVideoDisplaySource.src = mainVideo.path;
}

function updateSizes(){
    var mainVideoDisplayHeight = mainVideoDisplay.getBoundingClientRect().bottom - mainVideoDisplay.getBoundingClientRect().top;
    console.log(mainVideoDisplayHeight);
    mainVideoCanvas.style.marginTop = "-" + mainVideoDisplayHeight + "px";
    mainVideoCanvas.style.height = mainVideoDisplayHeight + "px";
}

window.onresize = updateSizes;

updateSizes();