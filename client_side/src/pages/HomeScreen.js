import { useNavigate } from "react-router-dom";
import logo from "../logo.jpg";
import "../pages/HomeScreen.css";

function HomeScreen() {
  const navigate = useNavigate();
  return (
    <div className="Bmail">
      <header className="Bmail-header">
        <img src={logo} className="Bmail-logo" alt="logo" />
        <h1>Welcome to Bmail</h1>
        <h2>Secure, smart and easy-to-use email</h2>
        <p>
          Show everyone how to do it <span>Better</span>.
        </p>
      </header>
      <div className="Bmail-buttons">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Register</button>
      </div>
    </div>
  );
}

export default HomeScreen;
