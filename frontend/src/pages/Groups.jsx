import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getGroups, createGroup, reset } from '../features/groups/groupSlice';
import Spinner from '../components/Spinner';

const Groups = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { groups, isLoading, isError, message } = useSelector(
        (state) => state.group
    );

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        coverImage: ''
    });

    const { name, description, coverImage } = formData;

    useEffect(() => {
        dispatch(getGroups());
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(createGroup({ name, description, coverImage }));
        setCreateModalOpen(false);
        setFormData({ name: '', description: '', coverImage: '' });
    };

    if (isLoading) {
        return <Spinner />;
    }

    const myGroups = groups.filter((g) => g.members.includes(user?._id) || g.admin?._id === user?._id);
    const discoverGroups = groups.filter((g) => !g.members.includes(user?._id) && g.admin?._id !== user?._id);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Groups</h1>
                    <p className="text-gray-500">Connect with communities that share your interests.</p>
                </div>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Create Group
                </button>
            </div>

            {/* My Groups */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">My Groups</h2>
                {myGroups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myGroups.map((group) => (
                            <Link to={`/groups/${group._id}`} key={group._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition block">
                                <img src={group.coverImage} alt={group.name} className="w-full h-24 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-800 truncate">{group.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2 truncate">{group.description}</p>
                                    <span className="text-xs text-blue-600 font-semibold">{group.members.length} members</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">You haven't joined any groups yet.</p>
                )}
            </div>

            {/* Discover Groups */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Discover Groups</h2>
                {discoverGroups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {discoverGroups.map((group) => (
                            <Link to={`/groups/${group._id}`} key={group._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition block">
                                <img src={group.coverImage} alt={group.name} className="w-full h-24 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-800 truncate">{group.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2 truncate">{group.description}</p>
                                    <span className="text-xs text-blue-600 font-semibold">{group.members.length} members</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No new groups to discover at the moment.</p>
                )}
            </div>

            {/* Create Group Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Create a New Group</h2>
                        <form onSubmit={onSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Group Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    placeholder="Enter group name"
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={description}
                                    onChange={onChange}
                                    placeholder="What is this group about?"
                                    required
                                    rows="3"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Cover Image URL (Optional)</label>
                                <input
                                    type="text"
                                    name="coverImage"
                                    value={coverImage}
                                    onChange={onChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setCreateModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    Create Group
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Groups;
