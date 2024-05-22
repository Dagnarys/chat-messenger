const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Путь к вашему JSON файлу OpenAPI
const ws = require('ws');
const axios = require('axios');
const cors = require('cors');
const app = express();
const wss = new ws.Server({ port: 5000 });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());


app.use(cors({
    origin: 'http://localhost:5173'
}));
// POST endpoint for receiving files
app.post('/receiveFile', (req, res) => {
    const fileData = req.body;
    console.log(req)

    console.log(fileData);

    // Возвращаем файлы в формате JSON
    res.json(fileData);

    // Обработка сообщения и отправка его всем клиентам WebSocket
    broadcastMessage(fileData);
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});

wss.on('connection', function connection(ws) {
    ws.on('message', async function (message) {
        message = JSON.parse(message);
        switch (message.event) {
            case 'receiveFile':
                await receiveFile(message);
                break;
            case 'connection':
                broadcastConnection(message);
                break;
        }
    });
});
function broadcastMessage(message) {
    // Преобразование сообщения в строку JSON
    const jsonMessage = JSON.stringify(message);

    // Отправка сообщения каждому клиенту WebSocket
    wss.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            client.send(jsonMessage);
        }
    });
}
function broadcastConnection(message) {
    wss.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

async function receiveFile(message) {

    try {
        // Отправляем POST запрос на адрес "http://localhost:3000/receiveFile" с данными сообщения
        await axios.post('http://172.20.10.4:3000/receiveFile', message);


        // Если необходимо, можете добавить вызов broadcastFile(message);
    } catch (error) {
        console.error('Error sending file:', error.message);
    }
}
