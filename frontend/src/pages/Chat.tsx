import { Button } from "@nextui-org/react";
import { useState } from "react";

const Chat = () => {
    const [out,setOut] = useState('hello');
    const test = async () => {
        setOut('Pressed');
        try {
            const data = await    fetch('http://127.0.0.1:8005/response',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: 'Hello what is your name' })
                })

            const repsonse = await data.json();

            setOut(repsonse.text);
            
        } catch (error) {
            console.log(error);
            setOut('hello');
        }
    }

    return(
        <>
            <h1 style={{color:'white'}}>{out}</h1>
            <Button color="error"
                onPress={test}
            />
        </>
    )
}

export default Chat;