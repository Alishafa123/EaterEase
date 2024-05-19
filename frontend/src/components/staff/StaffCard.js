import React from "react";
import "./StaffCard.scss"; // Import styles for the staff card
import {  FaTrashAlt } from "react-icons/fa";
import bot from "../../assets/bot.png";

const StaffCard = ({ restaurantId , user }) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  console.log(user);
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/restaurants/delete_staff?staffId=${user._id}&restaurantId=${restaurantId}`, 
        { 
          method: 'DELETE',
          credentials: 'include', // Ensure cookies are included with the request
          headers: {
            'Content-Type': 'application/json',
            // You don't manually set the token here since it's automatically included with cookies
          },
        }
      );
  
      if (response.ok) {
        console.log("Staff member deleted successfully");
        // Optionally, trigger a UI update or redirect
      } else {
        console.error("Failed to delete staff member");
      }
    } catch (error) {
      console.error("Error deleting staff member:", error);
    }
  };
  return (
    <div className="staff-card" style={{ width: "70%" }}>
      <img src={bot}  alt="staffPhoto" className="staff-photo" />
      <div className="staff-details  --flex-between">

        <div >
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
        </div>
        
        <span className=" delete --mr">
            <FaTrashAlt
              size={20}
              color={"red"}
              onClick={handleDelete}
            />
          </span>
      </div>
    </div>
  );
};

export default StaffCard;