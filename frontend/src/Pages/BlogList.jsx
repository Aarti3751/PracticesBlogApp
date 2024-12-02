import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons from react-icons
import './BlogList.css'; // Import the custom CSS file

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({ title: '', content: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/blog/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBlogs(response.data);
    } catch (err) {
      setError('Failed to fetch blogs');
    }
  };

  // Handle delete blog
  const handleDeleteBlog = async (blogId) => {
    try {
      await axios.delete(`http://localhost:4000/api/blog/delete/${blogId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (err) {
      setError('Failed to delete blog');
    }
  };

  // Handle edit blog
  const handleEditBlog = (blog) => {
    setCurrentBlog(blog);
    setShowModal(true);
  };

  // Handle modal submit for editing blog
  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4000/api/blog/${currentBlog._id}`,
        currentBlog,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setBlogs(blogs.map(blog => (blog._id === currentBlog._id ? response.data : blog)));
      setShowModal(false);
    } catch (err) {
      setError('Failed to update blog');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Blog List</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length === 0 ? (
            <tr><td colSpan="2">No blogs available</td></tr>
          ) : (
            blogs.map((blog) => (
              <tr key={blog._id}>
                <td>{blog.title}</td>
                <td>
                  <div className="d-flex justify-content-start gap-2"> {/* Flex row with gap */}
                    <Button 
                      onClick={() => handleEditBlog(blog)} 
                      className="btn btn-primary btn-sm d-flex align-items-center"
                    >
                      <FaEdit className="mr-2" /> {/* Edit Icon */}
                      Edit
                    </Button>
                    <Button 
                      onClick={() => handleDeleteBlog(blog._id)} 
                      className="btn btn-danger btn-sm d-flex align-items-center"
                    >
                      <FaTrash className="mr-2" /> {/* Delete Icon */}
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Blog Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitBlog}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={currentBlog.title}
                onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentBlog.content}
                onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
              />
            </Form.Group>

            <Button variant="primary" type="submit">Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BlogList;
