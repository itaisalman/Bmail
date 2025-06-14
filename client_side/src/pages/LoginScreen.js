import { useState } from "react";
import "./LoginScreen.css";
import logo from "../logo.jpg";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
        const errorMessage = data?.error || "Login failed";
        const newErrors = {};
        if (errorMessage.toLowerCase().includes("username")) {
          newErrors.username = errorMessage;
        } else if (errorMessage.toLowerCase().includes("password")) {
          newErrors.password = errorMessage;
        } else {
          newErrors.general = errorMessage;
        }

        setErrors(newErrors);
        return;
      }

      setErrors({});
      window.location.href = "/inbox";
    } catch (err) {
      setErrors({ general: "Server error: " + err.message });
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
          {errors.username && (
            <p className="error-message">{errors.username}</p>
          )}
          <input
            className="input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
          <div className="bottom-row">
            <div className="register-link">
              Don't have an account? <a href="/signup">register</a>
            </div>
            <label className="show-password-row">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show
            </label>
          </div>
          {errors.general && <p className="error-message">{errors.general}</p>}
          <button className="button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;
