import { ImCross } from "react-icons/im";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded shadow-lg w-full max-w-lg p-6 relative">
                <button
                    className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    onClick={onClose}
                >
                    <ImCross />
                </button>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;