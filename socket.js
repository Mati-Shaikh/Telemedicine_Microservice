import { io } from 'socket.io-client';

export const SOCKET_SERVER_URL = 'http://192.168.18.25:4000'; // Replace with your server's IP address

export const socket = io(SOCKET_SERVER_URL, {
    transports: ['websocket'],
    cors: {
        origin: "*", // Allow all origins or specify the origin of your Expo app
    },
});
