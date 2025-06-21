function LabelDelete({ label, onConfirm, onCancel }) {
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
          <button className="create-button" onClick={() => onConfirm(label.id)}>
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
