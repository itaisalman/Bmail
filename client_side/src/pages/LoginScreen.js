import { useState } from "react";
import "./LoginScreen.css";
import logo from "../logo.jpg";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="loginScreen">
      <div className="container">
        <div className="logo-wrapper">
          <img src={logo} className="Bmail-logo" alt="logo" />
        </div>
        <h2 className="title">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            className="input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="register-link">Don't have an account? register</div>

          <button className="button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;
