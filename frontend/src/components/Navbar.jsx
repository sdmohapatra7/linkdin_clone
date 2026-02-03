import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    // const { user } = useSelector((state) => state.auth);
    // const dispatch = useDispatch();
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');

    const onLogout = () => {
        // dispatch(logout());
        // dispatch(reset());
        navigate('/login');
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
                            <Link to="/messaging" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Messaging
                            </Link>
                            <Link to="/notifications" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Notifications
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="ml-3 relative">
                            <div>
                                <Link to="/profile" className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                    <span className="sr-only">Open user menu</span>
                                    <img className="h-8 w-8 rounded-full" src="https://via.placeholder.com/40" alt="" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
