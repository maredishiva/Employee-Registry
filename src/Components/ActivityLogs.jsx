import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/activity-logs.css';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [actionFilter, setActionFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:3000/activityLogs');
        // Sort by timestamp descending
        const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(sorted);
        setFilteredLogs(sorted);
      } catch (error) {
        toast.error('Failed to load activity logs');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Filter logs by action type
  useEffect(() => {
    let result = logs;

    if (actionFilter !== 'all') {
      result = logs.filter(log => log.action === actionFilter);
    }

    setFilteredLogs(result);
    setCurrentPage(1);
  }, [logs, actionFilter]);

  // Pagination
  const getTotalPages = () => Math.ceil(filteredLogs.length / itemsPerPage);

  const getPaginatedLogs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  };

  // Get action badge color
  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE':
        return 'create';
      case 'UPDATE':
        return 'update';
      case 'DELETE':
        return 'delete';
      case 'LOGIN':
        return 'login';
      case 'LOGOUT':
        return 'logout';
      default:
        return 'default';
    }
  };

  // Get action icon
  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE':
        return '➕';
      case 'UPDATE':
        return '✏️';
      case 'DELETE':
        return '🗑️';
      case 'LOGIN':
        return '🔓';
      case 'LOGOUT':
        return '🔐';
      default:
        return '📝';
    }
  };

  // Handle delete log
  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this log entry?')) return;

    try {
      await axios.delete(`http://localhost:3000/activityLogs/${logId}`);
      toast.success('Log entry deleted successfully');
      // Remove from state
      setLogs(logs.filter(log => log.id !== logId));
      setFilteredLogs(filteredLogs.filter(log => log.id !== logId));
    } catch (error) {
      toast.error('Failed to delete log entry');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="loading-container"><p>Loading activity logs...</p></div>;
  }

  return (
    <div className="logs-container">
      <h1 className="logs-title">📋 Activity Logs</h1>

      {/* Filter Section */}
      <section className="filter-section">
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="action-filter"
        >
          <option value="all">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="LOGIN">Login</option>
          <option value="LOGOUT">Logout</option>
        </select>
        <p className="log-count">{filteredLogs.length} log(s) found</p>
      </section>

      {/* Logs Table */}
      <section className="logs-section">
        {filteredLogs.length > 0 ? (
          <>
            <div className="logs-table">
              <div className="table-header">
                <div className="col-action">Action</div>
                <div className="col-user">User</div>
                <div className="col-employee">Employee</div>
                <div className="col-details">Details</div>
                <div className="col-timestamp">Timestamp</div>
                <div className="col-clear">Clear</div>
              </div>

              {getPaginatedLogs().map((log) => (
                <div key={log.id} className="table-row">
                  <div className="col-action">
                    <span className={`action-badge ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)} {log.action}
                    </span>
                  </div>
                  <div className="col-user">
                    <p className="user-email">{log.userEmail}</p>
                  </div>
                  <div className="col-employee">
                    <p>{log.employeeName || '—'}</p>
                  </div>
                  <div className="col-details">
                    <p className="details-text">{log.details}</p>
                  </div>
                  <div className="col-timestamp">
                    <p>{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="col-clear">
                    <button
                      className="delete-log-btn"
                      onClick={() => handleDeleteLog(log.id)}
                      title="Delete log entry"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredLogs.length > itemsPerPage && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {getTotalPages()}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(getTotalPages(), prev + 1))}
                  disabled={currentPage === getTotalPages()}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-logs">
            <p>No activity logs found</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ActivityLogs;
