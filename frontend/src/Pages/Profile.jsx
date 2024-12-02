import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa'; // Import the icons
import '../Pages/Profile.css';
import '../Pages/Blog.css'

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    blogPostCount: 0,
  });
  const [blogs, setBlogs] = useState([]); // Corrected to use blogs instead of blog
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState(''); // Added state for new comment

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found, please login.');
        }

        // Fetch user profile from the API
        const response = await axios.get('http://localhost:4000/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the profile data in the state
        setProfile({
          name: response.data.name,
          email: response.data.email,
          blogPostCount: response.data.blogPostCount,
        });

        setBlogs(response.data.blog); // Set the blogs in state
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLike = (blogId) => {
    // Logic to handle like functionality (placeholder)
    console.log(`Liked blog with id: ${blogId}`);
  };

  const handleComment = (blogId) => {
    // Logic to handle comment submission (placeholder)
    console.log(`Comment on blog with id: ${blogId}: ${newComment}`);
    setNewComment(''); // Clear the comment input after submission
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      <h2>{profile.role === 'admin' ? 'Admin Profile' : 'User Profile'}</h2>
      <div className="profile-details">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        {profile.role === 'admin' ? (
          <p><strong>Role:</strong> Admin</p>
        ) : (
          <p><strong>Blog Posts:</strong> {profile.blogPostCount}</p>
        )}
      </div>

      {/* Blogs Section */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Blogs</h2>
        {error && <p className="text-danger text-center">{error}</p>}

        <div className="row">
          {blogs.length === 0 ? (
            <p className="text-center">No blogs available</p>
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm blog-card">
                  {/* Blog Image (if available) */}
                  {blog.image && (
                    <img src={blog.image} alt="Blog" className="card-img-top" />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{blog.title}</h5>
                    <p className="card-text">{blog.content.slice(0, 150)}...</p>

                    {/* Author Name */}
                    <p className="card-text">
                      <small className="text-muted">By {blog.author?.name || 'Unknown'}</small>
                    </p>

                    {/* Like Button with Thumbs-Up Icon */}
                    <div className="like-button-container">
                      <button
                        onClick={() => handleLike(blog._id)}
                        className={`like-button ${blog.likes.includes(localStorage.getItem('user')) ? 'liked' : ''}`}
                      >
                        {blog.likes.includes(localStorage.getItem('user')) ? (
                          <FaThumbsUp />
                        ) : (
                          <FaRegThumbsUp />
                        )}
                        Like
                      </button>
                      <span className="like-count">{blog.likeCount} Likes</span>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-3">
                      <h6>Comments ({blog.comments.length})</h6>
                      {blog.comments.map((comment, index) => (
                        <p key={index}>
                          <strong>{comment.user?.name}: </strong>
                          {comment.comment}
                        </p>
                      ))}

                      <textarea
                        placeholder="Add a comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="form-control mb-2"
                        rows="3"
                      ></textarea>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleComment(blog._id)}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
