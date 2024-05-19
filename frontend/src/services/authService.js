import axios from "axios";
import { toast } from "react-toastify";

// export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const BACKEND_URL = "http://localhost:5000";
export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

//get restaurant id
const findUserRestaurantId = async () => {
  try {
      
      const response = await axios.get(`${BACKEND_URL}/api/restaurants/view_restaurants_list`);

      
      const user = await getUser(); // Assuming you have a function to fetch user details

      
      for (const restaurant of response.data) {
         
          if (restaurant.admin === user.id) {
              console.log(restaurant._id);
              return restaurant._id;
          }
      }

      // If user is not associated with any restaurant, return null or handle accordingly
      return null;
  } catch (error) {
      console.error("Error finding user's restaurant ID:", error);
      // Handle the error as per your application's requirements
      // You might want to return null or throw an error
      return null;
  }
};

// Register User
export const registerUser = async (userData, restaurantId) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/users/register`,
      userData,
      { withCredentials: true }
    );
    const user = response.data;
    const userId = user._id;

    const response2 = await axios.post(
      `${BACKEND_URL}/api/restaurants/add_staff?restaurantId=${restaurantId}&userId=${userId}`,
      null, // No data payload needed here, as parameters are in the URL
      { withCredentials: true }
    );


    if (response2.status === 200) {
      toast.success("User Registered successfully");
    } else {
      toast.error("Failed to add staff to restaurant");
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};


export const registerRestaurant = async (restaurantData) => {
  try {
    const formData = new FormData();
    formData.append("name", restaurantData.name);
    formData.append("phoneNo", restaurantData.phoneNo);
    formData.append("description", restaurantData.description);
    formData.append("openingTime", restaurantData.openingTime);
    formData.append("closingTime", restaurantData.closingTime);
    formData.append("admin", restaurantData.admin);
    formData.append("image", restaurantData.image); // Append the image file

    const response = await axios.post(
      `${BACKEND_URL}/api/restaurants/register`,
      formData,
      { 
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data" // Set content type to multipart/form-data for file upload
        }
      }
    );

    console.log(response.data);
    if (response.status === 201) {
      toast.success("Restaurant Registered successfully");
    }
    
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};


export const getRestaurant = async (adminId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/getRestaurant`, {
      params: { userId: adminId },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error; // You can handle errors in the calling function
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/users/login`,
      userData
    );
    if (response.statusText === "OK") {
      toast.success("Login Successful...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};



// Logout User
export const logoutUser = async () => {
  try {
    await axios.get(`${BACKEND_URL}/api/users/logout`);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Forgot Password
export const forgotPassword = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/users/forgotpassword`,
      userData
    );
    toast.success(response.data.message);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Reset Password
export const resetPassword = async (userData, resetToken) => {
  console.log(userData, resetToken);
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/users/resetpassword/${resetToken}`,
      userData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Get Login Status
export const getLoginStatus = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/loggedin`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
// Get User Profile
export const getUser = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/getuser`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
// Update Profile
export const updateUser = async (formData) => {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/api/users/updateuser`,
      formData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
// Update Profile
export const changePassword = async (formData) => {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/api/users/changepassword`,
      formData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};