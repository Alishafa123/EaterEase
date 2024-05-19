import React, { useState } from "react";
import styles from "./auth.module.scss";
import { AiOutlineMail } from "react-icons/ai";
import Card from "../../components/card/Card";
import { Link } from "react-router-dom";
import { forgotPassword, validateEmail } from "../../services/authService";
import { toast } from "react-toastify";
import Nav from "../../components/authNav/AuthNav"
import heroImg from "../../assets/inventory.png";

const Forgot = () => {
  const [email, setEmail] = useState("");

  const forgot = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter an email");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    const userData = {
      email,
    };

    await forgotPassword(userData);
    setEmail("");
  };

  return (
    <div className={styles.auth}>
      <Nav/>
      <div className={styles.centered}>
        <div className={styles.blueSection}>
          <img src={heroImg} alt="Inventory" />
          <p> this is an inventory management system</p>
        </div>

        <div className={styles.whiteSection}>
          <div className={styles.form}>
            <Card>
              <div className={styles.form}>
                <div className="--flex-center">
                  <AiOutlineMail size={35} color="#999" />
                </div>
                <h2>Forgot Password</h2>

                <form onSubmit={forgot}>
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type="submit" className="--btn --btn-primary --btn-block" style={{ width: '80%' }}>
                      Get Reset Email
                    </button>

                  </div>
                  <div className={styles.links}>
                    <p>
                      <Link to="/">- Home</Link>
                    </p>
                    <p>
                      <Link to="/login">- Login</Link>
                    </p>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default Forgot;