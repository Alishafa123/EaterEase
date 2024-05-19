import axios from "axios";
import { toast } from "react-toastify";

export const BACKEND_URL = "http://localhost:5000";

export const addMenuItem = async (formData) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/restaurants/add_menu_item`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
  
      if (response.status === 200) {
        toast.success("Menu item added successfully");
      }
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      console.log("Item ADDEDDD");
      throw new Error(message);
    }
  };

  export const fetchMenuDetails = async (restaurantId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/restaurants/view_menu_details?restaurantId=${restaurantId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || error.message || "Failed to fetch menu details");
    }
  };

  export const getRestaurantDetails = async (restaurantId) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/restaurants/view_details`, { restaurantId });
      return response.data.restaurant;
    } catch (error) {
      console.error('Failed to fetch restaurant details:', error);
      return null;
    }
  };
  
