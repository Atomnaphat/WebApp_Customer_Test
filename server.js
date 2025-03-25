const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

/**
 * Express application setup
 * PORT 400 for web server
 */
const app = express();
const PORT = process.env.PORT || 400;

/**
 * Middleware Configuration
 * - cors: Enable Cross-Origin Resource Sharing
 * - bodyParser: Parse JSON and URL-encoded bodies
 * - static: Serve static files from 'public' directory
 */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

/**
 * MongoDB Connection Setup
 * Database running on default port 27017
 */
mongoose.connect('mongodb://localhost:27017/customerDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

/**
 * Customer Schema Definition
 * Defines the structure of customer documents in MongoDB
 */
const customerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    phone: String,
    address: String,
    createdAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', customerSchema);

/**
 * API Routes
 */

// Create new customer
app.post('/api/customers', async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete customer by ID
app.delete('/api/customers/:id', async (req, res) => {
    try {
        const result = await Customer.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Start the server
 */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 