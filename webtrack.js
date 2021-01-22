var currentFrame = 0;
var frameRate = 25;

var mainVideo
var frameCounter
var newVideo

function init(){
    mainVideo = document.getElementById("mainVideo");
    frameCounter = document.getElementById("frameCounter");
    vidLoader = document.getElementById("vidLoader");
}

function nextFrame(){
    currentFrame += 1;
    changeFrame();
}

function previousFrame(){
    if(currentFrame > 0){
        currentFrame -= 1;
        changeFrame();
    } else {
        alert("Already at start of video!")
    }
}

function changeFrame(){
    mainVideo.currentTime = currentFrame / frameRate;

    frameCounter.innerHTML = "Current frame: " + String(currentFrame);
}

function setStick(){
    document.body.style.cursor = "crosshair";
    document.getElementById("setStick").innerHTML = "Cancel";
    document.getElementById("setStick").setAttribute("onclick",  "resetStickButton()");
}

function resetStickButton(){
    document.body.style.cursor = "default";
    document.getElementById("setStick").innerHTML = "Set calibration stick";
    document.getElementById("setStick").setAttribute("onclick",  "setStick()");
}

function updateFile(){
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();
  
    reader.addEventListener("load", function () {
      // convert image file to base64 string
      mainVideo.src = reader.result;
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }
}