// Import required Node.js modules
const express = require('express');        // Web framework for Node.js
const mongoose = require('mongoose');      // MongoDB object modeling tool
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const path = require('path');              // Utility for handling file paths

// Initialize Express application
const app = express();

// Connect to MongoDB database
// Using local MongoDB instance on default port 27017
mongoose.connect('mongodb://localhost:27017/customerDB', {
    useNewUrlParser: true,        // Use new URL string parser
    useUnifiedTopology: true      // Use new Server Discovery and Monitoring engine
});

// Define the Customer Schema (database structure)
const customerSchema = new mongoose.Schema({
    name: String,                 // Customer's full name
    email: String,                // Customer's email address
    phone: String,                // Customer's phone number
    address: String,              // Customer's address
    createdAt: {                  // Timestamp of when the record was created
        type: Date,
        default: Date.now         // Automatically set to current date/time
    }
});

// Create the Customer model using the schema
const Customer = mongoose.model('Customer', customerSchema);

// Middleware Configuration
app.use(bodyParser.json());       // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files from 'public' directory

// Route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Endpoints

// POST endpoint to create a new customer
app.post('/api/customers', async (req, res) => {
    try {
        // Create new customer from request body
        const customer = new Customer(req.body);
        // Save customer to database
        await customer.save();
        // Send success response with created customer
        res.status(201).json(customer);
    } catch (error) {
        // Send error response if something goes wrong
        res.status(400).json({ error: error.message });
    }
});

// GET endpoint to retrieve all customers
app.get('/api/customers', async (req, res) => {
    try {
        // Find all customers in database
        const customers = await Customer.find();
        // Send customers as JSON response
        res.json(customers);
    } catch (error) {
        // Send error response if something goes wrong
        res.status(500).json({ error: error.message });
    }
});

// DELETE endpoint to remove a customer
app.delete('/api/customers/:id', async (req, res) => {
    try {
        // Find and delete customer by ID
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            // If customer not found, return 404 error
            return res.status(404).json({ error: 'Customer not found' });
        }
        // Send success response
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        // Send error response if something goes wrong
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;  // Use environment PORT or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 