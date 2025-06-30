import { useState, useEffect, useCallback, useRef } from "react";
import { Outlet } from "react-router-dom";
import ButtonMailComposer from "../components/ButtonMailComposer/ButtonMailComposer";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import LabelEditor from "../components/Labels/LabelEditor";
import LabelDeleteConfirm from "../components/Labels/LabelDelete";
import { assignLabelToMail } from "../components/Labels/apiLabels";
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
  // Used for trigger re-fetching the wanted components (Like inbox/sent etc.)
  const actionRef = useRef(null);

  const toggleStar = useCallback(async (id) => {
    const token = sessionStorage.getItem("jwt");

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
    if (actionRef.current) {
      actionRef.current();
    }
  };

  // Reverses the state – if the label is open -> closes and vice versa
  const toggleLabels = () => setShowLabels((prev) => !prev);

  const handleLabelUpdated = (updatedLabel) => {
    setLabels((prev) =>
      prev.map((label) =>
        label.id === updatedLabel.id
          ? { ...label, name: updatedLabel.name }
          : label
      )
    );
  };

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
  };

  const moveToSpam = async (id) => {
    const token = sessionStorage.getItem("jwt");

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
  };

  const onAssignLabel = async (mailId, labelId, setMessages) => {
    try {
      assignLabelToMail(mailId, labelId);
      setMessages((prev) =>
        prev.map((mail) =>
          mail.id === mailId
            ? { ...mail, labels: [...(mail.labels || []), { id: labelId }] }
            : mail
        )
      );
    } catch (err) {
      console.error("Failed to assign label:", err.message);
    }
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
            labels,
            handleDelete,
            moveToSpam,
            handleMoveToSpam,
            onAssignLabel,
            setAction: (fn) => (actionRef.current = fn),
          }}
        />
      </main>
      {showComposer && (
        <ButtonMailComposer
          onClose={toggleComposer}
          onAction={() => actionRef.current?.()}
        />
      )}
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
