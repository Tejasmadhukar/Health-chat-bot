import { BotResponse } from "@/types";
import { Divider } from "@nextui-org/react";
import { FC } from "react";
import Similarity from "./Buttons/Similarity";
import Summary from "./Buttons/Summary";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

interface BeautifyProps {
    message: BotResponse[]
    UserMessage: string | number | BotResponse[]
}

const Beautify:FC<BeautifyProps> = ({message,UserMessage}) => {
    if(typeof UserMessage !== "string") return <p>Please Enter a string !!</p>
    return(
        <>
        {message.map((msg,index)=>(
            <div key={index} className="flex flex-col">
                <h1 className="font-bold">Result {index+1}</h1>
                <div className="flex my-2">
                    <p className="mr-2 font-bold">Relevance Score -</p>
                    <p className="mr-2">{msg.Output.RelevanceScore}</p>
                </div>
                <div className="flex my-2">
                    <p className="mr-2 font-bold">Facts: </p>
                    <p className="mr-2">{msg.Output.Facts}</p>
                </div>
                <div className="flex my-2 justify-center">
                    <Similarity message={msg} query={UserMessage} />
                </div>
                <div className="flex my-2 justify-center">
                    <Summary message={msg}/>
                </div>
                {/* <div className="flex my-2 justify-center">
                    <Button href={`https://indiankanoon.org/?formInput=${msg.Output.FileName}`} as={Link} isExternal color="secondary" variant="ghost" showAnchorIcon> Go to case</Button>
                </div> */}
                <Divider className="my-4" />
            </div>
        ))}
        </>
    )
}

export default Beautify;