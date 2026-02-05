import { FaPlus } from 'react-icons/fa';

const AddToFeed = () => {
    // Mock suggestions
    const suggestions = [
        {
            id: 1,
            name: 'Tech Daily',
            info: 'Company • Technology',
            image: 'https://via.placeholder.com/40',
        },
        {
            id: 2,
            name: 'React Developers',
            info: 'Group • 120k members',
            image: 'https://via.placeholder.com/40',
        },
        {
            id: 3,
            name: 'Web Design',
            info: 'Topic • 50k followers',
            image: 'https://via.placeholder.com/40',
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden pb-2">
            <div className="p-4 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-sm">Add to your feed</h3>
                <span className="text-gray-500 cursor-pointer hover:bg-gray-100 rounded p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
            </div>

            <div className="px-4 space-y-4">
                {suggestions.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-gray-900 leading-tight">{item.name}</h4>
                            <p className="text-xs text-gray-500 truncate mb-1">{item.info}</p>
                            <button className="flex items-center justify-center space-x-1 border border-gray-600 rounded-full px-3 py-1 hover:bg-gray-100 hover:border-gray-800 transition">
                                <FaPlus className="text-gray-600 text-xs" />
                                <span className="text-gray-600 font-semibold text-sm">Follow</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center text-sm text-gray-500 font-semibold">
                View all recommendations
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </div>
    );
};

export default AddToFeed;
