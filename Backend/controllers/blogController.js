const Blog = require('../models/blog');

// Get all blogs
exports.getBlog = async (req, res) => {
    try {
      const blogs = await Blog.find()
        .populate('author', 'name -_id')   // Populate author details without _id
        .populate('likes', 'name -_id')    // Populate liked users without _id
        .populate('comments.user', 'name -_id');  // Populate commenters' user names without _id
  
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Get blogs for a specific user
exports.getUserBlog = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.params.id }).populate('author', 'name -_id');
        if (!blogs.length) return res.status(404).json({ message: "No blogs found for this user" });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new blog post
exports.create = async (req, res) => {
    const { title, content } = req.body;
    try {
        const blog = await Blog.create({ title, content, author: req.user.id });
        const populatedBlog = await Blog.findById(blog._id).populate('author', 'name _id');
        res.status(200).json({ message: "Blog created successfully", blog: populatedBlog });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Like or Unlike a blog post
exports.likeBlog = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
  
      const userId = req.user.id;  // Assuming user ID is available in req.user (via middleware)
      const alreadyLiked = blog.likes.includes(userId);
  
      // Toggle like status
      if (alreadyLiked) {
        blog.likes = blog.likes.filter(like => like.toString() !== userId);
      } else {
        blog.likes.push(userId);
      }
  
      // Update like count
      blog.likeCount = blog.likes.length;
  
      await blog.save();
      res.status(200).json({
        message: alreadyLiked ? 'Blog unliked' : 'Blog liked',
        likes: blog.likes,
        likeCount: blog.likeCount
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
    
  
  
// Create a comment on a blog
exports.commentBlog = async (req, res) => {
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ message: "Comment text is required" });
  
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: "Blog not found" });
  
      // Push comment with user info
      blog.comments.push({ user: req.user.id, comment });
      await blog.save();
  
      const updatedBlog = await Blog.findById(req.params.id)
        .populate('comments.user', 'name')  // Populating user name of commenter
        .populate('author', 'name'); // Populating author's name
  
      res.status(201).json({ message: "Comment added", blog: updatedBlog });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Delete a blog (only the admin or the owner can delete a blog)
exports.deleteBlog = async (req, res) => {
    console.log(req.params.id)
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // Check if the logged-in user is the blog author or an admin
        if (blog.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this blog" });
        }

        // Proceed with deletion
        await Blog.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all blogs for the admin
exports.adminGetAllBlogs = async (req, res) => {
    try {
        // Only admins can access this route
        const blogs = await Blog.find()
            .populate('author', 'name -_id') // Populate author without _id
            .populate('likes', 'name -_id')  // Populate liked users without _id
            .populate('comments.user', 'name -_id');  // Populate commenters' user names without _id

        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a blog post (admin or owner)
exports.updateBlog = async (req, res) => {
    const { title, content } = req.body;

    try {
        // Find the blog post by ID
        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // Check if the user is the owner or admin
        if (blog.author.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to update this blog" });
        }

        // Update the blog post with new data
        blog.title = title || blog.title;
        blog.content = content || blog.content;

        await blog.save();

        // Return the updated blog
        const updatedBlog = await Blog.findById(blog._id)
            .populate('author', 'name _id')
            .populate('likes', 'name -_id')
            .populate('comments.user', 'name -_id');

        res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
