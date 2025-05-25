import { Route, Routes, BrowserRouter as Router } from "react-router-dom"
import LandingPage from "./Landing/LandingPage"
import RegisterLayout from "./Auth/layout/RegisterLayout"
import LoginLayout from "./Auth/layout/LoginLayout"

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterLayout />} />
          <Route path="/login" element={<LoginLayout />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
