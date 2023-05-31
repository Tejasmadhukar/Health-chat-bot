import { Button, Spacer } from "@nextui-org/react";
import { animated, useSpring } from "@react-spring/web";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const Selector:FC = () => {

    const [ButtonHover, setButtonHover] = useState('');
  
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();

    const navLeft = () => { 
        navigate('/probability')
    }

    const fadeinButton = useSpring({
        from: { opacity: 0,  },
        to: { opacity: 1 },
        config: { duration: 1000 },
    });      

    const fadeinHover = useSpring({
        from: { opacity: 0},
        to: { opacity: 1},
        config: { duration: 1000 },
        delay: 800,
    });      

    const fadeOut = useSpring({ 
        from: { opacity: 1},
        to: { opacity: 0},
        config: { duration: 1000 }
    }); 

    const fadeLeft = useSpring({
        opacity: ButtonHover === 'LeftButton' ? 1 : 0,
        config: { duration: 500 },
    }); 

    const fadeRight = useSpring({
        opacity: ButtonHover === 'RightButton' ? 1 : 0,
        config: { duration: 500 },
    }); 
  
    return(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <Spacer y={12}/>
    
            <animated.table style={fadeinButton}>
                <tbody>
                    <tr>
                        <td>
                            <Button size='xl' color="success" 
                                onMouseEnter={() => {setButtonHover('LeftButton')}}
                                onMouseLeave={() => {setButtonHover('')}}
                                onPress={navLeft} auto >
                                    Probablistic Disease Predictor
                            </Button>
                        </td>
                        <Spacer />
                        <td>
                            <Button size='xl' color="error"
                                onMouseEnter={() => {setButtonHover('RightButton')}} 
                                onMouseLeave={() => {setButtonHover('')}} auto >
                                    Neural Network Disease Predictor
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </animated.table>

            <Spacer />

            <div style={{ position: "relative" }}>
                <animated.h2
                    style={{
                        ...fadeLeft,
                        color: "white",
                        fontStyle: "italic",
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        whiteSpace: "nowrap", 
                    }}>
                    This is a disease predictor which uses Probabilistic/Statistical Methods <br /> 
                    to determine the disease you have based on symptoms selected.
                </animated.h2>
                <animated.h2
                    style={{
                        ...fadeRight,
                        color: "white",
                        fontStyle: "italic",
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        whiteSpace: "nowrap", 
                    }}>
                    This is a disease predictor which uses a Neural Network (3linear + 2dropout layers) <br />
                    to determine the disease you have based on the symptoms selected. 
                </animated.h2>
            </div>

            <Spacer y={4}/>

            <animated.div style={{...(ButtonHover=='LeftButton' || ButtonHover=='RightButton' ? fadeOut : fadeinHover), color: 'white', marginTop: '0'}}>
                <h2>Hover on button more information</h2>
            </animated.div>

        </div>
    )
}

export default Selector;