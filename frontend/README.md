# Chat App Frontend

This is the frontend client for the Chat Application, built with React, Redux Toolkit, and Vite.

## Features

*   **Responsive UI**: Modern, responsive design with clear navigation.
*   **State Management**: Redux Toolkit for managing global state (Auth, Chat, Posts, Search).
*   **Real-time Communication**: Socket.io client for instant messaging and notifications.
*   **Media Support**: Send images, videos, and emojis in chats.
*   **Search**: Advanced search with filters for location, role, and skills.
*   **Feed**: Infinite scroll feed for user posts.

## Configuration

This project uses Vite. Configuration is in `vite.config.js`.

Environment variables are stored in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Installation & Running

1.  Navigate to the directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev -- --host
    ```

4.  The application will be available at `http://localhost:3000`.

## Key Dependencies

*   `react` & `react-dom`
*   `@reduxjs/toolkit` & `react-redux`
*   `react-router-dom`
*   `axios`
*   `socket.io-client`
*   `react-icons`
*   `emoji-picker-react`
*   `react-toastify`

## Directory Structure

*   `src/components`: Reusable UI components (Navbar, Footer, etc.)
*   `src/features`: Redux slices and API services (Auth, Chat, Posts, etc.)
*   `src/pages`: Main application pages (Home, Login, Messaging, Profile, etc.)
*   `src/context`: React Context providers (SocketContext)
