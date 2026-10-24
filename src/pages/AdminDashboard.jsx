import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Mail,
  MailOpen,
  RefreshCw,
  ShieldCheck,
  CalendarDays,
  AlertCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import AdminProperties from "./AdminProperties";
import AdminMessages from "./AdminMessages";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api/admin";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Manage Properties", icon: Building2 },
    { name: "Registered Users", icon: Users },
    { name: "Messages", icon: Mail },
  ];

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("havenlyToken");

    if (!token) {
      setError("Please sign in to your admin account.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [dashboardResponse, usersResponse] =
        await Promise.all([
          fetch(`${API_URL}/dashboard`, { headers }),
          fetch(`${API_URL}/users`, { headers }),
        ]);

      const dashboardResult = await dashboardResponse.json();
      const usersResult = await usersResponse.json();

      if (
        !dashboardResponse.ok ||
        !dashboardResult.success
      ) {
        throw new Error(
          dashboardResult.message ||
            "Unable to load dashboard."
        );
      }

      if (!usersResponse.ok || !usersResult.success) {
        throw new Error(
          usersResult.message ||
            "Unable to load registered users."
        );
      }

      setStats(dashboardResult.data);
      setUsers(usersResult.data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("havenlyLoggedIn");
    localStorage.removeItem("havenlyRememberMe");
    localStorage.removeItem("havenlyToken");

    navigate("/login");
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      className: "users-stat",
      description: "Registered accounts",
    },
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Building2,
      className: "properties-stat",
      description: "Properties in database",
    },
    {
      title: "Total Messages",
      value: stats.totalMessages,
      icon: Mail,
      className: "messages-stat",
      description: "Contact form messages",
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: MailOpen,
      className: "unread-stat",
      description: "Waiting for review",
    },
  ];

  const changePage = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
    setError("");
  };

  const renderUsersTable = () => (
    <section className="admin-users-section">
      <div className="admin-section-heading">
        <div>
          <p className="admin-eyebrow">
            ACCOUNT MANAGEMENT
          </p>

          <h2>Registered Users</h2>

          <p>
            View all accounts registered on Havenly.
          </p>
        </div>

        <div className="admin-user-count">
          <Users size={18} />
          <span>{users.length} Users</span>
        </div>
      </div>

      {loading ? (
        <div className="admin-empty-state">
          <RefreshCw
            size={25}
            className="admin-spinning"
          />
          <p>Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="admin-empty-state">
          <Users size={30} />
          <p>No registered users found.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email Address</th>
                <th>Account Type</th>
                <th>Registration Date</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="admin-user-cell">
                      <div className="admin-avatar">
                        {(user.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>{user.name}</strong>

                        <span className="admin-user-id">
                          ID: {user._id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="admin-email-cell">
                    {user.email}
                  </td>

                  <td>
                    <span
                      className={`admin-role-badge ${
                        user.role === "admin"
                          ? "admin-role"
                          : "user-role"
                      }`}
                    >
                      {user.role === "admin" ? (
                        <ShieldCheck size={14} />
                      ) : (
                        <Users size={14} />
                      )}

                      {user.role || "user"}
                    </span>
                  </td>

                  <td>
                    <div className="admin-date-cell">
                      <CalendarDays size={15} />

                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Unavailable"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-table-footer">
        <span>
          Showing {users.length} registered{" "}
          {users.length === 1 ? "user" : "users"}
        </span>

        <span className="admin-secure-label">
          <ShieldCheck size={15} />
          Protected Admin Data
        </span>
      </div>
    </section>
  );

  const renderContent = () => {
    if (activePage === "Manage Properties") {
      return <AdminProperties />;
    }

    if (activePage === "Registered Users") {
      return renderUsersTable();
    }

    if (activePage === "Messages") {
      return (
        <AdminMessages
          onMessagesChange={fetchDashboardData}
        />
      );
    }

    return (
      <>
        <section className="admin-welcome">
          <div>
            <span className="admin-welcome-label">
              ADMINISTRATION
            </span>

            <h2>Welcome to Havenly</h2>

            <p>
              Manage your rental platform, registered users
              and activity.
            </p>
          </div>

          <div className="admin-welcome-icon">
            <Building2
              size={42}
              strokeWidth={1.5}
            />
          </div>
        </section>

        <section className="admin-stats-grid">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                className={`admin-stat-card ${card.className}`}
                key={card.title}
              >
                <div className="admin-stat-top">
                  <div className="admin-stat-icon">
                    <Icon size={22} />
                  </div>

                  <span className="admin-stat-dot" />
                </div>

                <p className="admin-stat-title">
                  {card.title}
                </p>

                <h3>{loading ? "..." : card.value}</h3>

                <p className="admin-stat-description">
                  {card.description}
                </p>
              </article>
            );
          })}
        </section>

        {renderUsersTable()}
      </>
    );
  };

  return (
    <main className="admin-layout">
      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "admin-sidebar-open" : ""
        }`}
      >
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <Building2 size={25} />
          </div>

          <div>
            <h2>Havenly</h2>
            <span>ADMIN PANEL</span>
          </div>

          <button
            type="button"
            className="admin-mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="admin-sidebar-label">
          WORKSPACE
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.name}
                className={`admin-nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => changePage(item.name)}
              >
                <Icon size={19} />

                <span>{item.name}</span>

                {item.name === "Messages" &&
                  stats.unreadMessages > 0 && (
                    <span className="admin-nav-badge">
                      {stats.unreadMessages}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-profile-avatar">
              Z
            </div>

            <div className="admin-profile-info">
              <strong>Zohaib Ahmed</strong>
              <span>Administrator</span>
            </div>

            <ShieldCheck
              size={17}
              className="admin-profile-shield"
            />
          </div>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              type="button"
              className="admin-mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={23} />
            </button>

            <div>
              <p className="admin-header-breadcrumb">
                Havenly / Admin
              </p>

              <h1>{activePage}</h1>
            </div>
          </div>

          <button
            type="button"
            className="admin-refresh-btn"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={
                loading ? "admin-spinning" : ""
              }
            />

            <span>Refresh Data</span>
          </button>
        </header>

        <div className="admin-content">
          {error && (
            <div className="admin-error">
              <AlertCircle size={20} />

              <div>
                <strong>
                  Unable to load dashboard
                </strong>

                <p>{error}</p>
              </div>
            </div>
          )}

          {renderContent()}
        </div>

        <footer className="admin-footer">
          <span>
            © 2026 Havenly. Zohaib Ahmed Awan.
          </span>

          <span>
            <ShieldCheck size={14} />
            Admin Workspace
          </span>
        </footer>
      </div>
    </main>
  );
}

export default AdminDashboard;