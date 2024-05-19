import React from "react";
import "./AddTable.scss";

const AddTable = ({ isOpen, onClose, onSubmit, formData, handleInputChange }) => {
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <h3>Add Table</h3>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="tableNumber"
              required
              name="tableNumber"
              value={formData.tableNumber}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Capacity"
              required
              name="capacity"
              value={formData.capacity}
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

export default AddTable;