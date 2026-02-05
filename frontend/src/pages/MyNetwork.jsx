import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getConnections, getRequests, acceptRequest, withdrawRequest, sendConnectionRequest } from '../features/connections/connectionSlice';
import connectionService from '../features/connections/connectionService';
import { accessChat } from '../features/chat/chatSlice';
import Spinner from '../components/Spinner';
import ConnectionCard from '../components/ConnectionCard';
import { toast } from 'react-toastify';
import { useState } from 'react';

const MyNetwork = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { requests, connections, isLoading } = useSelector((state) => state.connection);
    const { user } = useSelector((state) => state.auth);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        dispatch(getRequests());
        dispatch(getConnections());

        // Fetch suggestions
        if (user && user.token) {
            connectionService.getSuggestions(user.token)
                .then(data => {
                    // Filter out existing connections and self
                    // This is a basic client-side filter. Ideally backend should do this.
                    // Also filter out pending requests if possible, but we might not have that list fully sync'd here easily without checking `requests` state which contains RECEIVED requests, but not SENT ones.
                    // For now, just show all users except self.
                    setSuggestions(data);
                })
                .catch(err => console.error(err));
        }
    }, [dispatch, user]);

    const handleConnect = (id) => {
        dispatch(sendConnectionRequest(id))
            .unwrap()
            .then(() => {
                toast.success('Connection request sent!');
                // Update local state to show "Pending"
                setSuggestions(suggestions.map(u =>
                    u._id === id ? { ...u, connectionStatus: 'pending' } : u
                ));
            })
            .catch((err) => toast.error(err));
    };

    const handleAccept = (id) => {
        dispatch(acceptRequest(id));
    };

    const handleIgnore = (id) => {
        dispatch(withdrawRequest(id));
    };

    const handleMessage = async (id) => {
        await dispatch(accessChat(id));
        navigate('/messaging');
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="space-y-6">
            {/* Invitations */}
            {requests.length > 0 && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-900">Invitations</h2>
                        <span className="text-gray-500 text-sm">See all {requests.length}</span>
                    </div>
                    <div className="p-4 space-y-4">
                        {requests.map((req) => (
                            <div key={req._id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center space-x-3">
                                    <img
                                        className="h-16 w-16 rounded-full object-cover"
                                        src={req.sender.profilePicture || 'https://via.placeholder.com/60'}
                                        alt=""
                                    />
                                    <div>
                                        <div className="font-semibold">{req.sender.name}</div>
                                        <div className="text-sm text-gray-500">{req.sender.headline}</div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleIgnore(req._id)} className="text-gray-600 font-medium px-4 py-1.5 rounded-full hover:bg-gray-100">Ignore</button>
                                    <button onClick={() => handleAccept(req._id)} className="text-blue-600 font-medium px-4 py-1.5 rounded-full border border-blue-600 hover:bg-blue-50">Accept</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* My Connections */}
            {connections && connections.length > 0 && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-900">My Connections</h2>
                        <span className="text-gray-500 text-sm">{connections.length} Connections</span>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {connections.map((user) => (
                            <ConnectionCard
                                key={user._id}
                                user={user}
                                isConnection={true}
                                onMessage={() => handleMessage(user._id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Suggestions */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-900">People you may know</h2>
                    <span className="text-gray-500 text-sm">See all</span>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestions.map((user) => (
                            <ConnectionCard
                                key={user._id}
                                user={user}
                                onConnect={handleConnect}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyNetwork;
