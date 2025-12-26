import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");
        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
        }
    }, []);

    const saveTokens = (newAccessToken, newRefreshToken) => {
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
    };

    const clearTokens = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAccessToken(null);
        setRefreshToken(null);
    };

    const saveAccessToken = (newAccessToken) => {
        localStorage.setItem("accessToken", newAccessToken);
        setAccessToken(newAccessToken);
    };

    const clearAccessToken = () => {
        localStorage.removeItem("accessToken");
        setAccessToken(null);
    };

    const getAccessToken = async () => {

        if (!accessToken || !refreshToken) {
            return null;
        }

        try {

            const decodedToken = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {

                try {
                    const response = await axios.post("http://localhost:8000/api/refresh-token", {
                        'refresh_token': refreshToken
                    });
                    console.log("Access token refreshed:", response.data);
                    const { access_token } = response.data;
                    saveAccessToken(access_token);
                    return access_token;

                } catch (refreshError) {
                    console.error("Error refreshing access token:", refreshError);
                    clearTokens();
                    return null;
                }

            } else {
                return accessToken;
            }

        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const isAuthenticated = () => {
        if (!refreshToken) {
            return false;
        }

        try {
            const decodedToken = jwtDecode(refreshToken);
            const currentTime = Date.now() / 1000;

            return decodedToken.exp > currentTime;

        } catch (error) {
            console.error("Error decoding refresh token:", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, saveTokens, clearTokens, saveAccessToken, clearAccessToken, getAccessToken, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};