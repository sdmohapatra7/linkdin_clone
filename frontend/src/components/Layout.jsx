import Navbar from './Navbar';
import ProfileSummary from './ProfileSummary';
import AddToFeed from './AddToFeed';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#f3f2ef]">
            <Navbar />
            <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Sidebar - Profile Summary */}
                    <div className="hidden md:block md:col-span-3">
                        <ProfileSummary />
                    </div>

                    {/* Middle - Feed */}
                    <div className="col-span-1 md:col-span-6">
                        {children}
                    </div>

                    {/* Right Sidebar - Recommendations */}
                    <div className="hidden md:block md:col-span-3">
                        <AddToFeed />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
