import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingMessage, setEditingMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // GET USER MESSAGES
  // =========================

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/messages");

      setMessages(response.data.data || []);
    } catch (error) {
      console.error("Fetch messages error:", error);

      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load messages"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD MESSAGES
  // =========================

  useEffect(() => {
    fetchMessages();
  }, []);

  // =========================
  // ADD MESSAGE
  // =========================

  const handleAddMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      setError("Please enter a message");
      return;
    }

    if (newMessage.trim().length > 500) {
      setError("Message cannot exceed 500 characters");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post("/messages", {
        message: newMessage.trim(),
      });

      setNewMessage("");

      setSuccess("Note added successfully!");

      await fetchMessages();

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Add message error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to add note"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // START EDIT
  // =========================

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditingMessage(item.message);
    setError("");
    setSuccess("");
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {
    setEditingId(null);
    setEditingMessage("");
  };

  // =========================
  // UPDATE MESSAGE
  // =========================

  const handleUpdate = async (id) => {
    if (!editingMessage.trim()) {
      setError("Message cannot be empty");
      return;
    }

    if (editingMessage.trim().length > 500) {
      setError("Message cannot exceed 500 characters");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.put(`/messages/${id}`, {
        message: editingMessage.trim(),
      });

      setEditingId(null);
      setEditingMessage("");

      setSuccess("Note updated successfully!");

      await fetchMessages();

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Update message error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update note"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE MESSAGE
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(`/messages/${id}`);

      setSuccess("Note deleted successfully!");

      await fetchMessages();

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Delete message error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete note"
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================
  // DATE FORMAT
  // =========================

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <header className="dashboard-header">

        <div>
          <h1>
            📝 User Notes
          </h1>

          <p>
            Personal Notes Dashboard
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </header>

      <main className="dashboard-container">

        {/* USER CARD */}

        <section className="user-card">

          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <h2>
              Welcome, {user?.name || "User"} 👋
            </h2>

            <p>
              {user?.email}
            </p>
          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div className="alert error-alert">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="alert success-alert">
            {success}
          </div>
        )}

        {/* ADD NOTE */}

        <section className="add-note-card">

          <h2>
            Add New Note
          </h2>

          <form onSubmit={handleAddMessage}>

            <textarea
              value={newMessage}
              onChange={(e) =>
                setNewMessage(e.target.value)
              }
              placeholder="Write your note here..."
              maxLength={500}
              rows={4}
            />

            <div className="form-bottom">

              <span>
                {newMessage.length}/500
              </span>

              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "➕ Add Note"}
              </button>

            </div>

          </form>

        </section>

        {/* NOTES */}

        <section className="notes-section">

          <div className="section-title">

            <h2>
              My Notes
            </h2>

            <span>
              {messages.length}{" "}
              {messages.length === 1
                ? "note"
                : "notes"}
            </span>

          </div>

          {loading ? (
            <div className="empty-state">
              <p>
                Loading your notes...
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state">

              <div className="empty-icon">
                📝
              </div>

              <h3>
                No notes yet
              </h3>

              <p>
                Add your first note above.
              </p>

            </div>
          ) : (
            <div className="notes-list">

              {messages.map((item) => (

                <div
                  className="note-card"
                  key={item.id}
                >

                  {editingId === item.id ? (

                    <div className="edit-area">

                      <textarea
                        value={editingMessage}
                        onChange={(e) =>
                          setEditingMessage(
                            e.target.value
                          )
                        }
                        maxLength={500}
                        rows={4}
                      />

                      <div className="edit-actions">

                        <button
                          className="save-btn"
                          onClick={() =>
                            handleUpdate(item.id)
                          }
                          disabled={saving}
                        >
                          💾 Save
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={cancelEdit}
                          disabled={saving}
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  ) : (

                    <>
                      <p className="note-text">
                        {item.message}
                      </p>

                      <div className="note-footer">

                        <small>
                          {formatDate(
                            item.createdAt
                          )}
                        </small>

                        <div className="note-actions">

                          <button
                            className="edit-btn"
                            onClick={() =>
                              startEdit(item)
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(item.id)
                            }
                          >
                            🗑️ Delete
                          </button>

                        </div>

                      </div>
                    </>

                  )}

                </div>

              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
};

export default Dashboard;
