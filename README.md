# Customer Management System

A web application for managing customer information using Node.js, MongoDB, and a modern frontend with Bootstrap and jQuery.

## Features

- Add new customers with name, email, phone, and address
- View list of all customers
- Delete customers
- Responsive design with icons
- Modern UI with Bootstrap

## Prerequisites

- Node.js installed on your system
- MongoDB running on port 27017
- Web browser

## Installation

1. Clone the repository or download the files
2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Make sure MongoDB is running on port 27017
2. Start the application:
```bash
npm start
```
3. Open your web browser and navigate to: `http://localhost:3000`

## Technology Stack

- Backend: Node.js with Express
- Database: MongoDB
- Frontend: HTML, CSS, jQuery
- UI Framework: Bootstrap 5
- Icons: Font Awesome

## API Endpoints

- GET `/api/customers` - Get all customers
- POST `/api/customers` - Add a new customer
- DELETE `/api/customers/:id` - Delete a customer 