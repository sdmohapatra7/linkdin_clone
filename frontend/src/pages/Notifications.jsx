import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getNotifications, reset, markAsRead, deleteNotification, deleteAllNotifications } from '../features/notifications/notificationSlice';
import Spinner from '../components/Spinner';

const Notifications = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications, isLoading } = useSelector((state) => state.notification);

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            dispatch(markAsRead(notification._id));
        }

        if (notification.type === 'message') {
            navigate('/messaging');
        } else if (notification.type === 'connection') {
            navigate('/mynetwork');
        } else {
            navigate('/');
        }
    };

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch]);

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all notifications?')) {
            dispatch(deleteAllNotifications());
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Notifications</h2>
                {notifications && notifications.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-sm text-red-600 hover:text-red-800 font-semibold"
                    >
                        Clear All
                    </button>
                )}
            </div>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="space-y-4">
                    {notifications && notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`flex items-start space-x-3 p-3 border-b border-gray-100 rounded-lg transition cursor-pointer relative group ${notification.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'}`}
                            >
                                <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={notification.sender.profilePicture || 'https://via.placeholder.com/40'}
                                    alt=""
                                />
                                <div className="flex-1 pr-6">
                                    <p className="text-sm">
                                        <span className="font-bold">{notification.sender.name}</span>
                                        {' '}
                                        {notification.type === 'like' && 'liked your post'}
                                        {notification.type === 'comment' && 'commented on your post'}
                                        {notification.type === 'connection' && 'sent you a connection request'}
                                        {notification.type === 'message' && 'sent you a message'}
                                    </p>
                                    {notification.post && (
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{notification.post.text}</p>
                                    )}
                                    <span className="text-xs text-gray-400 mt-1 block">{new Date(notification.createdAt).toLocaleDateString()}</span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(deleteNotification(notification._id));
                                    }}
                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    title="Remove notification"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {!notification.read && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(markAsRead(notification._id));
                                        }}
                                        className="text-xs text-blue-600 font-semibold hover:text-blue-800 absolute bottom-3 right-3"
                                        title="Mark as read"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No notifications yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;
