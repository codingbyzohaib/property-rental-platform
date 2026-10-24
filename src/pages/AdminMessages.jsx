import { useCallback, useEffect, useState } from "react";
import {
  Mail,
  MailOpen,
  RefreshCw,
  Trash2,
  CheckCheck,
  Clock,
  UserRound,
  CalendarDays,
  AlertCircle,
  Inbox,
  ShieldCheck,
} from "lucide-react";

import "./AdminMessages.css";

const API_URL = "https://havenly-backend-qp1x.onrender.com/api/admin";

function AdminMessages({ onMessagesChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState("");

  const fetchMessages = useCallback(async () => {
    const token = localStorage.getItem("havenlyToken");

    if (!token) {
      setError("Please sign in to your admin account.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load messages."
        );
      }

      setMessages(result.data || []);
    } catch (err) {
      setError(
        err.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const unreadCount = messages.filter(
    (message) => message.status === "unread"
  ).length;

  const filteredMessages = messages.filter((message) => {
    if (filter === "unread") {
      return message.status === "unread";
    }

    if (filter === "read") {
      return message.status === "read";
    }

    return true;
  });

  const updateMessageStatus = async (message) => {
    const token = localStorage.getItem("havenlyToken");

    if (!token) {
      setError("Please sign in to your admin account.");
      return;
    }

    const newStatus =
      message.status === "unread" ? "read" : "unread";

    setBusyId(message._id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_URL}/messages/${message._id}/${newStatus}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update message."
        );
      }

      setNotice(
        newStatus === "read"
          ? "Message marked as read."
          : "Message marked as unread."
      );

      await fetchMessages();

      if (onMessagesChange) {
        await onMessagesChange();
      }
    } catch (err) {
      setError(
        err.message || "Unable to update message."
      );
    } finally {
      setBusyId("");
    }
  };

  const deleteMessage = async (message) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the message from ${message.name}?`
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("havenlyToken");

    if (!token) {
      setError("Please sign in to your admin account.");
      return;
    }

    setBusyId(message._id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_URL}/messages/${message._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to delete message."
        );
      }

      setMessages((previous) =>
        previous.filter(
          (item) => item._id !== message._id
        )
      );

      setNotice("Message deleted successfully.");

      if (onMessagesChange) {
        await onMessagesChange();
      }
    } catch (err) {
      setError(
        err.message || "Unable to delete message."
      );
    } finally {
      setBusyId("");
    }
  };

  return (
    <section className="admin-messages-page">
      <div className="admin-messages-heading">
        <div>
          <p className="admin-eyebrow">
            CUSTOMER SUPPORT
          </p>

          <h2>Inbox &amp; Messages</h2>

          <p>
            Manage inquiries submitted through your Havenly
            contact form.
          </p>
        </div>

        <button
          type="button"
          className="admin-messages-refresh"
          onClick={fetchMessages}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={
              loading ? "admin-messages-spinning" : ""
            }
          />

          Refresh
        </button>
      </div>

      <div className="admin-messages-stats">
        <article>
          <span className="admin-messages-stat-icon">
            <Inbox size={20} />
          </span>

          <div>
            <p>Total Messages</p>
            <strong>{messages.length}</strong>
          </div>
        </article>

        <article>
          <span className="admin-messages-stat-icon unread">
            <Mail size={20} />
          </span>

          <div>
            <p>Unread Messages</p>
            <strong>{unreadCount}</strong>
          </div>
        </article>

        <article>
          <span className="admin-messages-stat-icon read">
            <MailOpen size={20} />
          </span>

          <div>
            <p>Read Messages</p>
            <strong>{messages.length - unreadCount}</strong>
          </div>
        </article>
      </div>

      <div className="admin-messages-toolbar">
        <div>
          {[
            {
              value: "all",
              label: "All Messages",
            },
            {
              value: "unread",
              label: "Unread",
            },
            {
              value: "read",
              label: "Read",
            },
          ].map((item) => (
            <button
              type="button"
              key={item.value}
              className={`admin-message-filter ${
                filter === item.value ? "active" : ""
              }`}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <span>
          {filteredMessages.length} messages
        </span>
      </div>

      {error && (
        <div className="admin-messages-alert error">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {notice && (
        <div className="admin-messages-alert success">
          <CheckCheck size={19} />
          <span>{notice}</span>
        </div>
      )}

      {loading ? (
        <div className="admin-messages-empty">
          <RefreshCw
            size={28}
            className="admin-messages-spinning"
          />

          <h3>Loading messages</h3>

          <p>
            Please wait while we retrieve your inbox.
          </p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="admin-messages-empty">
          <span>
            <Inbox size={34} />
          </span>

          <h3>
            {messages.length === 0
              ? "Your inbox is empty"
              : "No messages in this filter"}
          </h3>

          <p>
            {messages.length === 0
              ? "Messages submitted through the contact form will appear here."
              : "Try selecting another message filter."}
          </p>
        </div>
      ) : (
        <div className="admin-message-list">
          {filteredMessages.map((message) => {
            const isUnread =
              message.status === "unread";

            const isBusy = busyId === message._id;

            return (
              <article
                key={message._id}
                className={`admin-message-card ${
                  isUnread ? "is-unread" : ""
                }`}
              >
                <div className="admin-message-card-top">
                  <div className="admin-message-sender">
                    <div className="admin-message-avatar">
                      {(message.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="admin-message-sender-details">
                      <div className="admin-message-name-line">
                        <h3>{message.name}</h3>

                        <span
                          className={`admin-message-status ${
                            isUnread ? "unread" : "read"
                          }`}
                        >
                          {isUnread ? (
                            <Mail size={13} />
                          ) : (
                            <CheckCheck size={13} />
                          )}

                          {isUnread ? "Unread" : "Read"}
                        </span>
                      </div>

                      <a href={`mailto:${message.email}`}>
                        {message.email}
                      </a>
                    </div>
                  </div>

                  <div className="admin-message-date">
                    <CalendarDays size={15} />

                    <span>
                      {message.createdAt
                        ? new Date(
                            message.createdAt
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Date unavailable"}
                    </span>
                  </div>
                </div>

                <div className="admin-message-body">
                  <p className="admin-message-subject">
                    {message.subject}
                  </p>

                  <p className="admin-message-text">
                    {message.message}
                  </p>
                </div>

                <div className="admin-message-card-footer">
                  <span className="admin-message-protected">
                    <ShieldCheck size={15} />
                    Admin inbox
                  </span>

                  <div className="admin-message-actions">
                    <button
                      type="button"
                      className="admin-message-action status-action"
                      onClick={() =>
                        updateMessageStatus(message)
                      }
                      disabled={isBusy}
                    >
                      {isUnread ? (
                        <MailOpen size={16} />
                      ) : (
                        <Clock size={16} />
                      )}

                      {isUnread
                        ? "Mark Read"
                        : "Mark Unread"}
                    </button>

                    <button
                      type="button"
                      className="admin-message-action delete-action"
                      onClick={() =>
                        deleteMessage(message)
                      }
                      disabled={isBusy}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>

                {isBusy && (
                  <div className="admin-message-busy">
                    <RefreshCw
                      size={14}
                      className="admin-messages-spinning"
                    />

                    Processing...
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <div className="admin-messages-footer">
        <UserRound size={16} />

        <span>
          Messages are only accessible through the protected
          admin account.
        </span>
      </div>
    </section>
  );
}

export default AdminMessages;