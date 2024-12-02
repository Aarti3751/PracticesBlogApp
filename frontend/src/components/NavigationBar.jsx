import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation to determine the current route
import { useNavigate } from 'react-router-dom';
import './NavigationBar.css'; // Import the custom CSS

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current location (URL)

  const token = localStorage.getItem('token'); // Check if the user is logged in

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container fluid> {/* Make navbar full width with fluid container */}
        <Navbar.Brand as={Link} to="/" className="navbar-brand">BlogApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto"> {/* Align the links to the right */}
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Home</Nav.Link>
            <Nav.Link as={Link} to="/register" active={location.pathname === '/register'}>Register</Nav.Link>

            {/* Dropdown for Login if not logged in */}
            {!token && (
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-login" className="dropdown-login">
                  Login
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/login">User Login</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/login">Admin Login</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

            {/* Only show Create Blog if user is logged in */}
            {token && (
              <Nav.Link as={Link} to="/create-blog" active={location.pathname === '/create-blog'} className="create-blog">
                Create Blog
              </Nav.Link>
            )}

            {/* Show logout button if logged in */}
            {token && (
              <Nav.Link onClick={handleLogout} className="logout-link">Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
