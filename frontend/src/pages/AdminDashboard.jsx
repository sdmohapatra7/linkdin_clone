import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRole, getRoles, deleteRole, updateRole, reset } from '../features/roles/roleSlice';
import { getJobs, deleteJob } from '../features/jobs/jobSlice';
import { FaTrash, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';
import CreateJobModal from '../components/CreateJobModal';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('roles');
    const [roleName, setRoleName] = useState('');
    const [roleToEdit, setRoleToEdit] = useState(null);
    const [showJobModal, setShowJobModal] = useState(false);
    const [jobToEdit, setJobToEdit] = useState(null);

    const dispatch = useDispatch();

    const { roles, isError, isSuccess, message } = useSelector((state) => state.role);
    const { jobs } = useSelector((state) => state.job);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        dispatch(getRoles());
        dispatch(getJobs());

        return () => {
            dispatch(reset());
        }
    }, [dispatch, isError, message]);

    const handleAddRole = (e) => {
        e.preventDefault();
        if (roleName.trim()) {
            if (roleToEdit) {
                dispatch(updateRole({ id: roleToEdit._id, roleData: { name: roleName } }))
                    .unwrap()
                    .then(() => {
                        toast.success(`Role updated to ${roleName}`);
                        setRoleToEdit(null);
                        setRoleName('');
                    })
                    .catch((err) => toast.error(err));
            } else {
                dispatch(createRole({ name: roleName }))
                    .unwrap()
                    .then(() => {
                        toast.success('Role created');
                        setRoleName('');
                    })
                    .catch((err) => toast.error(err));
            }
        }
    };


    const handleDeleteJob = (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            dispatch(deleteJob(id));
        }
    };

    const handleDeleteRole = (id) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            dispatch(deleteRole(id));
        }
    };

    const handleEditRole = (role) => {
        setRoleToEdit(role);
        setRoleName(role.name);
    };

    const handleCancelEditRole = () => {
        setRoleToEdit(null);
        setRoleName('');
    };

    const handleEditJob = (job) => {
        setJobToEdit(job);
        setShowJobModal(true);
    };

    const handleCloseModal = () => {
        setShowJobModal(false);
        setJobToEdit(null);
    };

    if (!user || (!user.isAdmin && user?.role?.name !== 'Recruiter')) {
        return <div className="p-10 text-center text-red-500">Access Denied</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow min-h-[500px]">
            {/* Header / Tabs */}
            <div className="border-b px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'roles' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        Manage Roles
                    </button>
                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'jobs' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        Manage Jobs
                    </button>
                </div>
            </div>

            <div className="p-6">
                {/* ROLES TAB */}
                {activeTab === 'roles' && (
                    <div className="max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">{roleToEdit ? 'Edit User Role' : 'Add New User Role'}</h2>
                            {roleToEdit && (
                                <button onClick={handleCancelEditRole} className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
                                    <FaTimes /> Cancel Edit
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleAddRole} className="flex gap-3 mb-8">
                            <input
                                type="text"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                placeholder="Role Name (e.g. Developer)"
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button type="submit" className={`text-white px-6 py-2 rounded-lg font-medium transition ${roleToEdit ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {roleToEdit ? 'Update Role' : 'Add Role'}
                            </button>
                        </form>

                        <h3 className="text-md font-semibold text-gray-600 mb-3">Existing Roles</h3>
                        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {roles.map((role) => (
                                        <tr key={role._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-end gap-3">
                                                {role._id}
                                                <button
                                                    onClick={() => handleEditRole(role)}
                                                    className="text-gray-500 hover:text-blue-600"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRole(role._id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {roles.length === 0 && <tr><td colSpan="2" className="px-6 py-4 text-center text-gray-500">No roles found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* JOBS TAB */}
                {activeTab === 'jobs' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">Job Postings</h2>
                            <button
                                onClick={() => setShowJobModal(true)}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                            >
                                <FaPlus /> Post New Job
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {jobs.map((job) => (
                                <div key={job._id} className="bg-white border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition">
                                    <div>
                                        <h3 className="font-bold text-blue-600 text-lg">{job.title}</h3>
                                        <p className="text-sm text-gray-600">{job.company} • {job.location} ({job.type})</p>
                                        <div className="text-xs text-gray-400 mt-1">Posted by {job.postedBy?.name || 'Unknown'}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleEditJob(job)}
                                            className="text-gray-500 hover:text-blue-600 p-2"
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJob(job._id)}
                                            className="text-gray-500 hover:text-red-600 p-2"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {jobs.length === 0 && <p className="text-center text-gray-500 py-10">No jobs posted yet.</p>}
                        </div>
                    </div>
                )}
            </div>

            {showJobModal && (
                <CreateJobModal
                    onClose={handleCloseModal}
                    jobToEdit={jobToEdit}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
