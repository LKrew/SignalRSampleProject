var connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();

connection.on("ReceiveUserConnected", function (userId, username) {
        addMessage(`${username} has open connection`);
});

connection.on("ReceiveUserDisconnected", function (userId, username) {
        addMessage(`${username} has closed a connection`);
});

connection.on("ReceiveAddRoomMessage", function (maxRoom, roomId, roomName, UserId, username) {
    addMessage(`${username} created room ${roomName}`);
    fillRoomDropDown();
});

connection.on("ReceiveDeleteRoomMessage", function (deleted, selected, roomName, username) {
    addMessage(`${username} deleted room ${roomName}`);
    fillRoomDropDown();
});

connection.on("ReceivePublicMessage", function (roomId, UserId, userName, message, roomName) {
    addMessage(`[Public Message = ${roomName}] ${userName}: ${message}`)
})
connection.on("ReceivePrivateMessage", function (sendername, senderId, receiverId, message, receiverName, chatId) {
    addMessage(`[Private Message = ${receiverName}] ${sendername}: ${message}`)
})

function sendPublicMessage() {
    let inputMsg = document.getElementById("txtPublicMessage");
    let ddlSelRoom = document.getElementById("ddlSelRoom");

    let roomId = ddlSelRoom.value;
    let roomName = ddlSelRoom.options[ddlSelRoom.selectedIndex].text;
    let message = inputMsg.value;

    connection.send("SendPublicMessage", Number(roomId), message, roomName);
    inputMsg.value = '';
}

function sendPrivateMessage() {
    let inputMsg = document.getElementById("txtPrivateMessage");
    let ddlSelUser = document.getElementById("ddlSelUser");

    let receiverId = ddlSelUser.value;
    let receiverName = ddlSelUser.options[ddlSelUser.selectedIndex].text;
    let message = inputMsg.value;

    connection.send("SendPrivateMessage", receiverId, message, receiverName);
    inputMsg.value = '';
}

function addnewRoom(maxRoom) {

    let createRoomName = document.getElementById('createRoomName');

    var roomName = createRoomName.value;

    if (roomName == null && roomName == '') {
        return;
    }
    /*POST*/
    $.ajax({
        url: '/ChatRooms/PostChatRoom',
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ id: 0, name: roomName }),
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            /*ADD ROOM COMPLETED SUCCESSFULLY*/
            connection.send("SendAddRoomMessage", maxRoom, json.id, json.name)
            createRoomName.value = '';
        },
        error: function (xhr) {
            alert('error');
        }
    })
}

function deleteRoom() {

    let ddlDelRoom = document.getElementById('ddlDelRoom');

    var roomName = ddlDelRoom.options[ddlDelRoom.selectedIndex].text;

    let text = `Do you want ot delete chat room ${roomName}`;
    if (confirm(text) == false) {
        return
    }

    if (roomName == null && roomName == '') {
        return;
    }

    let roomId = ddlDelRoom.value;

    $.ajax({
        url: `/ChatRooms/DeleteChatRoom/${roomId}`,
        dataType: "json",
        type: "DELETE",
        contentType: 'application/json; charset=utf-8',
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

           
            connection.invoke("SendDeleteRoomMessage", json.deleted, json.selected, roomName )
            fillRoomDropDown();
        },
        error: function (xhr) {
            alert('error');
        }
    })
}
document.addEventListener('DOMContentLoaded', (event) => {
    fillRoomDropDown();
    fillUserDropDown();
})


function fillUserDropDown() {

    $.getJSON('/ChatRooms/GetChatUser')
        .done(function (json) {

            var ddlSelUser = document.getElementById("ddlSelUser");

            ddlSelUser.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.userName;//item.whateverProperty
                newOption.value = item.id;
                ddlSelUser.add(newOption);


            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });

}

function fillRoomDropDown() {

    $.getJSON('/ChatRooms/GetChatRoom')
        .done(function (json) {
            var ddlDelRoom = document.getElementById("ddlDelRoom");
            var ddlSelRoom = document.getElementById("ddlSelRoom");

            ddlDelRoom.innerText = null;
            ddlSelRoom.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.name;
                newOption.value = item.id;
                ddlDelRoom.add(newOption);


                var newOption1 = document.createElement("option");

                newOption1.text = item.name;
                newOption1.value = item.id;
                ddlSelRoom.add(newOption1);
            });
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });
}

function addMessage(msg) {
    if (msg == null && msg == '') {
        return;
    }
    let ui = document.getElementById('messagesList');
    let li = document.createElement('li');
    li.innerHTML = msg;
    ui.appendChild(li);
}
connection.start().then(function () {
    //sendButton.disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});