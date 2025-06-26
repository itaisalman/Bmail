import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Labels.css";

function LabelItem({ label, onEditLabel, onDeleteLabel, onStartEdit }) {
  // Updates whether the label name is currently being edited
  const [isEditing, setIsEditing] = useState(false);
  // The label name as it appears in the text field while editing
  const [editedName, setEditedName] = useState(label.name);

  const handleSave = () => {
    if (editedName.trim()) {
      onEditLabel(label.id, editedName.trim());
    }
    setIsEditing(false);
  };

  // Handling keystrokes
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedName(label.name);
    }
  };

  return (
    <div className="sidebar-label-row">
      {isEditing ? (
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="label-edit-input"
          autoFocus
        />
      ) : (
        <>
          <NavLink
            to={`/main/labels/${label.name}`}
            className={({ isActive }) =>
              `label-link ${isActive ? "active" : ""}`
            }
          >
            <div className="label-main">
              <span className="icon">🏷️</span>
              <span className="label-name" title={label.name}>
                {label.name}
              </span>
            </div>
          </NavLink>

          {/* Edit and delete buttons */}
          <div className="label-actions">
            <button
              className="label-edit-button"
              onClick={() => onStartEdit(label)}
            >
              ✏️
            </button>
            <button
              className="label-delete-button"
              title="Delete label"
              onClick={() => onDeleteLabel(label)}
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default LabelItem;
