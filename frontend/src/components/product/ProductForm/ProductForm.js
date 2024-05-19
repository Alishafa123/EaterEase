import React ,{useState,useEffect}from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Card from "../../card/Card";
import axios from "axios";

import "./ProductForm.scss";
import Modal from "../addCategory/Add.js";


// const handleInputChange = (e) => {
//   const { name, value } = e.target;
//   setformData({ ...formData, [name]: value });
// };

// const openModal = () => {
//   setShowModal(true);
// };

// const closeModal = () => {
//   setShowModal(false);
// };

export const BACKEND_URL = "http://localhost:5000";
const ProductForm = ({
  product,
  productImage,
  imagePreview,
  ingredients,
  handleIngredientsChange,
  handleInputChange,
  handleImageChange,
  saveProduct,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/category/getCategories`);
      return response.data; // Assuming the server sends back the list of categories directly
    } catch (error) {
      // Properly handle error scenarios, extracting message based on the error response structure
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to fetch categories");
      }
    }
  };
  useEffect(() => {
    setLoading(true);
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories: {error}</p>;
  return (
    <div className="add-product">
      <Card cardClass={"card"}>
        <form onSubmit={saveProduct}>
          <Card cardClass={"group"}>
            <label>Item Image</label>
            <code className="--color-dark">
              Supported Formats: jpg, jpeg, png
            </code>
            <input
              type="file"
              name="image"
              onChange={(e) => handleImageChange(e)}
            />

            {imagePreview != null ? (
              <div className="image-preview">
                <img src={imagePreview} alt="product" />
              </div>
            ) : (
              <p>No image set for this poduct.</p>
            )}
          </Card>
          <label>Item Name:</label>
          <input
            type="text"
            placeholder="Item name"
            name="name"
            value={product?.name}
            onChange={handleInputChange}
          />

          <label>Item Category:</label>
          <select
          name="category"
          value={product.category}
          onChange={handleInputChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.title}</option>
          ))}
        </select>
          
           {/* <Modal className="Modal"
                isOpen={showModal} // Pass isOpen prop to indicate whether the modal should be open or not
                onClose={closeModal}
                onSubmit={addCategory}
                formData={formData}
                handleInputChange={handleInputChange}
            /> */}
          <label>Item Price:</label>
          <input
            type="text"
            placeholder="Item Price"
            name="price"
            value={product?.price}
            onChange={handleInputChange}
          />
           <label>Item Description:</label>
          <input
            type="text"
            placeholder="Item Description"
            name="description"
            value={product?.description}
            onChange={handleInputChange}
          />

          {/* <label>Product Quantity:</label>
          <input
            type="text"
            placeholder="Product Quantity"
            name="quantity"
            value={product?.quantity}
            onChange={handleInputChange}
          /> */}


          <label>Item Ingredients:</label>
          <textarea
            
            placeholder=""
            name="ingredients"
            value={product?.ingredients}
            onChange={handleInputChange} 
          />

          <div className="--my">
            <button type="submit" className="--btn --btn-primary">
              Save Product
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};


export default ProductForm;