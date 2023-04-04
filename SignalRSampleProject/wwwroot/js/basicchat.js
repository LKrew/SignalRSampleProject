
var connection = new signalR.HubConnectionBuilder().withUrl("/hubs/basicchat").build();

document.getElementById("sendMessage").disabled = true;

connection.on("MessageRecieved", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.textContent = `${user} - ${message}`;

})

document.getElementById("sendMessage").addEventListener("click", function (event) {
    var sender = document.getElementById("senderEmail").value;
    var message = document.getElementById("chatMessage").value;
    var reciever = document.getElementById("receiverEmail").value;

    if (reciever.length > 0) {
        connection.send("SendMessageToReciever", sender, reciever, message);
        }else {
            connection.send("SendMessageToAll", sender, message).catch(function (err) {
                return console.error(err.toString());
            });
        }
    event.preventDefault();
});



connection.start().then(function () {
    document.getElementById("sendMessage").disabled = false;
});