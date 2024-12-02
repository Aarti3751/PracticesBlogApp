// import React from 'react';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import necessary components

// // Import pages and components
// import RegisterForm from './Pages/RegisterForm'; 
// import Login from './Pages/Login';
// import Blogs from './Pages/Blogs';
// import CreateBlog from './Pages/CreateBlog';
// import AdminLogin from './Pages/AdminLogin';
// import AdminDashboard from './components/AdminDashbord'
// import BlogList from './Pages/BlogList';
// import Profile from './Pages/Profile'; // Profile page to be used for both user and admin profiles

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Register and Login routes */}
//         <Route path="/register" element={<RegisterForm />} />
//         <Route path="/login" element={<Login />} />

//         {/* Admin login and dashboard routes */}
//         <Route path="/admin/login" element={<AdminLogin />} />
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
//         {/* Admin Profile Route */}
//         <Route path="/admin/dashboard/profile" element={<Profile />} />


//         <Route path="/user/dashboard" element={<Profile />} />
//         {/* User Profile Route */}
//         <Route path="/user/dashboard/profile" element={<Profile />} />
        

//         {/* Blog and CreateBlog routes */}
//         <Route path="/blog" element={<Blogs />} />
//         <Route path="/login/create" element={<CreateBlog />} />

//         {/* Admin Blog Management Route */}
//         <Route path="/admin/dashboard/blog" element={<BlogList />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// App.js
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import necessary components

// Import pages and components
import RegisterForm from './Pages/RegisterForm'; 
import Login from './Pages/Login';
import Blogs from './Pages/Blogs';
import CreateBlog from './Pages/CreateBlog';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './components/AdminDashbord';
import BlogList from './Pages/BlogList';
import Profile from './Pages/Profile'; // Profile page to be used for both user and admin profiles
import NavigationBar from './components/NavigationBar'; // Import NavigationBar component

function App() {
  return (
    <Router>
      <NavigationBar /> {/* Add the navigation bar here */}
      <Routes>
        {/* Register and Login routes */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<Login />} />

        {/* Admin login and dashboard routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Admin Profile Route */}
        <Route path="/admin/dashboard/profile" element={<Profile />} />

        {/* User Dashboard and Profile Route */}
        <Route path="/user/dashboard" element={<Profile />} />
        <Route path="/user/dashboard/profile" element={<Profile />} />

        {/* Blog and CreateBlog routes */}
        <Route path="/blog" element={<Blogs />} />
        <Route path="/create-blog" element={<CreateBlog />} /> {/* Corrected path for CreateBlog */}

        {/* Admin Blog Management Route */}
        <Route path="/admin/dashboard/blog" element={<BlogList />} />
      </Routes>
    </Router>
  );
}

export default App;

