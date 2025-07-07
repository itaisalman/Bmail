import { useState } from "react";
import MailComposer from "../MailComposer/MailComposer";
import { useOutletContext } from "react-router-dom";

// Wrapper component to MailComposer
// When reaching MailComposer from the Create New Mail button - i want that MailComposer will do the functionality below on Send and X buttons.
function DraftMailComposer() {
  const [errors, setErrors] = useState("");
  const { draft, onClose } = useOutletContext();

  // Send function.
  const onSend = async ({ to, subject, message }) => {
    if (to) {
      const payload = {
        receiver: to,
        title: subject,
        content: message,
      };

      try {
        const token = sessionStorage.getItem("jwt");
        const post_mail_res = await fetch("/api/mails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
          },
          body: JSON.stringify(payload),
        });
        const posted_mail = await post_mail_res.json();
        // Return appropriate error message to the client.
        if (!post_mail_res.ok) {
          setErrors(posted_mail.error);
          return;
        }
        const delete_draft_res = await fetch(`/api/mails/draft/${draft._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + token,
          },
        });
        if (!delete_draft_res.ok) {
          const deleted_draft = await delete_draft_res.json();
          setErrors(deleted_draft.error);
          return;
        }
        // Success
        setErrors("");
        onClose();
      } catch (err) {
        setErrors(err.message || "An unexpected error occurred");
      }
    } else {
      setErrors("Receiver is required!");
      return;
    }
  };

  // X function.
  const onMailClose = async ({ to, subject, message }) => {
    const payload = {
      receiver: to,
      title: subject,
      content: message,
    };
    try {
      const token = sessionStorage.getItem("jwt");
      const res = await fetch(`/api/mails/${draft._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + token,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setErrors("Communication error with the server");
        return;
      }
      // Success
      setErrors("");
      onClose();
    } catch (err) {
      setErrors(err.message || "An unexpected error occurred");
    }
  };

  // Pass the functions and errors state to MailComposer as props.
  return (
    <MailComposer
      onSend={onSend}
      onClose={onMailClose}
      errors={errors}
      receiver={draft.receiver_address}
      title={draft.title}
      content={draft.content}
    />
  );
}

export default DraftMailComposer;
