import { useEffect, useState } from "react";
import axios from "axios";

import ArtifactCard from "../components/ArtifactCard";
import { useAuth } from "../context/AuthProvider";

const PersonalArtifacts = () => {

    const [artifacts, setArtifacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { getAccessToken } = useAuth();

    useEffect(() => {
        const fetchArtifacts = async () => {
            try {
                const token = await getAccessToken();
                const response = await axios.get("http://localhost:8000/api/artifacts/my-artifacts", {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                setArtifacts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching artifacts:", error);
                setLoading(false);
            }
        };

        fetchArtifacts();
    }, []);

    return (

        <div className="p-8 flex flex-1 flex-col items-center">

            <h1 className="text-3xl font-bold mb-6">My Artifacts</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="w-full max-w-4xl flex justify-center flex-wrap gap-4">
                    {artifacts.length > 0 ? artifacts.map((artifact) => (
                        <ArtifactCard
                            key={artifact.id}
                            artifact={artifact}
                        />
                    )) : <p className="text-center col-span-full">No artifacts found.</p>}
                </div>
            )}

        </div>

    );
};

export default PersonalArtifacts;