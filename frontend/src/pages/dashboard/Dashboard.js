// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ProductList from "../../components/product/productList/ProductList";
// import ProductSummary from "../../components/product/productSummary/ProductSummary";
// import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
// import { selectRestaurant, selectIsLoggedIn } from "../../redux/features/auth/authslice";
// import { fetchMenuDetails } from "../../services/restaurantService"; // Import fetchMenuDetails function

// const Dashboard = () => {
//   useRedirectLoggedOutUser("/login");
//   const dispatch = useDispatch();
//   const isLoggedIn = useSelector(selectIsLoggedIn);
//   const [menuDetails, setMenuDetails] = useState(null); // State to hold menu details
//   const restaurant = useSelector(selectRestaurant); // Get restaurant details from Redux store
//   useEffect(() => {
//     const fetchMenu = async () => {
//       if (!restaurant._id) {
//         console.log('Restaurant ID is not set.');
//         return;
//       }
//       try {
//         const details = await fetchMenuDetails(restaurant._id); 
//         setMenuDetails(details);
//         console.log(details);
//       } catch (error) {
//         console.error("Error fetching menu details:", error.message);
//       }
//     };

//     if (isLoggedIn) {
//       fetchMenu();
//     }
//   }, [isLoggedIn]);

//   return (
//     <div>
//       {/* <ProductSummary products={menuDetails} /> Pass menuDetails to ProductSummary */}
//       <ProductList products={menuDetails} /> {/* Pass menuDetails to ProductList */}
//     </div>
//   );
// };

// export default Dashboard;




import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "../../components/product/productList/ProductList";
import ProductSummary from "../../components/product/productSummary/ProductSummary";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { selectRestaurant, selectIsLoggedIn } from "../../redux/features/auth/authslice";
import { fetchMenuDetails } from "../../services/restaurantService"; // Import fetchMenuDetails function

const Dashboard = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [menuDetails, setMenuDetails] = useState(null); // State to hold menu details
  const [loading, setLoading] = useState(true); // State to handle loading
  const restaurant = useSelector(selectRestaurant); // Get restaurant details from Redux store

  useEffect(() => {
    const fetchMenu = async () => {
      if (!restaurant || !restaurant._id) {
        console.log('Restaurant ID is not set.');
        setLoading(false);
        return;
      }
      try {
        const details = await fetchMenuDetails(restaurant._id); 
        setMenuDetails(details);
        console.log(details);
      } catch (error) {
        console.error("Error fetching menu details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchMenu();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, restaurant]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <ProductSummary products={menuDetails} /> Pass menuDetails to ProductSummary */}
      <ProductList products={menuDetails} /> {/* Pass menuDetails to ProductList */}
    </div>
  );
};

export default Dashboard;
