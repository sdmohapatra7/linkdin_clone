import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, accessChat, setSelectedChat } from '../features/chat/chatSlice';
import { allMessages, sendMessage, addMessage } from '../features/messages/messageSlice';
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import { FaSmile, FaPaperclip, FaTimes } from 'react-icons/fa';

const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const Messaging = () => {
    const dispatch = useDispatch();
    const [newMessage, setNewMessage] = useState("");
    const { user } = useSelector((state) => state.auth);
    const { chats, selectedChat, isLoading: loadingChats } = useSelector((state) => state.chat);
    const { messages, isLoading: loadingMessages } = useSelector((state) => state.message);

    // Auto-scroll to bottom of chat
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initial socket setup can be here or in a global context
    useEffect(() => {
        if (user) {
            socket = io(ENDPOINT);
            socket.emit('setup', user);
            socket.on('connected', () => console.log('Socket Connected'));
            socket.on('typing', () => console.log('Typing...'));
            socket.on('stop typing', () => console.log('Stop Typing'));
        }
        return () => {
            // Clean up if needed, though often we keep socket open
            // if(socket) socket.disconnect(); 
        }
    }, [user]);

    useEffect(() => {
        if (user) dispatch(fetchChats());
    }, [dispatch, user]);

    // Fetch messages when chat is selected & Join Room
    useEffect(() => {
        if (!selectedChat) return;

        dispatch(allMessages(selectedChat._id));

        socket.emit('join chat', selectedChat._id);
        selectedChatCompare = selectedChat;
    }, [selectedChat, dispatch]);

    // Listen for new messages
    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                // Notification logic could go here
                console.log("Notification: New message from " + newMessageReceived.sender.name);
            } else {
                dispatch(addMessage(newMessageReceived));
            }
        });
        return () => {
            socket.off("message received");
        };
    }, [dispatch]);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [mediaFiles, setMediaFiles] = useState({ images: [], videos: [] });
    const fileInputRef = useRef(null);

    const onEmojiClick = (emojiObject) => {
        setNewMessage((prev) => prev + emojiObject.emoji);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];
        const newVideos = [];

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                newImages.push(file);
            } else if (file.type.startsWith('video/')) {
                newVideos.push(file);
            }
        });

        setMediaFiles(prev => ({
            images: [...prev.images, ...newImages],
            videos: [...prev.videos, ...newVideos]
        }));
    };

    const removeMedia = (type, index) => {
        setMediaFiles(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const sendMessageHandler = async (e) => {
        if ((e.key === "Enter" || e.type === "click") && (newMessage || mediaFiles.images.length > 0 || mediaFiles.videos.length > 0)) {
            // Prevent default if it's a keypress (Enter) to avoid newline if we were using textarea, 
            // but for input it's fine. Main purpose is to stop form submit if any.

            // Preparing FormData
            const formData = new FormData();
            formData.append('content', newMessage);
            formData.append('chatId', selectedChat._id);

            mediaFiles.images.forEach(file => formData.append('image', file));
            mediaFiles.videos.forEach(file => formData.append('video', file));

            setNewMessage(""); // Optimistic clear
            setMediaFiles({ images: [], videos: [] });
            setShowEmojiPicker(false);

            // Dispatch action (we need to update messageService to handle FormData first, 
            // but assuming we will do that next, or if the thunk handles it)
            // Note: If messageSlice uses a service that expects JSON, we need to change it.
            // Let's pass formData directly.

            const action = await dispatch(sendMessage(formData));

            if (sendMessage.fulfilled.match(action)) {
                socket.emit("new message", action.payload);
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    };

    return (
        <div className="h-[calc(100vh-80px)] bg-white rounded-lg shadow overflow-hidden flex">
            {/* Sidebar - Chat List */}
            <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold">Messaging</h2>
                </div>
                <div className="overflow-y-auto flex-1">
                    {loadingChats ? (
                        <p className="p-4 text-center">Loading chats...</p>
                    ) : (
                        chats && chats.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => dispatch(setSelectedChat(chat))}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 flex items-center space-x-3 ${selectedChat?._id === chat._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                            >
                                <div className="relative">
                                    <img
                                        className="h-12 w-12 rounded-full object-cover"
                                        src={!chat.isGroupChat
                                            ? (chat.users[0]._id === user?._id ? chat.users[1]?.profilePicture : chat.users[0]?.profilePicture) || 'https://via.placeholder.com/50'
                                            : 'https://via.placeholder.com/50?text=Group'}
                                        alt=""
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-semibold truncate">
                                            {!chat.isGroupChat
                                                ? (chat.users[0]._id === user?._id ? chat.users[1]?.name : chat.users[0]?.name)
                                                : chat.chatName}
                                        </h3>
                                        {chat.latestMessage && (
                                            <span className="text-xs text-gray-400">{new Date(chat.latestMessage.createdAt).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">
                                        {chat.latestMessage ? (
                                            <span>
                                                {chat.latestMessage.sender._id === user?._id ? 'You: ' : ''}
                                                {chat.latestMessage.content}
                                            </span>
                                        ) : 'Start a conversation'}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Window */}
            <div className={`w-full md:w-2/3 flex flex-col ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <button onClick={() => dispatch(setSelectedChat(null))} className="md:hidden text-gray-500">
                                    Back
                                </button>
                                <div className="flex items-center space-x-3">
                                    <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={!selectedChat.isGroupChat
                                            ? (selectedChat.users[0]._id === user?._id ? selectedChat.users[1]?.profilePicture : selectedChat.users[0]?.profilePicture) || 'https://via.placeholder.com/50'
                                            : 'https://via.placeholder.com/50?text=Group'}
                                        alt=""
                                    />
                                    <h3 className="font-bold">
                                        {!selectedChat.isGroupChat
                                            ? (selectedChat.users[0]._id === user?._id ? selectedChat.users[1]?.name : selectedChat.users[0]?.name)
                                            : selectedChat.chatName}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-3">
                            {loadingMessages ? (
                                <div className="text-center mt-10">Loading messages...</div>
                            ) : (
                                messages && messages.map((m, i) => (
                                    <div key={m._id} className={`flex ${m.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${m.sender._id === user._id
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                            }`}>
                                            {m.image && m.image.length > 0 && (
                                                <div className={`grid gap-1 mb-1 ${m.image.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                                    {m.image.map((img, idx) => (
                                                        <img key={idx} src={img} alt="msg-attachment" className="rounded-lg max-w-full h-auto object-cover" />
                                                    ))}
                                                </div>
                                            )}
                                            {m.video && m.video.length > 0 && (
                                                <div className="space-y-1 mb-1">
                                                    {m.video.map((vid, idx) => (
                                                        <video key={idx} src={vid} controls className="rounded-lg w-full" />
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-sm">{m.content}</p>
                                            <span className={`text-[10px] block text-right mt-1 ${m.sender._id === user._id ? 'text-blue-100' : 'text-gray-400'}`}>
                                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={endOfMessagesRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200 relative">
                            {/* Emoji Picker Popover */}
                            {showEmojiPicker && (
                                <div className="absolute bottom-20 left-4 z-10">
                                    <EmojiPicker onEmojiClick={onEmojiClick} />
                                </div>
                            )}

                            {/* Previews */}
                            {(mediaFiles.images.length > 0 || mediaFiles.videos.length > 0) && (
                                <div className="flex space-x-2 mb-2 overflow-x-auto p-2 bg-gray-50 rounded">
                                    {mediaFiles.images.map((file, i) => (
                                        <div key={`img-${i}`} className="relative h-16 w-16 flex-shrink-0">
                                            <img src={URL.createObjectURL(file)} alt="preview" className="h-full w-full object-cover rounded" />
                                            <button onClick={() => removeMedia('images', i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 text-xs"><FaTimes /></button>
                                        </div>
                                    ))}
                                    {mediaFiles.videos.map((file, i) => (
                                        <div key={`vid-${i}`} className="relative h-16 w-16 flex-shrink-0 bg-black rounded flex items-center justify-center">
                                            <span className="text-white text-xs">Video</span>
                                            <button onClick={() => removeMedia('videos', i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 text-xs"><FaTimes /></button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex space-x-2 items-center">
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="text-gray-500 hover:text-yellow-500 transition"
                                >
                                    <FaSmile size={24} />
                                </button>

                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="text-gray-500 hover:text-blue-500 transition"
                                >
                                    <FaPaperclip size={20} />
                                </button>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />

                                <input
                                    type="text"
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
                                    placeholder="Write a message..."
                                    value={newMessage}
                                    onChange={typingHandler}
                                    onKeyDown={sendMessageHandler}
                                />
                                <button
                                    onClick={sendMessageHandler}
                                    className="bg-blue-600 text-white rounded-full px-6 py-2 font-bold hover:bg-blue-700"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center flex-col text-gray-500">
                        <h2 className="text-xl font-bold mb-2">Select a chat to start messaging</h2>
                        <p>Choose from your existing conversations</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messaging;
