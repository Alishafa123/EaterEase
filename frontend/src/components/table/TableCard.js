import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaDownload } from "react-icons/fa";
import { selectRestaurant } from "../../redux/features/auth/authslice";
import { useDispatch ,useSelector} from "react-redux";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const TableCard = ({ table  }) => {
  const [QR_Code, setQR_Code] = useState("");
  const restaurant = useSelector(selectRestaurant);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/restaurants/get_qr_code?restaurantId=${restaurant}&tableId=${table._id}`,
          { withCredentials: true }
        );
        setQR_Code(response.data);
      } catch (error) {
        console.error('Error fetching QR code:', error);
      }
    };

    fetchQRCode();
  }, [table._id]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/restaurants/delete_table?tableId=${table._id}&restaurantId=${restaurant._id}`,
        { withCredentials: true }
      );
      console.log(response);
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  }



  return (
    <div className="staff-card" style={{ width: "70%" }}>
      {/* Set the src attribute to the base64 encoded image data */}
      <img src={`${BACKEND_URL}/api/restaurants/get_qr_code?restaurantId=${restaurant._id}&tableId=${table._id}`} alt={`QR Code for ${table.name}`} className="staff-photo" />
      <div className="staff-details --flex-between">
        <div>
          <h2>Table No: {table.tableNumber}</h2>
          <p>Capacity: {table.capacity}</p>
        </div>
        <div>
          <span className="delete --mr">
            <a  href={`${BACKEND_URL}/api/restaurants/get_qr_code?restaurantId=${restaurant._id}&tableId=${table._id}`} download alt={`QR Code for ${table.name}`}><FaDownload size={20} color={"black"} /></a>
          </span>
          <span className="delete --mr">
            <FaEdit size={20} color={"red"} />
          </span>
          <span className="delete --mr">
            <FaTrashAlt size={20} color={"red"} onClick={handleDelete}/>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TableCard;
