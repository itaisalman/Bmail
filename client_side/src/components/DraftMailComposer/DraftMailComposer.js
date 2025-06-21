import { useState } from "react";
import MailComposer from "../MailComposer/MailComposer";

// Wrapper component to MailComposer
// When reaching MailComposer from the Create New Mail button - i want that MailComposer will do the functionality below on Send and X buttons.
function DraftMailComposer({ onClose }) {
    const [errors, setErrors] = useState("");

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
                const res = await fetch("/api/mails", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "bearer " + token,
                    },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                // Return appropriate error message to the client.
                if (!res.ok) {
                    if (res.status === 401)
                        setErrors("Token required. Please log in again.");
                    else if (
                        res.status === 400 &&
                        data.error === "Invalid/Missing Receiver"
                    )
                        setErrors("Invalid/Missing receiver!");
                    else setErrors("Server error: " + res.status);

                    return;
                }

                // Success
                setErrors("");
                onClose();
            } catch (err) {
                setErrors("Failed to connect to the server. Please try again later.");
            }
        } else {
            setErrors("Receiver is required!");
            return;
        }
    }

    // X function.
    const onMailClose = async ({ to, subject, message }) => {
        const payload = {
            receiver: to,
            title: subject,
            content: message,
        };
        try {
            const token = sessionStorage.getItem("jwt");
            const res = await fetch("/api/mails/draft", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "bearer " + token,
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                // Server returned an error status
                setErrors("Failed to save draft. Please try again.");
                return;
            }
            onClose();
        } catch (err) {
            setErrors("Failed to connect to the server. Please try again later.");
        }
    }

    // Pass the functions and errors state to MailComposer as props.
    return (
        <MailComposer onSend={onSend} onClose={onMailClose} errors={errors}></MailComposer>
    );
}

export default DraftMailComposer;