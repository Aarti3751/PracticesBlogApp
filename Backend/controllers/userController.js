const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Blog=require('../models/blog')
const blog = require('../models/blog')

// User Registration
exports.register = async (req, res) => {
    const { name, email, password } = req.body

    console.log(name,email,password)
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully 🥳" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, name: user.name }, // Include relevant user info in token
            process.env.secret_key, // Secret key from .env file
            { expiresIn: '30d' } // Token expires in 30 days
        );

        res.status(200).json({ message: "Login successful", token, name: user.name });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // If no user found, send error
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if the user is an admin
        if (!user.isAdmin) {
            return res.status(403).json({ message: "You do not have admin privileges" });
        }

        // Generate a JWT token for the user (admin)
        const token = jwt.sign(
            { id: user._id, name: user.name, isAdmin: user.isAdmin },
            process.env.secret_key,  // Secret key for JWT, stored in your .env file
            { expiresIn: '30d' }     // Token expires in 30 days
        );

        // Send the response with the token
        res.status(200).json({
            message: "Login successful",
            token, // Send the generated token back to the client
            name: user.name // Optionally send user name
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// // Get User Profile with Blog Post Count
// exports.getProfile = async (req, res) => {
//     console.log(req.user);  // Log the user for debugging

//     try {
//         // Get user ID from the JWT token (extracted from the request header)
//         const userId = req.user.id;

//         // Find user by ID and exclude the password field
//         const user = await User.findById(userId).select('-password');
        
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Count the number of blog posts created by the user
//         const blogPostCount = await Blog.countDocuments({ author: userId });

//         // Return user details along with the blog post count
//         res.status(200).json({
//             name: user.name,
//             email: user.email,
//             blogPostCount: blogPostCount
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


exports.getProfile = async (req, res) => {
    console.log(req.user);  // Log the user for debugging

    try {
        const userId = req.user.id;

        // Fetch user details, excluding the password
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const blog=await Blog.find({ author:userId})
        // If the user is an admin, return additional admin data
        if (user.role === 'admin') {
            return res.status(200).json({
                name: user.name,
                email: user.email,
                
                blogPostCount: await Blog.countDocuments({ author: userId }), // Blog posts for admin
                blog
            });
        }

        // For regular users, return user-specific data (blog count)
        const blogPostCount = await Blog.countDocuments({ author: userId });
        res.status(200).json({
            name: user.name,
            email: user.email,
            blogPostCount: blogPostCount,
            blog
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
