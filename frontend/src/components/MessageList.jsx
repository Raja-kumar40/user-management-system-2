import { useState } from "react";
import MessageForm from "./MessageForm";

const MessageList = ({ messages, onUpdate, onDelete, deletingId }) => {
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [updatingMessageId, setUpdatingMessageId] = useState(null);

  const formatDate = (dateValue) => {
    return new Date(dateValue).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  const handleUpdate = async (messageId, updatedText) => {
    setUpdatingMessageId(messageId);

    const success = await onUpdate(messageId, updatedText);

    if (success) {
      setEditingMessageId(null);
    }

    setUpdatingMessageId(null);

    return success;
  };

  if (messages.length === 0) {
    return (
      <div className="empty-state">
        <p>You have not added any notes yet.</p>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((item) => (
        <article className="message-card" key={item.message_id}>
          {editingMessageId === item.message_id ? (
            <MessageForm
              initialValue={item.message}
              buttonText="Save Changes"
              onCancel={() => setEditingMessageId(null)}
              onSubmit={(updatedText) =>
                handleUpdate(item.message_id, updatedText)
              }
              isLoading={updatingMessageId === item.message_id}
            />
          ) : (
            <>
              <p className="message-text">{item.message}</p>

              <div className="message-meta">
                <span>Created: {formatDate(item.created_at)}</span>

                {item.updated_at !== item.created_at && (
                  <span>Updated: {formatDate(item.updated_at)}</span>
                )}
              </div>

              <div className="message-actions">
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => setEditingMessageId(item.message_id)}
                  disabled={deletingId === item.message_id}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => onDelete(item.message_id)}
                  disabled={deletingId === item.message_id}
                >
                  {deletingId === item.message_id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  );
};

export default MessageList;