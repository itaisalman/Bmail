import MailDetails from "../ViewMail/ViewMail";
import { useNavigate, useLocation } from "react-router";
import { useOutletContext } from "react-router-dom";

function ViewResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const mail = location.state?.mail;
  const path = location.state?.from;
  const label = location.pathname.split("/")[2];
  const isStarredLabel = label === "starred";
  const isImportantLabel = label === "important";

  const {
    starredMails,
    importantMails,
    toggleStar,
    toggleImportant,
    handleDelete,
    handleMoveToSpam,
    disabledActions = false,
    isSpamScreen = false,
    RestoreFromSpam,
    setMessages,
    labels,
    onAssignLabel,
    removeMailFromLabel,
  } = useOutletContext();

  // When pressing spam or trash while viewing a mail, the view mail should be closed.
  const handleClosingFunctions = (mail_id, setMessages, func) => {
    handleClose();
    console.log(mail_id);
    func(mail_id, setMessages);
  };

  // Navigate to previous path
  const handleClose = () => {
    navigate(path);
  };
  return (
    <MailDetails
      mail={mail}
      onClose={handleClose}
      onStarToggle={(mail_id) => {
        if (isStarredLabel) {
          handleClose();
        }
        toggleStar(mail_id);
      }}
      onImportantToggle={(mail_id) => {
        if (isImportantLabel) {
          handleClose();
        }
        toggleImportant(mail_id);
      }}
      onDelete={(mail_id, setMessages) =>
        handleClosingFunctions(mail_id, setMessages, handleDelete)
      }
      moveToSpam={(mail_id, setMessages) =>
        handleClosingFunctions(mail_id, setMessages, handleMoveToSpam)
      }
      starred={starredMails}
      important={importantMails}
      disabledActions={disabledActions}
      isSpamScreen={isSpamScreen}
      setMessages={setMessages}
      labels={labels}
      onAssignLabel={onAssignLabel}
      removeMailFromLabel={removeMailFromLabel}
      restore={(mail_id, setMessages) =>
        handleClosingFunctions(mail_id, setMessages, RestoreFromSpam)
      }
    />
  );
}

export default ViewResult;
