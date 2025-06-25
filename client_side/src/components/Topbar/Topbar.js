import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext";
import { FaSearch } from "react-icons/fa";
import "./Topbar.css";
import LiveSearchResult from "../LiveSearchResult/LiveSearchResult";

function Topbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
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
      setShowDropdown(true);
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

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const token = sessionStorage.getItem("jwt");
        const res = await fetch(
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
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err.message);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

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
      {/* <div className="search-wrapper">
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search in email"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowDropdown(true)}
          />
          <button type="submit" className="search-button" aria-label="Search">
            <FaSearch />
          </button>
        </form>
        {showDropdown && (
          <LiveSearchResult
            results={results}
            onSelect={(item) => {
              setQuery(item.subject || "");
              setShowDropdown(false);
              navigate(`/mail/${item.id}`);
            }}
          />
        )}
      </div> */}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search in email"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowDropdown(true)}
          />
          <button type="submit" className="search-button" aria-label="Search">
            <FaSearch />
          </button>
        </form>

        {showDropdown && (
          <div className="live-search-dropdown">
            <LiveSearchResult results={results} />
          </div>
          // <LiveSearchResult
          //   className="live-search-dropdown"
          //   results={results}
          //   // onSelect={(item) => {
          //   //   setQuery(item.subject || "");
          //   //   setShowDropdown(false);
          //   //   navigate(`/mail/${item.id}`);
          //   // }}
          // />
        )}
      </div>

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
