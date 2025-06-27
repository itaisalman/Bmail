import MailDetails from "../ViewMail/ViewMail";
import { useNavigate, useLocation } from "react-router";
import { useOutletContext } from "react-router-dom";

function ViewResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const mail = location.state?.mail;
  const path = location.state?.from;

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
  } = useOutletContext();

  // When pressing spam or trash while viewing a mail, the view mail should be closed.
  const handleClosingFunctions = (mail_id, setMessages, func) => {
    handleClose();
    func(mail_id, setMessages);
  };

  // Navigate to previous path
  const handleClose = () => {
    navigate(path);
  };

  const handleDeleteResult = () => {
    handleDelete(mail.id, setMessages);
    handleClose();
  };
  return (
    <MailDetails
      mail={mail}
      onClose={handleClose}
      onStarToggle={toggleStar}
      onImportantToggle={toggleImportant}
      onDelete={handleDeleteResult}
      moveToSpam={(mail_id, setMessages) =>
        handleClosingFunctions(mail_id, setMessages, handleMoveToSpam)
      }
      starred={starredMails}
      important={importantMails}
      disabledActions={disabledActions}
      isSpamScreen={isSpamScreen}
      setMessages={setMessages}
      restore={(mail_id, setMessages) =>
        handleClosingFunctions(mail_id, setMessages, RestoreFromSpam)
      }
    />
  );
}

export default ViewResult;
