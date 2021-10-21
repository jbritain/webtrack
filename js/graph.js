google.charts.load('current',{packages:['corechart']});

function drawGraph(mass, field1, field2){
    graphOptions = {
        'title': field2 + " against " + field1,
        'hAxis': {title: field1, minValue: 0},
        'vAxis': {title: field2, minValue: 0},
        'legend': 'none'
    }

    var data = new Array(mass.realData.length).fill([0, 0]);

    massIndex = masses.findIndex(m => m == mass);

    mass.realData.forEach((coord, coordIndex) => {
        data[coordIndex] = [eval(fields[fields.findIndex(element => element.includes(field1))][1]), eval(fields[fields.findIndex(element => element.includes(field2))][1])];

        if(data[coordIndex][0] == "NaN"){
            data[coordIndex][0] = 0;
        }

        if(data[coordIndex][1] == "NaN"){
            data[coordIndex][1] = 0;
        }
    });

    data.splice(0, 0, [field1, field2])

    console.log(data);

    convertedData = google.visualization.arrayToDataTable(data);

    var chart = new google.visualization.ScatterChart(document.getElementById("mainGraph"));
    chart.draw(convertedData, graphOptions);
}

function drawMainGraph(){
    drawGraph(masses[masses.findIndex(m => graphMassSelector.value == m.name)], field1Selector.value, field2Selector.value);
}