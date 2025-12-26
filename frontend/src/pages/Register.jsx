import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";

import { SystemRole, Region } from "../types";
import { useAuth } from "../context/AuthProvider";


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [region, setRegion] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({
        name: "",
        email: "",
        role: "",
        region: "",
        password: "",
        confirmPassword: ""
    });

    const navigate = useNavigate();
    const {accessToken, setAccessToken, getAccessToken} = useAuth();

    const handleUserRegister = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError((prevError) => ({
                ...prevError,
                confirmPassword: "Passwords do not match"
            }));
            return;
        }

        axios.post("http://localhost:8000/api/register", {
            'name': name,
            'email': email,
            'role': role,
            'region': region,
            'password': password
        })
        .then((response) => {
            toast.success("Registration successful! Please login.");
            navigate("/login");
        })
        .catch((error) => {
            console.error("Registration failed:", error);
            toast.error("Registration failed. Please try again.");
        });
    };

    // Redirect to home if already logged in
    useEffect(() => {
        const fetchToken = async () => {
            const token = await getAccessToken();
            setAccessToken(token);
        };
        fetchToken();
        if (accessToken) {
            toast.info("You are already logged in. Redirecting to home.");
            navigate("/");
        }
    }, [accessToken, navigate]);

    return (
        <div className="p-8 flex flex-1 flex-col items-center">

            <form className="w-full max-w-xl flex flex-col gap-2" method="post">

                <legend className="py-2 text-2xl font-bold border-b border-gray-300">Register</legend>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-email">Email</label>
                    <input type="email" id="id-email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    {error.email && <span className="text-sm text-red-600">{error.email}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-name">Name</label>
                    <input type="text" id="id-name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    {error.name && <span className="text-sm text-red-600">{error.name}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-role">Role</label>
                    <select id="id-role" name="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                        <option value="">Select a role</option>
                        {Object.values(SystemRole).map((role) => (
                            <option className="bg-transparent" key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    {error.role && <span className="text-sm text-red-600">{error.role}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-region">Region</label>
                    <select id="id-region" name="region" value={region} onChange={(e) => setRegion(e.target.value)} required>
                        <option value="">Select a region</option>
                        {Object.values(Region).map((region) => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                    {error.region && <span className="text-sm text-red-600">{error.region}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-password">Password</label>
                    <input type="password" id="id-password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {error.password && <span className="text-sm text-red-600">{error.password}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-confirm-password">Confirm Password</label>
                    <input type="password" id="id-confirm-password" name="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    {error.confirmPassword && <span className="text-sm text-red-600">{error.confirmPassword}</span>}
                </div>

                <button onClick={handleUserRegister} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 cursor-pointer">
                    Register
                </button>

                <div className="flex gap-2">
                    Already have an account? 
                    <Link to="/login" className="text-teal-600 hover:underline">Login here</Link>
                </div>

            </form>

        </div>
    );
};

export default Register;
