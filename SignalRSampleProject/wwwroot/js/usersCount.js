//create connection
var connectionUserCount = new signalR
    .HubConnectionBuilder().withUrl("/hubs/userCount", signalR.HttpTransportType.WebSockets)
    .build();

//connect to methods that hub invokes
connectionUserCount.on("updateTotalViews", (value) => {
    var newCountSpan = document.getElementById("totalViewsCounter");
    newCountSpan.innerText = value.toString();
});
connectionUserCount.on("updateTotalUsers", (value) => {
    var newCountSpan = document.getElementById("totalUsersCounter");
    newCountSpan.innerText = value.toString();
})

//invoke hub methods
function newWindowLoadedOnClient() {
    connectionUserCount.send("NewWindowLoaded");
}

function fulfilled() {
    console.log("connection to user hub successful");
    newWindowLoadedOnClient();
}

function rejected() {
    console.log("failed to connect to user hub");
}
//start connection
connectionUserCount.start().then(fulfilled, rejected);