var mainVideo;
var mainVideoDisplay = document.getElementById("mainVideoDisplay")
var mainVideoDisplaySource = document.getElementById("mainVideoDisplaySource")

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
    mainVideoDisplay.load();
}