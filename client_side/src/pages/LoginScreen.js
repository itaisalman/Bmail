import { useState } from "react";
import "./LoginScreen.css";
import logo from "../logo.jpg";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = {
      username: username,
      password: password,
    };

    try {
      const res = await fetch("/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("Error: " + data.error);
      } else {
        window.location.href = "/inbox";
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
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
          <div className="register-link">
            Don't have an account? <a href="/signup">register</a>
          </div>

          <button className="button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;
