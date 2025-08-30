import { useState } from "react";
import "./styles/login.css";
import background from "./assets/background-login.avif";
import logoImage from "./assets/menuImage2.png";
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

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${background})`,
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

        <form>
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
              <label>Phone Number:</label>
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
