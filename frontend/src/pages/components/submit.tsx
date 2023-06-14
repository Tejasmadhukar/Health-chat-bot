import "./chat.css"
import { FormEvent, useState, FC, ChangeEvent } from "react";

interface TextProps {
    onMessageSubmit: (message: string) => void;
  }

const Text:FC<TextProps> = ({ onMessageSubmit }) => {

    const [inputValue,setinputValue] = useState('');

    const Submit = (event : FormEvent) => {
        event.preventDefault();
        onMessageSubmit(inputValue);
        setinputValue('');
    };

    const Change = (event: ChangeEvent<HTMLInputElement>) => {
        setinputValue(event.target.value);
      };

    return(
        <form className="msger-inputarea" onSubmit={Submit}>
            <input type="text" onChange={Change} className="msger-input" value={inputValue} placeholder="Enter your message..." />
            <button  className="msger-send-btn" type="submit">Send</button>
        </form>
    )
}

export default Text