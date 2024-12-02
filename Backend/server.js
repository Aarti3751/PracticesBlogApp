const express = require('express');
const connect = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');  // Import cors

const app = express();

require('dotenv').config();

// Connect to the database
connect();

const port = process.env.PORT || 5000;  

app.use(express.json());
app.use(cors());  // Make sure to call cors() as middleware

// Use routes
app.use('/api/user', userRoutes); 
app.use('/api/blog', blogRoutes); 
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
    console.log(`We are listening on port ${port}`);
});
