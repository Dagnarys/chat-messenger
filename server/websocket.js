const axios = require('axios')
const ws = require('ws');

const wss = new ws.Server({
    port: 5000,
}, () => console.log(`Server started on 5000`))


wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        switch (message.event) {
            case 'file':
                broadcastFile(message)
                break;
            case 'connection':
                broadcastConnection(message)
                break;
            case 'sendFile':
                sendFile(message);
                break;
            case 'receiveFile':
                receiveFile(message);
                break;
        }
    })
})

function broadcastFile(message) {
    wss.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function broadcastConnection(message) {
    wss.clients.forEach((client ) => { // Provide type annotation for client
        if (client.readyState === ws.OPEN) { // Ensure client is recognized as a WebSocket object
            client.send(JSON.stringify(message));
        }
    });
}

async function sendFile(message) {
    try {
        // Отправляем POST запрос на адрес "http://127.0.0.1:3000/sendFile" с JSON данными сообщения
        await axios.post('http://127.0.0.1:3000/receiveFile', message);
    } catch (error) {
        console.error('Error sending file:', error.message);
    }
}

async function receiveFile(message) {
    try {
        // Отправляем GET запрос на адрес "http://127.0.0.1:3000/receiveFile" с JSON данными сообщения
        await axios.get('http://127.0.0.1:3000/sendFile', { params: message });
    } catch (error) {
        console.error('Error receiving file:', error.message);
    }
}