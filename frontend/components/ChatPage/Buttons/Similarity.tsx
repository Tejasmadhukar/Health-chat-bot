'use client'
import { BotResponse } from "@/types";
import { Button } from "@nextui-org/button";
import { FC, useState } from "react";
import { FetchSim } from "./fetch";

interface ButtonProps {
    message: BotResponse
    query: string
}

const Similarity:FC<ButtonProps> = ({message, query}) => {
    const [Loading, setLoading] = useState(false);
    const [Completed, setCompleted] = useState(false);
    const [Output, setOutput] = useState("");

    const HandleClick = () => {
        setLoading(true);
        FetchSim(query,message.Output.Facts).then((data)=>{
            setLoading(false);
            setCompleted(true);
            setOutput(data);
        })
    }

    return (
        <>
            {!Completed ? (
                <Button color="secondary" variant="ghost" isLoading={Loading} onPress={HandleClick}>
                    Show Similarity and Dissimilarity
                </Button>
            ) : (
                <>
                    <p className="mr-2 font-bold">Similarity Dissimilarity: </p>
                    <div className="flex flex-col">
                        {Output.split('\n').map((line, index) => (
                            <>
                                <p className="mr-2" key={index}>{line}</p>
                                <hr className="my-1"/>
                            </>
                        ))}
                    </div>

                </>
            )}
        </>
    )
}

export default Similarity;