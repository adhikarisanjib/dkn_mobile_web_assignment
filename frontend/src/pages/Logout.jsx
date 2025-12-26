import { Link } from "react-router-dom";

const Logout = () => {

    return (
        <div className="p-8 flex flex-1 flex-col items-center">

            <div className="text-lg">
                You have been logged out. 
                If you want to log in again, please click <Link to="/login" className="text-teal-600 hover:underline">here</Link>.
            </div>

        </div>
    )
};

export default Logout;
