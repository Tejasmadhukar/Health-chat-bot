import { animated, useSpring } from '@react-spring/web';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './button.css';

const LandingPage:FC = () => {
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate();

  const fadeInProps = useSpring({
    from: { opacity: 0, transform : 'translateY(0px)' },
    to: { opacity: 1, transform : 'translateY(-100px)' },
    config: { duration: 1000 },
    color: 'white',
    onRest: () => {setShowContinueButton(true)}
  });

  const buttonFadeInProps = useSpring({
    from: { opacity: 0, transform : 'translateY(+100px)' },
    to: { opacity: 1, transform : 'translateY(0px)' },
    config: { duration: 1500 },
    margin: 0,
    padding: 0
  });

  const fadeOutProps = useSpring({
    from: { opacity: 1},
    to: { opacity: 0 },
    config: { duration: 5000 }
  });

  const handleContinue = () => {
    setFadeOut(true);
    navigate('/choose');
  };

  return (
    <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!fadeOut && (
            <animated.h1 style={fadeInProps}>
                <h1 style={{ color: 'white' }}>Welcome to care catalyst </h1>
                {showContinueButton  && (
                    <animated.div style={buttonFadeInProps}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button  className="glow-on-hover" onClick={handleContinue} type="button">Click me to continue !</button>
                        </div>
                    </animated.div>
                )}
            </animated.h1>
        )}    

        {fadeOut && (<animated.div style={fadeOutProps}></animated.div>)} 
    </div>

  );
};

export default LandingPage;
