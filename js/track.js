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
        this.videoData = [];
        this.realData = [];
    }
}

class Position {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

var masses = [];
var trackingMode;

var calibrationStick = [new Position(-999, -999), new Position(-999, -999)];
var calibrationStickCount = 0;

var realCalibrationStickLength = 0;
var videoCalibrationStickLength = 0;

var conversionRatio;

var massColours = [
    ["red", "darkRed"],
    ["lime", "green"],
    ["yellow", "brown"],
    ["purple", "rebeccaPurple"],
    ["orange", "brown"],
    ["pink", "plum"]
]

function addMass(){ // create a new mass
    newMassName = prompt("Enter mass name", "Mass" + (masses.length + 1));
    masses.push(new Mass(newMassName));
    
    newMass = document.createElement("option");
    newMass.value = newMassName;
    newMass.innerText = newMassName;
    
    massSelector.appendChild(newMass);

    massTrackButton.disabled = false;
    massSelector.disabled = false;
}

function getCanvasCoords(inputCoords){ // get coordinates of a click relative to the canvas
    var viewportOffset = mainVideoCanvas.getBoundingClientRect();
    
    canvasCoords = new Position;
    relativeClickCoords =  new Position;

    canvasCoords.x = viewportOffset.left;
    canvasCoords.y = viewportOffset.top;

    relativeClickCoords.x = inputCoords.x - canvasCoords.x;
    relativeClickCoords.y = inputCoords.y - canvasCoords.y;

    return relativeClickCoords;
}

function canvasCoordstoVideoCoords(inputCoords){ // convert coordinates relative to canvas to coordinates ranging from 0 to 1
    videoCoords = new Position;
    
    videoCoords.x = (inputCoords.x / mainVideoCanvas.clientWidth) * mainVideoDisplay.videoWidth ;
    videoCoords.y = (inputCoords.y / mainVideoCanvas.clientHeight) * mainVideoDisplay.videoHeight;

    return videoCoords;
}

function getRealPosition(inputCoords){
    return new Position(inputCoords.x * conversionRatio, inputCoords.y * conversionRatio);
}

function drawCanvas(){
    ctx = canvasCTX;
    ctx.clearRect(0, 0, mainVideoDisplay.videoWidth, mainVideoDisplay.videoHeight);

    pixelSize = mainVideoDisplay.videoWidth / mainVideoDisplay.clientWidth; // this way the width of the stroke is not dependent on the size of the video. I would be interested to see what happens with a really low resolution video
    ctx.lineWidth = 2 * pixelSize;
    ctx.font = "20px Arial";

    // draw squares with crosses and numbers around each tracked point
    masses.forEach((mass, massIndex) => {
        mass.videoData.forEach((coordinate, coordIndex) => {
            if(coordIndex <= currentFrame){
                ctx.beginPath();
                if(currentFrame == coordIndex) {
                    ctx.strokeStyle = massColours[massIndex][0];
                    ctx.fillStyle = massColours[massIndex][0];
                } else {
                    ctx.strokeStyle = massColours[massIndex][1];
                    ctx.fillStyle = massColours[massIndex][1];
                }

                ctx.moveTo(coordinate.x - (5 * pixelSize), coordinate.y); // cross (x)
                ctx.lineTo(coordinate.x + (5 * pixelSize), coordinate.y);

                ctx.moveTo(coordinate.x, coordinate.y - (5 * pixelSize)); // cross (y)
                ctx.lineTo(coordinate.x, coordinate.y + (5 * pixelSize));

                ctx.rect(coordinate.x - (5 * pixelSize), coordinate.y - (5 * pixelSize), 10 * pixelSize, 10 * pixelSize); // square

                ctx.stroke();

                ctx.fillText(coordIndex, coordinate.x + 10 * pixelSize, coordinate.y + 10 * pixelSize);
            }

        });
    });

    // draw calibration stick
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "blue";

    ctx.beginPath();

    ctx.moveTo(calibrationStick[0].x, calibrationStick[0].y); // line between points
    ctx.lineTo(calibrationStick[1].x, calibrationStick[1].y);
    
    ctx.rect(calibrationStick[0].x - (5 * pixelSize), calibrationStick[0].y - (5 * pixelSize), 10 * pixelSize, 10 * pixelSize); // square at point 1

    ctx.moveTo(calibrationStick[0].x - (5 * pixelSize), calibrationStick[0].y); // cross (x) at point 1
    ctx.lineTo(calibrationStick[0].x + (5 * pixelSize), calibrationStick[0].y);

    ctx.moveTo(calibrationStick[0].x, calibrationStick[0].y - (5 * pixelSize)); // cross (y) at point 1
    ctx.lineTo(calibrationStick[0].x, calibrationStick[0].y + (5 * pixelSize));
    
    ctx.rect(calibrationStick[1].x - (5 * pixelSize), calibrationStick[1].y - (5 * pixelSize), 10 * pixelSize, 10 * pixelSize); // square at point 2

    ctx.moveTo(calibrationStick[1].x  - (5 * pixelSize), calibrationStick[1].y); // cross (x) at point 2
    ctx.lineTo(calibrationStick[1].x  + (5 * pixelSize), calibrationStick[1].y);

    ctx.moveTo(calibrationStick[1].x, calibrationStick[1].y - (5 * pixelSize)); // cross (y) at point 2
    ctx.lineTo(calibrationStick[1].x, calibrationStick[1].y + (5 * pixelSize));

    ctx.fillText(realCalibrationStickLength + "m", (calibrationStick[0].x + calibrationStick[1].x) / 2, (calibrationStick[0].y + calibrationStick[1].y) / 2);

    ctx.stroke();
}

function canvasClick(click){
    ctx = canvasCTX;

    mouseCoords = new Position(click.clientX, click.clientY);

    switch (trackingMode) {
        case "mass": // when we are tracking a mass
            coords = canvasCoordstoVideoCoords(getCanvasCoords(mouseCoords));

            masses[massSelector.selectedIndex].videoData[currentFrame] = coords;
            masses[massSelector.selectedIndex].realData[currentFrame] = getRealPosition(coords);

            nextFrame();
            break

        case "calibration": // set the calibration stick
            coords = canvasCoordstoVideoCoords(getCanvasCoords(mouseCoords));
            

            switch (calibrationStickCount){
                case 0:
                    calibrationStick[0] = coords; // set point 1
                    calibrationStickCount = 1;
                    break
                case 1: 
                    calibrationStick[1] = coords; // set point 2
                    calibrationStickCount = 0;

                    realCalibrationStickLength = parseFloat(prompt("Enter length of calibration stick", "1.00"));
                    videoCalibrationStickLength = distanceBetweenPoints(calibrationStick[0], calibrationStick[1]);

                    addMassButton.disabled = false;

                    conversionRatio = realCalibrationStickLength / videoCalibrationStickLength;

                    setMode("none"); // exit setting stick
                    break;
            }
        
        drawCanvas();
    }
}