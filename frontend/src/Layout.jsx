import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = ({ children }) => {
    return (
        <div className="h-screen flex flex-col text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950 transition-colors duration-300">
            <Navbar />
            <div className="flex-1 flex flex-col mt-16 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950">
                {children}
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
