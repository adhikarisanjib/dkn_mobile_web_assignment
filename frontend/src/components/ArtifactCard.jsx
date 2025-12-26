import { useState } from "react";

import ArtifactDetail from "./ArtifactDetail";
import Modal from "./Modal";

const ArtifactCard = ({ artifact }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div 
                className="border border-gray-300 rounded p-4 shadow hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <h2 className="text-xl font-bold mb-2">{artifact.title} ({artifact.status})</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{artifact.summary}</p>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ArtifactDetail 
                    id={artifact.id}
                    title={artifact.title}
                    content={artifact.content}
                    summary={artifact.summary}
                    fileUrl={artifact.file_url}
                    status={artifact.status}
                />
            </Modal>
        </>
    );
};

export default ArtifactCard;