require('dotenv').config();

const express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

let players = [];
console.log("hey.....");
app.use(express.static('public'));

app.get('/players', function (req, res) {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
    "Access-Control-Allow-Credentials": true
  };
  console.log(players);
  res.writeHead(200, headers);
  res.json(JSON.stringify(players));
});

//socket io
io.on('connection', (socket) => {
    console.log("connexion for > ", socket.id);
    const id = players.length;
    players[id] = {
        id: socket.id,
        pos: {
            x: 0,
            y: 0
        }
    };
    //emit when login
    socket.broadcast.emit('positions', players.map((elem) => {
      if (elem.id != id) {
          return {
              id: elem.id,
              x: elem.pos.x,
              y: elem.pos.y
          }
      }
      return null;
    }));

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
    socket.on('fire', (data) => {
        console.log(data);
        socket.broadcast.emit('fire', data);
    });
    socket.on('disconnect', () => {

        // players = players.map((player) => {
        //     console.log(player.id);
        //     return player.id == socket.id ? player : undefined;
        // })
        players[id].pos.x = -9000;
        players[id].pos.y = -9000;
    });
});
//end

server.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
})