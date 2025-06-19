import { useState, useEffect } from "react";
import "./Topbar.css";

function Topbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

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

      {/* Search field */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search in email"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Logout button */}
      <button className="logout-button">Logout</button>

      {/* Display mode toggle button */}
      <button className="theme-toggle-button">🔆</button>
    </div>
  );
}

export default Topbar;
