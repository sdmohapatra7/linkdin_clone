import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#f3f2ef]">
            <Navbar />
            <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Sidebar - Profile Summary */}
                    <div className="hidden md:block md:col-span-3">
                        {/* Placeholder for Left Sidebar */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-bold">Profile Summary</h3>
                            <p className="text-sm text-gray-500">Welcome back!</p>
                        </div>
                    </div>

                    {/* Middle - Feed */}
                    <div className="col-span-1 md:col-span-6">
                        {children}
                    </div>

                    {/* Right Sidebar - Recommendations */}
                    <div className="hidden md:block md:col-span-3">
                        {/* Placeholder for Right Sidebar */}
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-bold">Add to your feed</h3>
                            <p className="text-sm text-gray-500">Follow these topics</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
