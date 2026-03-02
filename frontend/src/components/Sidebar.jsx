import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
    BsChatDotsFill,
    BsPeopleFill,
    BsShieldLockFill,
    BsPersonBadgeFill,
    BsPersonPlusFill,
    BsBriefcaseFill,
    BsBellFill,
    BsGearFill,
    BsHouseDoorFill
} from 'react-icons/bs';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const { notifications } = useSelector((state) => state.notification) || { notifications: [] };
    const location = useLocation();

    if (!user) return null;

    const role = user.role?.name || (user.isAdmin ? 'Admin' : 'Member');

    // Calculate unread notifications count, safely handling if notifications is undefined
    const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;

    // Choose role icon
    let RoleIcon = BsPersonBadgeFill;
    if (role === 'Admin') RoleIcon = BsShieldLockFill;

    // Helper function for nav item styles
    const getNavStyle = (path) => {
        const isActive = location.pathname.startsWith(path);
        return `p-3 rounded-lg transition-colors relative ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'}`;
    };

    return (
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-4 z-20 hidden sm:flex shadow-sm overflow-y-auto overflow-x-hidden no-scrollbar">
            {/* Role Icon with tooltip */}
            <Link to="/profile" className="relative group flex flex-col items-center mb-6 w-full px-2">
                <div className={getNavStyle('/profile')}>
                    <RoleIcon size={24} />
                </div>
                <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity pointer-events-none">
                    Profile ({role})
                </span>
            </Link>

            {/* Home Icon */}
            <Link to="/" className="relative group flex flex-col items-center w-full px-2">
                <div className={getNavStyle('/') === getNavStyle('/') && location.pathname === '/' ? `p-3 rounded-lg transition-colors relative bg-blue-600 text-white shadow-md` : `p-3 rounded-lg transition-colors relative text-gray-500 hover:bg-gray-100 hover:text-blue-600`}>
                    <BsHouseDoorFill size={24} />
                </div>
                <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity pointer-events-none">
                    Home
                </span>
            </Link>

            {/* My Network Icon */}
            <Link to="/mynetwork" className="relative group flex flex-col items-center w-full px-2">
                <div className={getNavStyle('/mynetwork')}>
                    <BsPersonPlusFill size={24} />
                </div>
                <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity pointer-events-none">
                    My Network
                </span>
            </Link>

            {/* Jobs Icon */}
            <Link to="/jobs" className="relative group flex flex-col items-center w-full px-2">
                <div className={getNavStyle('/jobs')}>
                    <BsBriefcaseFill size={24} />
                </div>
                <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity pointer-events-none">
                    Jobs
                </span>
            </Link>

            {/* Chat Icon */}
            <Link to="/messaging" className="relative group flex flex-col items-center w-full px-2">
                <div className={getNavStyle('/messaging')}>
                    <BsChatDotsFill size={24} />
                </div>
                <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity pointer-events-none">
                    Messaging
                </span>
            </Link>

            {/* Notifications Icon */}
            <Link to="/notifications" className="relative group flex flex-col items-center w-full px-2">
                <div className={getNavStyle('/notifications')}>
                    <BsBellFill size={24} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full border border-white">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity pointer-events-none">
                    Notifications
                </span>
            </Link>

            {/* Groups Icon */}
            <Link to="/groups" className="relative group flex flex-col items-center w-full px-2">
                <div className={getNavStyle('/groups')}>
                    <BsPeopleFill size={24} />
                </div>
                <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity pointer-events-none">
                    Groups
                </span>
            </Link>

            <div className="flex-grow"></div>

            {/* Settings Icon (bottom) */}
            <Link to="/settings" className="relative group flex flex-col items-center w-full px-2 mt-auto pt-4 border-t border-gray-100">
                <div className={getNavStyle('/settings')}>
                    <BsGearFill size={24} />
                </div>
                <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 transition-opacity pointer-events-none bottom-0">
                    Settings
                </span>
            </Link>
        </div>
    );
};

export default Sidebar;
