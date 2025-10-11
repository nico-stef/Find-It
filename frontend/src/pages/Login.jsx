const API_URL = import.meta.env.VITE_API_URL;
import { useState } from "react";
import axios from 'axios';
import "../styles/login.css";
import logoImage from "../assets/menuImage2.png";
import { Link } from "react-router-dom";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true } //pentru a trimite si cookie
      );

      setEmail("");
      setPassword("");

      toast.success(response.data.message);
      navigate("/home");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  }

  return (
    <div
      className="login-container"
      style={{
        background: "linear-gradient(135deg, #e5e6ff 0%, #5b63b7d5 100%)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="logo-container">
        <img src={logoImage} alt="logo" className="logo" />
        <span className="app-name">Find It</span>
      </div>
      <div className="login-form">
        <h1 className="login-title">Log In</h1>
        <p className="signup-text">
          New to Find It? <Link to="/signup">Create an account here.</Link>
        </p>

        <form onSubmit={handleLogin}>
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
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="button-container">
            <button type="submit">LOG IN</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
