import { Checkbox, Spacer, Button } from '@nextui-org/react';
import { animated, useSpring } from '@react-spring/web';
import { FC, useState, useEffect } from 'react';

interface Symptom{
    name: string;
}

const Predictor:FC = () => {

    const [symptoms,setsymptom] = useState<Symptom[]>([]);
    const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>([]);
    const [count, setCount] = useState(5);

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

    const top_list = async () => {
        try{
            const list = await fetch('http://127.0.0.1:8005/top');
            const jsonData = await list.json();
            setsymptom(jsonData);
        }catch(err){
            console.log(err);
        }
    };

    const CheckboxChange = (label: string) =>{
        fetch(`http://127.0.0.1:8005/appendpb?a=${label}`)
        .then().catch((err) => console.log(err));
        setCheckedSymptoms(prevCheckedSymptoms => {
            if (prevCheckedSymptoms.includes(label)) {
              return prevCheckedSymptoms.filter(symptom => symptom !== label);
            } else {
              return [...prevCheckedSymptoms, label];
            }
        });
        console.log(checkedSymptoms.length);
        setCount(5-checkedSymptoms.length);
    }
    console.log(checkedSymptoms.length);

    useEffect(() => {
       top_list();
    }, []);
    
    return(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <animated.div style={{ ...fadeInFromRightProps, color: 'white', marginTop: '0' }}>
                <h1>Disease Predictor</h1>
            </animated.div>
    
            <animated.div style={{ ...fadeInFromLeftProps, color: 'white', marginTop: '0' }}>
                <h2>Please select at least {count} symptoms</h2>
            </animated.div>

            <Spacer />

            <animated.table style={{...fadeinTable}}>
                <tbody>
                {symptoms.map((symptom, index) => (
                    index % 2 == 0 && (
                        <tr key={symptom.name}>

                            <td>
                                <Checkbox color='error' labelColor={checkedSymptoms.includes(symptom.name) ? 'error' : 'success' }  size='lg' label={symptom.name} isSelected={checkedSymptoms.includes(symptom.name)}  onChange={() => CheckboxChange(symptom.name)} />
                                <Spacer />
                            </td>
                            
                            <td style={{ paddingLeft: '16px' }}>
                                <Checkbox color='error' size='lg' label={symptoms[++index].name} isSelected={checkedSymptoms.includes(symptoms[index].name)}  onChange={() => CheckboxChange(symptoms[index].name)} labelColor={checkedSymptoms.includes(symptoms[index].name) ? 'error' : 'success' } />
                                <Spacer />
                            </td>
                        
                        </tr>
                    )
                ))}
                </tbody>
            </animated.table>

            <Button color="error" auto ghost>More</Button>

        </div>
    );
}

export default Predictor