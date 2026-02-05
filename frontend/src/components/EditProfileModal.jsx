import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../features/users/userSlice';
import { FaTimes, FaCamera } from 'react-icons/fa';

const EditProfileModal = ({ show, onClose }) => {
    const dispatch = useDispatch();
    const { userProfile, isLoading } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        headline: '',
        about: '',
        skills: '',
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [bannerPhoto, setBannerPhoto] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    useEffect(() => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || '',
                headline: userProfile.headline || '',
                about: userProfile.about || '',
                skills: userProfile.skills ? userProfile.skills.join(', ') : '',
            });
            setPreview(userProfile.profilePicture || 'https://via.placeholder.com/150');
            setBannerPreview(userProfile.bannerPhoto || 'https://via.placeholder.com/600x200');
        }
    }, [userProfile]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerPhoto(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('headline', formData.headline);
        data.append('about', formData.about);
        data.append('skills', formData.skills);

        if (profilePicture) {
            data.append('profilePicture', profilePicture);
        }

        if (bannerPhoto) {
            data.append('bannerPhoto', bannerPhoto);
        }

        // Pass token implicitly via slice/service or if needed in args
        // The slice usually gets token from local state or arg
        dispatch(updateUserProfile({ userData: data, userId: user._id }));
        onClose();
    };

    if (!show) return null;

    return createPortal(
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    {/* Banner Photo Upload */}
                    <div className="relative mb-6">
                        <img
                            src={bannerPreview}
                            alt="Banner"
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <label className="absolute bottom-2 right-2 bg-white/80 p-2 rounded-full cursor-pointer hover:bg-white text-gray-700 transition shadow-sm">
                            <FaCamera size={16} />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleBannerChange}
                            />
                        </label>
                    </div>

                    {/* Profile Picture Upload */}
                    <div className="flex justify-center mb-6 relative">
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Profile"
                                className="h-32 w-32 rounded-full object-cover border-4 border-blue-50"
                            />
                            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 text-white transition">
                                <FaCamera size={16} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                        <input
                            type="text"
                            name="headline"
                            value={formData.headline}
                            onChange={handleChange}
                            placeholder="Ex: Software Engineer at Company X"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                        <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Comma separated)</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white rounded-full px-6 py-2 font-semibold hover:bg-blue-700 transition"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default EditProfileModal;
