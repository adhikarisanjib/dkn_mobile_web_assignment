import { Link } from "react-router-dom";


const ArtifactDetail = ({ id, title, content, summary, fileUrl, status }) => {

    return (
        <div className="p-8 flex flex-1 flex-col items-center">

            <div className="w-full max-w-xl flex flex-col gap-2">

                <legend className="py-2 text-2xl font-bold border-b border-gray-300">Artifact Detail</legend>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-status" className="font-semibold">Status</label>
                    <div id="id-status" name="status" className="p-2 border border-gray-300 rounded">{status}</div>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-title" className="font-semibold">Title</label>
                    <div id="id-title" name="title" className="p-2 border border-gray-300 rounded">{title}</div>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-content" className="font-semibold">Content</label>
                    <div id="id-content" name="content" className="p-2 border border-gray-300 rounded whitespace-pre-wrap">{content}</div>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="id-summary" className="font-semibold">Summary</label>
                    <div id="id-summary" name="summary" className="p-2 border border-gray-300 rounded">{summary}</div>
                </div>

                {fileUrl && (
                    <div className="flex flex-col gap-1">
                        <label htmlFor="id-file" className="font-semibold">Attached File</label>
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            View Attached File
                        </a>
                    </div>
                )}

                <div className="border-t border-gray-300 mt-4">
                    <Link
                        to={`/update-artifact/${id}`}
                        className="inline-block mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                    >
                        Update Artifact
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ArtifactDetail;
