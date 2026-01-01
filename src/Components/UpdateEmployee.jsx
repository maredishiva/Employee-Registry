import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../styles/update-employee.css";
import "../styles/alerts.css";

const UpdateEmployee = () => {
  const navigator = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      dob: "",
      designation: "",
      photo: "",
    },
    onSubmit: async (details, { resetForm }) => {
      try {
        await axios.put(`http://localhost:3000/employee/${id}`, details);
        resetForm();
        setMessage("Updated employee details successfully");
        window.alert("Updated employee details successfully");
        navigator("/");
      } catch (error) {
        setMessage("Failed to update employee");
        console.error(error);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        formik.setFieldValue("photo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchData = async () => {
    const { data } = await axios.get(`http://localhost:3000/employee/${id}`);
    formik.setValues(data);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const { name, email, phone, dob, designation, photo } = formik.values;
  const { handleChange, handleSubmit } = formik;

  const photoPreview =
    photo ||
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="update-container">
      <div className="update-card">
        <div className="update-header">
          <div>
            <p className="eyebrow">Edit Profile</p>
            <h1>Update Employee</h1>
            <p className="subtext">Refresh contact, role, and profile photo.</p>
          </div>
          <div className="avatar-preview">
            <img src={photoPreview} alt={name || "Employee"} />
          </div>
        </div>

        {message && <div className="inline-alert">{message}</div>}

        <form onSubmit={handleSubmit} className="update-form">
          <div className="form-grid">
            <label className="field">
              <span>Full Name</span>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span>Designation</span>
              <input
                type="text"
                name="designation"
                placeholder="Enter job title"
                value={designation}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span>Email Address</span>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span>Phone Number</span>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span>Date of Birth</span>
              <input
                type="date"
                name="dob"
                value={dob}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field file-field">
              <span>Profile Photo</span>
              <div className="file-input">
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <div className="file-hint">PNG, JPG up to 2MB</div>
              </div>
            </label>
          </div>

          <div className="actions">
            <button type="button" className="ghost-btn" onClick={() => navigator("/")}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEmployee;