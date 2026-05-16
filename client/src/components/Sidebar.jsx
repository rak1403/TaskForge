import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Settings, LogOut, ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import toast from "react-hot-toast";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logged out successfully");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: FolderKanban, label: "Projects", path: "/projects" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <div className="logo-small">T</div>
        <span className="logo-text">TaskForge</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <item.icon size={20} className="nav-icon" />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={16} className="active-indicator" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 50;
          display: flex;
          flex-direction: column;
          border-radius: 0 24px 24px 0;
          border-left: none;
        }

        .sidebar-header {
          padding: 32px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-small {
          width: 32px;
          height: 32px;
          background: var(--primary);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .logo-text {
          font-weight: 600;
          font-size: 1.1rem;
          letter-spacing: -0.01em;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 12px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          margin-bottom: 4px;
          border-radius: 12px;
          color: var(--text-secondary);
          text-decoration: none;
          gap: 12px;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
        }

        .active-indicator {
          margin-left: auto;
        }

        .sidebar-footer {
          padding: 24px;
          border-top: 1px solid var(--glass-border);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: transparent;
          border: none;
          color: var(--accent-rose);
          cursor: pointer;
          border-radius: 12px;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: rgba(244, 63, 94, 0.1);
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
