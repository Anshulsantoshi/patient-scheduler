require('dotenv').config();

const express = require("express");
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const Auth = require('./routes/auth');
app.use('/api/users', Auth);

const appoit = require("./routes/appointmentsroute");
app.use('/api/appointments', appoit);

console.log('MONGODB_URI loaded:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Not loaded');

connectDB();

app.get('/', (req, res) => {
    res.send("Patient Scheduler API is running!");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});