import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';

import Layout from "./Layout"
import { ThemeProvider } from "./context/ThemeProvider"
import { AuthProvider } from "./context/AuthProvider"
import { UserProvider } from "./context/UserProvider";

import Home from "./pages/Home"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard";
import Artifacts from "./pages/Artifacts";
import CreateArtifact from "./pages/CreateArtifact";
import UpdateArtifact from "./pages/UpdateArtifact";
import PersonalArtifacts from "./pages/PersonalArtifacts";
import ArtifactReviewRequests from "./pages/ArtifactReviewRequest";

function App() {

  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <ThemeProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/artifacts" element={<Artifacts />} />
                <Route path="/create-artifact" element={<CreateArtifact />} />
                <Route path="/update-artifact/:id" element={<UpdateArtifact />} />
                <Route path="/personal-artifacts" element={<PersonalArtifacts />} />
                <Route path="/artifact-review-requests" element={<ArtifactReviewRequests />} />
              </Routes>
              <ToastContainer />
            </Layout>
          </ThemeProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
