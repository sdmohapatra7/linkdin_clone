import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useSocket } from '../context/SocketContext';
import { BsBellFill } from 'react-icons/bs';
import { getNotifications, markAsRead, addNotification } from '../features/notifications/notificationSlice';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const { socket } = useSocket();
    const { notifications } = useSelector((state) => state.notification);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

    // Calculate unread count from Redux store which is the source of truth
    const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

    useEffect(() => {
        if (socket) {
            const handleNewNotification = (notification) => {
                dispatch(addNotification(notification));
            };

            socket.on('notification received', handleNewNotification);

            return () => {
                socket.off('notification received', handleNewNotification);
            };
        }
    }, [socket, dispatch]);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const handleNotificationClick = (notification) => {
        // Mark as read
        if (!notification.read) {
            dispatch(markAsRead(notification._id));
        }

        // Navigate
        setShowNotificationDropdown(false);
        if (notification.type === 'message') {
            navigate('/messaging');
        } else if (notification.type === 'connection') {
            navigate('/mynetwork');
        } else {
            // like or comment
            navigate('/');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search?q=${keyword}`);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" className="text-blue-600 w-10 h-10" width="24" height="24" focusable="false">
                                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                                </svg>
                            </Link>
                        </div>

                        <div className="ml-4 flex items-center">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-blue-50 bg-blue-50 rounded-md leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring-blue-300 sm:text-sm text-gray-900 transition duration-150 ease-in-out"
                                />
                            </form>
                        </div>

                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Home
                            </Link>
                            <Link to="/mynetwork" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                My Network
                            </Link>
                            <Link to="/jobs" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Jobs
                            </Link>
                            <Link to="/messaging" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium relative">
                                Messaging
                            </Link>

                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowNotificationDropdown(!showNotificationDropdown);
                                    if (!showNotificationDropdown) {
                                        dispatch(getNotifications());
                                    }
                                }}
                                className="relative p-2 text-gray-500 hover:text-gray-700 mr-2 focus:outline-none"
                            >
                                <BsBellFill className="h-6 w-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotificationDropdown && (
                                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <div className="py-2 px-4 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="font-bold text-gray-700">Notifications</h3>
                                        <Link
                                            to="/notifications"
                                            className="text-xs text-blue-600 hover:underline"
                                            onClick={() => setShowNotificationDropdown(false)}
                                        >
                                            View All
                                        </Link>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications && notifications.length > 0 ? (
                                            notifications.slice(0, 5).map((notification) => (
                                                <div
                                                    key={notification._id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${!notification.read ? 'bg-blue-50' : ''}`}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <img
                                                            className="h-8 w-8 rounded-full object-cover"
                                                            src={notification.sender.profilePicture || 'https://via.placeholder.com/40'}
                                                            alt=""
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-800">
                                                                <span className="font-bold">{notification.sender.name}</span>
                                                                {' '}
                                                                {notification.type === 'like' && 'liked your post'}
                                                                {notification.type === 'comment' && 'commented on your post'}
                                                                {notification.type === 'connection' && 'sent connection request'}
                                                                {notification.type === 'message' && 'sent you a message'}
                                                            </p>
                                                            <span className="text-xs text-gray-400 mt-1 block">{new Date(notification.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm text-center py-4">No notifications</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="ml-3 relative">
                            <div>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        id="user-menu-button"
                                        aria-expanded="false"
                                        aria-haspopup="true"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            className="h-8 w-8 rounded-full object-cover"
                                            src={user?.profilePicture || 'https://via.placeholder.com/40'}
                                            alt=""
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }}
                                        />
                                    </button>

                                    {showDropdown && (
                                        <div
                                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="user-menu-button"
                                            tabIndex="-1"
                                        >
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                tabIndex="-1"
                                                id="user-menu-item-0"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                View Profile
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                tabIndex="-1"
                                                id="user-menu-item-1"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                Settings
                                            </Link>
                                            {(user?.isAdmin || user?.role?.name === 'Recruiter') && (
                                                <Link
                                                    to="/admin"
                                                    className="block px-4 py-2 text-sm text-blue-600 font-semibold hover:bg-gray-100"
                                                    role="menuitem"
                                                    tabIndex="-1"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setShowDropdown(false);
                                                    onLogout();
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                tabIndex="-1"
                                                id="user-menu-item-2"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
