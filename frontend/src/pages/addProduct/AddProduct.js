import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import ProductForm from "../../components/product/ProductForm/ProductForm";
import { addMenuItem } from "../../services/restaurantService";
import {
    
  selectIsLoading,
} from "../../redux/features/product/productSlice";
import { selectRestaurant } from "../../redux/features/auth/authslice";

const initialState = {
  name: "",
  quantity: "",
  price: "",
  description: "", 
  ingredients: "", // Add ingredients to match the product form
  category: "", // Add categoryName to match the product form
};

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(initialState);
  const [productImage, setProductImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const restaurant = useSelector(selectRestaurant); // Get restaurant details from Redux store

  

  const isLoading = useSelector(selectIsLoading);

  const { name, description, ingredients , price , category  } = product;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

 
  

  const saveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("restaurantId", restaurant._id);
    // You won't need isNewCategory and categoryName anymore if you're selecting from existing categories
    formData.append("itemName", name);
    formData.append("itemDescription", description);
    formData.append("itemIngredients", ingredients);
    formData.append("itemPrice", price);
    formData.append("categoryId", category); 


    if (productImage) {
      formData.append("image", productImage);
    }
    
    try {
      await addMenuItem(formData); // Use Redux action to make API call
      navigate("/dashboard");
    } catch (error) {
      console.error("Error while saving product:", error);
      // Optionally stop the loading state here
      // Handle error if needed, perhaps by dispatching another Redux action
    }
  
  };
  

  return (
    <div>
      {/* {isLoading && <Loader />} */}
      <h3 className="--mt">Add New Item</h3>
      <ProductForm
        product={product}
        productImage={productImage}
        imagePreview={imagePreview}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        saveProduct={saveProduct}
      />
    </div>
  );
};

export default AddProduct;