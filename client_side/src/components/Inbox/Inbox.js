import { useEffect, useState } from "react";
import "../Inbox/Inbox.css";
import { FiRefreshCw } from "react-icons/fi";
import MailList from "../MailList/MailList";
import MailDetails from "../ViewMail/ViewMail";

const demoMails = [
  {
    id: 1,
    sender_address: "alice@bmail.com",
    title: "Welcome to Bmail!",
    date: "2025-06-17",
    content: "Thanks for joining. Here's what you can do...",
  },
  {
    id: 2,
    sender_address: "bob@bmail.com",
    title:
      "Meeting tomorrowaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    date: "2025-06-16",
    content: "Don't forget our meeting at 10am.",
  },
  {
    id: 3,
    sender_address: "carol@bmail.com",
    title: "Project Update",
    date: "2025-06-15",
    content:
      "Here's the latest status of the project aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  },
  {
    id: 4,
    sender_address: "dave@bmail.com",
    title: "Invitation to join group",
    date: "2025-06-14",
    content: "You've been invited to join the 'Dev Team' group.",
  },
  {
    id: 5,
    sender_address: "eve@bmail.com",
    title: "Security Alert",
    date: "2025-06-13",
    content: "We noticed a new login from an unknown device.",
  },
  {
    id: 6,
    sender_address: "frank@bmail.com",
    title: "Code Review Feedback",
    date: "2025-06-12",
    content: "Please check comments on your last commit.",
  },
  {
    id: 7,
    sender_address: "grace@bmail.com",
    title: "Weekly Digest",
    date: "2025-06-11",
    content: "Here are this week's highlights and updates.",
  },
  {
    id: 8,
    sender_address: "heidi@bmail.com",
    title: "Billing Statement",
    date: "2025-06-10",
    content: "Your monthly billing statement is now available.",
  },
  {
    id: 9,
    sender_address: "ivan@bmail.com",
    title: "Happy Birthday!",
    date: "2025-06-09",
    content: "Wishing you a fantastic birthday!",
  },
  {
    id: 10,
    sender_address: "judy@bmail.com",
    title: "System Maintenance",
    date: "2025-06-08",
    content: "Scheduled maintenance will occur this weekend.",
  },
  {
    id: 11,
    sender_address: "mallory@bmail.com",
    title: "Login Verification",
    date: "2025-06-07",
    content: "Use this code to verify your login: 839102",
  },
  {
    id: 12,
    sender_address: "oscar@bmail.com",
    title: "New Connection Request",
    date: "2025-06-06",
    content: "Oscar wants to connect with you.",
  },
  {
    id: 13,
    sender_address: "peggy@bmail.com",
    title: "File Shared With You",
    date: "2025-06-05",
    content: "Peggy shared a file: 'Budget_Q2.xlsx'",
  },
  {
    id: 14,
    sender_address: "trent@bmail.com",
    title: "Performance Review Reminder",
    date: "2025-06-04",
    content: "Your review is scheduled for Thursday.",
  },
  {
    id: 15,
    sender_address: "victor@bmail.com",
    title: "Newsletter - June Edition",
    date: "2025-06-03",
    content: "Check out the new features and updates.",
  },
  {
    id: 16,
    sender_address: "walter@bmail.com",
    title: "Bug Report Confirmation",
    date: "2025-06-02",
    content: "Thanks for reporting the issue. We're on it.",
  },
  {
    id: 17,
    sender_address: "yvonne@bmail.com",
    title: "Action Required: Policy Update",
    date: "2025-06-01",
    content: "Please review and accept the new policy.",
  },
  {
    id: 18,
    sender_address: "zack@bmail.com",
    title: "Your Subscription is Expiring",
    date: "2025-05-31",
    content: "Renew now to keep your benefits active.",
  },
  {
    id: 19,
    sender_address: "admin@bmail.com",
    title: "Server Downtime Report",
    date: "2025-05-30",
    content: "No issues were reported during the window.",
  },
  {
    id: 20,
    sender_address: "nina@bmail.com",
    title: "Thank You!",
    date: "2025-05-29",
    content: "Just wanted to say thanks for your help.",
  },
  {
    id: 21,
    sender_address: "kevin@bmail.com",
    title: "Your Order Has Shipped",
    date: "2025-05-28",
    content: "Track your package using the following link...",
  },
  {
    id: 22,
    sender_address: "susan@bmail.com",
    title: "Training Material Available",
    date: "2025-05-27",
    content: "New videos are now available in the portal.",
  },
  {
    id: 23,
    sender_address: "bruce@bmail.com",
    title: "Feedback Requested",
    date: "2025-05-26",
    content: "How was your recent experience?",
  },
  {
    id: 24,
    sender_address: "natalie@bmail.com",
    title: "Job Opportunity at Bmail",
    date: "2025-05-25",
    content: "A new position matching your profile is open.",
  },
  {
    id: 25,
    sender_address: "quentin@bmail.com",
    title: "Monthly Report Attached",
    date: "2025-05-24",
    content: "Please find attached the monthly report.",
  },
];

function InboxScreen() {
  const [messages, setMessages] = useState(demoMails);
  // const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [starredMails, setStarredMails] = useState(new Set());
  const [importantMails, setImportantMails] = useState(new Set());
  const [selectedMail, setSelectedMail] = useState(null);

  const fetchInbox = async () => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) return;

      const res = await fetch("/api/mails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + token,
          label: "Inbox",
        },
      });

      if (!res.ok) throw new Error("Failed to load inbox");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError("Error loading inbox: " + err.message);
    }
  };

  useEffect(() => {
    // fetchInbox();
  }, []);

  // const handleMailClick = async (id) => {
  //   const token = sessionStorage.getItem("jwt");
  //   const res = await fetch(`/api/mails/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   const data = await res.json();
  //   setSelectedMail(data);
  // };

  const handleMailClick = (id) => {
    const mail = messages.find((m) => m.id === id);
    if (mail) setSelectedMail(mail);
  };

  const toggleStar = (id) => {
    setStarredMails((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const toggleImportant = (id) => {
    setImportantMails((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const toggleDelete = (id) => {
    setMessages((prev) => prev.filter((mail) => mail.id !== id));
    setStarredMails((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setImportantMails((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    if (selectedMail?.id === id) {
      setSelectedMail(null);
    }
  };

  return (
    <div className="inboxScreen">
      <div className="inbox-header">
        <button className="refresh-button" onClick={fetchInbox}>
          <FiRefreshCw size={20} />
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}

      {selectedMail ? (
        <MailDetails
          mail={selectedMail}
          onClose={() => setSelectedMail(null)}
          onStarToggle={toggleStar}
          onImportantToggle={toggleImportant}
          onDelete={toggleDelete}
          starred={starredMails}
          important={importantMails}
        />
      ) : (
        <MailList
          mails={messages}
          starred={starredMails}
          important={importantMails}
          onSelect={handleMailClick}
          onStarToggle={toggleStar}
          onImportantToggle={toggleImportant}
          onDelete={toggleDelete}
        />
      )}
    </div>
  );
}

export default InboxScreen;
