var cloakSpan = document.getElementById("cloakCounter");
var stoneSpan = document.getElementById("stoneCounter");
var wandSpan = document.getElementById("wandCounter");


//create connection
var connectionDeathlyHallows = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/deathlyhallows").build();

//connect to methods that hub invokes aka receive notfications from hub
connectionDeathlyHallows.on("updateDealthyHallowCount", (one, two, three) => {
    cloakSpan.innerText = one.toString();
    stoneSpan.innerText = two.toString();
    wandSpan.innerText = three.toString();
});

//start connection
function fulfilled() {
    connectionDeathlyHallows.invoke("GetRaceStatus").then((raceCounter) => {
        cloakSpan.innerText = raceCounter.three.toString();
        stoneSpan.innerText = raceCounter.one.toString();
        wandSpan.innerText = raceCounter.two.toString();
    });
    //do something on start
    console.log("Connection to User Hub Successful");
}
function rejected() {
    //rejected logs
}

connectionDeathlyHallows.start().then(fulfilled, rejected);