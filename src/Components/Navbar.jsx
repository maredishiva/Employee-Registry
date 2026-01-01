import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getAuthUser, logoutUser, isAdmin } from '../utils/authUtils';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [mobileSearch, setMobileSearch] = useState('');
  
  const initials = authUser?.name
    ? authUser.name
        .trim()
        .split(/\s+/)
        .map(part => part[0]?.toUpperCase())
        .filter(Boolean)
        .slice(0, 2)
        .join('')
    : 'U';

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
    setIsMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking a link
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle mobile search
  const handleMobileSearch = (e) => {
    const value = e.target.value;
    setMobileSearch(value);
    
    // Update URL with search param
    if (window.location.pathname === '/') {
      const params = new URLSearchParams(window.location.search);
      if (value.trim()) {
        params.set('search', value.trim());
      } else {
        params.delete('search');
      }
      navigate(`/?${params.toString()}`, { replace: true });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">📋</span>
          Employee Registry
        </Link>

        {/* Mobile Search Bar - Only visible on mobile */}
        {authUser && (
          <div className="navbar-search-mobile">
            <input
              type="text"
              placeholder="Search employees..."
              value={mobileSearch}
              onChange={handleMobileSearch}
              className="search-input-mobile"
            />
          </div>
        )}

        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="theme-toggle"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {authUser ? (
            <>
              {/* Admin-only links */}
              {isAdmin() && (
                <>
                  <Link to="/" className="nav-link" onClick={closeMenu}>Employees</Link>
                  <Link to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
                  <Link to="/logs" className="nav-link" onClick={closeMenu}>Activity Logs</Link>
                </>
              )}
              {!isAdmin() && (
                <Link to="/" className="nav-link" onClick={closeMenu}>Employees</Link>
              )}

              {/* User Profile Section */}
              <div className="user-profile">
                <div className="user-avatar">
                  {authUser.photo ? (
                    <img
                      src={authUser.photo}
                      alt={authUser.name}
                    />
                  ) : (
                    <span className="avatar-fallback">{initials}</span>
                  )}
                </div>
                <div className="user-info">
                  <span className="user-name">{authUser.name}</span>
                  <span className="user-role">{authUser.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-logout"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
