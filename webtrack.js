///      webtrack.js
// Copyright Joshua Britain, 2021


// VARIABLE DECLARATIONS
var currentFrame = 0;
var frameRate = 30;
var shouldPause = false;
var mainVideo;
var frameCounter;
var vidLoader;
var newVideo;
var playIcon;
var playButton;
var mainCanvas;
var stickCoord1 = [0, 0];
var stickCoord2 = [0, 0];
var rect;
var stickLength;
var distanceRatio;

var clickState = 0; // What action should be performed when the canvas is clicked, as listed below
// 0 - Do nothing
// 1 - Place first point for calibration stick
// 2 - Place second point for calibration stick
// 3 - Place point to indicate projectile location

 // Initialise all variables storing page elements
function pageInit(){
    mainVideo = document.getElementById("mainVideo");
    frameCounter = document.getElementById("frameCounter");
    vidLoader = document.getElementById("vidLoader");
    playIcon = document.getElementById("playIcon");
    playButton = document.getElementById("playButton");
    mainCanvas = document.getElementById("mainCanvas");
}

// Set values for variables that change per video
function init(){
    frameRate = parseInt(prompt("Enter video framerate")); // This does not technically matter as the video will always play at the correct speed but it means each frame will be representing a proper one
    duration = mainVideo.duration;
    frameCount = Math.round(frameRate * duration);
    changeFrame();

    mainCanvas.height = mainVideo.offsetHeight;
    mainCanvas.width = mainVideo.offsetWidth;
}

// Skips to next frame
function nextFrame(){
    if(currentFrame < frameCount){
        currentFrame += 1;
        changeFrame();
    } else {
        currentFrame = 0;
        changeFrame();
    }
}

// Skips back one frame
function previousFrame(){
    if(currentFrame > 0){
        currentFrame -= 1;
        changeFrame();
    } else {
        currentFrame = frameCount;
        changeFrame();
    }
}

// Updates the frame currently displayed by the video
function changeFrame(){
    mainVideo.currentTime = currentFrame / frameRate;

    frameCounter.innerHTML = "Current frame: " + String(currentFrame) + "/" + String(frameCount);
}
// Allows user to set calibration stick
function setStick(){
    document.body.style.cursor = "crosshair";
    document.getElementById("setStick").innerHTML = "Cancel";
    document.getElementById("setStick").setAttribute("onclick",  "resetStickButton()");
    clickState = 1;
}

// Resets the button and cursor for when you are setting the stick position
function resetStickButton(){
    document.body.style.cursor = "default";
    document.getElementById("setStick").innerHTML = "Set calibration stick";
    document.getElementById("setStick").setAttribute("onclick",  "setStick()");
}

// Loads new video file
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

// Plays the video frame by frame at the correct speed
async function playVideo() {
    playIcon.innerHTML = "pause";
    playButton.setAttribute("onclick",  "pauseVideo()");
    for(i = currentFrame; i < frameCount; i++){
        if(shouldPause == false){
            nextFrame();
            await new Promise(r => setTimeout(r, 1000 / frameRate));
        } else {
            break;
        }

    }
    if(currentFrame == frameCount){
        currentFrame = 0;
    }
    shouldPause = false;
    playIcon.innerHTML = "play_arrow";
    playButton.setAttribute("onclick",  "playVideo()");
}

//Pauses the video
function pauseVideo(){
    shouldPause = true;
}

//Executes something when canvas is clicked
function canvasClick() {
    rect = mainCanvas.getBoundingClientRect();
    
    if (clickState == 1){
        stickCoord1 = [event.clientX - rect.left, event.clientY - rect.top]

        clickState = 2;

    } else if (clickState == 2){
        stickCoord2 = [event.clientX - rect.left, event.clientY - rect.top]

        clickState = 0;
        document.body.style.cursor = "default";
        document.getElementById("setStick").innerHTML = "Set calibration stick";
        document.getElementById("setStick").setAttribute("onclick",  "setStick()");

        stickLength = prompt("Enter length of calibration stick")

        distanceRatio = stickLength / Math.sqrt(Math.pow(stickCoord1[0] - stickCoord2[0], 2), Math.pow(stickCoord1[1] - stickCoord2[1], 2))

        drawShapes()
    }
}

function drawShapes(){
    ctx = mainCanvas.getContext("2d");
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
    ctx.strokeStyle = "#0000FF";
    ctx.fillStyle = "#0000FF";
    ctx.lineWidth = 2;
    ctx.font = "20px Arial";
    
    // Calibration Stick

    ctx.strokeRect(stickCoord1[0] - 5, stickCoord1[1] - 5, 10, 10)
    ctx.strokeRect(stickCoord2[0] - 5, stickCoord2[1] - 5, 10, 10)
    ctx.fillStyle = "#0000FF";
    ctx.fillText(stickLength + ("m"), ((stickCoord1[0] + stickCoord2[0]) / 2) + 10, (stickCoord1[1] + stickCoord2[1]) / 2);

    ctx.beginPath();
    ctx.moveTo(stickCoord1[0], stickCoord1[1]);
    ctx.lineTo(stickCoord2[0], stickCoord2[1]);
    ctx.stroke();
}