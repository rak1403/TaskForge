import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, createTask, updateTaskStatus } from "../store/taskSlice";
import { fetchNotes, createNote } from "../store/noteSlice";
import { fetchMembers, addMember } from "../store/memberSlice";
import axiosInstance from "../api/axiosInstance";
import TaskDetailsModal from "../components/TaskDetailsModal";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Users, 
  FileText, 
  MessageSquare, 
  MoreVertical,
  ChevronRight,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("tasks");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [newMember, setNewMember] = useState({ email: "", role: "member" });
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  
  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const { notes, loading: notesLoading } = useSelector((state) => state.notes);
  const { members, loading: membersLoading } = useSelector((state) => state.members);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axiosInstance.get(`/projects/${projectId}`);
        setProject(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch project details");
        navigate("/");
      }
    };

    fetchProjectDetails();
    dispatch(fetchTasks(projectId));
    dispatch(fetchNotes(projectId));
    dispatch(fetchMembers(projectId));
  }, [projectId, dispatch, navigate]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const result = await dispatch(createTask({ projectId, taskData: newTask }));
    if (createTask.fulfilled.match(result)) {
      toast.success("Task created!");
      setIsTaskModalOpen(false);
      setNewTask({ title: "", description: "" });
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const result = await dispatch(addMember({ projectId, ...newMember }));
    if (addMember.fulfilled.match(result)) {
      toast.success("Member invited!");
      setIsMemberModalOpen(false);
      setNewMember({ email: "", role: "member" });
      dispatch(fetchMembers(projectId));
    } else {
      toast.error(result.payload || "Failed to invite member");
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ projectId, taskId, status: newStatus }));
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    const result = await dispatch(createNote({ projectId, noteData: newNote }));
    if (createNote.fulfilled.match(result)) {
      toast.success("Note created!");
      setIsNoteModalOpen(false);
      setNewNote({ title: "", content: "" });
    } else {
      toast.error(result.payload || "Failed to create note");
    }
  };

  const userRole = members.find(m => m.user._id === user?._id)?.role || "member";
  const canManageTasks = ["admin", "project_admin"].includes(userRole);
  const canManageNotes = userRole === "admin";
  const canManageMembers = userRole === "admin";

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  const groupedTasks = {
    todo: tasks.filter(t => t.status === "todo"),
    in_progress: tasks.filter(t => t.status === "in_progress"),
    done: tasks.filter(t => t.status === "done")
  };

  return (
    <div className="project-details-page">
      <div className="project-header">
        <div className="breadcrumb">
          <Link to="/">Dashboard</Link>
          <ChevronRight size={14} />
          <span>{project.name}</span>
        </div>
        <h1>{project.name}</h1>
        <p>{project.description}</p>

        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === "tasks" ? "active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            <CheckCircle2 size={18} />
            Tasks
          </button>
          <button 
            className={`tab-btn ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            <FileText size={18} />
            Notes
          </button>
          <button 
            className={`tab-btn ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            <Users size={18} />
            Members
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "tasks" && (
          <div className="tasks-view">
            <div className="view-header">
              <h2>Task Board</h2>
              {canManageTasks && (
                <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-primary btn-sm">
                  <Plus size={16} />
                  Add Task
                </button>
              )}
            </div>

            <div className="kanban-board">
              {["todo", "in_progress", "done"].map((status) => (
                <div key={status} className="kanban-column">
                  <div className="column-header">
                    <span className={`status-dot ${status}`}></span>
                    <h3>{status.replace("_", " ").toUpperCase()}</h3>
                    <span className="count">{groupedTasks[status].length}</span>
                  </div>
                  
                  <div className="task-list">
                    {groupedTasks[status].map((task) => (
                      <div 
                        key={task._id} 
                        className="task-card glass"
                        onClick={() => setSelectedTaskId(task._id)}
                      >
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <div className="task-footer">
                          <div className="assignee">
                            <div className="avatar-xs">
                              {task.assignee?.username?.charAt(0) || "?"}
                            </div>
                          </div>
                          <div className="actions">
                            <select 
                              value={task.status} 
                              onChange={(e) => handleStatusChange(task._id, e.target.value)}
                              className="status-select"
                            >
                              <option value="todo">Todo</option>
                              <option value="in_progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="notes-view">
            <div className="view-header">
              <h2>Project Notes</h2>
              {canManageNotes && (
                <button onClick={() => setIsNoteModalOpen(true)} className="btn btn-primary btn-sm">
                  <Plus size={16} />
                  New Note
                </button>
              )}
            </div>
            <div className="notes-grid">
              {notes.map(note => (
                <div key={note._id} className="note-card glass">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <div className="note-footer">
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="members-view">
            <div className="view-header">
              <h2>Team Members</h2>
              {canManageMembers && (
                <button onClick={() => setIsMemberModalOpen(true)} className="btn btn-primary btn-sm">
                  <Plus size={16} />
                  Invite Member
                </button>
              )}
            </div>
            <div className="members-list glass">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.user._id}>
                      <td>
                        <div className="member-info">
                          <div className="avatar-sm">
                            {member.user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="member-name">{member.user.username}</div>
                            <div className="member-email">{member.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${member.role}`}>{member.role}</span>
                      </td>
                      <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="icon-btn">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="modal-overlay" onClick={() => setIsTaskModalOpen(false)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
            <h2>New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label>Task Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea
                  className="input-field"
                  rows="3"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {isMemberModalOpen && (
        <div className="modal-overlay" onClick={() => setIsMemberModalOpen(false)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
            <h2>Invite Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="user@example.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Role</label>
                <select 
                  className="input-field"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                >
                  <option value="member">Member</option>
                  <option value="project_admin">Project Admin</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsMemberModalOpen(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {isNoteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNoteModalOpen(false)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
            <h2>New Note</h2>
            <form onSubmit={handleCreateNote}>
              <div className="input-group">
                <label>Note Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Content</label>
                <textarea
                  className="input-field"
                  rows="5"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  required
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsNoteModalOpen(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Note</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTaskId && (
        <TaskDetailsModal 
          projectId={projectId} 
          taskId={selectedTaskId} 
          onClose={() => setSelectedTaskId(null)} 
        />
      )}

      <style jsx>{`
        .project-details-page {
          animation: fadeIn 0.4s ease-out;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .breadcrumb a {
          color: var(--text-secondary);
          text-decoration: none;
        }

        .breadcrumb a:hover {
          color: var(--primary);
        }

        .project-header h1 {
          font-size: 2.4rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .project-header p {
          color: var(--text-secondary);
          max-width: 800px;
          margin-bottom: 32px;
        }

        .tab-navigation {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid var(--glass-border);
          margin-bottom: 32px;
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 12px 24px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          position: relative;
        }

        .tab-btn:hover {
          color: var(--text-primary);
        }

        .tab-btn.active {
          color: var(--primary);
        }

        .tab-btn.active::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--primary);
        }

        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .kanban-board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: flex-start;
        }

        .kanban-column {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 16px;
          padding: 16px;
          min-height: 500px;
        }

        .column-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding: 0 8px;
        }

        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .status-dot.todo { background: var(--text-secondary); }
        .status-dot.in_progress { background: var(--accent-amber); }
        .status-dot.done { background: var(--accent-emerald); }

        .column-header h3 {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }

        .count {
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .task-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .task-card {
          padding: 16px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .task-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
        }

        .task-card h4 {
          margin-bottom: 8px;
          font-size: 1rem;
        }

        .task-card p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .avatar-xs {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .status-select {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 6px;
          outline: none;
        }

        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .note-card {
          padding: 20px;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 0.85rem;
        }

        .members-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .members-table th {
          padding: 16px;
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          border-bottom: 1px solid var(--glass-border);
        }

        .members-table td {
          padding: 16px;
          border-bottom: 1px solid var(--glass-border);
        }

        .member-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-sm {
          width: 32px;
          height: 32px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .member-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .member-email {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .kanban-board {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
