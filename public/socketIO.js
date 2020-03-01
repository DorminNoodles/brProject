// console.log(io);

export const socket = io.connect('http://localhost:4000');

export const sendDataToServer = (eventName, data) => {
    socket.emit(eventName, data);
}