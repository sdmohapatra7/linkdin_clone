# Chat App Backend

This is the backend server for the Chat Application, built with Node.js, Express, and MongoDB.

## Features

*   **Authentication**: JWT-based auth with Login, Register, and Password Reset.
*   **User Management**: Profile updates, searching, following/unfollowing users.
*   **Messaging**: Real-time chat with Socket.io, image/video support, and read receipts.
*   **Posts**: Create, like, and comment on posts with pagination.
*   **Connections**: Linkedin-style connection request system.
*   **Search**: Advanced search for users by name, skill, or location.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
BASE_URL=http://localhost:8000
```

## Installation & Running

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

3.  The server will start on `http://localhost:8000` (or your defined PORT).

## API Endpoints

### Auth
*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Login user
*   `GET /api/auth/me` - Get current user profile

### Users
*   `GET /api/users/search` - Search users
*   `PUT /api/users/profile` - Update profile
*   `POST /api/users/forgot-password` - Request password reset
*   `PUT /api/users/reset-password/:token` - Reset password

### Chat
*   `POST /api/chat` - Access or create chat
*   `GET /api/chat` - Fetch all chats
*   `POST /api/message` - Send a message
*   `GET /api/message/:chatId` - Get messages for a chat
