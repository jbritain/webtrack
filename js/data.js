var dataTableContainer = document.getElementById("dataTableContainer");
var frameDelta;

var fields = [
    ["Frame", "coordIndex"],
    ["X", "mass.realData[coordIndex].x"],
    ["Y", "mass.realData[coordIndex].y"],
    ["V", "getVelocity(massIndex,coordIndex)"]
];

function getVelocity(inputMassIndex, inputCoordIndex){
    if(inputCoordIndex in masses[inputMassIndex].realData && inputCoordIndex - 1 in masses[inputMassIndex].realData){

        s = distanceBetweenPoints(masses[inputMassIndex].realData[inputCoordIndex], masses[inputMassIndex].realData[inputCoordIndex - 1]);
        t = frameDelta;

        console.log(s);
        console.log(t);

        return s/t
    } else {
        console.log(inputCoordIndex);
        console.log(inputMassIndex);
        return "NaN";
    }
}

function distanceBetweenPoints(point1, point2){
    var a = Math.abs(point1.x - point2.x);
    var b = Math.abs(point1.y - point2.y);

    var c = Math.sqrt(Math.pow(a, 2) + Math.pow(a, 2))

    return c
};

function addData(){
    frameDelta = 1 / mainVideo.framerate;

    dataTableContainer.innerHTML = "";
    masses.forEach((mass, massIndex) => {

        title = document.createElement("h2");
        title.innerText = mass.name;

        table = document.createElement("table");

        tableHeader = document.createElement("tr");

        fields.forEach((field) => {
            newField = document.createElement("th");
            newField.innerHTML = field[0];

            tableHeader.appendChild(newField);
        });

        table.appendChild(tableHeader);

        mass.realData.forEach((coord, coordIndex) => {
            console.log(coord);
            row = document.createElement("tr");

            fields.forEach((field) => {
                item = document.createElement("td");
                item.innerHTML = eval(field[1]);
                row.appendChild(item);
            });

            table.appendChild(row);
        });

        dataTableContainer.appendChild(title);
        dataTableContainer.appendChild(table);

    })

}