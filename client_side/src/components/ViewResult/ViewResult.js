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
    setMessages,
  } = useOutletContext();

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
      moveToSpam={handleMoveToSpam}
      starred={starredMails}
      important={importantMails}
      setMessages={setMessages}
    />
  );
}

export default ViewResult;
