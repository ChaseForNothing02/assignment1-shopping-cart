# Shopping Cart Web Application

## Project Overview
This project is based on react, node.js, express and MongoDB. Users can browse products, search and filter items and manage shopping cart.
The main goal of this project is to show the CURD operations and the integration of frontend and backend.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Styling: CSS

## System Description
This application follows a client-server architecture.

The frontend is built using React and runs as a single-page application (SPA). It communicates with the backend using HTTP requests (fetch API).

The backend is implemented using Node.js and Express, which exposes RESTful API endpoints. It handles all business logic and interacts with the MongoDB database using Mongoose.

Data flow:
- The frontend requests product data from the backend (`GET /products`)
- The backend retrieves data from MongoDB and returns it as JSON
- The frontend displays products dynamically
- Cart operations (add, update, delete) are sent to the backend via API
- The backend updates the MongoDB database accordingly

This ensures that all data is persistent and synchronized between the UI and the database.
## Key Dependencies
- express: backend server framework
- mongoose: MongoDB object modeling
- cors: enable cross-origin requests

## Features
- Display products from database
- Search products by name
- Filter products by category
- Add items to shopping cart
- Increase and decrease item quantity
- Remove items from cart
- Persistent cart stored in MongoDB
- Responsive user interface
- Loading states and UI feedback

## System Architecture
Frontend (React) communicates with Backend (Express API), which interacts with MongoDB for data storage.

## Challenges
The main challenge is integrating the frontend with the backend API that ensuring data consistency and designing a smooth user experience without page reloads (SPA behavior) required managing state effectively and updating the UI dynamically. Another challenge is handling asynchronous operations using fetch, which required careful handling of API responses and errors to ensure that the application did not break when the server failed or returned unexpected results.

## How to Run the Project

### Prerequisites
Make sure the following are installed:
- Node.js
- MongoDB (running locally on port 27017)

### 1. Start MongoDB
Ensure MongoDB is running on your machine.
Default connection: mongodb://127.0.0.1:27017

### 2. Start Backend Server
cd backend
node server.js
The backend will run on: http://localhost:5000

### 3. Start frontend Server
cd frontend
npm run dev
Open your browser and go to:http://localhost:5173

### 4. Database export
Database export is included in `/backend/data/products.json`.