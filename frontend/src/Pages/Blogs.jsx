import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa'; // Import thumbs-up icons
import './Blog.css'; // Import the custom CSS file

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login'; // Redirect to login if no token
          return;
        }

        const response = await axios.get('http://localhost:4000/api/blog', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBlogs(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load blogs');
      }
    };

    fetchBlogs();
  }, []);

  const handleLike = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.post(
        `http://localhost:4000/api/blog/${blogId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the blogs state with the new like count
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId
            ? { ...blog, likes: response.data.likes, likeCount: response.data.likeCount }
            : blog
        )
      );
    } catch (err) {
      setError('Failed to like/unlike the blog');
    }
  };

  // Handle comment
  const handleComment = async (blogId) => {
    if (!newComment.trim()) {
      setError("Comment text can't be empty");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:4000/api/blog/${blogId}/comments`,
        { comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update the blogs state with the new comment
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? response.data.blog : blog
        )
      );
      setNewComment('');
      setError(''); // Clear any previous error
    } catch (err) {
      setError('Failed to comment on the blog');
    }
  };

  return (
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
  );
};

export default Blogs;
