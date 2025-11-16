# 🌱 EcoTrack - Carbon Footprint Tracker & Eco-Pledge System

**SDG 13: Climate Action** - A full-stack MERN application for tracking carbon footprint and making eco-pledges.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Video Demonstration](#video-demonstration)
- [Live URL](#live-url)

## 🎯 Overview

EcoTrack is a comprehensive carbon footprint tracking application that allows users to:
- Log daily activities and automatically calculate CO₂ emissions
- Visualize their carbon footprint with interactive charts
- Join a community of eco-conscious users through real-time pledge wall
- Track global CO₂ savings across all users
- Export their data as CSV

This project demonstrates full-stack development skills using the MERN stack (MongoDB, Express.js, React, Node.js) with real-time features powered by Socket.io.

## ✨ Features

### User Authentication
- Secure JWT-based authentication with httpOnly cookies
- User registration and login
- Protected routes
- User profile management

### Carbon Tracking
- Log activities by category (transport, energy, food, waste, shopping, other)
- Automatic CO₂ calculation based on activity type and amount
- Manual CO₂ entry option
- View entries by date and category

### Data Visualization
- Line chart showing CO₂ emissions over time (last 30 days)
- Pie chart showing CO₂ breakdown by category
- Real-time statistics dashboard
- Total CO₂ tracking per user

### Eco-Pledge System
- Create and share eco-pledges
- Real-time pledge wall with Socket.io
- Like/unlike pledges
- See all community pledges

### Additional Features
- Global CO₂ counter on homepage (updates every 30 seconds)
- CSV export functionality
- Responsive design (mobile-first)
- Beautiful UI with Tailwind CSS v4
- Real-time updates via WebSocket

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Socket.io Client** - Real-time updates
- **Tailwind CSS v4** - Styling

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB installation)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-final-project-J-Njoroge
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Create `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

   Create `client/.env` (optional, defaults to `http://localhost:5000/api`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:5173`

### Available Scripts

**Root Level:**
- `npm run dev` - Run both server and client in development mode
- `npm run install:all` - Install dependencies for root, client, and server
- `npm run build` - Build both client and server for production

**Server:**
- `npm run dev` - Run server with nodemon (auto-restart)
- `npm start` - Run server in production mode

**Client:**
- `npm run dev` - Run Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📁 Project Structure

```
mern-final-project-J-Njoroge/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ActivityForm.jsx
│   │   │   ├── CarbonChart.jsx
│   │   │   ├── PledgeCard.jsx
│   │   │   └── PledgeWall.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/          # Configuration
│   │   │   └── db.js
│   │   ├── controllers/     # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── carbonController.js
│   │   │   └── pledgeController.js
│   │   ├── middleware/      # Custom middleware
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/          # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── CarbonEntry.js
│   │   │   └── Pledge.js
│   │   ├── routes/          # API routes
│   │   │   ├── auth.js
│   │   │   ├── carbon.js
│   │   │   └── pledge.js
│   │   ├── sockets/         # Socket.io setup
│   │   │   └── pledgeSocket.js
│   │   └── index.js         # Server entry point
│   ├── .env
│   └── package.json
│
└── package.json            # Root package.json
```

## 📡 API Documentation

### Authentication Routes

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Carbon Routes

- `GET /api/carbon` - Get all carbon entries (Protected)
- `POST /api/carbon` - Create new carbon entry (Protected)
  ```json
  {
    "category": "transport",
    "description": "Drove to work",
    "activityType": "car",
    "amount": 10,
    "date": "2024-01-15"
  }
  ```

- `GET /api/carbon/stats` - Get carbon statistics (Protected)
- `DELETE /api/carbon/:id` - Delete carbon entry (Protected)

### Pledge Routes

- `GET /api/pledge` - Get all pledges (Public)
- `POST /api/pledge` - Create new pledge (Protected)
  ```json
  {
    "text": "I pledge to reduce my carbon footprint by 20% this year"
  }
  ```

- `POST /api/pledge/:id/like` - Like/unlike a pledge (Protected)
- `GET /api/pledge/global-co2` - Get global CO₂ saved (Public)

## 🔐 Environment Variables

### Server (.env)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (min 32 characters)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS

### Client (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## 🚢 Deployment

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Set build command: `cd server && npm install`
5. Set start command: `cd server && npm start`

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend: `cd client && npm run build`
2. Deploy the `client/dist` folder
3. Set environment variable `VITE_API_URL` to your backend URL

### Production Build

The server is configured to serve the built React app in production:

```bash
npm run build
```

The server will automatically serve static files from `client/dist` when `NODE_ENV=production`.

## 📸 Screenshots

_Add screenshots of your application here_

## 🎥 Video Demonstration

_[Add link to your video demonstration here]_

## 🌐 Live URL

_[Add your deployed application URL here]_

## 📝 License

This project is part of a MERN Stack Development course assignment.

## 👤 Author

**J. Njoroge**

## 🙏 Acknowledgments

- United Nations SDG 13: Climate Action
- MongoDB Atlas for database hosting
- Tailwind CSS for styling
- Recharts for data visualization 