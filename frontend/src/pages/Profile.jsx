import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser, reset } from '../features/users/userSlice';
import Spinner from '../components/Spinner';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { userProfile, isLoading, isError, message } = useSelector(
        (state) => state.user
    );

    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (isError) {
            console.log(message);
        }

        // Ensure user is logged in
        if (user) {
            // Fetch profile for the logged in user (or route param id if extended)
            dispatch(getUser(user._id));
        }

        return () => {
            dispatch(reset());
        };
    }, [user, isError, message, dispatch]);

    if (isLoading) {
        return <Spinner />;
    }

    if (!userProfile) {
        return <div className="text-center mt-10">Profile not found</div>;
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Cover Image */}
                <div className="h-32 bg-gray-300 relative">
                    {/* Profile Image */}
                    <div className="absolute -bottom-10 left-4">
                        <img
                            className="h-24 w-24 rounded-full border-4 border-white object-cover"
                            src={userProfile.profilePicture || 'https://via.placeholder.com/100'}
                            alt=""
                        />
                    </div>
                </div>
                <div className="pt-12 pb-4 px-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                            <p className="text-gray-600">{userProfile.headline || 'No headline'}</p>
                            <p className="text-xs text-gray-500 mt-1">Location • <span className="text-blue-600 font-bold">{userProfile.email}</span></p>
                        </div>
                        <button
                            onClick={() => {
                                console.log('Edit profile clicked!');
                                setShowEditModal(true);
                            }}
                            className="ml-4 px-4 py-1 text-blue-600 border border-blue-600 rounded-full font-bold hover:bg-blue-50"
                        >
                            Edit profile
                        </button>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-lg font-bold">About</h2>
                        <p className="text-sm text-gray-800 mt-1">
                            {userProfile.about || 'No about info'}
                        </p>
                    </div>

                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <h2 className="text-lg font-bold">Skills</h2>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {userProfile.skills && userProfile.skills.length > 0 ? (
                                userProfile.skills.map((skill, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">No skills listed</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <EditProfileModal show={showEditModal} onClose={() => setShowEditModal(false)} />
        </div>
    );
};

export default Profile;
