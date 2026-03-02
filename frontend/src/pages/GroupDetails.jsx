import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroup, joinGroup, leaveGroup } from '../features/groups/groupSlice';
import { getPosts, likePost, reset as resetPosts } from '../features/posts/postSlice';
import Spinner from '../components/Spinner';
import PostCreator from '../components/PostCreator';
import CommentSection from '../components/CommentSection';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const GroupDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { group, isLoading, isError, message } = useSelector((state) => state.group);

    // We isolate the post feed state
    const { posts, isLoading: isPostsLoading, hasMore } = useSelector((state) => state.post);

    const [activeComments, setActiveComments] = useState({});
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(getGroup(id));
        dispatch(getPosts({ page: 1, groupId: id }));

        return () => {
            dispatch(resetPosts());
        };
    }, [dispatch, id, user, navigate]);

    const handleJoin = () => {
        dispatch(joinGroup(id));
    };

    const handleLeave = () => {
        if (window.confirm('Are you sure you want to leave this group?')) {
            dispatch(leaveGroup(id));
        }
    };

    const toggleComments = (postId) => {
        setActiveComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const loadMore = () => {
        if (!isPostsLoading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            dispatch(getPosts({ page: nextPage, groupId: id }));
        }
    };

    const { targetRef } = useIntersectionObserver(loadMore, [isPostsLoading, hasMore, page]);

    if (isLoading || !group) {
        return <Spinner />;
    }

    const isMember = group.members.some(m => m._id === user._id) || group.admin?._id === user._id;
    const isAdmin = group.admin?._id === user._id;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header / Cover */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 w-full bg-blue-100 flex items-center justify-center relative">
                    <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                </div>
                <div className="p-6 relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
                            <p className="text-gray-500 mt-2">{group.description}</p>
                            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                    {group.members.length} members
                                </span>
                                {group.admin && (
                                    <span>Created by {group.admin.name}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            {isAdmin ? (
                                <button className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-full cursor-default">Admin</button>
                            ) : isMember ? (
                                <button onClick={handleLeave} className="border border-red-500 text-red-500 hover:bg-red-50 font-semibold py-2 px-4 rounded-full transition">Leave Group</button>
                            ) : (
                                <button onClick={handleJoin} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition shadow-md">Join Group</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Feeds */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    {isMember ? (
                        <>
                            {/* We inject the group context directly into our generic PostCreator component via a prop 
                                We first need to check if PostCreator supports a groupId prop. Since we didn't add it yet,
                                we'll render a simplified composer or instruct the user to update PostCreator.
                                Actually, we'll assume we can pass `groupId` directly as a prop and update PostCreator next. */}
                            <PostCreator groupId={id} />

                            {/* Feed List */}
                            {posts.length > 0 ? (
                                <>
                                    {posts.map((post) => (
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
                                            {/* Media placeholders similar to Home */}
                                            <div className="grid grid-cols-2 gap-2 my-2">
                                                {post.image && post.image.slice(0, 4).map((img, index) => (
                                                    <div key={index} className="relative w-full h-[250px]">
                                                        <img src={img} alt="Post content" className="rounded-md w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                                    </div>
                                                ))}
                                                {post.video && post.video.map((vid, index) => (
                                                    <video key={index} controls src={vid} className="rounded-md w-full max-h-[500px] col-span-2"></video>
                                                ))}
                                            </div>
                                            <div className="flex justify-between items-center text-gray-500 text-sm border-t border-gray-200 pt-2">
                                                <button onClick={() => dispatch(likePost(post._id))} className={`flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded ${(post.likes || []).some(like => like.user === user._id) ? 'text-blue-600 font-bold' : ''}`}>
                                                    <span>Like ({(post.likes || []).length})</span>
                                                </button>
                                                <button onClick={() => toggleComments(post._id)} className="flex items-center space-x-1 hover:bg-gray-100 px-2 py-1 rounded">
                                                    <span>Comment ({(post.comments || []).length})</span>
                                                </button>
                                            </div>
                                            {activeComments[post._id] && <CommentSection postId={post._id} comments={post.comments} />}
                                        </div>
                                    ))}

                                    {/* Infinite Scroll Observer Target */}
                                    {hasMore && (
                                        <div ref={targetRef} className="flex justify-center py-4">
                                            {isPostsLoading && <Spinner />}
                                        </div>
                                    )}

                                    {!hasMore && posts.length > 0 && (
                                        <div className="text-center text-gray-500 py-4">No more posts in this group.</div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center bg-white p-6 rounded-lg shadow text-gray-500">No posts in this group yet. Be the first to post!</div>
                            )}
                        </>
                    ) : (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center text-blue-800">
                            <h3 className="text-lg font-bold mb-2">Private Group Feed</h3>
                            <p>You must join the group to view and create posts.</p>
                        </div>
                    )}
                </div>

                {/* Right sidebar info */}
                <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-bold text-gray-800 border-b pb-2 mb-2">About this group</h3>
                        <p className="text-sm text-gray-600">{group.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupDetails;
