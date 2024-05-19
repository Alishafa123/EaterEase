import React from "react";
import "./AddStaff.scss";

const AddStaff = ({ isOpen, onClose, onSubmit, formData, handleInputChange }) => {
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h3>Add Staff Member</h3>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Name"
              required
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <div className="modal-buttons">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddStaff;
