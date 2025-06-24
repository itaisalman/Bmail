import { FiRefreshCw } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import "./MailsControl.css";

function MailsControl({
  currentPage,
  totalCount,
  onRefresh,
  onPageChange,
  onEmptyTrash,
}) {
  // Check if the screen is trash to present empty trash button
  const location = useLocation();
  const showEmptyTrashBtn = location.pathname === "/main/trash";

  return (
    <div className="inbox-header">
      <button
        className="refresh-button"
        onClick={() => onRefresh(currentPage)}
        aria-label="Refresh inbox"
      >
        <FiRefreshCw size={20} />
      </button>
      {showEmptyTrashBtn && (
        <button
          className="empty-trash-button"
          onClick={onEmptyTrash}
          aria-label="Empty Trash"
        >
          Empty Trash 🗑️
        </button>
      )}

      <div className="pagination-top">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ◀ Prev
        </button>

        <span className="pagination-range">
          {totalCount === 0 ? 0 : (currentPage - 1) * 50 + 1}-
          {Math.min(currentPage * 50, totalCount)} from {totalCount}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage * 50 >= totalCount}
          aria-label="Next page"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

export default MailsControl;
