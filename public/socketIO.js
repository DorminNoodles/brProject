import * as config from './Config.js';

export const socket = io.connect(config.ORIGIN_URL);

export const sendDataToServer = (eventName, data) => {
    // console.log("send to server ==>")
    socket.emit(eventName, data);
}