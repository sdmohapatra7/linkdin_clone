import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getJobs, applyJob, deleteJob } from '../features/jobs/jobSlice';
import CreateJobModal from '../components/CreateJobModal';
import { FaBriefcase, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';

const Jobs = () => {
    const dispatch = useDispatch();
    const { jobs, isLoading } = useSelector((state) => state.job);
    const { user } = useSelector((state) => state.auth);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        dispatch(getJobs());
    }, [dispatch]);

    const handleApply = (id) => {
        dispatch(applyJob(id));
        alert('Applied successfully!');
    };

    const isRecruiter = user?.role?.name === 'Recruiter';
    const canPostJob = user?.isAdmin || isRecruiter;

    return (
        <div className="space-y-6">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Jobs for you</h1>
                {canPostJob && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700"
                    >
                        Post a Job
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {jobs.map((job) => (
                    <div key={job._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <FaBuilding className="text-gray-500 text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold text-blue-600 text-lg hover:underline cursor-pointer">
                                    {job.title}
                                </h3>
                                <p className="text-gray-900 text-sm">{job.company}</p>
                                <div className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                                    <FaMapMarkerAlt size={12} /> {job.location} ({job.type})
                                </div>
                                <div className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                                    <img
                                        src={job.postedBy?.profilePicture || 'https://via.placeholder.com/20'}
                                        className="w-5 h-5 rounded-full"
                                    />
                                    <span>Posted by {job.postedBy?.name}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={() => handleApply(job._id)}
                                className="border border-blue-600 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-50"
                            >
                                Easy Apply
                            </button>
                            {user && job.postedBy && user._id === job.postedBy._id && (
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this job?')) {
                                            dispatch(deleteJob(job._id));
                                        }
                                    }}
                                    className="text-red-500 text-xs hover:underline text-center"
                                >
                                    Delete Job
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && <CreateJobModal onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default Jobs;
