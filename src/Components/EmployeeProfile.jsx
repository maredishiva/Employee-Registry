import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/employee-profile.css';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:3000/employee/${id}`);
        setEmployee(data);
      } catch (error) {
        toast.error('Failed to load employee details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  if (loading) {
    return <div className="loading-container"><p>Loading employee profile...</p></div>;
  }

  if (!employee) {
    return <div className="error-container"><p>Employee not found</p></div>;
  }

  return (
    <div className="employee-profile-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Employees
      </button>

      <div className="profile-card">
        {/* Photo Section */}
        <div className="profile-photo-section">
          <img
            src={employee.photo}
            alt={employee.name}
            className="profile-photo"
          />
        </div>

        {/* Details Section */}
        <div className="profile-details">
          <h1 className="profile-name">{employee.name}</h1>
          <p className="profile-designation">{employee.designation}</p>

          <div className="details-grid">
            <div className="detail-item">
              <label>Email Address</label>
              <p className="detail-value">{employee.email}</p>
            </div>

            <div className="detail-item">
              <label>Phone Number</label>
              <p className="detail-value">{employee.phone}</p>
            </div>

            <div className="detail-item">
              <label>Date of Birth</label>
              <p className="detail-value">{employee.dob}</p>
            </div>

            <div className="detail-item">
              <label>Employee ID</label>
              <p className="detail-value">{employee.id}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="info-section">
            <h3>Contact Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">📧</span>
                <span>{employee.email}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">📱</span>
                <span>{employee.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🎂</span>
                <span>{employee.dob}</span>
              </div>
              <div className="info-item">
                <span className="info-icon">💼</span>
                <span>{employee.designation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
