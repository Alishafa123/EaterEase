import axios from "axios";
import { toast } from "react-toastify";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `http://localhost:5000/api/products/`;

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `${BACKEND_URL}/api/products/${productId}`,
      {
        withCredentials: true 
      }
    );

    if (response.status === 200) {
      toast.success("Product deleted successfully");
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
    throw new Error(message);
  }
};


const createProduct = async (formData) => {
  const response = await axios.post(API_URL, formData);
  return response.data;
};

// Get all products
const getProducts = async () => {
  const response = await axios.get(API_URL);
  console.log(response.data);
  return response.data;
};

// Delete a Product
const deletesProduct = async (id) => {
  const response = await axios.delete(API_URL + id);
  return response.data;
};
// Get a Product
const getProduct = async (id) => {
  console.log(API_URL + id);
  const response = await axios.get(API_URL + id);
  console.log(response.data);
  return response.data;
};
// Update Product
const updateProduct = async (id, formData) => {
  const response = await axios.patch(`${API_URL}${id}`, formData);
  return response.data;
};

const productService = {
  createProduct,
  getProducts,
  getProduct,
  deletesProduct,
  updateProduct,
};

export default productService;