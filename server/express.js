const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Path to your OpenAPI JSON file

const app = express();

// Подключаем Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json()); // Для разбора JSON данных в теле запроса

// POST endpoint for sending files
app.post('/sendFile', (req, res) => {
    // Принимаем JSON данные с информацией о файле
    const fileData = req.body;

    // Добавляем дополнительную логику по обработке файла, например, сохраняем его в базу данных

    // Отправляем ответ клиенту
    res.send('File sent successfully' );
    console.log(fileData)

});

// GET endpoint for receiving files
app.get('/receiveFile', (req, res) => {
    // Здесь вы можете вернуть список доступных файлов, например, из базы данных или кэша
    const files = [];
    console.log(files)
    // Возвращаем файлы клиенту в формате JSON
    res.json(files);
});

// Запуск сервера Express
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
