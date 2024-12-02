import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/admin/user/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(response.data);
      } catch (error) {
        setError('Error fetching user details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!user.name || !user.email) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4000/api/admin/user/${id}`, user, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate('/admin/dashbord'); // Redirect to dashboard on success
    } catch (error) {
      setError('Error updating user.');
      console.error(error);
    }
  };

  // Loading state while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Edit User</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="Enter user name"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Enter user email"
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditUser;
