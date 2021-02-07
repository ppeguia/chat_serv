const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);

app.use(express.static('public'));

var io = require('socket.io')(server,{
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"],
      credentials: true
    }
});

const path = require('path');
app.set('port', process.env.PORT || 3000);//Usar el puerto

server.listen(app.get('port'));

UserOnId = new Array();
IdsOnUser = new Array();

var noExiste = function (IdsOnUser, socketid) {
    for (var key in IdsOnUser) {
        if (key === socketid) {
            return false;
        }
    }
    return true;
};

var showLog = function () {
    console.log('#####IdsOnUser#####');
    console.log(IdsOnUser);
    console.log('#####UserOnId#####');
    console.log(UserOnId);
    console.log('Numero de usuarios: ' + Object.keys(UserOnId).length);
}

io.on('connect', (socket) => {

    console.log('nueva conexion id:', socket.id);
    socket.on('data_user', (datos) => {
        console.log(datos.correo + '-' + datos.usuario + ' - ' + socket.id);

        if (noExiste(IdsOnUser, socket.id)) {

            if (UserOnId[datos.usuario] == null) {
                UserOnId[datos.usuario] = new Array();
            }
            IdsOnUser[socket.id] = datos.usuario;
            UserOnId[datos.usuario].push(socket.id);

            io.emit('user', { user: datos.usuario });

            showLog();
        }

    });

    socket.on('send_message', (datos) => {
        console.log('user:' + datos.user + ', send_message: ' + datos.message + '-' + socket.id);
        io.emit('messageNew', { user: datos.user, message: datos.message });
    });

    socket.on('send_message_private', (datos) => {
        console.log('userP:' + datos.user + ', send_messageP: ' + datos.message + '-' + datos.target);
        listId = UserOnId[datos.target];
        for (var i = 0; i < listId.length; i++) {
            io.to(listId[i]).emit('messageNew', { user: datos.user, message: datos.message });
        }
        io.to(socket.id).emit('messageNew', { user: datos.user, message: datos.message });
    });

    socket.on('disconnect', () => {
        id_user = socket.id;

        user = IdsOnUser[id_user];
        listId = UserOnId[user];
        if (user !== undefined) {
            for (var i = 0; i < listId.length; i++) {
                if (listId[i] == id_user) {
                    idborrar = i;
                    break;
                }
            }
            UserOnId[user].splice(idborrar, 1);

            if (UserOnId[user].length < 1) {
                delete UserOnId[user];
            }

            delete IdsOnUser[id_user];
            showLog();
            console.log('adios conexion id:', socket.id);
        } else {
            console.log('adios conexion id:', socket.id);
        }
    });

});