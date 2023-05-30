import Landing from "./components/Landing"
import Predictor from "./components/Predictor";
import Selector from "./components/Selector";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/choose' element={<Selector />} />
          <Route path='/probability' element={<Predictor />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
