var dataTableContainer = document.getElementById("dataTableContainer");

var fields = [
    ["Frame", "coordIndex"],
    ["X", "mass.data[coordIndex][0]"],
    ["Y", "mass.data[coordIndex][1]"]
]

function addData(){
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

        mass.data.forEach((coord, coordIndex) => {
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