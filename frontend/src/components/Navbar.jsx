import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { BiSun, BiMoon, BiMenu, BiCross } from "react-icons/bi";
import { toast } from "react-toastify";

import { useTheme } from "../context/ThemeProvider";
import { useAuth } from "../context/AuthProvider";


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    const {theme, toggleTheme} = useTheme();
    const { clearTokens, isAuthenticated } = useAuth();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        toast.info("You have been logged out.");
        clearTokens();
        navigate("/logout");
    };

    // Handle scroll to add background to navbar when in light mode to improve visibility/separation of navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 32) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header className={`
            fixed top-0 w-full px-8 z-50 transition-all duration-300
            ${scrolled ? 'bg-white dark:bg-gray-950 shadow-lg backdrop-blur-md' : 'bg-transparent'}
        `}>
            
            <div className="mx-auto px-4 h-16 flex items-center justify-between">
                
                {/* Logo */}
                <NavLink to="/" className="font-bold text-2xl text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400">
                    DKN
                </NavLink>

                {/* For Desktop */}
                <nav className="hidden md:flex items-center space-x-4">
                    <NavLink to="/" className="text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400">
                        Home
                    </NavLink>
                    {isAuthenticated() && (
                        <NavLink to="/create-artifact" className="text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400">
                            Create Artifact
                        </NavLink>
                    )}
                    {isAuthenticated() && (
                        <NavLink to="/personal-artifacts" className="text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400">
                            My Artifacts
                        </NavLink>
                    )}
                    {
                        isAuthenticated() ? 
                        (<button onClick={handleLogout} className="text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 cursor-pointer">
                            Logout
                        </button>) : 
                        (<NavLink to="/login" className="text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400">
                            Login
                        </NavLink>)
                    }
                    <button onClick={toggleTheme} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
                        {
                            theme === "dark" ? (
                                <BiSun className="text-white" size={20} />
                            ) : (
                                <BiMoon className="text-gray-950" size={20} />
                            )
                        }
                    </button>
                </nav>

                {/* For Mobile */}
                <div className="flex items-center md:hidden space-x-4">
                    <button onClick={toggleTheme} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
                        {
                            theme === "dark" ? (
                                <BiSun className="text-white" size={20} />
                            ) : (
                                <BiMoon className="text-gray-950" size={20} />
                            )
                        }
                    </button>
                    <button onClick={toggleMenu} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
                        {
                            isOpen ? <BiCross className="text-gray-800 dark:text-gray-200" size={24} /> :
                            <BiMenu className="text-gray-800 dark:text-gray-200" size={24} /> 
                        }
                    </button>
                </div>

            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-950 shadow-lg rounded-lg p-4 md:hidden">
                    <nav className="flex flex-col items-center space-y-2">
                        <NavLink to="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400">
                            Home
                        </NavLink>
                        {
                            isAuthenticated() ?
                            (<button onClick={handleLogout} className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer">
                                Logout
                            </button>) :
                            (<NavLink to="/login" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400">
                                Login
                            </NavLink>)
                        }
                    </nav>
                </div>
            )}

        </header>
    );
};

export default Navbar;