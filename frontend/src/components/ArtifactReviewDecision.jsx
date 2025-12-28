import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthProvider";
import { useUser } from "../context/UserProvider";

import { ReviewDecision } from "../types";

const ArtifactReviewDecision = ({ artifactId, currentDecision }) => {

    const { getAccessToken } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();

    const [decision, setDecision] = useState(currentDecision || ReviewDecision.PENDING);
    const [comments, setComments] = useState("");
    const [error, setError] = useState({
        comments: "",
        decision: "",
    });

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        try {
            const token = await getAccessToken();
            const response = await axios.post(`http://localhost:8000/api/review-artifact/${artifactId}`, {
                comments,
                decision,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            toast.success(`${response.data}`);
            navigate("/artifact-review-requests");
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error(`Error submitting review: ${error.response ? error.response.data : error.message}`);
        }
    };

    if (!user || (user.role !== "KNOWLEDGE_CHAMPION" && user.role !== "ADMIN")) {
        navigate("/");
        return null;
    }
    
    return (
        <div className="container mx-auto p-4">
            <form className="w-full max-w-xl flex flex-col gap-2" method="post">

                <legend className="py-2 text-2xl font-bold border-b border-gray-300">Review Decision</legend>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-comments">Comments</label>
                    <textarea name="comments" id="id-comments" value={comments} onChange={(e) => setComments(e.target.value)} required></textarea>
                    {error.comments && <span className="text-sm text-red-600">{error.comments}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-decision">Decision</label>
                    <select id="id-decision" name="decision" value={decision} onChange={(e) => setDecision(e.target.value)} required>
                        <option value="">Select a decision</option>
                        {Object.values(ReviewDecision).map((decision) => (
                            <option className="bg-transparent" key={decision} value={decision}>{decision}</option>
                        ))}
                    </select>
                    {error.decision && <span className="text-sm text-red-600">{error.decision}</span>}
                </div>

                <button onClick={handleSubmitReview} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 cursor-pointer">
                    Submit Review
                </button>
            
            </form>
        </div>
    );
};

export default ArtifactReviewDecision;
