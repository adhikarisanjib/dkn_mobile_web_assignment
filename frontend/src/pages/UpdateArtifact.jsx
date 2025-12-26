import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";

import { useAuth } from "../context/AuthProvider";


const UpdateArtifact = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [summary, setSummary] = useState("");
    const [fileUrl, setFileUrl] = useState(null);
    const [newFile, setNewFile] = useState(null);

    const navigate = useNavigate();
    const { getAccessToken } = useAuth();

    let { id } = useParams();

    useEffect(() => {

        const fetchArtifact = async () => {
            try {
                const token = await getAccessToken();
                const response = await axios.get(`http://localhost:8000/api/artifacts/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const artifact = response.data;
                console.log("Fetched artifact:", artifact);
                if (artifact) {
                    setTitle(artifact.title);
                    setContent(artifact.content);
                    setSummary(artifact.summary);
                    setFileUrl(artifact.file_url);
                } else {
                    toast.error("Artifact not found.");
                    navigate("/");
                }
            } catch (error) {
                toast.error("Failed to fetch artifact details. Please try again.");
            }
        };

        fetchArtifact();
    }, []);

    const handleCreateArtifact = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("summary", summary);
        if (newFile) {
            formData.append("file", newFile);
        }

        try {
            const token = await getAccessToken();
            await axios.put(`http://localhost:8000/api/artifacts/${id.replaceAll("-", "")}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });
            toast.success("Artifact updated successfully!");
            navigate("/");

        } catch (error) {
            toast.error("Failed to update artifact. Please try again.");
        }
    };

    return (
        <div className="p-8 flex flex-1 flex-col items-center">

            <form className="w-full max-w-xl flex flex-col gap-2" method="post">

                <legend className="py-2 text-2xl font-bold border-b border-gray-300">Update Artifact</legend>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-title">Title</label>
                    <input type="text" id="id-title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-content">Content</label>
                    <textarea id="id-content" name="content" value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-summary">Summary</label>
                    <input type="text" id="id-summary" name="summary" value={summary} onChange={(e) => setSummary(e.target.value)} required />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-file">Attached File</label>
                    {fileUrl ? (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline mb-2"
                        >
                            Current File: {fileUrl.split('/').pop()}
                        </a>
                    ) : (
                        <p className="text-gray-600 mb-2">No file currently attached.</p>
                    )}
                    <input type="file" id="id-file" name="file" onChange={(e) => setNewFile(e.target.files[0])} />
                </div>

                <button onClick={handleCreateArtifact} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 cursor-pointer">
                    Update Artifact
                </button>

            </form>

        </div>
    );
};
    
export default UpdateArtifact;