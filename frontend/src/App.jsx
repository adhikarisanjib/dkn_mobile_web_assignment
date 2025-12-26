import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';

import Layout from "./Layout"
import { ThemeProvider } from "./context/ThemeProvider"
import { AuthProvider } from "./context/AuthProvider"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import Register from "./pages/Register"
import CreateArtifact from "./pages/CreateArtifact";
import UpdateArtifact from "./pages/UpdateArtifact";
import PersonalArtifacts from "./pages/PersonalArtifacts";

function App() {

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-artifact" element={<CreateArtifact />} />
              <Route path="/update-artifact/:id" element={<UpdateArtifact />} />
              <Route path="/personal-artifacts" element={<PersonalArtifacts />} />
            </Routes>
            <ToastContainer />
          </Layout>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
