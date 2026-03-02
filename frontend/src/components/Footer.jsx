import { Link, useLocation } from 'react-router-dom';
import { FaLinkedinIn, FaTwitter, FaGithub, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password' || location.pathname.startsWith('/reset-password');

    if (isAuthPage) {
        return null;
    }

    return (
        <footer className={`bg-white border-t border-gray-200 pt-12 pb-8 mt-auto sm:ml-16`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <img src="/favicon.png" alt="JobsHub Logo" className="h-8 w-8" />
                            <span className="text-xl font-bold text-blue-600 tracking-tight">JobsHub</span>
                        </Link>
                        <p className="text-sm text-gray-500 mb-6">
                            Elevating careers and connecting top talent with industry-leading opportunities worldwide.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <FaLinkedinIn className="h-5 w-5" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <span className="sr-only">Twitter</span>
                                <FaTwitter className="h-5 w-5" />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                                <span className="sr-only">GitHub</span>
                                <FaGithub className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Platform</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/jobs" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Browse Jobs</Link>
                            </li>
                            <li>
                                <Link to="/network" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">My Network</Link>
                            </li>
                            <li>
                                <Link to="/groups" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Communities</Link>
                            </li>
                            <li>
                                <Link to="/pricing" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">For Recruiters</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Help Center</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Career Advice</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Interview Prep</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Salary Insights</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Cookie Policy</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Accessibility</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-base text-gray-400">
                        &copy; {new Date().getFullYear()} JobsHub, Inc. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="text-sm text-gray-500">Empowering Professionals Worldwide</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
