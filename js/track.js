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

