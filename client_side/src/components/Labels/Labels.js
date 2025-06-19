import { useState } from "react";
import "./Labels.css";

function Labels({ onClose, onNewLabelCreated }) {
  const [labelName, setLabelName] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("jwt");
    if (!token) {
      setError("Missing token");
      return;
    }

    try {
      const res = await fetch("/api/labels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify({ name: labelName }),
      });

      if (res.status === 201) {
        const location = res.headers.get("Location");
        const newId = location.split("/").pop();
        const newLabel = { id: Number(newId), name: labelName };
        onNewLabelCreated(newLabel);
        onClose();
      } else {
        const data = await res.json();
        console.log(data);
        setError(data.error || "Failed to create label");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="label-composer-container">
        <div className="label-composer-header">
          <span className="new-label-text">New Label</span>
        </div>
        <form className="composer-form" onSubmit={handleCreate}>
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
              Create
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

export default Labels;
