import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing icons
import '../Pages/Admin.css'; // Assuming some custom styling for the dashboard

const AdminDashboard = () => {
  const [adminName, setAdminName] = useState('');
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '', email: '' });
  const [currentBlog, setCurrentBlog] = useState({ title: '', content: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdminName = localStorage.getItem('adminName');
    const token = localStorage.getItem('token');
    
    if (storedAdminName) {
      setAdminName(storedAdminName);
    } else {
      navigate('/admin/login');
    }

    if (token) {
      fetchUsers(token);
      fetchBlogs(token);
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch users and blogs
  const fetchUsers = async (token) => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users');
    }
  };

  const fetchBlogs = async (token) => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/blog', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };

  // Handle user and blog editing
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowUserModal(true);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4000/api/admin/user/${currentUser._id}`,
        currentUser,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setUsers(users.map((user) => (user._id === currentUser._id ? response.data : user)));
      setShowUserModal(false);
    } catch (error) {
      console.error('Error updating user');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user');
    }
  };

  // Handle blog editing
  const handleEditBlog = (blog) => {
    setCurrentBlog(blog);
    setShowBlogModal(true);
  };

  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4000/api/admin/blog/${currentBlog._id}`,
        currentBlog,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setBlogs(blogs.map((blog) => (blog._id === currentBlog._id ? response.data : blog)));
      setShowBlogModal(false);
    } catch (error) {
      console.error('Error updating blog');
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/blog/${blogId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error('Error deleting blog');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2 className="sidebar-title text-white">Admin</h2>
        <ul className="sidebar-nav">
          <li><a href="/admin/dashboard" className="sidebar-item">Users</a></li>
          <li><a href="/admin/dashboard/blog" className="sidebar-item">Blogs</a></li>
          <li><a href="/admin/dashboard/profile" className="sidebar-item">Profile</a></li>
          <li><Button onClick={handleLogout} className="sidebar-item logout-btn">Logout</Button></li>
        </ul>
      </div>

      <div className="main-content">
        <div className="topbar">
          <span className="welcome-text">Welcome, {adminName}</span>
        </div>

        <div className="content-body">
          <h1 className="dashboard-title">User Management</h1>

          {/* Users Table */}
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="actions">
                        <Button variant="warning" onClick={() => handleEditUser(user)}><FaEdit /></Button>
                        <Button variant="danger" onClick={() => deleteUser(user._id)}><FaTrashAlt /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals for editing user and blog */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitUser}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentUser.name}
                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentUser.email}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showBlogModal} onHide={() => setShowBlogModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitBlog}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentBlog.title}
                onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content"
                value={currentBlog.content}
                onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
