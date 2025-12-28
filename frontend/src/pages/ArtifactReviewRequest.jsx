import { useState, useEffect } from "react";
import axios from "axios";

import { useAuth } from "../context/AuthProvider";
import { useUser } from "../context/UserProvider";

import Modal from "../components/Modal";
import ArtifactReviewDecision from "../components/ArtifactReviewDecision";

const ArtifactReviewRequests = () => {

    const [reviewRequests, setReviewRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const { getAccessToken } = useAuth();
    const { user } = useUser();

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchReviewRequests = async () => {
            try {
                const token = await getAccessToken();
                const response = await axios.get("http://localhost:8000/api/review-requests", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                setReviewRequests(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching review requests:", error);
            }
        };

        if (user && user.role === "ADMIN") {
            fetchReviewRequests();
        }
    }, [user]);

    return (
        <div className="p-8 flex flex-1 flex-col items-center">

            <h1 className="text-3xl font-bold mb-6">Artifacts To Review</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="w-full max-w-4xl flex flex-col items-center gap-4">
                    {reviewRequests.length > 0 ? reviewRequests.map((request) => (
                        <>
                            <div key={request.id} className="border border-gray-300 rounded p-4 w-full max-w-xl shadow hover:shadow-md transition-shadow duration-200 cursor-pointer">
                                <h2 className="text-xl font-semibold mb-2 border-b border-gray-300 pb-2">
                                    {request.title}
                                    <span className="ml-2 text-sm text-gray-500">({request.review.decision})</span>
                                </h2>
                                <p className="text-gray-700 mb-1">{request.content}</p>
                                <div className="py-2 border-t border-gray-300">
                                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 cursor-pointer">
                                        Review Artifact
                                    </button>
                                </div>
                            </div>
                            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                                <ArtifactReviewDecision artifactId={request.id} currentDecision={request.review.decision} />
                            </Modal>
                        </>
                    )) : <p className="text-center col-span-full">No review requests found.</p>}
                </div>
            )}

        </div>
    )
}

export default ArtifactReviewRequests;
