import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { searchGlobal, reset } from '../features/search/searchSlice';
import Spinner from '../components/Spinner';
import ConnectionCard from '../components/ConnectionCard';

const Search = () => {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q');

    const dispatch = useDispatch();
    const { results, isLoading } = useSelector((state) => state.search);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (q) {
            dispatch(searchGlobal(q));
        }
    }, [dispatch, q]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Search Results for "{q}"</h2>

            {isLoading ? <Spinner /> : (
                <>
                    <div>
                        <h3 className="text-xl font-bold mb-3 text-gray-700">People</h3>
                        {results.users && results.users.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.users.filter(u => u._id !== user._id).map(user => (
                                    <ConnectionCard key={user._id} user={user} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No people found.</p>
                        )}
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-3 text-gray-700">Posts</h3>
                        {results.posts && results.posts.length > 0 ? (
                            <div className="space-y-4">
                                {results.posts.map(post => (
                                    <div key={post._id} className="bg-white rounded-lg shadow p-4">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <img className="h-10 w-10 rounded-full" src={post.user.profilePicture || 'https://via.placeholder.com/40'} alt="" />
                                            <div>
                                                <p className="font-bold text-sm">{post.user.name}</p>
                                                <p className="text-xs text-gray-500">{post.user.headline}</p>
                                            </div>
                                        </div>
                                        <p>{post.text}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No posts found.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Search;
