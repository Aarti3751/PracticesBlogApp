import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Add Bootstrap for styling

const CreateBlog = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate(); // To navigate to the blogs page after successful creation

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
    
        try {
            // Add the token to the headers for authentication
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:4000/api/blog/create', // Adjust to your API endpoint
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in header for authentication
                    },
                }
            );
    
          
            console.log('Blog created:', response.data); 
            alert('Blog created successfully!');
    
            // Optionally use response data, e.g., to navigate to a new page
            navigate('/blog'); // Redirect to the list of blogs or other page
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating blog');
        }
    };
    
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">Create Blog</h2>
                        <form onSubmit={handleSubmit}>
                            {error && <p className="text-danger text-center">{error}</p>}
                            <div className="form-group mb-3">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    className="form-control"
                                    placeholder="Enter blog title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="content">Content</label>
                                <textarea
                                    name="content"
                                    id="content"
                                    className="form-control"
                                    placeholder="Enter blog content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary btn-block">
                                    Create Blog
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateBlog;
