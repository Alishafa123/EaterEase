import React from "react";
import "./OrderCard.scss"; // Import styles for the staff card
import {  FaTrashAlt } from "react-icons/fa";
const OrderCard = ({ user }) => {
  return (
    <div className="staff-card" style={{ width: "70%" }}>
      <img src={user.photo} alt={user.name} className="staff-photo" />
      <div className="staff-details  --flex-between">

        <div >
            <h2>{user.user}</h2>
            <p>Email: {user.email}</p>
        </div>
        
        <span className=" delete --mr">
            <FaTrashAlt
              size={20}
              color={"red"}
            />
          </span>
      </div>
    </div>
  );
};

export default OrderCard;
