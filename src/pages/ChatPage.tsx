// ChatPage.tsx
import React, { useRef, useState } from "react";
import Message from "../components/message";
import Input from "../components/input";
import { Icon20Attach } from '@vkontakte/icons';
import Button from "../components/button/Button.tsx";

import "./ChatPage.sass";

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [file, setFile] = useState<File | null>(null);
    const [value, setValue] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setFile(file);
        }
    };

    const handleUpload = async () => {
        if (file) {
            console.log("Uploading file...");

            const formData = new FormData();
            formData.append("file", file);

            try {
                const result = await fetch("https://httpbin.org/post", {
                    method: "POST",
                    body: formData,
                });

                const data = await result.json();

                console.log(data);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className='chat_container'>
            <div className='chat_input'>
                <input
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    type="text"
                    placeholder="Введите имя"
                    name="name"
                />
            </div>
            <div className='chat_messages'>
                {messages.map(mess =>
                    <div className="message" key={mess.id}>
                        {mess.message}
                    </div>
                )}
            </div>
            <div className='chat_send'>
                <Icon20Attach
                    fill={'3F8AE0'}
                    width={25}
                    height={25}
                    onClick={handleFileUploadClick}
                    style={{ cursor: 'pointer' }}
                />
                <input
                    type='file'
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <Button onClick={handleUpload} />
            </div>
        </div>
    );
};

export default ChatPage;
