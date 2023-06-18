import { animated, useSpring } from "@react-spring/web";
import { FC } from "react";

interface Props{
    title: string;
}


const FadeinTitle:FC<Props> = (props) => {

    const fadeinText = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 1000 },
    })

    return (

        <animated.div style={fadeinText}>
            <h1 style={{color:'white'}}>{props.title}</h1>
        </animated.div>

    )
}

export default FadeinTitle;