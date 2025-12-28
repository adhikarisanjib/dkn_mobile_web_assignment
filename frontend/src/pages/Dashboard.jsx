import { useEffect, useState } from "react";
import axios from "axios";

import { useAuth } from "../context/AuthProvider";

const Dashboard = () => {

    const { getAccessToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchDashboardDetails = async () => {
            try {
                const token = await getAccessToken();
                const response = await axios.get("http://localhost:8000/api/dashboard", {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                setDashboardData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setLoading(false);
            }
        };

        fetchDashboardDetails();
    }, []);

    return (

        <div className="p-8 flex flex-1 flex-col items-center">

            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {loading ? (
                <p>Loading...</p>
            ) : dashboardData ? (
                <div className="w-full max-w-4xl flex flex-col gap-6">
                    
                    <div className="border border-gray-300 rounded p-6 shadow-md from-teal-50 to-white">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                                    {dashboardData.user.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">{dashboardData.user.email}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border border-gray-300 bg-teal-100 text-teal-800`}>
                                {dashboardData.user.role}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Region</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{dashboardData.user.region}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Trusted Contributor</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    {dashboardData.user.is_trusted_contributor ? (
                                        <span className="text-green-600 dark:text-green-400">Yes</span>
                                    ) : (
                                        <span className="text-gray-600 dark:text-gray-400">No</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Member Since</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    {new Date(dashboardData.user.created_on).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Artifacts</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{dashboardData.user.artifacts.length}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">My Artifacts</h2>
                        
                        {dashboardData.user.artifacts.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {dashboardData.user.artifacts.map((artifact) => (
                                    <div 
                                        key={artifact.id} 
                                        className="border border-gray-300 rounded p-5 shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
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
                                ))}
                            </div>
                        ) : (
                            <div className="border border-gray-300 rounded p-8 text-center ">
                                <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't created any artifacts yet.</p>
                                <button className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 cursor-pointer">
                                    Create Your First Artifact
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            ) : (
                <p className="text-center text-gray-600 dark:text-gray-400">No data available.</p>
            )}

        </div>

    );
};

export default Dashboard;