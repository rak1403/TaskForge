import { useSelector } from "react-redux";
import { Search, Bell, User } from "lucide-react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="navbar glass">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search anything..." />
      </div>

      <div className="navbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">
          <div className="user-info">
            <span className="username">{user?.username}</span>
            <span className="user-role">{user?.role || "Member"}</span>
          </div>
          <div className="avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" />
            ) : (
              <User size={20} />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          margin: 20px 40px 0;
          border-radius: 20px;
          z-index: 40;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: rgba(15, 23, 42, 0.4);
          padding: 8px 16px;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          width: 300px;
        }

        .search-icon {
          color: var(--text-secondary);
          margin-right: 10px;
        }

        .search-bar input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          outline: none;
          width: 100%;
          font-size: 0.9rem;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          padding: 4px;
        }

        .icon-btn:hover {
          color: var(--text-primary);
        }

        .notification-dot {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 8px;
          height: 8px;
          background: var(--accent-rose);
          border-radius: 50%;
          border: 2px solid var(--bg-dark);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-left: 24px;
          border-left: 1px solid var(--glass-border);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .username {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: capitalize;
        }

        .avatar {
          width: 36px;
          height: 36px;
          background: var(--primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .navbar {
            margin: 0;
            border-radius: 0;
            padding: 0 20px;
          }
          .search-bar {
            width: 150px;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
