var dataTableContainer = document.getElementById("dataTableContainer");

var fields = [
    ["Frame", "coordIndex"],
    ["X", "mass.realData[coordIndex].x"],
    ["Y", "mass.realData[coordIndex].y"]
]

function distanceBetweenPoints(point1, point2){
    var a = Math.abs(point1.x - point2.x);
    var b = Math.abs(point1.y - point2.y);

    var c = Math.sqrt(Math.pow(a, 2) + Math.pow(a, 2))

    return c
}

function addData(){
    dataTableContainer.innerHTML = "";
    masses.forEach((mass, massIndex) => {

        title = document.createElement("h2");
        title.innerText = mass.name;

        title.style.color = massColours[massIndex][0];

        table = document.createElement("table");

        tableHeader = document.createElement("tr");

        fields.forEach((field) => {
            newField = document.createElement("th");
            newField.innerHTML = field[0];

            tableHeader.appendChild(newField);
        });

        table.appendChild(tableHeader);

        mass.realData.forEach((coord, coordIndex) => {
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