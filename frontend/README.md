# JobsHub Frontend

This is the frontend client for JobsHub, a professional networking and job search platform featuring a modern UI and real-time connectivity. Built with React, Redux Toolkit, and Vite.

## Core Features

*   **Role-Based Access**: Dedicated interfaces for Job Seekers and Recruiters.
*   **Job Board**: Post jobs (Recruiters), apply with Easy Apply (Seekers), and manage applicant tracking.
*   **Professional Networking**: Build a connection network, similar to LinkedIn, with full connection lifecycle management.
*   **Groups & Communities**: Create and join professional groups with dedicated discussion boards.
*   **Real-time Messaging**: Instant one-on-one messaging powered by Socket.io, including media sharing and read receipts.
*   **Interactive Feed**: Infinite scroll feed for sharing updates, articles, and media with your network.
*   **Advanced Search**: Discover professionals, companies, and opportunities using multi-faceted search algorithms.
*   **Authentication Flow**: Modern split-screen authentication with an intuitive 3-step signup wizard.

## Configuration

This project uses Vite. Configuration is located in `vite.config.js`.

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

## Tech Stack & Dependencies

*   **Framework**: `react`, `react-dom`
*   **State Management**: `@reduxjs/toolkit`, `react-redux`
*   **Routing**: `react-router-dom`
*   **Networking**: `axios`, `socket.io-client`
*   **Styling**: `tailwindcss`, `react-icons`

## Directory Structure

*   `src/components`: Reusable UI components (Navbar, Footer, Modals, Forms)
*   `src/features`: Redux state slices and encapsulated API services
*   `src/pages`: Main application views (Network, Jobs, Messaging, User Profiles)
*   `src/context`: React Context providers (Socket integration)
