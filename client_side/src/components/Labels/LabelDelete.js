import { deleteLabel } from "./apiLabels";

function LabelDelete({ label, onSuccess, onCancel }) {
  if (!label) return null;
  const handleDelete = async () => {
    try {
      await deleteLabel(label.id);
      onSuccess(label.id);
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
          Delete the label <strong>"{label.name}"</strong>?
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
