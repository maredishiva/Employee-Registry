import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/view-employee.css";

const ViewEmployee = () => {
  const [employee, setEmployee] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/employee/${id}`);
        setEmployee(data);
      } catch (error) {
        console.error("Failed to fetch employee", error);
      }
    };

    fetchData();
  }, [id]);

  if (!employee) {
    return (
      <div className="view-container">
        <div className="view-loading">Loading employee...</div>
      </div>
    );
  }

  const photoSrc =
    employee.photo ||
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="view-container">
      <article className="view-card">
        <div className="view-card-actions">
          <button className="back-btn" onClick={() => navigate('/')}>Back to Employees</button>
        </div>
        <div className="view-hero">
          <div className="avatar-wrapper">
            <div className="avatar-ring">
              <img src={photoSrc} alt={employee.name} />
            </div>
          </div>
          <div className="hero-text">
            <p className="eyebrow">Employee Profile</p>
            <h1>{employee.name}</h1>
            <p className="designation">{employee.designation}</p>
          </div>
        </div>

        <div className="info-section">
          <h4>Details</h4>
          <div className="info-grid">
            <div className="info-row">
              <span className="label">Phone</span>
              <span className="value">{employee.phone || "—"}</span>
            </div>
            <div className="info-row">
              <span className="label">Email</span>
              <span className="value">{employee.email || "—"}</span>
            </div>
            <div className="info-row">
              <span className="label">Date of Birth</span>
              <span className="value">{employee.dob || "—"}</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ViewEmployee;