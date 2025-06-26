import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import ButtonMailComposer from "../components/ButtonMailComposer/ButtonMailComposer";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import LabelEditor from "../components/Labels/LabelEditor";
import LabelDeleteConfirm from "../components/Labels/LabelDelete";
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
  const [starredMails, setStarredMails] = useState(new Set());
  const [importantMails, setImportantMails] = useState(new Set());
  const [selectedMail, setSelectedMail] = useState(null);

  const toggleStar = useCallback(async (id) => {
    const token = sessionStorage.getItem("jwt");
    if (!token) return;

    const res = await fetch(`/api/mails/star/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: "bearer " + token,
      },
    });
    if (!res.ok) return;

    setStarredMails((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  }, []);

  const toggleImportant = useCallback(async (id) => {
    const token = sessionStorage.getItem("jwt");
    if (!token) return;

    const res = await fetch(`/api/mails/important/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: "bearer " + token,
      },
    });
    if (!res.ok) return;

    setImportantMails((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  }, []);

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
      },
    })
      .then((res) => res.json())
      .then((data) => setLabels(data));
  }, []);

  const deleteMail = async (id) => {
    const token = sessionStorage.getItem("jwt");
    if (!token) return;

    const res = await fetch(`/api/mails/${id}`, {
      method: "DELETE",
      headers: {
        authorization: "bearer " + token,
      },
    });

    if (!res.ok) return;

    setStarredMails((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });

    setImportantMails((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });
  };

  // Delete the mail from all labels
  const handleDelete = async (id, setMessages) => {
    await deleteMail(id);
    setMessages((prev) => prev.filter((mail) => mail.id !== id));
    if (selectedMail?.id === id) setSelectedMail(null);
  };

  const moveToSpam = async (id) => {
    const token = sessionStorage.getItem("jwt");
    if (!token) return;

    const res = await fetch(`/api/mails/spam/${id}`, {
      method: "POST",
      headers: {
        authorization: "bearer " + token,
      },
    });

    if (!res.ok) return;

    setStarredMails((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });

    setImportantMails((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });
  };

  const handleMoveToSpam = async (id, setMessages) => {
    await moveToSpam(id);
    setMessages((prev) => prev.filter((mail) => mail.id !== id));
    if (selectedMail?.id === id) {
      setSelectedMail(null);
    }
  };

  const handleMailClick = async (id) => {
    const token = sessionStorage.getItem("jwt");
    const res = await fetch(`/api/mails/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setSelectedMail(data);
  };

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
        <Outlet
          context={{
            starredMails,
            importantMails,
            toggleStar,
            toggleImportant,
            handleDelete,
            moveToSpam,
            handleMailClick,
            setSelectedMail,
            selectedMail,
            handleMoveToSpam,
          }}
        />
      </main>
      {showComposer && <ButtonMailComposer onClose={toggleComposer} />}
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
          onSuccess={(deletedId) => {
            setLabels((prev) => prev.filter((label) => label.id !== deletedId));
            setShowDeleteConfirm(false);
            setLabelToDelete(null);
          }}
          onCancel={closeDeletePopup}
        />
      )}
    </div>
  );
}

export default MainScreen;
