import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";

import { useAuth } from "../context/AuthProvider";


const CreateArtifact = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [summary, setSummary] = useState("");
    const [file, setFile] = useState(null);

    const navigate = useNavigate();
    const { getAccessToken } = useAuth();

    const handleCreateArtifact = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("summary", summary);
        if (file) {
            formData.append("file", file);
        }

        try {
            const token = await getAccessToken();
            await axios.post("http://localhost:8000/api/create-artifact", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });
            toast.success("Artifact created successfully!");
            navigate("/");

        } catch (error) {
            toast.error("Failed to create artifact. Please try again.");
        }
    };

    return (
        <div className="p-8 flex flex-1 flex-col items-center">

            <form className="w-full max-w-xl flex flex-col gap-2" method="post">

                <legend className="py-2 text-2xl font-bold border-b border-gray-300">Create Artifact</legend>

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
                    <label htmlFor="id-file">Attachment</label>
                    <input type="file" id="id-file" name="file" onChange={(e) => setFile(e.target.files[0])} />
                </div>

                <button onClick={handleCreateArtifact} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 cursor-pointer">
                    Create Artifact
                </button>

            </form>

        </div>
    );
};

export default CreateArtifact;