import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="page-container">
      <Sidebar />
      <div className="content-wrapper">
        <Navbar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      <style jsx>{`
        .content-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          margin-left: var(--sidebar-width);
          transition: margin-left 0.3s ease;
        }

        @media (max-width: 768px) {
          .content-wrapper {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
