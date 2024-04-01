// Button.tsx
import React from "react";
import './Button.sass'

type ButtonProps = {
    onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} className='chat_button'>
            Отправить
        </button>
    );
};

export default Button;