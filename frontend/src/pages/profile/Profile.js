import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios"; // import axios to make HTTP requests
import Card from "../../components/card/Card";
import { SpinnerImg } from "../../components/loader/Loader";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { updateRestaurant, selectRestaurant } from "../../redux/features/auth/authslice";
import "./Profile.scss";

const Profile = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); // Set true initially to show the loader on component mount
  const restaurant = useSelector(selectRestaurant);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/restaurants/view_details`, {
                params: { restaurantId: restaurant._id }
            });
            dispatch(updateRestaurant(response.data));  // Update state with the fetched data
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch restaurant details:", error);
            setIsLoading(false);
        }
    };

    if (restaurant._id) {
        fetchRestaurantDetails();
    } else {
        setIsLoading(false);  // If no restaurant ID is set, stop loading
    }
}, [dispatch, restaurant._id]);  // Dependency array


  if (isLoading) {
    return <SpinnerImg />;
  }

  if (!restaurant) {
    return <p>Something went wrong, please reload the page...</p>;
  }

  const openingTime = new Date(restaurant.openingTime);
  const closingTime = new Date(restaurant.closingTime);

  return (
    <div className="profile --my2">
      <div className="profile">
        <span className="profile-photo">
          <img src={restaurant.logo} alt="Profile Pic" />
        </span>
        <span className="profile-data">
          <p><b>Name:</b> {restaurant.name}</p>
          <p><b>Phone:</b> {restaurant.phoneNo}</p>
          <p><b>Bio:</b> {restaurant.description}</p>
          <p><b>Opening Time:</b> {openingTime.toLocaleTimeString()}</p>
          <p><b>Closing Time:</b> {closingTime.toLocaleTimeString()}</p>
          <div>
            <Link to="/edit-profile">
              <button className="--btn --btn-primary">Edit Profile</button>
            </Link>
          </div>
        </span>
      </div>
    </div>
  );
};

export default Profile;
