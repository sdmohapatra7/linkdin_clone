# JobsHub Backend API Server

This is the core backend infrastructure for JobsHub, a professional networking and job aggregation platform. Engineered with Node.js, Express, and MongoDB.

## Architecture & Features

*   **Authentication System**: Robust JWT-based authentication featuring Login, multi-step Registration, and secure Password Reset mechanisms.
*   **Role-Based Access Control (RBAC)**: Enforced authorization isolating actions between *Job Seekers* and *Recruiters*.
*   **Job & Applicant Tracking**: RESTful endpoints for publishing jobs, submitting applications, and retrieving populated applicant profiles.
*   **User Modeling & Graphs**: Complex MongoDB schemas modeling user profiles, work experience, education, and mutual follower graphs.
*   **Real-Time Communications**: Integrated Socket.io server facilitating low-latency messaging, media transfer, and live notifications.
*   **Content Feed System**: Endpoints for generating, paginating, and interacting (liking/commenting) with community posts.
*   **Groups Management**: API infrastructure supporting group creation, membership rosters, and localized discussions.

## Environment Variables

Create a `.env` file in the root directory configured with:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
BASE_URL=http://localhost:8000
```

## Installation & Running

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server (runs with nodemon):
    ```bash
    npm run dev
    ```

The server initializes on `http://localhost:8000` (or defined PORT) and immediately attempts to connect to the MongoDB instance.

## Core API Domains

### Auth (`/api/auth`)
*   `POST /register` - Provision a new user account
*   `POST /login` - Authenticate and issue JWT
*   `GET /me` - Retrieve current stateless profile

### Jobs (`/api/jobs`)
*   `POST /` - Publish a new job (Recruiter Only)
*   `POST /:id/apply` - Submit application (Seeker Only)
*   `GET /:id/applicants` - Fetch applicant roster (Post Author Only)

### Network (`/api/users`)
*   `POST /follow/:id` - Initiate connection request
*   `GET /search` - Query professionals by skill, role, or name
*   `PUT /profile` - Mutate profile metadata

### Communications (`/api/chat` & `/api/message`)
*   `POST /chat` - Initialize direct messaging channel
*   `POST /message` - Dispatch message payload (text/media)
