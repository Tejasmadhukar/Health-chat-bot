'use client'
import { FC, useState } from "react";
import { BotResponse } from "@/types"
import { Button } from "@nextui-org/button";
import { FetchSummary } from "./fetch";

interface ButtonProps {
    message: BotResponse
}

const Summary:FC<ButtonProps> = ({message}) => {
    const [Loading, setLoading] = useState(false);
    const [Completed, setCompleted] = useState(false);
    const [Output, setOutput] = useState("");

    const HandleClick = () => {
        setLoading(true);
        FetchSummary(message.Output.CaseSummary).then((data)=>{
            setLoading(false);
            setCompleted(true);
            setOutput(data);
        })
    }

    return (
        <>
            {!Completed ? (
                <Button color="secondary" variant="ghost" isLoading={Loading} onPress={HandleClick}>
                    Show Summary
                </Button>
            ) : (
                <>
                    <p className="mr-2 font-bold">Summary: </p>
                    <div className="flex flex-col">
                        <p className="flex flex-col">{Output}</p>
                    </div>

                </>
            )}
        </>
    )
}

export default Summary;