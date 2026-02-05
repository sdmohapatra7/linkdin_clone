import { useState } from 'react';

const Settings = () => {
    const [notifications, setNotifications] = useState(true);
    const [privacy, setPrivacy] = useState('public');

    return (
        <div className="container mx-auto mt-8 p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <div className="bg-white shadow rounded-lg p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Account Preferences</h2>
                    <div className="flex items-center justify-between py-2 border-b">
                        <div>
                            <p className="font-medium text-gray-800">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive emails about new messages</p>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${notifications ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>

                    <div className="py-4 border-b">
                        <p className="font-medium text-gray-800 mb-2">Profile Privacy</p>
                        <select
                            value={privacy}
                            onChange={(e) => setPrivacy(e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                        >
                            <option value="public">Public (Everyone can see your profile)</option>
                            <option value="connections">Connections Only</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
                    <button className="border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50 transition">
                        Delete Account
                    </button>
                </div>

                <div className="pt-4">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
