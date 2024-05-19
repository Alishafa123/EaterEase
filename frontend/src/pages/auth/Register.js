import React, { useState } from "react";
import styles from "./auth.module.scss";
import { TiUserAddOutline } from "react-icons/ti";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import { getRestaurant, registerUser, registerRestaurant, validateEmail } from "../../services/authService";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SET_LOGIN, SET_NAME, SET_RESTAURANT } from "../../redux/features/auth/authslice";
import Loader from "../../components/loader/Loader";
import heroImg from "../../assets/inventory.png";
import { RiProductHuntLine } from "react-icons/ri";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";
import Nav from "../../components/authNav/AuthNav";


const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
};



const Register = ({ setRestaurantResponse }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const { name, email, password, password2, image } = formData;
  const [LogoImage, setLogoImage] = useState("");
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };
  const handleImageChange = (e) => {
    setLogoImage(e.target.files[0]);
    setformData({ ...formData, image: e.target.files[0] });
    
  };

  const Register = async (e) => {
    e.preventDefault();
    

  
    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }
    if (password.length < 6) {
      return toast.error("Passwords must be at least 6 characters long");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    if (password !== password2) {
      return toast.error("Passwords do not match");
    }
  
    const userData = {
      name : formData.name,
      email: formData.email,
      password: formData.password,
      role: 'admin',
    };
    setIsLoading(true);
    try {
      
      const adminData = await registerUser(userData);
      console.log(adminData);
     
      
      const restaurantData = {
        name: adminData.name,
        phoneNo : "+92", 
        description: "write your description",
        closingTime: new Date(),
        openingTime: new Date(),
        admin: adminData._id,
        image: image,
        
      };

      console.log(restaurantData);
      const restaurant = await registerRestaurant(restaurantData); 
      
      if (restaurant) {
        await dispatch(SET_LOGIN(true));
        await dispatch(SET_NAME(adminData.name)); // Assuming adminData contains the registered admin's information
        navigate("/dashboard");
        const restaurantResponse = await getRestaurant(adminData._id);
        setRestaurantResponse(restaurantResponse);
        console.log(restaurantResponse);
        //dispatch(SET_RESTAURANT(restaurantResponse));
      } else {
        toast.error("Error ");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Error registering restaurant");
    }
  };
  


  return (
    <div className={styles.auth}>
      {isLoading}

      <Nav />
      <div className={styles.centered}>
        <div className={styles.blueSection}>
          <img src={heroImg} alt="Inventory" />
          <p> Welcome to DineWise</p>
        </div>

        <div className={styles.whiteSection}>
          <div className={styles.form}>
            <Card>
              <div className={styles.form}>
                <div className="--flex-center">
                  <TiUserAddOutline size={35} color="#999" />
                </div>
                <h2>Register</h2>

                <form onSubmit={Register}>

                  
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={handleInputChange}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                  />1
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    name="password2"
                    value={password2}
                    onChange={handleInputChange}
                  />
                  <div style={{ display: 'flex', justifyContent: 'center' }}>

                    <button type="submit" className="--btn --btn-primary --btn-block" style={{ width: '80%' }}>
                      Register
                    </button>

                  </div>
                  
                </form>

                <span className={styles.register}>
                  <Link to="/">Home</Link>
                  <p> &nbsp; Already have an account? &nbsp;</p>
                  <Link to="/login">Login</Link>
                </span>
              </div>
            </Card>
          </div>
        </div>  
      </div>
    </div>
    
  );
};

export default Register;