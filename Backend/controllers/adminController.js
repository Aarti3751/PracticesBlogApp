// const User = require('../models/user');


// exports.getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find(); 

//         res.status(200).json(users);  
//     } catch (error) {
//         res.status(500).json({ message: error.message });  // Catch and send error if occurs
//     }
// };

// exports.getUserDetails = async (req, res) => {
//     try {
        
//         const {id} = req.params;  // Get the user ID from the request params

//         // Find user by ID
//         const user = await User.findById(id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });  // User not found
//         }

//         res.status(200).json(user);  // Send user details
//     } catch (error) {
//         res.status(500).json({ message: error.message });  // Catch and send error if occurs
//     }
// };


// exports.getUserUpdate = async (req, res) => {
//     try {
//         const {id} = req.params;  // Get the user ID from the request params
//         const {name,email,password} = req.body;  // Get the fields to update from the request body

//         // Find and update the user by ID, and return the updated user
//         const user = await User.findByIdAndUpdate(id, {name,email,password}, { new: true });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json(user);  // Return the updated user
//     } catch (error) {
//         res.status(500).json({ message: error.message });  // Handle server error
//     }
// };

// // Delete user by ID
// exports.getUserDelete = async (req, res) => {
//     try {
//         const { id } = req.params;  // Get the user ID from the request params

//         // Find and delete the user by ID
//         const user = await User.findByIdAndDelete(id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });  // User not found
//         }

//         res.status(200).json({ message: 'User deleted successfully' });  // Confirm successful deletion
//     } catch (error) {
//         res.status(500).json({ message: error.message });  // Handle server error
//     }
// };



const User = require('../models/user');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user details by ID
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user by ID
exports.getUserUpdate = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user by ID
exports.getUserDelete = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
