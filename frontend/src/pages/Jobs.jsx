import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getJobs, createJob, applyJob } from '../features/jobs/jobSlice';

const Jobs = () => {
    const dispatch = useDispatch();
    const { jobs, isLoading } = useSelector((state) => state.job);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        description: ''
    });

    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        dispatch(getJobs());
    }, [dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(createJob(formData));
        setShowForm(false);
        setFormData({
            title: '',
            company: '',
            location: '',
            type: 'Full-time',
            description: ''
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow p-4 sticky top-20">
                    <h3 className="font-bold text-lg mb-4">Job Seeker</h3>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition"
                    >
                        {showForm ? 'Cancel Post' : 'Post a Job'}
                    </button>
                </div>
            </div>

            <div className="md:col-span-3 space-y-4">
                {showForm && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Post a New Job</h2>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                <input type="text" name="title" value={formData.title} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company</label>
                                    <input type="text" name="company" value={formData.company} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select name="type" value={formData.type} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Freelance</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea name="description" value={formData.description} onChange={onChange} required rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"></textarea>
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Post Job</button>
                        </form>
                    </div>
                )}

                <h2 className="text-xl font-bold mb-2">Recent Job Openings</h2>
                {isLoading ? <p>Loading jobs...</p> : (
                    jobs.map((job) => (
                        <div key={job._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-blue-600 border-b border-transparent hover:border-blue-600 cursor-pointer inline-block">{job.title}</h3>
                                    <p className="text-gray-900 font-medium">{job.company}</p>
                                    <p className="text-gray-500 text-sm">{job.location} ({job.type})</p>
                                    <p className="text-gray-400 text-xs mt-1">Posted by {job.postedBy?.name} on {new Date(job.createdAt).toLocaleDateString()}</p>
                                </div>
                                {job.applicants && job.applicants.includes(user._id) ? (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Applied</span>
                                ) : (
                                    <button
                                        onClick={() => dispatch(applyJob(job._id))}
                                        className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700"
                                    >
                                        Apply Now
                                    </button>
                                )}
                            </div>
                            <p className="mt-4 text-gray-600 text-sm line-clamp-3">{job.description}</p>
                        </div>
                    ))
                )}
                {jobs.length === 0 && !isLoading && <p>No jobs found.</p>}
            </div>
        </div>
    );
};

export default Jobs;
