// Login.jsx

import React, { useState } from "react";
import styles from "./auth.module.scss";
import { BiLogIn } from "react-icons/bi";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser, validateEmail, getRestaurant } from "../../services/authService";
import { SET_LOGIN, SET_NAME, SET_RESTAURANT } from "../../redux/features/auth/authslice";
import Loader from "../../components/loader/Loader";
import heroImg from "../../assets/inventory.png";
import Nav from "../../components/authNav/AuthNav";
import { RiProductHuntLine } from "react-icons/ri";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const { email, password } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    const userData = {
      email,
      password,
    };
    setIsLoading(true);
    try {
      const data = await loginUser(userData);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      console.log(data._id);
      const restaurantResponse = await getRestaurant(data._id);
      // setRestaurantResponse(restaurantResponse);
      await dispatch( SET_RESTAURANT(restaurantResponse));
     
      console.log(restaurantResponse);
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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

            <Card >
              <div className={styles.formContent}>
                <div className="--flex-center">
                  <BiLogIn size={35} color="#f88379" />
                </div>
                <h2>Login</h2>

                <form onSubmit={login}>
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                  />

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type="submit" className="--btn --btn-primary --btn-block" style={{ width: '80%' }}>
                      Login
                    </button>

                  </div>
                </form>

                <Link to="/forgot" style={{ display: 'flex', justifyContent: 'center', color: '#000' }}>Forgot Password</Link>

                <span className={styles.register}>
                  <Link to="/">Home</Link>
                  <p> &nbsp; Don't have an account? &nbsp;</p>
                  <Link to="/register">Register</Link>
                </span>
              </div>
            </Card>

          </div>
          
        </div>

      </div>
      
    </div>
  );
};

export default Login;
