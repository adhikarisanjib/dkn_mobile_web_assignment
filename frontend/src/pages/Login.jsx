import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from "axios"

import { useAuth } from "../context/AuthProvider";


const Login = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const { getAccessToken } = useAuth();

    const handleUserLogin = async (e) => {
        e.preventDefault();

        axios.post("http://localhost:8000/api/login", {
            'email': email,
            'password': password
        })
        .then((response) => {
            const { access_token, refresh_token } = response.data;
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("refreshToken", refresh_token);
            toast.success("Login successful!");
            window.location.href = "/";
        })
        .catch((error) => {
            console.error("Login failed:", error);
            toast.error("Login failed. Please check your credentials and try again.");
        });
        
    }

    // Redirect to home if already logged in
    useEffect(() => {
        const fetchToken = async () => {
            const token = await getAccessToken();
            setAccessToken(token);
        };
        fetchToken();
        if (accessToken) {
            toast.info("You are already logged in.");   
        }
    }, [accessToken, navigate]);

    return (
        <div className="p-8 flex flex-1 flex-col items-center">

            <form className="w-full max-w-xl flex flex-col gap-2" method="post">

                <legend className="py-2 text-2xl font-bold border-b border-gray-300">Login</legend>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-email">Email</label>
                    <input type="email" id="id-email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    {error.email && <span className="text-sm text-red-600">{error.email}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-password">Password</label>
                    <input type="password" id="id-password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {error.password && <span className="text-sm text-red-600">{error.password}</span>}
                </div>

                <button onClick={handleUserLogin} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 cursor-pointer">
                    Login
                </button>

                <div className="flex gap-2">
                    Need an account? 
                    <Link to="/register" className="text-teal-600 hover:underline">Register here</Link>
                </div>

            </form>

        </div>
    );
};

export default Login;