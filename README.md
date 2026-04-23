# SchoolData Portal - MERN Stack

A powerful, secure, and data-driven application for school surveys, form building, and multi-level review systems.

## Project Structure

- **/frontend**: React + Vite application (UI, State, Routing)
- **/backend**: Express + TypeScript + MongoDB (API, Auth, Logic)
- **Root**: Orchestration scripts to run both environments simultaneously.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (or use the built-in memory server for testing)

### Installation
From the root directory, run:
```bash
npm run install:all
```

### Running Locally (Production Database)
```bash
npm run dev
```

### Running Locally (In-Memory Database for Testing)
This starts the app with a pre-seeded, ephemeral MongoDB instance.
```bash
npm run dev:test
```

## Available Scripts (Root)

- `npm run dev`: Start frontend and backend.
- `npm run dev:test`: Start frontend and backend with in-memory MongoDB.
- `npm run build`: Build both applications for production.
- `npm run seed`: Populate the database with test data.

## Documentation
- [Implementation Details](./implementation.md)
- [Testing Guide](./TESTING.md)
