import { useState } from "react";

import ArtifactDetail from "./ArtifactDetail";
import Modal from "./Modal";

const ArtifactCard = ({ artifact }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div 
                key={artifact.id} 
                className="w-full max-w-xl border border-gray-300 rounded p-5 shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {artifact.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border border-gray-300 bg-teal-100 text-teal-800`}>
                        {artifact.status}
                    </span>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-3">{artifact.summary}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex items-center gap-1">
                        <span>Created: {new Date(artifact.created_on).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>Updated: {new Date(artifact.last_updated).toLocaleDateString()}</span>
                    </div>
                    {artifact.file && (
                        <div className="flex items-center gap-1">
                            <span className="truncate max-w-xs">Files: {artifact.file}</span>
                        </div>
                    )}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ArtifactDetail 
                    id={artifact.id}
                    title={artifact.title}
                    content={artifact.content}
                    summary={artifact.summary}
                    fileUrl={artifact.file_url}
                    status={artifact.status}
                    createdBy={artifact.created_by}
                    review={artifact.review}
                    reviewRequested={artifact.review_requested}
                />
            </Modal>
        </>
    );
};

export default ArtifactCard;