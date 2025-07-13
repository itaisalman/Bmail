import { useNavigate } from "react-router-dom";
import { deleteLabel } from "./apiLabels";
import "./Labels.css";

function LabelDelete({ label, onSuccess, onCancel }) {
  const navigate = useNavigate();
  if (!label) return null;
  const handleDelete = async () => {
    try {
      await deleteLabel(label);
      onSuccess(label._id);
      navigate("/main/inbox");
    } catch (err) {
      alert("Error deleting label: " + err.message);
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
      </div>
    </div>
  );
}

export default LabelDelete;
