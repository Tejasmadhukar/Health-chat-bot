import { Button, Checkbox, Spacer } from '@nextui-org/react';
import { animated, useSpring } from '@react-spring/web';
import { FC, useEffect, useState } from 'react';

interface Symptom{
    recommender: string[];
    diagnosis: string[];
}

interface LandingProps{
    showNextPage: () => void;
}

const Predictor:FC<LandingProps> = ({ showNextPage }) => {


    const [symptoms,setsymptom] = useState<Symptom>({
        recommender: [],
        diagnosis: [],
      });
    const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>([]);
    const [count,setcount] = useState(5);

    const fadeInFromRightProps = useSpring({
        from: { opacity: 0, transform: 'translateX(200px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
        config: { duration: 1000 },
    });      

    const fadeInFromLeftProps = useSpring({
        from: { opacity: 0, transform: 'translateX(-200px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
        config: { duration: 1000 },
        delay: 500,
    });

    const fadeinTable = useSpring({
        from: { opacity: 0},
        to: { opacity: 1},
        config: { duration: 1000 },
        delay: 1200,
    });

    const fadeinDiagnosis = useSpring({
        from: { opacity: 0},
        to: { opacity: 1},
        config: { duration: 1000 },
    })

    const fadeOut = useSpring({
        from: { opacity: 1 },
        to: { opacity: count === 0 ? 0 : 1 },
        config: { duration: 1000 },
    });

    const fadeinButton = useSpring({
        from: { opacity: 0},
        to: { opacity: 1},
        config: { duration: 1000 },
        delay: 2200,
    });

    const fetchSymptoms = async () => {
        try{
            const list = await fetch('https://127.0.0.1:8005/getSymptoms');
            const jsonData = await list.json();
            'diagnosis' in jsonData ? (console.log(jsonData.diagnosis)) : (console.log(jsonData.recommender));
            'diagnosis' in jsonData ? (setsymptom((prev) => ({ ...prev, diagnosis: jsonData.diagnosis }))) : (setsymptom((prev) => ({ ...prev, recommender: jsonData.recommender })))
            setsymptom(prev => ({...prev, recommender: jsonData.recommender}));
        }catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        fetchSymptoms();
      }, []);
      
    useEffect(() => {
    if (count === 0) {
        fetchSymptoms();
    }
    }, [count]);
      
    const CheckboxChange = (label: string) =>{
        fetch(`http://127.0.0.1:8005/recommender?symptom=${label}`)
        .then().catch((err) => console.log(err));
        setCheckedSymptoms(prevCheckedSymptoms => {
            if (prevCheckedSymptoms?.includes(label)) {
              return prevCheckedSymptoms.filter(symptom => symptom !== label);
            } else {
              return [...(prevCheckedSymptoms || []), label];
            }
        });
        console.log(checkedSymptoms?.length);
        setcount(count-1);
    }
    
    return(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <animated.div style={{ ...fadeInFromRightProps, color: 'white', marginTop: '0' }}>
                <h1>Disease Predictor</h1>
            </animated.div>
    
            <animated.div style={{color: 'white', marginTop: '0', ...(count === 0 ? fadeOut : fadeInFromLeftProps) }}>
                <h2>Please select at least {count} symptoms</h2>
            </animated.div>

            <Spacer />

            {count === 0 && (
                <>
                    <animated.table style={fadeinDiagnosis}>
                        <tbody>
                            <tr>
                                <td>
                                    <h1 style={{ color: 'white', textAlign: 'center' }}>You Probably one of these diseases</h1>
                                </td>
                            </tr>
                            {symptoms.diagnosis.map((symptom) => (
                                <tr key={symptom}>
                                    <td>
                                        <h2 style={{ color: 'white', textAlign: 'center' }}>{symptom}</h2>
                                    </td>
                                </tr>
                            ))}
                            <Spacer />
                            <tr>
                                <td style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <animated.div style={fadeinDiagnosis}>
                                        <Button shadow color="success" onPress={showNextPage} auto>Continue to chat</Button>
                                    </animated.div>
                                </td>
                            </tr>
                        </tbody>
                    </animated.table>
                </>
            )}

            <animated.table style={count === 0 ? fadeOut : fadeinTable}>
                <tbody>
                {symptoms.diagnosis.length<=0 && (
                    <>
                    {symptoms.recommender?.map((symptom, index) =>
                    index % 2 === 0 && (
                        <tr key={index}>
                            <td>
                                <Checkbox
                                color="error"
                                labelColor={checkedSymptoms?.includes(symptom) ? 'error' : 'success'}
                                size="lg"
                                label={symptom}
                                isSelected={checkedSymptoms?.includes(symptom)}
                                onChange={() => CheckboxChange(symptom)}
                                />
                                <Spacer />
                            </td>
                            <td style={{ paddingLeft: '16px' }}>
                                <Checkbox
                                color="error"
                                size="lg"
                                label={symptoms.recommender[index + 1]}
                                isSelected={checkedSymptoms?.includes(symptoms.recommender[index + 1])}
                                onChange={() => CheckboxChange(symptoms.recommender[index + 1])}
                                labelColor={checkedSymptoms?.includes(symptoms.recommender[index + 1]) ? 'error' : 'success'}
                                />
                                <Spacer />
                            </td>
                        </tr>
                        ))
                    }
                    </>
                )}
                </tbody>
            </animated.table>
            
            <animated.div style={{...fadeinButton, ...(count === 0 ? fadeOut : fadeinTable)}}>
                <Button color='error' onPress={fetchSymptoms} auto ghost>More Symptoms</Button>
            </animated.div>

        </div>
    );
}

export default Predictor