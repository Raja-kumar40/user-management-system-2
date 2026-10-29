import { useEffect, useState } from "react";

const MessageForm = ({
  onSubmit,
  initialValue = "",
  buttonText = "Add Message",
  onCancel,
  isLoading = false
}) => {
  const [message, setMessage] = useState(initialValue);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setMessage(initialValue);
  }, [initialValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage) {
      setValidationError("Please write a message.");
      return;
    }

    if (cleanMessage.length > 500) {
      setValidationError("Message cannot exceed 500 characters.");
      return;
    }

    setValidationError("");

    const success = await onSubmit(cleanMessage);

    if (success && !onCancel) {
      setMessage("");
    }
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Write a short message or note..."
        rows="4"
        maxLength="500"
      />

      <div className="form-footer">
        <span className="character-count">{message.length}/500 characters</span>

        <div className="form-buttons">
          {onCancel && (
            <button
              type="button"
              className="secondary-btn"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? "Please wait..." : buttonText}
          </button>
        </div>
      </div>

      {validationError && (
        <p className="error-message">{validationError}</p>
      )}
    </form>
  );
};

export default MessageForm;