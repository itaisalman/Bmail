import { useEffect } from "react";
import "./LabelDropdown.css";

function LabelDropdown({ labels, selected = [], onSelect, onClose }) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".label-dropdown")) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const toggleLabel = (label) => {
    const isSelected = selected.includes(label._id);
    onSelect(label, !isSelected);
  };

  return (
    <div className="label-dropdown">
      <div className="label-dropdown-title">Assign to category</div>

      <div className="label-list">
        {labels.map((label) => {
          const isChecked = selected.map(String).includes(String(label._id));
          return (
            <div key={label._id} className="label-option">
              <label htmlFor={`label-${label._id}`} className="label-name">
                {label.name}
              </label>
              <input
                className="label-toggle"
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleLabel(label)}
                id={`label-${label._id}`}
              />
            </div>
          );
        })}
      </div>

      <button className="label-cancel" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
}

export default LabelDropdown;
