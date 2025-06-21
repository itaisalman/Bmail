import DraftMailComposer from "../DraftMailComposer/DraftMailComposer";
import MailsControl from "../MailsControl/MailsControl";
import "./Draft.css";

function Draft() {
    const [messages, setMessages] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDraft, setSelectedDraft] = useState(null);
    const [showComposer, setShowComposer] = useState(false);

    const toggleComposer = () => {
        setShowComposer((prev) => !prev);
    };

    // Fetch inbox data from the server for the current page
    const fetchInbox = useCallback(
        async (page = currentPage) => {
            try {
                const token = sessionStorage.getItem("jwt");
                if (!token) return;

                const res = await fetch(`/api/mails?page=${page}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "bearer " + token,
                        label: "Draft",
                    },
                });

                if (!res.ok) throw new Error("Failed to load inbox");
                const data = await res.json();
                setMessages(data.mails);
                setTotalCount(data.totalCount);
            } catch (err) {
                setError("Error loading inbox: " + err.message);
            }
        },
        [currentPage]
    );

    // Fetch inbox whenever the page changes
    useEffect(() => {
        fetchInbox(currentPage);
    }, [fetchInbox, currentPage]);

    // Load and show the full details of a selected mail
    const handleMailClick = async (id) => {
        const token = sessionStorage.getItem("jwt");
        const res = await fetch(`/api/mails/draft/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        setSelectedDraft(data);
    };

    // Remove a mail from the current list and unmark it from starred/important
    const toggleDelete = (id) => {
        setMessages((prev) => prev.filter((draft) => draft.id !== id));
        if (selectedDraft?.id === id) {
            setSelectedDraft(null);
        }
    };

    return (
        <div className="inboxScreen">
            {!selectedMail && (
                <MailsControl
                    currentPage={currentPage}
                    totalCount={totalCount}
                    onRefresh={fetchInbox}
                    onPageChange={setCurrentPage}
                />
            )}

            {error && <p className="error-message">{error}</p>}

            {!selectedMail ? (
                <div className="inbox-body">
                    <MailList
                        mails={messages}
                        onSelect={handleMailClick}
                        onDelete={toggleDelete}
                    />
                </div>
            ) : (
                showComposer && <DraftMailComposer
                    onClose={toggleComposer}
                />
            )}
        </div>
    );
}

export default Draft;