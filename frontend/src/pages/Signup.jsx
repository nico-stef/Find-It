const API_URL = import.meta.env.VITE_API_URL;
import { useState } from "react";
import axios from 'axios';
import "../styles/login.css";
import logoImage from "../assets/menuImage2.png";
import { Link } from "react-router-dom";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaUserAlt,
  FaPhone,
  FaCity,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/register`, {
        email, password, firstName, lastName, phone: phoneNumber, city
      });

      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setCity("");
      setShowPassword(false);

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong."); //daca primim mesaj de pe backend il afisam, daca nu afisam ceva generic
    }
  }

  return (
    <div
      className="login-container"
      style={{
        background: "linear-gradient(135deg, #e5e6ff 0%, #5b63b7d5 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className="logo-container">
        <img src={logoImage} alt="logo" className="logo" />
        <span className="app-name">Find It</span>
      </div>
      <div className="login-form">
        <h1 className="login-title">Sign Up</h1>
        <p className="signup-text">
          Already have an account? <Link to="/login">Log in here.</Link>
        </p>

        <form onSubmit={handleSignup}>
          <div className="credential-line">
            <label>Email:</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="credential-line">
            <label>Password:</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="two-credential-container">
            <div className="credential">
              <label>First name:</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="credential">
              <label>Last name:</label>
              <div className="input-wrapper">
                <FaUserAlt className="input-icon" />
                <input
                  type="text"
                  placeholder="last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="two-credential-container">
            <div className="credential">
              <label>Phone:</label>
              <div className="input-wrapper">
                <FaPhone className="input-icon" />
                <input
                  placeholder="phone number (optional)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="credential">
              <label>City:</label>
              <div className="input-wrapper">
                <FaCity className="input-icon" />
                <input
                  type="text"
                  placeholder="city (optional)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="button-container">
            <button type="submit">SIGN UP</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
