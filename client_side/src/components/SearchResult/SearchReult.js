import "./SearchResult.css";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

// Every result is rendered by this component
function SearchResult({ result, setQuery, setResults }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Format date string to "YYYY-MM-DD" (short format)
  function formatDateShort(dateString) {
    return dateString ? dateString.split("T")[0] : "";
  }

  // Clicking on result cause the search bar to reset
  const handleClick = () => {
    setResults("");
    setQuery("");
    const pathParts = location.pathname.split("/");
    const label = pathParts[2] || "inbox";
    navigate(`/main/${label}/${result.id}`, { state: { result } });
  };

  return (
    <div className="search-result" onClick={handleClick}>
      <div className="icon-container">
        <FaEnvelope className="mail-icon" />
      </div>

      <div className="info-container">
        <div className="mail-title">{result.title}</div>
        <div className="mail-meta">
          <span className="mail-sender">{result.sender_address}</span>
          <span className="mail-separator">→</span>
          <span className="mail-receiver">{result.receiver_address}</span>
        </div>
      </div>

      <div className="date-container">{formatDateShort(result.date)}</div>
    </div>
  );
}

export default SearchResult;
