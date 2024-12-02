const jwt = require('jsonwebtoken');
const User = require('../models/user');  // Adjust if the path is different

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from Authorization header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.secret_key);

            // Get user from the database and attach to the request object
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                // Send response and return to stop execution further down
                return res.status(401).json({ message: 'User not found' });
            }

            // Proceed to the next middleware/route handler
            next(); 
        } catch (error) {
            // Check if the error is due to token expiration or failure
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired, please log in again' });
            }
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        // Token is missing
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};



// Middleware to check if the user is an admin
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();  // User is admin, proceed
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });  // Forbidden if not an admin
    }
};

module.exports = { protect, admin };
