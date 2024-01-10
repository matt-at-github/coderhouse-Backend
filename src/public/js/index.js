console.log('main.js loaded');

// eslint-disable-next-line no-undef
const socket = io();

socket.emit('message', 'Hola mundo');

socket.on('greet', (data) => { console.log(data); });