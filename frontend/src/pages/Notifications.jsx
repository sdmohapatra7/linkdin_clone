import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getNotifications, reset } from '../features/notifications/notificationSlice';
import Spinner from '../components/Spinner';

const Notifications = () => {
    const dispatch = useDispatch();
    const { notifications, isLoading } = useSelector((state) => state.notification);

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch]);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="space-y-4">
                    {notifications && notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification._id} className="flex items-start space-x-3 p-3 border-b border-gray-100 hover:bg-gray-50">
                                <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={notification.sender.profilePicture || 'https://via.placeholder.com/40'}
                                    alt=""
                                />
                                <div>
                                    <p className="text-sm">
                                        <span className="font-bold">{notification.sender.name}</span>
                                        {' '}
                                        {notification.type === 'like' && 'liked your post'}
                                        {notification.type === 'comment' && 'commented on your post'}
                                        {notification.type === 'connection' && 'sent you a connection request'}
                                    </p>
                                    {notification.post && (
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{notification.post.text}</p>
                                    )}
                                    <span className="text-xs text-gray-400 mt-1 block">{new Date(notification.createdAt).toLocaleDateString()}</span>
                                </div>
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
