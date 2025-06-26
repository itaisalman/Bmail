import "./SearchResult.css";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Every result is rendered by this component
function SearchResult({ result }) {
  const navigate = useNavigate();

  // Format date string to "YYYY-MM-DD" (short format)
  function formatDateShort(dateString) {
    return dateString ? dateString.split("T")[0] : "";
  }

  const handleClick = () => {
    const label = result.label?.toLowerCase() || "inbox";
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
