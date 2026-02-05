import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProfileSummary = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { connections } = useSelector((state) => state.connection);

    if (!user) return null;

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Banner */}
            <div className="h-16 bg-gray-300 relative">
                <img
                    className="w-full h-full object-cover"
                    src={user.bannerPhoto || 'https://via.placeholder.com/600x200'}
                    alt="Current User Banner"
                />
            </div>

            {/* Profile Info */}
            <div className="text-center px-4 pb-4 border-b border-gray-200">
                <div className="relative -mt-8 mb-2">
                    <img
                        className="h-16 w-16 rounded-full border-2 border-white object-cover mx-auto bg-white cursor-pointer"
                        src={user.profilePicture || 'https://via.placeholder.com/60'}
                        alt={user.name}
                        onClick={() => navigate('/profile')}
                    />
                </div>
                <h3
                    className="font-bold text-gray-900 hover:underline cursor-pointer"
                    onClick={() => navigate('/profile')}
                >
                    {user.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 truncate">{user.headline || 'No headline'}</p>
            </div>

            {/* Stats */}
            <div className="py-4 px-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/mynetwork')}>
                <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500">Connections</span>
                    <span className="text-xs font-bold text-blue-600">
                        {connections ? connections.length : 0}
                    </span>
                </div>
                <div className="text-xs font-bold text-gray-900 text-left mt-0.5">Grow your network</div>
            </div>

            {/* Premium / My Items (Mock) */}
            <div className="p-3 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer border-b border-gray-200 text-left flex items-center">
                <div className="w-3 h-3 bg-yellow-600 mr-2 rounded-sm"></div>
                Try Premium for free
            </div>
            <div className="p-3 text-xs font-bold text-gray-900 hover:bg-gray-50 cursor-pointer text-left">
                My items
            </div>
        </div>
    );
};

export default ProfileSummary;
