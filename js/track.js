var masses = [];
var trackingMode;

var calibrationStick = [[0, 0], [0, 0]];
var calibrationStickCount = 0;

var massColours = [
    ["red", "darkRed"],
    ["lime", "green"],
    ["yellow", "brown"],
    ["purple", "rebeccaPurple"],
    ["orange", "brown"],
    ["pink", "plum"]
]

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

    canvasCoords = [viewportOffset.left, viewportOffset.top];

    relativeClickCoords = [inputCoords[0] - canvasCoords[0], inputCoords[1] - canvasCoords[1]];

    return relativeClickCoords;
}

function canvasCoordstoVideoCoords(inputCoords){ // convert coordinates relative to canvas to coordinates ranging from 0 to 1
    videoCoords = [(inputCoords[0] / mainVideoCanvas.clientWidth) * mainVideoDisplay.videoWidth, (inputCoords[1] / mainVideoCanvas.clientHeight) * mainVideoDisplay.videoHeight];

    return videoCoords;
}

function drawCanvas(){
    ctx = canvasCTX;
    ctx.clearRect(0, 0, mainVideoDisplay.videoWidth, mainVideoDisplay.videoHeight);

    pixelSize = mainVideoDisplay.videoWidth / mainVideoDisplay.clientWidth;
    ctx.lineWidth = 2 * pixelSize;

    // draw squares with crosses around each tracked point
    masses.forEach((mass, massIndex) => {
        mass.data.forEach((coordinate, coordIndex) => {
            if(coordIndex <= currentFrame){
                ctx.beginPath();
                if(currentFrame == coordIndex) {
                    ctx.strokeStyle = massColours[massIndex][0];
                } else {
                    ctx.strokeStyle = massColours[massIndex][1];
                }

                ctx.moveTo(coordinate[0] - (5 * pixelSize), coordinate[1]);
                ctx.lineTo(coordinate[0] + (5 * pixelSize), coordinate[1]);

                ctx.moveTo(coordinate[0], coordinate[1] - (5 * pixelSize));
                ctx.lineTo(coordinate[0], coordinate[1] + (5 * pixelSize));

                ctx.rect(coordinate[0] - (5 * pixelSize), coordinate[1] - (5 * pixelSize), 10 * pixelSize, 10 * pixelSize);
                ctx.stroke();
            }

        });
    });

    // draw calibration stick
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(calibrationStick[0][0] - (5 * pixelSize), calibrationStick[0][1]);
    ctx.lineTo(calibrationStick[0][0] + (5 * pixelSize), calibrationStick[0][1]);
    
    ctx.rect(calibrationStick[0][0] - (5 * pixelSize), calibrationStick[0][1] - (5 * pixelSize), 10 * pixelSize, 10 * pixelSize);

    ctx.moveTo(calibrationStick[1][0] - (5 * pixelSize), calibrationStick[1][1]);
    ctx.lineTo(calibrationStick[1][0] + (5 * pixelSize), calibrationStick[1][1]);
    
    ctx.rect(calibrationStick[1][0] - (5 * pixelSize), calibrationStick[1][1] - (5 * pixelSize), 10 * pixelSize, 10 * pixelSize);

    ctx.moveTo(calibrationStick[0][0], calibrationStick[0][1]);
    ctx.lineTo(calibrationStick[1][0], calibrationStick[1][1]);
    ctx.stroke();
}

function canvasClick(click){
    ctx = canvasCTX;

    mouseCoords = [click.clientX, click.clientY];

    switch (trackingMode) {
        case "mass": // when we are tracking a mass
            coords = canvasCoordstoVideoCoords(getCanvasCoords(mouseCoords));

            masses[massSelector.selectedIndex].data[currentFrame] = coords;
            nextFrame();
            break

        case "calibration": // set the calibration stick
            coords = canvasCoordstoVideoCoords(getCanvasCoords(mouseCoords));
            

            switch (calibrationStickCount){
                case 0:
                    calibrationStick[0] = coords;
                    calibrationStickCount = 1;
                    break
                case 1: 
                    calibrationStick[1] = coords;
                    calibrationStickCount = 0;
                    setMode("none");
                    break;
            }
        
        drawCanvas();
    }
}