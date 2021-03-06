function xhrSuccess() {
    this.callback.apply(this, this.arguments);
}

function xhrError() {
    console.error(this.statusText);
}

function getRecords(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.callback = callback;
    xhr.arguments = Array.prototype.slice.call(arguments, 2);
    xhr.onload = xhrSuccess;
    xhr.onerror = xhrError;
    xhr.open("GET", url, true);
    xhr.send(null);
}

function deleteRecord(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.callback = callback;
    xhr.arguments = Array.prototype.slice.call(arguments, 2);
    xhr.onload = xhrSuccess;
    xhr.onerror = xhrError;
    xhr.open("DELETE", url, true);
    xhr.send(null);
}

function updateRecord(url, value, callback) {
    var data = {};
    data.value = value;
    var json = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.callback = callback;
    xhr.arguments = Array.prototype.slice.call(arguments, 2);
    xhr.onload = xhrSuccess;
    xhr.onerror = xhrError;
    xhr.open("PUT", url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(json);
}

function startStopCapture(url, value, callback) {
    var data = {};
    data.action = value;
    var json = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.callback = callback;
    xhr.arguments = Array.prototype.slice.call(arguments, 2);
    xhr.onload = xhrSuccess;
    xhr.onerror = xhrError;
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(json);
}


function createChart() {
    let json = JSON.parse(this.responseText);
    let labels = [];
    let data = [];
    json.forEach(element => {
        labels.push(element.timestamp);
        data.push(element.value);
    })
    var ctx = document.getElementById('recordChart').getContext('2d');
    var recordChart = new Chart(ctx, {
        type: 'line',
        options: {
            scales: {
                xAxes: [{
                    display: false,
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        steps: 50,
                        stepValue: 2,
                        max: 1.2,
                    }
                }]
            }
        },
        data: {
            labels: labels,
            datasets: [{
                label: 'Detected',
                data: data,
                backgroundColor: "rgba(153,255,51,0.6)"
            }]
        }
    })
}

function createTable() {
    let htmlContent = ""
    let records = JSON.parse(this.responseText);
    records.forEach(record => {
        htmlContent = htmlContent + "<tr>";
        htmlContent = htmlContent + " <th scope='row'>" + record._id + "</th>";
        htmlContent = htmlContent + " <td>" + record.timestamp + "</td>";
        htmlContent = htmlContent + " <td>" + record.value + "</td>";
        htmlContent = htmlContent + " <td> <button type='button' class='btn btn-outline-dark' onclick='orderToUpdateRecord(\"" + record._id + "\", \"" + record.value + "\")'>Edit</button><button type='button' class='btn btn-outline-danger' onclick='orderToDeleteRecord(\"" + record._id + "\")'>Remove</button></td>";
        htmlContent = htmlContent + "<tr>";
        htmlContent = htmlContent + "<tr>";
        htmlContent = htmlContent + "<tr>";
    });
    document.getElementById("records").innerHTML = htmlContent;
}

function orderToCreateTable() {
    getRecords("http://localhost:3000/records", createTable);
}

function orderToCreateChart() {
    getRecords("http://localhost:3000/records", createChart);
}

function orderToStartCapture() {
    startStopCapture("http://localhost:3000/configurations/", 1, altertStart)
    document.getElementById("startButton").style.display = "none";
    document.getElementById("stopButton").style.display = "inline";
}

function orderToStopCapture() {
    startStopCapture("http://localhost:3000/configurations/", 0, altertStop)
    document.getElementById("startButton").style.display = "inline";
    document.getElementById("stopButton").style.display = "none";
}

function orderToDeleteRecord(id) {
    document.getElementById("idToRemove").innerHTML = id;
    $('#removeRecord').modal()
}

function orderToUpdateRecord(id, value) {
    document.getElementById("idToUpdate").innerHTML = id;
    document.getElementById("newRecordValue").value = value;
    $('#editRecord').modal()
}

function alertDelete() {
    alert("Record Removed");
    location.reload();
}

function alertUpdate() {
    alert("Record Updated");
    location.reload();
}

function altertStart() {
    alert(JSON.parse(this.responseText).message);
}

function altertStop() {
    alert(JSON.parse(this.responseText).message);
}

function saveRecord() {
    value = document.getElementById("newRecordValue").value;
    id = document.getElementById("idToUpdate").innerHTML;
    updateRecord("http://localhost:3000/records/" + id, value, alertUpdate);
}

function dropRecord() {
    id = document.getElementById("idToRemove").innerHTML;
    deleteRecord("http://localhost:3000/records/" + id, alertDelete);
}