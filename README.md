# JobsHub 🚀

**Live Demo:** [https://linkdin-clone-gray.vercel.app](https://linkdin-clone-gray.vercel.app)

**JobsHub** is a premier, full-stack platform designed to bridge the gap between top-tier talent and industry-leading recruiters. It offers a premium, modern alternative to traditional job boards by deeply integrating authentic professional networking with streamlined application tracking.

This repository is structured as a monolithic monorepo containing both the React frontend and the Express/Node backend.

## Architecture Overview

*   **Frontend**: Located in `./frontend`. Powered by React, Vite, Redux Toolkit, and styled continuously with TailwindCSS to deliver a beautiful, App-like experience. Includes sophisticated multi-step wizards and real-time state synchronization.
*   **Backend**: Located in `./server`. Structured with Node.js and Express, backed by a NoSQL MongoDB database. It handles complex data modeling for User Graphs (Connections), robust Role-Based Access controls (Seekers vs Recruiters), and persistent WebSocket connections via Socket.io.

## Quick Start

To launch the entire platform locally, you must run both the frontend and backend servers concurrently.

### 1. Database Initialization
Ensure you have a MongoDB instance running locally or a valid MongoDB Atlas URI. 

### 2. Backend Setup
```bash
cd server
npm install
```
Configure your `/server/.env` based on the `/server/README.md` guidelines, then:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal session.
```bash
cd frontend
npm install
npm run dev -- --host
```

The application will now be live and accessible at `http://localhost:3000`.

## Project Vision

JobsHub aims to disrupt standard job hunting by providing an ecosystem where:
- Candidates can discover niche communities (`Groups`), network with peers, and apply seamlessly (`Easy Apply`).
- Recruiters can publish tailored opportunities, manage applicant flows efficiently, and scout talent through advanced filtering mechanisms.

---
*Empowering Professionals Worldwide.*
