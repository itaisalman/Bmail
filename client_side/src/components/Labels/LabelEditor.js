import { useState, useEffect } from "react";
import { createLabel, updateLabel } from "./apiLabels";
import "./Labels.css";

function LabelEditor({
  onClose,
  onNewLabelCreated,
  onLabelUpdated,
  labelToEdit,
  labels = [],
}) {
  // Makes labelToEdit a boolean – if there is an edit label it will be set to true
  const isEdit = !!labelToEdit;

  // labelName stores the contents of the label name text field.
  // If we are editing – starts from the existing name.
  const [labelName, setLabelName] = useState(labelToEdit?.name || "");
  const [error, setError] = useState("");

  // Every time the editable label changes – update the input field to the current name of the label
  useEffect(() => {
    if (isEdit) {
      setLabelName(labelToEdit.name);
    }
  }, [isEdit, labelToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = labelName.trim();
    if (!trimmedName) {
      setError("Label name cannot be empty.");
      return;
    }

    // If we are editing – it is permissible for the label with the same name to be the one we are editing
    const isDuplicate = labels.some(
      (lbl) =>
        lbl.name.toLowerCase() === trimmedName.toLowerCase() &&
        (!isEdit || lbl.id !== labelToEdit.id)
    );

    if (isDuplicate) {
      setError("A label with this name already exists.");
      return;
    }

    try {
      if (isEdit) {
        await updateLabel(labelToEdit.id, trimmedName);
        onLabelUpdated({ id: labelToEdit.id, name: trimmedName });
      } else {
        const newLabel = await createLabel(trimmedName);
        onNewLabelCreated(newLabel);
      }

      onClose();
    } catch (err) {
      setError(err.message || "Server error");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="label-composer-container">
        <div className="label-composer-header">
          <span className="new-label-text">
            {isEdit ? "Edit Label" : "New Label"}
          </span>
        </div>

        <form className="composer-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Label name"
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
          />
          <div className="button-row">
            <button
              type="submit"
              className="create-button"
              disabled={labelName.trim() === ""}
            >
              {isEdit ? "Save" : "Create"}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
          {error && <div className="error-text">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default LabelEditor;
