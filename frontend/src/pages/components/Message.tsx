import './Message.css';
import { FC } from 'react';

interface Message{
    name: string;
    side?: string;
    text: string | React.JSX.Element ;
}

const Message:FC<Message> = (props) => {

    const formatDate = () => {
        const h:string = "0" + new Date().getHours();
        const m:string = "0" + new Date().getMinutes();
        return `${h.slice(-2)}:${m.slice(-2)}`;
    }
    
    const img:string = props.side==='left' ? "url(https://images.unsplash.com/photo-1634315556998-81c64cfab8a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=792&q=80)" : 
        "url(https://images.unsplash.com/photo-1599272771314-f3ec16bda3f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80)";

    const message_position = 'msg ' + props.side + '-msg';

    return(
        <div className={message_position}>

            <div className="msg-img" style={{backgroundImage : img}}></div>

            <div className="msg-bubble">
                <div className="msg-info">
                    <div className="msg-info-name">{props.name}</div>
                    <div className="msg-info-time">{formatDate()}</div>
                </div>

                <div className="msg-text">{props.text}</div>
            </div>
        </div>
    )
}

export default Message 