import { useState } from "react"
// import Landing from "./components/Landing"
import Predictor from "./components/Predictor"

function App() {

  const [currentPage,setcurrentPage] = useState('landing');

  // const goToPredictor = () => {
  //   setcurrentPage('Predictor');
  // };

  const goTochat = () => {
    setcurrentPage('Chat');
  };

  return (
    <>
      {/* {currentPage=='landing' && (<Landing showNextPage={goToPredictor} />)}
      {currentPage=='Predictor' && (<Predictor showNextPage={goTochat}/>)} */}
      <Predictor showNextPage={goTochat}/>
      {currentPage}
    </>
  )
}

export default App
