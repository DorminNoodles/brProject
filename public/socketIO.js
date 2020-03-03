// console.log(io);

export const socket = io.connect('http://51.83.44.50:4000');

export const sendDataToServer = (eventName, data) => {
    socket.emit(eventName, data);
}