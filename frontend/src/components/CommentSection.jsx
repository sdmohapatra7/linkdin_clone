import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../features/posts/postSlice';
import { Link } from 'react-router-dom';

const CommentSection = ({ postId, comments }) => {
    const [text, setText] = useState('');
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        dispatch(addComment({ postId, text }));
        setText('');
    };

    return (
        <div className="mt-4 border-t border-gray-100 pt-4">
            {/* Input Area */}
            <div className="flex space-x-3 mb-4">
                <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={user?.profilePicture || 'https://via.placeholder.com/40'}
                    alt="Current user"
                />
                <form onSubmit={handleSubmit} className="flex-grow flex space-x-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border border-transparent"
                    />
                    {text.trim() && (
                        <button
                            type="submit"
                            className="bg-blue-600 text-white rounded-full px-4 py-1 text-sm font-semibold hover:bg-blue-700 transition"
                        >
                            Post
                        </button>
                    )}
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {comments && comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="flex space-x-3 group">
                            <Link to={`/profile/${comment.user?._id}`}>
                                <img
                                    className="h-8 w-8 rounded-full object-cover mt-1"
                                    src={comment.user?.profilePicture || 'https://via.placeholder.com/40'}
                                    alt={comment.user?.name}
                                />
                            </Link>
                            <div className="flex-grow">
                                <div className="bg-gray-100 rounded-lg px-3 py-2 inline-block">
                                    <div className="flex items-center space-x-2">
                                        <Link to={`/profile/${comment.user?._id}`} className="font-semibold text-sm hover:underline hover:text-blue-600">
                                            {comment.user?.name || 'Unknown User'}
                                        </Link>
                                        {comment.user?.headline && (
                                            <span className="text-xs text-gray-500 truncate max-w-[150px]">
                                                {comment.user.headline}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-800">{comment.text}</p>
                                </div>
                                <div className="flex items-center space-x-2 mt-1 ml-1 text-xs text-gray-500">
                                    <span>{new Date(comment.date).toLocaleDateString()}</span>
                                    {/* Future: Add Like/Reply implementation */}
                                    {/* <button className="hover:text-blue-600">Like</button> */}
                                    {/* <button className="hover:text-blue-600">Reply</button> */}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center">No comments yet. Be the first to say something!</p>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
