import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getJobs, applyJob, deleteJob, getJobApplicants } from '../features/jobs/jobSlice';
import CreateJobModal from '../components/CreateJobModal';
import { FaBriefcase, FaMapMarkerAlt, FaBuilding, FaTimes, FaEnvelope } from 'react-icons/fa';

const Jobs = () => {
    const dispatch = useDispatch();
    const { jobs, applicants, isLoading } = useSelector((state) => state.job);
    const { user } = useSelector((state) => state.auth);
    const [showModal, setShowModal] = useState(false);
    const [viewingApplicantsFor, setViewingApplicantsFor] = useState(null);

    useEffect(() => {
        dispatch(getJobs());
    }, [dispatch]);

    const handleApply = (id) => {
        dispatch(applyJob(id));
        alert('Applied successfully!');
    };

    const handleViewApplicants = (id) => {
        setViewingApplicantsFor(id);
        dispatch(getJobApplicants(id));
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
                        <div className="flex flex-col space-y-2 text-right">
                            {/* Job Seekers see Apply */}
                            {!isRecruiter && (
                                <button
                                    onClick={() => handleApply(job._id)}
                                    className="border border-blue-600 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-50"
                                >
                                    Easy Apply
                                </button>
                            )}

                            {/* Recruiters see View Applicants on their own jobs */}
                            {user && job.postedBy && user._id === job.postedBy._id && isRecruiter && (
                                <button
                                    onClick={() => handleViewApplicants(job._id)}
                                    className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-700 shadow-sm"
                                >
                                    View Applicants
                                </button>
                            )}

                            {user && job.postedBy && user._id === job.postedBy._id && (
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this job?')) {
                                            dispatch(deleteJob(job._id));
                                        }
                                    }}
                                    className="text-red-500 text-xs hover:underline text-center mt-2"
                                >
                                    Delete Job
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Applicant Viewer Modal */}
            {viewingApplicantsFor && (
                <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setViewingApplicantsFor(null)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start w-full">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                                                Job Applicants
                                            </h3>
                                            <button onClick={() => setViewingApplicantsFor(null)} className="text-gray-400 hover:text-gray-500">
                                                <FaTimes size={20} />
                                            </button>
                                        </div>
                                        <div className="mt-4 max-h-96 overflow-y-auto pr-2 space-y-4">
                                            {isLoading ? (
                                                <div className="text-center py-4 text-gray-500">Loading applicants...</div>
                                            ) : applicants && applicants.length > 0 ? (
                                                applicants.map(applicant => (
                                                    <div key={applicant._id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                                        <div className="flex items-center space-x-3">
                                                            <img
                                                                src={applicant.profilePicture || 'https://via.placeholder.com/40'}
                                                                alt={applicant.name}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }}
                                                            />
                                                            <div>
                                                                <h4 className="font-bold text-gray-900">{applicant.name}</h4>
                                                                <p className="text-xs text-gray-500">{applicant.headline || 'No headline provided'}</p>
                                                            </div>
                                                        </div>
                                                        <a href={`mailto:${applicant.email}`} className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition">
                                                            <FaEnvelope size={18} />
                                                        </a>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                                    No one has applied to this job yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => setViewingApplicantsFor(null)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && <CreateJobModal onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default Jobs;
