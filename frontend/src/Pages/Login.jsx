// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css'; 
// import '../Pages/Register.css';

// const Login = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(''); 

//         try {
//             const response = await axios.post('http://localhost:4000/api/user/login', formData);

//             // Log the response data to check what is returned
//             console.log('Login Response:', response.data);

//             // Store the user name and token in localStorage
//             localStorage.setItem('user', response.data.name);
//             localStorage.setItem('token', response.data.token);

//             alert('Login successful!');
//             navigate('/blog');  // Navigate to profile page after successful login
//         } catch (err) {
//             // Handle login failure
//             setError(err.response?.data?.message || 'Login failed');
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <div className="row justify-content-center">
//                 <div className="col-md-6">
//                     <div className="card shadow p-4">
//                         <h2 className="text-center mb-4">Login</h2>
//                         <form onSubmit={handleSubmit}>
//                              {error && <p className="text-danger text-center">{error}</p>}
//                             <div className="form-group mb-3">
//                                 <label htmlFor="email">Email</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     id="email"
//                                     className="form-control"
//                                     placeholder="Enter your email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group mb-3">
//                                 <label htmlFor="password">Password</label>
//                                 <input
//                                     type="password"
//                                     name="password"
//                                     id="password"
//                                     className="form-control"
//                                     placeholder="Enter your password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
                           
//                             <div className="text-center">
//                                 <button type="submit" className="btn btn-primary btn-block">
//                                     Login
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;



import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../Pages/Register.css';

const Login = () => {
  const { login } = useContext(AuthContext); // Get login function from context
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/api/user/login', formData);

      // Log the response data to check what is returned
      console.log('Login Response:', response.data);

      // Store the user name and token in localStorage
      localStorage.setItem('user', response.data.name);
      localStorage.setItem('token', response.data.token);

      login({ name: response.data.name, token: response.data.token }); // Use login from context

      alert('Login successful!');
      navigate('/blog');  // Navigate to profile page after successful login
    } catch (err) {
      // Handle login failure
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              {error && <p className="text-danger text-center">{error}</p>}
              <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary btn-block">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

