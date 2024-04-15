
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