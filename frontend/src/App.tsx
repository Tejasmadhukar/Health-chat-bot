import Landing from "./pages/Landing"
import Predictor from "./pages/Predictor";
import Selector from "./pages/Selector";
import Symptoms from "./pages/Symptoms";
import Chat from "./pages/Chat";
import Test from "./pages/test";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/choose' element={<Selector />} />
          <Route path='/probability' element={<Predictor />} />
          <Route path='/network' element={<Symptoms />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='*' element={<Test />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
