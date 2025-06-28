import { useEffect } from "react";
import "./LabelDropdown.css";

function LabelDropdown({
  labels,
  onSelect,
  onClose,
  hideDefaultLabels = false,
}) {
  // Automatically close when clicked outside the dropdown
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

  const defaultLabels = hideDefaultLabels ? [] : [{ id: 1995, name: "Inbox" }];
  const allLabels = [...defaultLabels, ...labels];

  return (
    <div className="label-dropdown">
      <div className="label-dropdown-title">Assign to category</div>
      {allLabels.map((label) => (
        <div
          key={label.id}
          className="label-option"
          onClick={() => onSelect(label)}
        >
          {label.name}
        </div>
      ))}
      <button className="label-cancel" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
}

export default LabelDropdown;
