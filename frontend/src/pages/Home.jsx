import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts, reset, createPost, likePost, addComment } from '../features/posts/postSlice';
import { logout } from '../features/auth/authSlice';
import PostCreator from '../components/PostCreator';
import Spinner from '../components/Spinner';
import CommentSection from '../components/CommentSection';
import { useSocket } from '../context/SocketContext';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { posts, isLoading, isError, message } = useSelector(
        (state) => state.post
    );

    const [activeComments, setActiveComments] = useState({});

    const toggleComments = (postId) => {
        setActiveComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    useEffect(() => {
        if (isError) {
            console.log(message);
            if (
                message === 'Not authorized' ||
                message === 'User not found' ||
                message === 'Not authorized, no token' ||
                message.includes('Request failed with status code 401')
            ) {
                dispatch(logout());
                navigate('/login');
                dispatch(reset());
            }
        }

        if (!user) {
            navigate('/login');
        } else {
            dispatch(getPosts());
        }

        return () => {
            dispatch(reset());
        };
    }, [user, navigate, dispatch, isError, message]);

    const { socket } = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('new post', (newPost) => {
                dispatch(getPosts());
            });
            return () => {
                socket.off('new post');
            };
        }
    }, [socket, dispatch]);


    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="space-y-4">
            <PostCreator />

            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post._id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex space-x-3 mb-2">
                            <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={post.user?.profilePicture || 'https://via.placeholder.com/40'}
                                alt=""
                            />
                            <div>
                                <div className="font-bold text-sm">{post.user?.name || 'Unknown User'}</div>
                                <div className="text-xs text-gray-500">{post.user?.headline || 'Member'} • {new Date(post.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">
                            {post.text}
                        </div>
                        <div className="grid grid-cols-2 gap-2 my-2">
                            {post.image && post.image.slice(0, 4).map((img, index) => (
                                <div key={index} className="relative w-full h-[250px]">
                                    <img src={img} alt="Post content" className="rounded-md w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                    {index === 3 && post.image.length > 4 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md cursor-pointer">
                                            <span className="text-white text-xl font-bold">+{post.image.length - 4} more</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {post.video && post.video.map((vid, index) => (
                                <video key={index} controls src={vid} className="rounded-md w-full max-h-[500px] col-span-2"></video>
                            ))}
                        </div>
                        <div className="flex justify-between items-center text-gray-500 text-sm border-t border-gray-200 pt-2">
                            <button
                                onClick={() => dispatch(likePost(post._id))}
                                className={`flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded ${(post.likes || []).find(like => like.user === user._id) ? 'text-blue-600 font-bold' : ''}`}
                            >
                                <span>Like ({(post.likes || []).length})</span>
                            </button>
                            <button
                                onClick={() => toggleComments(post._id)}
                                className="flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded"
                            >
                                <span>Comment ({(post.comments || []).length})</span>
                            </button>
                        </div>
                        {activeComments[post._id] && (
                            <CommentSection postId={post._id} comments={post.comments} />
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500">No posts yet</div>
            )}
        </div >
    );
};

export default Home;
