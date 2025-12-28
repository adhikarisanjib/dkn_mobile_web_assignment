import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

import { useAuth } from "./AuthProvider";

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const { getAccessToken } = useAuth();

    useEffect(() => {
        const fetchUser = async () => {
            const token = await getAccessToken();
            if (token) {
                try {
                    const response = await axios.get("http://localhost:8000/api/profile", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };
        fetchUser();
    }, [getAccessToken]);
    

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
