import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/authUtils';
import '../styles/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    photo: ''
  });
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const initials = formData.name
    ? formData.name
        .trim()
        .split(/\s+/)
        .map(part => part[0]?.toUpperCase())
        .filter(Boolean)
        .slice(0, 2)
        .join('')
    : 'U';

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file upload for photo
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setFormMessage('Please choose an image under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setFormData(prev => ({ ...prev, photo: base64 }));
        setPhotoPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form data
  const validateForm = () => {
    const { name, email, password, confirmPassword, role } = formData;

    if (!name.trim()) {
      setFormMessage('Name is required');
      return false;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormMessage('Valid email is required');
      return false;
    }

    if (!password || password.length < 6) {
      setFormMessage('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setFormMessage('Passwords do not match');
      return false;
    }

    if (!['admin', 'employee'].includes(role)) {
      setFormMessage('Invalid role selected');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormMessage('');

    setLoading(true);
    const result = await registerUser(
      formData.email,
      formData.password,
      formData.name,
      formData.role,
      formData.photo
    );

    setLoading(false);

    if (result.success) {
      setFormMessage('Registration successful! Redirecting to login...');
      window.alert('Registration successful!');
      navigate('/login');
    } else {
      setFormMessage(result.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box register-box">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Add your details, set a profile photo, and choose your role.</p>
        </div>

        {formMessage && <div className="auth-inline-message">{formMessage}</div>}

        <div className="register-layout">
          <div className="profile-pane">
            <div className="profile-preview">
              {photoPreview ? (
                <img src={photoPreview} alt="preview" className="photo-preview" />
              ) : (
                <div className="avatar-fallback">{initials}</div>
              )}
              <label htmlFor="photo" className="photo-cta">
                Upload photo
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="photo-input-hidden"
                />
              </label>
            </div>
            <p className="photo-hint">Square images look best. Keep it under 2MB with a clear headshot.</p>
            <ul className="profile-tips">
              <li>Good lighting and a plain background help.</li>
              <li>Centered framing keeps your avatar crisp.</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="auth-form register-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password (min 6 characters)"
                    className="form-input"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-pressed={showPassword}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="password-field">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="form-input"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    aria-pressed={showConfirmPassword}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="role" className="form-label">Select Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                  disabled={loading}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </div>
          </form>
        </div>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
