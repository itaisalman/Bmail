import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import MailComposer from "../components/MailComposer/MailComposer";
import LabelEditor from "../components/Labels/LabelEditor";
import LabelDeleteConfirm from "../components/Labels/LabelDelete";
import { deleteLabel } from "../components/Labels/apiLabels";
import "./MainScreen.css";

function MainScreen() {
  const [showComposer, setShowComposer] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  // All user labels
  const [labels, setLabels] = useState([]);
  // Label selected for editing
  const [labelToEdit, setLabelToEdit] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [labelToDelete, setLabelToDelete] = useState(null);

  const toggleComposer = () => {
    setShowComposer((prev) => !prev);
  };

  // Reverses the state – if the label is open -> closes and vice versa
  const toggleLabels = () => setShowLabels((prev) => !prev);

  const handleLabelUpdated = (updatedLabel) => {
    setLabels((prev) =>
      prev.map((label) =>
        // If label.id is equal to updatedLabel.id,
        // then return a new label with the updated name.
        // Otherwise, return the label as is.
        label.id === updatedLabel.id
          ? { ...label, name: updatedLabel.name }
          : label
      )
    );
  };

  // Its function is to update the status of the labels on the client side after a successful deletion.
  const handleLabelDeleted = (deletedId) => {
    // Removes the label with the id that needs to be deleted
    setLabels((prev) => prev.filter((label) => label.id !== deletedId));
  };

  const handleDelete = async (id) => {
    try {
      // Call the delete function from the server
      await deleteLabel(id);
      // Update client side after success
      handleLabelDeleted(id);
      setShowDeleteConfirm(false);
      setLabelToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Closes the modal without deleting – if the user clicks "Cancel"
  const closeDeletePopup = () => {
    setShowDeleteConfirm(false);
    setLabelToDelete(null);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    fetch("/api/labels", {
      headers: {
        authorization: "Bearer " + token,
        user: sessionStorage.getItem("userId"),
      },
    })
      .then((res) => res.json())
      .then((data) => setLabels(data));
  }, []);

  return (
    <div className="main-container">
      <Sidebar
        onNewMailClick={toggleComposer}
        onNewLabelClick={toggleLabels}
        labels={labels}
        onStartEditLabel={(label) => {
          setLabelToEdit(label);
          setShowLabels(true);
        }}
        onDeleteLabel={(label) => {
          setLabelToDelete(label);
          setShowDeleteConfirm(true);
        }}
      />
      <main className="main-content">
        <Topbar />
        <Outlet />
      </main>
      {showComposer && <MailComposer onClose={toggleComposer} />}
      {showLabels && (
        <LabelEditor
          onClose={() => {
            setShowLabels(false);
            setLabelToEdit(null);
          }}
          onNewLabelCreated={(newLabel) =>
            setLabels((prevLabels) => [...prevLabels, newLabel])
          }
          labelToEdit={labelToEdit}
          onLabelUpdated={handleLabelUpdated}
        />
      )}
      {showDeleteConfirm && (
        <LabelDeleteConfirm
          label={labelToDelete}
          onConfirm={handleDelete}
          onCancel={closeDeletePopup}
        />
      )}
    </div>
  );
}

export default MainScreen;
