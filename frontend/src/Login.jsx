import { useState } from "react";
import "./styles/login.css";
import background from "./assets/background-login.avif";
import logoImage from "./assets/menuImage2.png";
import { Link } from "react-router-dom";
import { FaLock, FaEnvelope } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        <h1 className="login-title">Log In</h1>
        <p className="signup-text">
          New to Find It? <Link to="/signup">Create an account here.</Link>
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
