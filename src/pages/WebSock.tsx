import React, { useEffect, useRef, useState } from 'react';
import { Icon20Attach } from '@vkontakte/icons';
import Button from '../components/button/Button.tsx';
import axios, {toFormData} from 'axios';

import './WebSock.sass';

const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const [file, setFile] = useState(null);
    const [username, setUsername] = useState('');
    const socket = useRef();
    const [connected, setConnected] = useState(false);
    const fileInputRef = useRef(null);

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')


        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                time: Date.now()
            }
            socket.current.send(JSON.stringify(message))
            console.log('Socket открыт')
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose= () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }

    const handleFileUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = e => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setFile(file);
        }

    };


    const receiveFile = () => {
        if (file) {
            console.log(file);
            // Чтение содержимого файла
            const reader = new FileReader();
            reader.onload = () => {
                // Отправка файла через вебсокет
                const message = {
                    username,
                    file: reader.result, // Содержимое файла в формате base64 или ArrayBuffer
                    fileName: file.name, // Имя файла
                    time: Date.now(),
                    isError: false,
                    event: 'sendFile'
                };
                console.log(message);
                socket.current.send(JSON.stringify(message));
            };
            reader.readAsDataURL(file); // Преобразование содержимого файла в base64
            setFile(null); // Сброс выбранного файла
        }
    };
    const downloadFile = (fileName, fileData) => {
        const blob = new Blob([fileData]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleLogout = () => {
        // Очистка состояний и завершение соединения с WebSocket
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
                        onChange={e => setUsername(e.target.value)}
                        type="text"
                        placeholder="Введите ваше имя"/>
                    <button className='chat_button' onClick={connect}>Войти</button>
                </div>
            </div>
        )

    }


    return (
        <div className="chat_container">
            <div className='chat_name'>
                {username}
                <button className='chat_button' onClick={handleLogout}>Выйти</button>
            </div>
            <div className="chat_messages">
                {messages.map((mess,index) => (
                    <div key={`${mess.time}`}>
                        {mess.event === 'connection' ? (
                            <div className="connection_message">
                                Пользователь {mess.username} подключился
                            </div>
                        ) : (
                            <div className='message'>
                                {mess.username}.{' '}
                                {mess.file && (
                                    <a
                                        href='#'
                                        onClick={() => downloadFile(mess.fileName, mess.file)}
                                    >
                                        {mess.fileName}

                                    </a>

                                )}
                                {mess.isError ? ' Ошибка!' : null}
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
                        style={{cursor: 'pointer'}}
                    />
                    <input
                        value={value}
                        type="file"
                        ref={fileInputRef}
                        style={{display: 'none'}}
                        onChange={handleFileChange}
                    />
                    <button className='chat_button' onClick={receiveFile}>Отправить файл</button>
                </div>
            </div>
        </div>


    );
};

export default WebSock;
