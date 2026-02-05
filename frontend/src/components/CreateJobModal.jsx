import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createJob, updateJob } from '../features/jobs/jobSlice';
import { FaTimes } from 'react-icons/fa';

const CreateJobModal = ({ onClose, jobToEdit }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        description: '',
        skills: '',
        applyLink: '',
    });

    useEffect(() => {
        if (jobToEdit) {
            setFormData({
                title: jobToEdit.title || '',
                company: jobToEdit.company || '',
                location: jobToEdit.location || '',
                type: jobToEdit.type || 'Full-time',
                description: jobToEdit.description || '',
                skills: jobToEdit.skills ? (Array.isArray(jobToEdit.skills) ? jobToEdit.skills.join(', ') : jobToEdit.skills) : '',
                applyLink: jobToEdit.applyLink || '',
            });
        }
    }, [jobToEdit]);

    const { title, company, location, type, description, skills, applyLink } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (jobToEdit) {
            dispatch(updateJob({ id: jobToEdit._id, jobData: formData }));
        } else {
            dispatch(createJob(formData));
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={20} />
                </button>
                <h2 className="text-2xl font-bold mb-4">{jobToEdit ? 'Edit Job' : 'Post a Job'}</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Job Title</label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={onChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Company</label>
                        <input
                            type="text"
                            name="company"
                            value={company}
                            onChange={onChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex gap-4 mb-4">
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={location}
                                onChange={onChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                            <select
                                name="type"
                                value={type}
                                onChange={onChange}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Internship</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            name="description"
                            value={description}
                            onChange={onChange}
                            rows="4"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Skills (comma separated)</label>
                        <input
                            type="text"
                            name="skills"
                            value={skills}
                            onChange={onChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {jobToEdit ? 'Update Job' : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJobModal;
