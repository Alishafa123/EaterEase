import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../services/authService";
import { useDispatch ,useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { SET_LOGIN, SET_NAME,selectRestaurant } from "../../redux/features/auth/authslice";
import "./Table.scss";
import Modal from "../../components/table/AddTable";
import TableCard from "../../components/table/TableCard";
import axios from "axios";



const initialState = {
  name: "",
  capacity: "",
};

const Table = ( ) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [showModal, setShowModal] = useState(false);
  const [tables, setTables] = useState([]);
  const restaurant = useSelector(selectRestaurant);
  const { tableNumber, capacity } = formData;

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/restaurants/view_tables?restaurantId=${restaurant._id}`,
        { withCredentials: true }
      );
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  const addTable = async () => {
    if (!tableNumber || !capacity) {
      return toast.error("All fields are required");
    }
  
    setIsLoading(true);
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api/restaurants/add_table?restaurantId=${restaurant._id}`,
        formData,
        { withCredentials: true }
      );
      toast.success("Table added successfully");
      setIsLoading(false);
      closeModal();
  
      // Fetch updated tables after adding a new table
      fetchTables(); // This will update the tables state with the latest data
    } catch (error) {
      setIsLoading(false);
      toast.error("Error adding table");
    }
  };
  
  return (
    <div>
      <div className="--flex-center --mt">
        <h3>Tables</h3>
      </div>
      <button
        className="--btn --btn-primary --mt  "
        style={{ width: "18rem" }}
        onClick={openModal}
      >
        Add Table
      </button>

      <div className="viewStaff"></div>
      <Modal
        className="Modal"
        isOpen={showModal} // Pass isOpen prop to indicate whether the modal should be open or not
        onClose={closeModal}
        onSubmit={addTable}
        formData={formData}
        handleInputChange={handleInputChange}
      />
      <div className="--flex-center" style={{ width: "100%" }}>
        <div className="staff-list --mt --flex-dir-column --justify-center --width-100">
          {/* Each Table Render */}
          {tables.map((table, index) => (
            <div key={index} className="--width-100  --flex-center">
              <TableCard table={table} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
