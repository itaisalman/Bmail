import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext";
import { FaSearch } from "react-icons/fa";
import "./Topbar.css";

function Topbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { toggleTheme } = useContext(ThemeContext);

  // Function that performs a fetch request for user data
  const fetchTopbar = async () => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;
      const res = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + token,
        },
      });
      if (!res.ok) throw new Error("Faild to load user");
      // Gets the information from the server
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error loading inbox: " + err.message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    navigate("/login");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;
      const res = await fetch(
        // Used encodeURIComponent in order to search for anything the user wants without misbehaviour
        `/api/mails/search/${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
          },
        }
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    console.log("Updated results:", results);
  }, [results]);

  useEffect(() => {
    fetchTopbar();
  }, []);

  return (
    <div className="inbox-header">
      {/* Display image and name */}
      {user && (
        <>
          <img
            src={`http://localhost:3000/${user.image}`}
            alt="Profile"
            className="profile-image"
          />
          <span className="username">{user.first_name}</span>
        </>
      )}
      <form className="search-container" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search in email"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-button" aria-label="Search">
          <FaSearch />
        </button>
      </form>

      {/* Logout button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {/* Display mode toggle button */}
      <button className="theme-toggle-button" onClick={toggleTheme}>
        🔆
      </button>
    </div>
  );
}

export default Topbar;
