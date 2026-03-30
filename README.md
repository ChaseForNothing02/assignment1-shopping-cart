# Shopping Cart Web Application

## Project Overview
This project is based on react, node.js, express and MongoDB. Users can browse products, search and filter items and manage shopping cart.
The main goal of this project is to show the CURD operations and the integration of frontend and backend.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Styling: CSS

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