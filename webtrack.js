var currentFrame = 0;
var frameRate = 30;
var mainVideo;
var frameCounter;
var vidLoader;
var newVideo;

function pageInit(){
    mainVideo = document.getElementById("mainVideo");
    frameCounter = document.getElementById("frameCounter");
    vidLoader = document.getElementById("vidLoader");
}

function init(){
    frameRate = parseInt(prompt("Enter video framerate"));
    duration = mainVideo.duration;
    frameCount = Math.round(frameRate * duration);
    console.log("initialised!")
    changeFrame();
}

function nextFrame(){
    if(currentFrame < frameCount){
        currentFrame += 1;
        changeFrame();
    } else {
        currentFrame = 0;
        changeFrame();
    }
}

function previousFrame(){
    if(currentFrame > 0){
        currentFrame -= 1;
        changeFrame();
    } else {
        currentFrame = frameCount;
        changeFrame();
    }
}

function changeFrame(){
    mainVideo.currentTime = currentFrame / frameRate;

    frameCounter.innerHTML = "Current frame: " + String(currentFrame) + "/" + String(frameCount);
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
        mainVideo.src = reader.result;
        mainVideo.load();
        
    }
    , false);

    mainVideo.addEventListener('loadeddata', function() {
        init();
     }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }
}

async function playVideo() {
    for(i = currentFrame; i < frameCount; i++){
        nextFrame();
        await new Promise(r => setTimeout(r, 1000 / frameRate));

    }
    currentFrame = 0;
    changeFrame();
}