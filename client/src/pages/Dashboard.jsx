import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, createProject } from "../store/projectSlice";
import { Plus, Folder, Users, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    const result = await dispatch(createProject(newProject));
    setCreating(false);
    if (createProject.fulfilled.match(result)) {
      toast.success("Project created successfully!");
      setIsModalOpen(false);
      setNewProject({ name: "", description: "" });
    } else {
      toast.error(result.payload || "Failed to create project");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Your Projects</h1>
          <p>Manage and track your collaborative work</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          New Project
        </button>
      </div>

      {loading ? (
        <div className="loader-container">
          <Loader2 className="animate-spin" size={40} color="var(--primary)" />
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state glass">
          <Folder size={48} color="var(--text-secondary)" />
          <h3>No projects yet</h3>
          <p>Get started by creating your first project</p>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-ghost">
            Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((item) => (
            <Link key={item.project._id} to={`/projects/${item.project._id}`} className="project-card glass">
              <div className="project-card-header">
                <div className="project-icon">
                  <Folder size={20} />
                </div>
                <span className={`role-badge ${item.role}`}>{item.role}</span>
              </div>
              <h3>{item.project.name}</h3>
              <p>{item.project.description}</p>
              
              <div className="project-card-footer">
                <div className="stats">
                  <div className="stat-item">
                    <Users size={14} />
                    <span>{item.project.members || 0}</span>
                  </div>
                  <div className="stat-item">
                    <Calendar size={14} />
                    <span>{new Date(item.project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="view-btn">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="input-group">
                <label>Project Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Website Redesign"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea
                  className="input-field"
                  placeholder="What is this project about?"
                  rows="4"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  required
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? <Loader2 className="animate-spin" size={18} /> : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-page {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .dashboard-header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .dashboard-header p {
          color: var(--text-secondary);
        }

        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 100px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px;
          text-align: center;
          gap: 16px;
        }

        .empty-state h3 {
          font-size: 1.4rem;
          margin-top: 8px;
        }

        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .project-card {
          padding: 24px;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-8px);
          border-color: var(--primary);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .project-icon {
          width: 40px;
          height: 40px;
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .role-badge {
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .role-badge.admin { background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); }
        .role-badge.project_admin { background: rgba(245, 158, 11, 0.1); color: var(--accent-amber); }
        .role-badge.member { background: rgba(148, 163, 184, 0.1); color: var(--text-secondary); }

        .project-card h3 {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .project-card p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid var(--glass-border);
        }

        .stats {
          display: flex;
          gap: 16px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .view-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .project-card:hover .view-btn {
          background: var(--primary);
          color: white;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          padding: 32px;
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-content h2 {
          margin-bottom: 24px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 32px;
        }

        textarea.input-field {
          resize: none;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
