const socket = io.connect();

socket.on('user', (user)=>{
    alert('el nuevo usuario: ' + user.user);
});

socket.on('messageNew', (data)=>{
    getMessage(data.user,data.message);
});

function sendDataUser(correo, usuario ){
    socket.emit('data_user',{correo: correo, usuario: usuario});
}

function sendMessage(message, user){
    socket.emit('send_message',{message: message, user: user});
}

function sendMessagePrivate(message, user, target){
    socket.emit('send_message_private',{message: message, user: user, target: target});
}