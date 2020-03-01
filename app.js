require('dotenv').config();

const express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

let players = [];

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile('public/index.html');
})

app.get('/players', function (req, res) {
    console.log(players);
    res.json(JSON.stringify(players));
  })

//socket io
io.on('connection', (socket) => {
    const id = players.length;
    players[id] = {
        id: socket.id,
        pos: {
            x: 0,
            y: 0
        }
    };
    console.log(id);
    socket.emit('news', { hello: 'world' });
    socket.on('news', function (data) {
        console.log(socket.id);
        console.log(data);
    });
    socket.on('updatePosition', (data) => {
        console.log(data);
        players[id].pos = data;
        //send others players
        socket.emit('positions', players.map((elem) => {
            if (elem.id != id) {
                return {
                    id: elem.id,
                    x: elem.pos.x,
                    y: elem.pos.y
                }
            }
            return null;
        }));
    });
  });
//end

server.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
})