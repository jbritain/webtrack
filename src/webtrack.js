///      webtrack.js
// Copyright Joshua Britain, 2021



// VARIABLE DECLARATIONS
var currentFrame = 1;
var frameRate = 30;
var shouldPause = false;
var mainVideo;
var frameCounter;
var vidLoader;
var newVideo;
var playIcon;
var playButton;
var mainCanvas;
var stickCoord1
var stickCoord2
var rect;
var stickLength;
var distanceRatio;
var frameLocations = [];

var clickState = 0; // What action should be performed when the canvas is clicked, as listed below
// 0 - Do nothing
// 1 - Place first point for calibration stick
// 2 - Place second point for calibration stick
// 3 - Place point to indicate projectile location
// 4 - Debug info for mouse position

 // Initialise all variables storing page elements
function pageInit(){
    mainVideo = document.getElementById("mainVideo");
    frameCounter = document.getElementById("frameCounter");
    vidLoader = document.getElementById("vidLoader");
    playIcon = document.getElementById("playIcon");
    playButton = document.getElementById("playButton");
    mainCanvas = document.getElementById("mainCanvas");
}

function setSizes(){
    rect = mainCanvas.getBoundingClientRect();
    mainCanvas.height = mainVideo.offsetHeight;
    document.getElementById("mainContainer").style.height = mainVideo.offsetHeight;
    mainCanvas.width = mainVideo.offsetWidth;
}

// Set values for variables that change per video
function init(){
    frameRate = parseInt(prompt("Enter video framerate")); // This does not technically matter as the video will always play at the correct speed but it means each frame will be representing a proper one
    document.getElementById("setStick").disabled = false;
    previousButton = document.getElementById("previousButton").disabled = false;
    nextButton = document.getElementById("nextButton").disabled = false;
    playButton.disabled = false;
    
    duration = mainVideo.duration;
    frameCount = Math.round(frameRate * duration);
    changeFrame();
}

window.onresize = setSizes(); drawShapes();

// Skips to next frame
function nextFrame(){
    if(currentFrame < frameCount){
        currentFrame += 1;
        changeFrame();
    } else {
        currentFrame = 1;
        changeFrame();
    }
    drawShapes();
}

// Skips back one frame
function previousFrame(){
    if(currentFrame > 1){
        currentFrame -= 1;
        changeFrame();
    } else {
        currentFrame = frameCount;
        changeFrame();
    }
    drawShapes();
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
        
    }
    , false);

    mainVideo.addEventListener('loadeddata', function() {
        init();
        setSizes();
        vidLoader.disabled = true;
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
    
    if (clickState == 1){
        stickCoord1 = [event.pageX - mainContainer.offsetLeft, event.pageY - mainContainer.offsetTop];

        clickState = 2;
        drawShapes()

    } else if (clickState == 2){
        stickCoord2 = [event.pageX - mainContainer.offsetLeft, event.pageY - mainContainer.offsetTop];
        clickState = 0;
        document.body.style.cursor = "default";
        document.getElementById("setStick").innerHTML = "Set calibration stick";
        document.getElementById("setStick").setAttribute("onclick",  "setStick()");

        stickLength = prompt("Enter length of calibration stick")

        distanceRatio =  stickLength / Math.sqrt(Math.pow(stickCoord1[0] - stickCoord2[0], 2) + Math.pow(stickCoord1[1] - stickCoord2[1], 2))
        
        drawShapes()
        document.getElementById("trackPoints").disabled = false;
    } else if (clickState == 3){
        frameLocations[currentFrame] = [event.pageX - mainContainer.offsetLeft, event.pageY - mainContainer.offsetTop];
        displayData();
        nextFrame();
    } else if (clickState == 4) {
        console.log("Client Y: " + event.clientY)
        console.log("Page Y: " + event.pageY)
        console.log("Scroll: " + window.scrollY)
        clickState = 0;
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
    if(stickCoord1){
        ctx.strokeRect(stickCoord1[0] - 5, stickCoord1[1] - 5, 10, 10)
    }
    if(stickCoord2){
        ctx.strokeRect(stickCoord2[0] - 5, stickCoord2[1] - 5, 10, 10)

        ctx.fillText(stickLength + ("m"), ((stickCoord1[0] + stickCoord2[0]) / 2) + 10, (stickCoord1[1] + stickCoord2[1]) / 2);

        ctx.beginPath();
        ctx.moveTo(stickCoord1[0], stickCoord1[1]);
        ctx.lineTo(stickCoord2[0], stickCoord2[1]);
        ctx.stroke();
    }

    ctx.strokeStyle = "#FF0000";
    ctx.fillStyle = "#FF0000";
    ctx.font = "10px Arial";

    // Current Tracking Point
    if(frameLocations[currentFrame]){
        ctx.strokeRect(frameLocations[currentFrame][0] - 5, frameLocations[currentFrame][1] - 5, 10, 10)
        ctx.fillText(currentFrame, frameLocations[currentFrame][0] + 7, frameLocations[currentFrame][1] + 7);
    }

    ctx.strokeStyle = "#9e0000";
    ctx.fillStyle = "#9e0000";
    
    // Previous Tracking Points
    if(currentFrame > 0){
        for(i = currentFrame - 1; i > 0; i--){
            if(frameLocations[i]){
                ctx.strokeRect(frameLocations[i][0] - 5, frameLocations[i][1] - 5, 10, 10)
                ctx.fillText(i, frameLocations[i][0] + 7, frameLocations[i][1] + 7);
            }
        }
    }
    
}

// Start tracking points
function trackPoints(){
    document.body.style.cursor = "crosshair";
    document.getElementById("trackPoints").innerHTML = "Finish";
    document.getElementById("trackPoints").setAttribute("onclick",  "resetTrackButton()");
    clickState = 3;
}

// Resets the button and cursor for when you are tracking points
function resetTrackButton(){
    document.body.style.cursor = "default";
    document.getElementById("trackPoints").innerHTML = "Track points";
    document.getElementById("trackPoints").setAttribute("onclick",  "trackPoints()");
    
}

function displayData(){
    var mainTable = document.getElementById("dataTable");

    var newEntry;
    var newFrame;
    var newT;
    var newX;
    var newY;
    var newV;

    mainTable.innerHTML = "<tr><th>Frame</th><th>T</th><th>X</th><th>Y</th><th>V</th></tr>";

    for(i=1; i<frameCount + 1; i++){

        newEntry = document.createElement("tr");
        newFrame = document.createElement("td");
        newT = document.createElement("td");
        newX = document.createElement("td");
        newY = document.createElement("td");
        newV = document.createElement("td");

        newFrame.innerHTML = i;
        newT.innerHTML = ((1 / frameRate) * i).toFixed(2);

        if(frameLocations[i]){
            newX.innerHTML = (frameLocations[i][0] * distanceRatio).toFixed(2);
            newY.innerHTML = (frameLocations[i][1] * distanceRatio).toFixed(2);

            if(frameLocations[i - 1]){
                newV.innerHTML = ((Math.sqrt(Math.pow(frameLocations[i][0] - frameLocations[i - 1][0], 2) + Math.pow(frameLocations[i][1] - frameLocations[i - 1][1], 2)) * distanceRatio) / (1/frameRate)).toFixed(2);
            } else {
                newV.innerHTML = 0;
            }

        
        newEntry.appendChild(newFrame);
        newEntry.appendChild(newT);
        newEntry.appendChild(newX);
        newEntry.appendChild(newY);
        newEntry.appendChild(newV);
    
        mainTable.appendChild(newEntry);

        }
    }
}