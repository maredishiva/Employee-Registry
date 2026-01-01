import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    byDesignation: {},
    recentAdditions: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: employees } = await axios.get('http://localhost:3000/employee');
        const { data: logs } = await axios.get('http://localhost:3000/activityLogs');

        // Calculate statistics
        const byDesignation = {};
        employees.forEach(emp => {
          byDesignation[emp.designation] = (byDesignation[emp.designation] || 0) + 1;
        });

        // Get recent additions
        const createLogs = logs
          .filter(log => log.action === 'CREATE')
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 5);

        setStats({
          totalEmployees: employees.length,
          byDesignation,
          recentAdditions: createLogs
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-container"><p>Loading dashboard...</p></div>;
  }

  const handleDesignationClick = (designation) => {
    navigate(`/?designation=${encodeURIComponent(designation)}`);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Admin Dashboard</h1>

      {/* Stats Cards */}
      <section className="stats-section">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Employees</h3>
            <p className="stat-number">{stats.totalEmployees}</p>
          </div>
        </div>

        <div className="stat-card designations">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <h3>Total Designations</h3>
            <p className="stat-number">{Object.keys(stats.byDesignation).length}</p>
          </div>
        </div>
      </section>

      {/* Designation Breakdown */}
      <section className="breakdown-section">
        <h2>Employees by Designation</h2>
        <div className="designation-grid">
          {Object.entries(stats.byDesignation).map(([designation, count]) => (
            <button
              type="button"
              key={designation}
              className="designation-card"
              onClick={() => handleDesignationClick(designation)}
            >
              <h4>{designation}</h4>
              <p className="count">{count}</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(count / stats.totalEmployees) * 100}%`
                  }}
                ></div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Additions */}
      {stats.recentAdditions.length > 0 && (
        <section className="recent-section">
          <h2>Recently Added Employees</h2>
          <div className="recent-list">
            {stats.recentAdditions.map((log) => (
              <div key={log.id} className="recent-item">
                <div className="recent-info">
                  <h4>{log.employeeName || 'N/A'}</h4>
                  <p>Added on {new Date(log.timestamp).toLocaleDateString()}</p>
                  <p className="by-text">by {log.userEmail}</p>
                </div>
                <span className="action-badge">Added</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Summary Stats */}
      <section className="summary-section">
        <h2>Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="label">Active Employees</span>
            <span className="value">{stats.totalEmployees}</span>
          </div>
          <div className="summary-item">
            <span className="label">Department Count</span>
            <span className="value">{Object.keys(stats.byDesignation).length}</span>
          </div>
          <div className="summary-item">
            <span className="label">Recent Changes</span>
            <span className="value">{stats.recentAdditions.length}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
