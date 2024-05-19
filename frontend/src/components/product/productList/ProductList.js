import React ,{ useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SpinnerImg } from "../../loader/Loader";
import "./productList.scss";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import Search from "../../search/Search";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../../redux/features/product/productSlice';

import { selectRestaurant, selectIsLoggedIn } from "../../../redux/features/auth/authslice";
import { fetchMenuDetails } from "../../../services/restaurantService"; // Import fetchMenuDetails function
const ProductList = ({ products }) => {
  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [menuDetails, setMenuDetails] = useState(null); // State to hold menu details
  const restaurant = useSelector(selectRestaurant); // Get restaurant details from Redux store
  
  const navigate = useNavigate();

  const handlenavigate = (item) => {
    try {
      navigate(`/product-detail/${item._id}`);
    } catch (error) {
      console.log(error);
    }
    console.log(item);
  };

  const delProduct = (id) => {
    console.log(id);

    fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        //dispatch(getProducts());

      })
      .catch((err) => console.log(err));
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product.",
      buttons: [
        {
          label: "Delete",
          onClick: () => delProduct(id),
        },
        {
          label: "Cancel",
          onClick: () => alert('Click No')
        },
      ],
    });
  };

  return (
    <div className="product-list">
      
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Menu Items</h3>
          </span>
        </div>

        <div className="table">
          {products ? (
            <>
              {products.length === 0 ? (
                <p>-- No product found, please add a product...</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                     
                      <th>Item Name</th>
                      <th>Category Title</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((category, index) => (
                      <React.Fragment key={category._id}>
                        
                        {category.itemList.map((item, i) => (
                          <tr key={item._id}>
                            {console.log(item)}
                            <td>{item.name}</td>
                            <td>{category.categoryTitle}</td>
                            <td>{item.price}</td>
                            <td className="icons">
                              <span>
                                <AiOutlineEye
                                  size={25}
                                  color={"black"}
                                  onClick={() =>{
                                    try {
                                      navigate(`/product-detail/${item._id}`);
                                    } catch (error) {
                                      console.log(error);
                                    }
                                    console.log(item);
                                  }}
                                />
                              </span>
                              <span>
                                <FaEdit
                                  size={20}
                                  color={"black"}
                                  onClick={
                                    () => {
                                      try {
                                        navigate(`/edit-product/${item._id}`);
                                      } catch (error) {
                                        console.log(error);
                                      }
                                      console.log(item);
                                    }
                                  }
                                />
                              </span>
                              <span>
                                <FaTrashAlt
                                  size={20}
                                  color={"red"}
                                  onClick={() => confirmDelete(item._id)}
                                />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <SpinnerImg />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
