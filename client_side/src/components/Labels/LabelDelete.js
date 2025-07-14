import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { deleteLabel } from "./apiLabels";
import "./Labels.css";

function LabelDelete({ label, onSuccess, onCancel }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  if (!label) return null;
  const handleDelete = async () => {
    try {
      await deleteLabel(label);
      onSuccess(label._id);
      if (location.pathname === `/main/labels/${label.name}`) {
        navigate("/main/inbox");
      }
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="modal-backdrop">
      <div className="label-composer-container">
        <div className="label-composer-header">
          <span className="new-label-text">Delete label</span>
        </div>
        <p>
          Delete the label{" "}
          <strong>
            "<span className="delete-label-name">{label.name}</span>"
          </strong>
          ?
        </p>

        <div className="button-row">
          <button className="create-button" onClick={handleDelete}>
            Delete
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
        {error && (
          <div className="error-message">Error delete label: {error}</div>
        )}
      </div>
    </div>
  );
}

export default LabelDelete;
