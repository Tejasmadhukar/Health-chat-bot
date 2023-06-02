import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Button, Spacer } from "@nextui-org/react";
import { animated, useSpring } from "@react-spring/web";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import DeleteDocumentIcon from './components/DeleteDocumentIcon';
import './Symptoms.css'

const Symptoms = () => {

    const [symptoms,setsymptoms] = useState<string[]>([
        "fatigue",
        "vomiting",
        "high fever",
        "loss of appetite",
        "nausea"
    ]);

    const [SelectedSymptoms, setSelectedSymptoms] = useState<(string | null)[]>([]);

    const [Diagnosis, setDiagnosis] = useState<string[]>([]);

    const [count, setCount] = useState(3);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();

    const fetchData = async (symptom:string) => {
        try{
            const response = await fetch(`http://127.0.0.1:8005/search?search_symptom=${symptom}`);
            const data = await response.json();
            setsymptoms(data.search_results);
        } catch (err) {
            console.log(err);
        }
    }

    const addSymptom = async (symptom: string | null) =>{
        
        if(SelectedSymptoms.includes(symptom)){
            try{
                fetch(`http://127.0.0.1:8005/append?symptom=${symptom}`)
                .then().catch(err =>console.error(err));
                setSelectedSymptoms(SelectedSymptoms.filter((s) => s !== symptom));
                setCount(count + 1);
            }catch(err){
                console.log(err);
            }
        }
        else{
            try{
                const response = await fetch(`http://127.0.0.1:8005/append?symptom=${symptom}`)
                const data = await response.json();
                if ('diagnosis' in data) {
                    console.log(data.diagnosis); // Log the diagnosis value for debugging
                    setDiagnosis(data.diagnosis);
                  }
                setSelectedSymptoms([...(SelectedSymptoms || []),symptom]);
                setCount(count-1);
            }catch(err){
                console.log(err);
            }
        }
    }

    const fadeinText = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 1000 },
    })

    const fadeinCounter = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 1000 },
        delay: 1000,
    })


    const fadeinInput = useSpring({
        from: { opacity: 0 },
        to: { opacity: count == 0 ? 0 : 1 },
        config: { duration: 1000 },
        delay: 2000
    })

    const fadeinTable = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1},
        config: { duration: 1000 },
        delay: 2000
    });

    const fadeinDiagnosis = useSpring({
        from: { opacity: 0},
        to: { opacity: count == 0 ? 1 : 0},
        config: { duration: 1000 },
        delay : 1000,
    })

    const fadeOut = useSpring({
        from: { opacity: 1 },
        to: { opacity: count == 0 ? 0 : 1 },
        config: { duration: 1000 },
    });

    const Navigate = () => {
        navigate('/chat')
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <animated.div style={fadeinText}>
                <h1 style={{color:'white'}}>Disease predictor</h1>
            </animated.div>



            <animated.div style={{color: 'white', marginTop: '0', ...(count == 0 ? fadeOut : fadeinCounter) }}>
                {count < 3 ? (<h2>Select {count} more symptoms</h2>) : (<h2>Please select at least {count} symptoms</h2>)}   
            </animated.div>

            <Spacer />

            {count == 0 && (
                <animated.table style={fadeinDiagnosis}>
                    <tbody>
                        <tr>
                            <td>
                                <h1 style={{ color: 'white', textAlign: 'center' }}>You Probably one of these diseases</h1>
                            </td>
                        </tr>
                        {Diagnosis.map((disease) => (
                            <tr key={disease}>
                                <td>
                                    <h2 style={{ color: 'white', textAlign: 'center' }}>{disease}</h2>
                                </td>
                            </tr>
                        ))}
                        <Spacer />
                        <tr>
                            <td style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <animated.div style={fadeinDiagnosis}>
                                    <Button shadow color="success" onPress={Navigate} auto>Continue to chat</Button>
                                </animated.div>
                            </td>
                        </tr>
                    </tbody>
                </animated.table>
            )}

            <animated.div style={count == 0 ? fadeOut : fadeinInput}>
                <Autocomplete
                    freeSolo
                    autoComplete
                    autoHighlight
                    id="combo-box-demo"
                    options={symptoms}
                    sx={{ width: 300 }}
                    onChange={(_event,value)=>{value!==null && (addSymptom(value))}}
                    renderInput={(params) => 
                    <TextField {...params} 
                        onChange={(e)=>{fetchData(e.target.value)}} 
                        variant="standard" 
                        error
                        color='primary'
                        label="Search your symptoms here" 
                    />}
                />
            </animated.div>

            <Spacer y={4}/>

            <animated.table style={count == 0 ? fadeOut : fadeinTable}>
                {Diagnosis.length <=0 && (
                    <>
                        <tbody>
                        {SelectedSymptoms.map((symptom, index) => (
                            <tr key={index} onClick={() => {addSymptom(symptom)}}>
                                <td>
                                    <h3 style={{ color: 'white', textAlign: 'center' }}>{symptom}</h3>
                                </td>
                                <td>
                                    <DeleteDocumentIcon size={22} fill='red' />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </>
                )}
            </animated.table>
            {/* <DeleteIcon size={100} fill="red" /> */}
            

        </div>

    )
}

export default Symptoms;