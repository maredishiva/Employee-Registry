// Auth utility functions for user authentication and authorization

const API_BASE = 'http://localhost:3000';

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @param {string} role - User role (admin/employee)
 * @param {string} photo - User photo (base64 or URL)
 * @returns {Promise<object>} - Response from server
 */
export const registerUser = async (email, password, name, role = 'employee', photo = '') => {
  try {
    // Check if email already exists
    const usersResponse = await fetch(`${API_BASE}/users?email=${email}`);
    const existingUsers = await usersResponse.json();
    
    if (existingUsers.length > 0) {
      throw new Error('Email already registered');
    }

    // Validate inputs
    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Create new user
    const newUser = {
      id: 'u' + Date.now(),
      email,
      passwordHash: password, // In production, use bcrypt
      name,
      role,
      photo: photo || getDefaultAvatar(name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    if (!response.ok) throw new Error('Registration failed');
    
    const user = await response.json();
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} - User data if successful
 */
export const loginUser = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password required');
    }

    const response = await fetch(`${API_BASE}/users?email=${email}`);
    const users = await response.json();

    if (users.length === 0) {
      throw new Error('User not found');
    }

    const user = users[0];
    
    // Simple password check (in production, use bcrypt)
    if (user.passwordHash !== password) {
      throw new Error('Invalid password');
    }

    // Save to localStorage
    const authData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        photo: user.photo
      },
      token: btoa(`${user.email}:${user.id}`), // Simple token
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('authUser', JSON.stringify(authData));

    // Log the activity
    await logActivity(user.id, user.email, 'LOGIN', null, 'User logged in');

    return { success: true, user: authData.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  const authUser = getAuthUser();
  if (authUser) {
    logActivity(authUser.id, authUser.email, 'LOGOUT', null, 'User logged out');
  }
  localStorage.removeItem('authUser');
};

/**
 * Get current authenticated user
 * @returns {object|null} - Current user or null
 */
export const getAuthUser = () => {
  try {
    const authData = localStorage.getItem('authUser');
    return authData ? JSON.parse(authData).user : null;
  } catch (error) {
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getAuthUser();
};

/**
 * Check if user is admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  const user = getAuthUser();
  return user && user.role === 'admin';
};

/**
 * Check if user has permission
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (permission) => {
  const user = getAuthUser();
  if (!user) return false;

  const permissions = {
    admin: ['create_employee', 'read_employee', 'update_employee', 'delete_employee', 'view_dashboard', 'view_logs'],
    employee: ['read_employee']
  };

  const userPermissions = permissions[user.role] || [];
  return userPermissions.includes(permission);
};

/**
 * Get authentication token
 * @returns {string|null}
 */
export const getAuthToken = () => {
  try {
    const authData = localStorage.getItem('authUser');
    return authData ? JSON.parse(authData).token : null;
  } catch (error) {
    return null;
  }
};

/**
 * Log user activity
 * @param {string} userId - User ID
 * @param {string} userEmail - User email
 * @param {string} action - Action type (CREATE, UPDATE, DELETE, LOGIN, LOGOUT)
 * @param {string} employeeId - Employee ID (optional)
 * @param {string} details - Activity details
 */
export const logActivity = async (userId, userEmail, action, employeeId = null, details = '') => {
  try {
    const activityLog = {
      id: 'log' + Date.now(),
      userId,
      userEmail,
      action,
      employeeId,
      employeeName: '',
      timestamp: new Date().toISOString(),
      details
    };

    // Get employee name if employeeId is provided
    if (employeeId) {
      try {
        const response = await fetch(`${API_BASE}/employee/${employeeId}`);
        if (response.ok) {
          const employee = await response.json();
          activityLog.employeeName = employee.name;
        }
      } catch (err) {
        // Employee not found, continue without name
      }
    }

    await fetch(`${API_BASE}/activityLogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityLog)
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

/**
 * Generate a default avatar based on user name
 * @param {string} name - User name
 * @returns {string} - SVG avatar as data URI
 */
export const getDefaultAvatar = (name) => {
  const initial = name.charAt(0).toUpperCase();
  const colors = ['#4F46E5', '#2587F9', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6'];
  const color = colors[name.length % colors.length];

  const svg = `
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${color}"/>
      <text x="50" y="50" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dy=".3em">
        ${initial}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>}
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updates,
        updatedAt: new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error('Update failed');

    const user = await response.json();
    
    // Update localStorage
    const authData = localStorage.getItem('authUser');
    if (authData) {
      const parsed = JSON.parse(authData);
      parsed.user = { ...parsed.user, ...updates };
      localStorage.setItem('authUser', JSON.stringify(parsed));
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
