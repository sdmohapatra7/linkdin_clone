const ConnectionCard = ({ user, type, onAccept, onIgnore, isConnection, onMessage, onConnect }) => {
    return (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center space-y-2 border border-gray-200">
            <img
                src={(user.profilePicture && (user.profilePicture.startsWith('http') || user.profilePicture.startsWith('/'))) ? user.profilePicture : 'https://via.placeholder.com/100'}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
            />
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-gray-500 text-sm h-10 overflow-hidden">{user.headline || 'LinkedIn User'}</p>

            <div className="w-full pt-2">
                {isConnection ? (
                    <button className="text-gray-600 font-medium px-4 py-1 rounded-full border border-gray-400 hover:bg-gray-100 w-full">
                        Message
                    </button>
                ) : type === 'request' ? (
                    <div className="flex space-x-2 justify-center">
                        <button
                            onClick={() => onIgnore(user._id)}
                            className="text-gray-600 font-medium px-4 py-1 rounded-full border border-gray-400 hover:bg-gray-100"
                        >
                            Ignore
                        </button>
                        <button
                            onClick={() => onAccept(user._id)}
                            className="text-blue-600 font-medium px-4 py-1 rounded-full border border-blue-600 hover:bg-blue-50"
                        >
                            Accept
                        </button>
                    </div>
                ) : user.connectionStatus === 'pending' ? (
                    <button disabled className="text-gray-500 font-medium px-4 py-1 rounded-full border border-gray-300 bg-gray-100 w-full cursor-not-allowed">
                        Pending
                    </button>
                ) : (
                    <button
                        onClick={() => onConnect && onConnect(user._id)}
                        className="text-blue-600 font-medium px-4 py-1 rounded-full border border-blue-600 hover:bg-blue-50 w-full">
                        Connect
                    </button>
                )}
            </div>
        </div>
    );
};

export default ConnectionCard;
