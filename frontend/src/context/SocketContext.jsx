import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        let newSocket;
        if (user) {
            const ENDPOINT = 'http://localhost:5000';
            newSocket = io(ENDPOINT);
            setSocket(newSocket);

            newSocket.emit('setup', user);
            newSocket.on('connected', () => console.log('Socket Connected Globally'));

            // Listen for notifications
            newSocket.on('notification received', (notification) => {
                setUnreadNotifications((prev) => prev + 1);
                // Optional: Show toast here
            });

            // Listen for new messages globally for badge
            // Note: Currently messageController emits 'message received' to the specific user room
            newSocket.on('message received', (newMessage) => {
                // You might want to check if the user is currently looking at this chat
                // For now, simpler implementation:
                setUnreadMessages((prev) => prev + 1);
            });

        }
        return () => {
            if (newSocket) newSocket.disconnect();
        }
    }, [user]);

    // Reset counts methods
    const resetNotifications = () => setUnreadNotifications(0);
    const resetMessages = () => setUnreadMessages(0);

    return (
        <SocketContext.Provider value={{ socket, unreadNotifications, unreadMessages, resetNotifications, resetMessages }}>
            {children}
        </SocketContext.Provider>
    );
};
