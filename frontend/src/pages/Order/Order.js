import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Order.scss";
import OrderCard from "../../components/orders/OrderCard";
import Cookies from 'js-cookie';
import { selectRestaurant, selectIsLoggedIn } from "../../redux/features/auth/authslice";


const initialState = {
    name: "",
    email: "",
    password: "",
    role: "staff", // Default role
};

const Order = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setformData] = useState(initialState);
    const [orders, setOrders] = useState([]); // State to store fetched orders
    const restaurant = useSelector(selectRestaurant); // Get restaurant details from Redux store

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                console.log(restaurant._id);
                const response = await fetch(`http://localhost:5000/api/orders/view_current_orders_restaurant?restaurantId=${restaurant._id}`, {
                    //get token from local storage using getItem
                    method: 'GET',
                    credentials: "include"
                });
                if (!response.ok) {
                    throw new Error('Could not fetch orders');
                }
                const data = await response.json();
                console.log(data);
                setOrders(data); // Assuming the response is an array of orders
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                toast.error(error.message || 'Failed to fetch orders');
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <div className="--flex-center --mt">
                <h3>Orders</h3>
            </div>
            <div className="--flex-center" style={{ width: "100%" }}>
                {/* <div className="staff-list --mt --flex-dir-column --justify-center --width-100">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        orders.map((order, index) => (
                            <div key={index} className="--width-100 --flex-center">
                              
                                <OrderCard user={order} />
                            </div>
                            
                        ))
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default Order;