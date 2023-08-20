'use client'
import { Spinner } from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import { Message } from "postcss";
import TextMessage from "./Text";

async function getMessages(group: string) {
    const res = await fetch(``);
    if (!res.ok) {
        console.log(res)
    } else {
        return await res.json()
    }
}

export default function ChatPage() {
    const bottomRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()
    useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    },[])


    const ScrollintoView = () => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }


    const previousMessages = queryClient.getQueryData<Message[]>(['messages'])
    const welcomeMessage:Message = {id: 'first', created_by: 'bot', content_message: 'You can query your files now !!', updated_at: new Date()} 

    let updatedMessages:Message[] = []
    if(previousMessages){
        updatedMessages = [...previousMessages, welcomeMessage]
    }
    queryClient.setQueryData<Message[]>(['messages'], updatedMessages)
    
    
    return (
        <div className="flex w-full flex-col h-screen message group">
            <div className="flex-1 overflow-y-auto">
                {data.map((message,index)=>
                    <TextMessage key={index} message={message}/>
                )}
                <div ref={bottomRef} />
            </div>
            
            <ChatInput scrollFunction={ScrollintoView} groupId={groupId}/>
        </div>
    )
}