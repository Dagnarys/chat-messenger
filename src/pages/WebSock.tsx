import React, { useEffect, useRef, useState } from 'react';
import { Icon20Attach } from '@vkontakte/icons';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './WebSock.sass';

const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const [file, setFile] = useState(null);
    const [username, setUsername] = useState('');
    const socket = useRef(null);
    const [connected, setConnected] = useState(false);
    const fileInputRef = useRef(null);

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5000');

        socket.current.onopen = () => {
            setConnected(true);
            const message = {
                event: 'connection',
                username,
                time: Date.now()
            };
            socket.current.send(JSON.stringify(message));
            console.log('Socket открыт');
        };

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.event === 'receiveFile') {
                receiveFile(message.file);
            } else {
                setMessages((prev) => [message, ...prev]);
            }
        };

        socket.current.onclose = () => {
            console.log('Socket закрыт');
        };

        socket.current.onerror = () => {
            console.log('Socket произошла ошибка');
        };
    };

    const handleFileUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setFile(file);
        }
    };
    const sendFile = async () => {
        if (file) {
            try {
                // Преобразование файла в base64 строку
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const base64File = reader.result;

                    // Отправка данных файла в JSON формате
                    const jsonData = {
                        username,
                        file: base64File,
                        filename: file.name,
                        time: Date.now(),


                    };
                    console.log(jsonData)

                    // Отправка JSON данных на сервер
                    const response = await axios.post('http://172.20.10.2:8000/sendFile/', jsonData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });


                };
            } catch (error) {
                console.error('File upload failed:', error);
                const errorMessage = {
                    username,
                    file: null,
                    filename: file.name,
                    time: Date.now(),

                };
                socket.current.send(JSON.stringify(errorMessage));
            }
        }
    };


    const receiveFile = (responseData) => {
        if (responseData) {

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    username,
                    file: responseData, // File content in base64 or ArrayBuffer format
                    filename: file.name, // File name
                    time: Date.now(),
                    isError: false,
                    event: 'receiveFile'
                }
            ]);
        }
        else
        {
            console.log('error receive')
        }

    };


    const downloadFile = (filename, fileData) => {
        const blob = new Blob([fileData]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleLogout = () => {
        setUsername('');
        setMessages([]);
        setConnected(false);
        if (socket.current) {
            socket.current.close();
        }
    };

    if (!connected) {
        return (
            <div className='chat_container'>
                <div className='chat_input'>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Введите ваше имя"
                    />
                    <button className='chat_button' onClick={connect}>Войти</button>
                </div>
            </div>
        );
    }

    return (
        <div className="chat_container">
            <div className='chat_name'>
                {username}
                <button className='chat_button' onClick={handleLogout}>Выйти</button>
            </div>
            <div className="chat_messages">
                {messages.map((mess, index) => (

                    <div key={`${mess.username}-${mess.time}-${index}`} className={mess.username === username ? 'send_message' : 'rec_message'}>
                        {mess.event === 'connection' ? (
                            <div className="connection_message">
                                Пользователь {mess.username} подключился
                            </div>
                        ) : (
                            <div className="message">
                                {mess.username}.{' '}
                                {mess.isError ? (
                                    'Ошибка!'
                                ) : (
                                    <>
                                        {mess.file && (
                                            <a
                                                href='#'
                                                onClick={() => downloadFile(mess.filename, mess.file)}
                                            >
                                                {mess.filename}
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="chat_input">
                <div className="chat_send">
                    <Icon20Attach
                        fill={'3F8AE0'}
                        width={25}
                        height={25}
                        onClick={handleFileUploadClick}
                        style={{ cursor: 'pointer' }}
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <button className='chat_button' onClick={sendFile}>Отправить файл</button>
                </div>
            </div>
        </div>
    );
};

export default WebSock;
