import MailDetails from "../ViewMail/ViewMail";
import { useNavigate, useLocation } from "react-router";
import { useOutletContext } from "react-router-dom";

function ViewResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  const {
    starredMails,
    importantMails,
    toggleStar,
    toggleImportant,
    handleDelete,
    handleMoveToSpam,
    setMessages,
  } = useOutletContext();

  // Go to parent path
  const handleClose = () => {
    const segments = location.pathname.split("/");
    segments.pop();
    const parentPath = segments.join("/") || "/";
    navigate(parentPath);
  };

  const handleDeleteResult = () => {
    handleDelete(result.id, setMessages);
    handleClose();
  };
  return (
    <MailDetails
      mail={result}
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
