# Cadet Management System - Backend

## Overview
This backend system manages outpass requests for cadets with three user roles: Cadet, Parent, and Admin.

## Features
- Create outpass requests
- Parent approval workflow
- Admin final status management
- Real-time WebSocket notifications

## Models
- Cadet
- Parent
- OutpassRequest

## API Endpoints
- `POST /outpass`: Create outpass request
- `PATCH /outpass/:id/parent-approval`: Parent approval
- `PATCH /outpass/:id/admin-status`: Admin status update
- `PATCH /outpass/:id/times`: Update in/out times
- `GET /outpass/cadet/:cadetId`: Get cadet's outpass requests
- `GET /outpass/:id`: Get single outpass request

## WebSocket Events
- `newOutpass`: Notify parent of new request
- `parentResponse`: Notify admin of parent's response
- `adminUpdate`: Notify relevant parties of admin updates

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure database in `config/config.json`
4. Run migrations: `npx sequelize-cli db:migrate`
5. Start server: `npm run dev`

## Technologies
- Node.js
- Express
- Sequelize
- Socket.IO
- MySQL

## Environment Variables
- `PORT`: Server port
- `DATABASE_URL`: Database connection string
- `JWT_SECRET`: JWT authentication secret

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.
