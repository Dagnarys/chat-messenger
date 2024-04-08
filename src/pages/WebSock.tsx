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
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
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

    // const sendFile = async () => {
    //     if (file) {
    //         console.log('Uploading file...');
    //
    //         const formData = new FormData();
    //         formData.append('file', file);
    //
    //         try {
    //             const result = await axios.post('https://httpbin.org/post', formData);
    //
    //             console.log(result.data);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //         setValue('');
    //     }
    // };
    const sendFile = async () => {

        const message = {
            username,

            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message));
        setValue('')

    }

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
            <div className="messages">
                {messages.map(mess => (
                    <div key={mess.id}>
                        {mess.event === 'connection' ? (
                            <div className="connection_message">
                                            Пользователь {mess.username} подключился
                                        </div>
                                    ) : (
                                        <div className="message">
                                            {mess.username}. {mess.formData}
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
                        value={value}
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
