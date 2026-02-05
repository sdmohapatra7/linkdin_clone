import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../features/posts/postSlice';
import { FaImage, FaVideo, FaTimes } from 'react-icons/fa';

const PostCreator = () => {
    const [text, setText] = useState('');
    const [image, setImage] = useState([]);
    const [video, setVideo] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const { isLoading, uploadProgress } = useSelector((state) => state.post);
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!text && image.length === 0 && video.length === 0) return;

        const formData = new FormData();
        formData.append('text', text);

        image.forEach((file) => {
            formData.append('image', file);
        });

        video.forEach((file) => {
            formData.append('video', file);
        });

        dispatch(createPost(formData));

        // Reset state
        setText('');
        setImage([]);
        setVideo([]);
        setShowModal(false);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex space-x-3">
                    <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user?.profilePicture || "https://via.placeholder.com/40"}
                        alt=""
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }}
                    />
                    <button
                        onClick={handleOpenModal}
                        className="flex-grow text-left rounded-full border border-gray-300 px-4 py-2 text-gray-500 hover:bg-gray-100 font-medium transition"
                    >
                        Start a post
                    </button>
                </div>
            </div>

            {/* Modal - Debug Style */}
            {showModal && createPortal(
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '500px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        position: 'relative',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Create a post</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={onSubmit}>
                            <textarea
                                className="w-full border p-2 rounded focus:ring-0 text-lg resize-none h-32"
                                placeholder="What do you want to talk about?"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                autoFocus
                            />

                            <div className="mt-4 space-y-3">
                                <div className="mt-4 flex space-x-4">
                                    <div>
                                        <label className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-blue-600 transition">
                                            <FaImage className="text-blue-500 text-xl" />
                                            <span className="font-medium">Photos</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => setImage([...image, ...Array.from(e.target.files)])}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <label className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-green-600 transition">
                                            <FaVideo className="text-green-500 text-xl" />
                                            <span className="font-medium">Videos</span>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                multiple
                                                onChange={(e) => setVideo([...video, ...Array.from(e.target.files)])}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Previews */}
                                <div className="mt-4 space-y-4">
                                    {image.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {image.map((file, index) => (
                                                <div key={index} className="relative h-20 w-full">
                                                    <img src={URL.createObjectURL(file)} alt="preview" className="h-full w-full object-cover rounded" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setImage(image.filter((_, i) => i !== index))}
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 text-xs"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {video.length > 0 && (
                                        <div className="space-y-2">
                                            {video.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setVideo(video.filter((_, i) => i !== index))}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-5 sm:mt-6 flex flex-col justify-end">
                                {isLoading && (
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                        <p className="text-xs text-center mt-1 text-gray-600">{uploadProgress > 0 ? `${uploadProgress}% Uploaded` : 'Starting upload...'}</p>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={!text && (!image || image.length === 0) && (!video || video.length === 0) || isLoading}
                                    className={`inline-flex justify-center rounded-full border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isLoading ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default PostCreator;
