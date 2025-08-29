import { useState } from "react";
import "./styles/login.css";
import background from "./assets/background-login.avif";

const Login = () => {
  const [username, setUsername] = useState("");
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
      <div className="login-form">
        <h1 className="login-title">Log In</h1>
        <p className="signup-text">New to Find It? Create an account here.</p>

        <form>
          <div className="credential-line">
            <label>Username:</label>
            <input
              type="text"
              placeholder="Email address"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // <-- aici
              required
            />
          </div>
          <div className="credential-line">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // <-- aici
              required
            />
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
