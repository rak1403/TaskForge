import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Plus, Trash2, CheckSquare, Square, Paperclip, Loader2 } from "lucide-react";
import { createSubtask, updateSubtask, fetchTaskById } from "../store/taskSlice";
import toast from "react-hot-toast";

const TaskDetailsModal = ({ projectId, taskId, onClose }) => {
  const dispatch = useDispatch();
  const { currentTask, loading } = useSelector((state) => state.tasks);
  const [newSubtask, setNewSubtask] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchTaskById({ projectId, taskId }));
  }, [projectId, taskId, dispatch]);

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    setCreating(true);
    const result = await dispatch(createSubtask({ 
      projectId, 
      taskId, 
      subtaskData: { title: newSubtask } 
    }));
    setCreating(false);
    if (createSubtask.fulfilled.match(result)) {
      setNewSubtask("");
      dispatch(fetchTaskById({ projectId, taskId }));
    }
  };

  const handleToggleSubtask = async (subtask) => {
    await dispatch(updateSubtask({ 
      projectId, 
      subTaskId: subtask._id, 
      subtaskData: { isCompleted: !subtask.isCompleted } 
    }));
    dispatch(fetchTaskById({ projectId, taskId }));
  };

  if (!currentTask) return (
    <div className="modal-overlay">
      <div className="modal-content glass flex items-center justify-center p-20">
        <Loader2 className="animate-spin" size={32} color="var(--primary)" />
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass task-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        
        <div className="modal-header">
          <span className={`status-badge ${currentTask.status}`}>{currentTask.status.replace("_", " ")}</span>
          <h2>{currentTask.title}</h2>
          <p className="task-desc">{currentTask.description}</p>
        </div>

        <div className="modal-body">
          <div className="section">
            <h3>Subtasks</h3>
            <div className="subtask-list">
              {currentTask.subtasks?.map((st) => (
                <div key={st._id} className="subtask-item" onClick={() => handleToggleSubtask(st)}>
                  {st.isCompleted ? (
                    <CheckSquare size={18} className="text-emerald" />
                  ) : (
                    <Square size={18} className="text-secondary" />
                  )}
                  <span className={st.isCompleted ? "completed" : ""}>{st.title}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddSubtask} className="add-subtask">
              <input 
                type="text" 
                placeholder="Add a subtask..." 
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
              />
              <button type="submit" disabled={creating}>
                {creating ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              </button>
            </form>
          </div>

          <div className="section">
            <h3>Attachments</h3>
            <div className="attachments-list">
              {currentTask.attachments?.length > 0 ? (
                currentTask.attachments.map((file, idx) => (
                  <div key={idx} className="attachment-item">
                    <Paperclip size={16} />
                    <span>{file.name || "Attachment"}</span>
                  </div>
                ))
              ) : (
                <p className="empty-text">No attachments yet</p>
              )}
              <button className="btn btn-ghost btn-sm w-full mt-2">
                <Plus size={14} /> Add Attachment
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .task-details-modal {
          max-width: 600px;
          padding: 32px;
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .status-badge {
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: 6px;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 12px;
          display: inline-block;
        }

        .status-badge.todo { background: rgba(148, 163, 184, 0.1); color: var(--text-secondary); }
        .status-badge.in_progress { background: rgba(245, 158, 11, 0.1); color: var(--accent-amber); }
        .status-badge.done { background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald); }

        .task-desc {
          color: var(--text-secondary);
          margin-top: 12px;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .modal-body {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .section h3 {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          margin-bottom: 16px;
          letter-spacing: 0.05em;
        }

        .subtask-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .subtask-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .subtask-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .subtask-item span.completed {
          text-decoration: line-through;
          color: var(--text-secondary);
        }

        .add-subtask {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .add-subtask input {
          flex: 1;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--glass-border);
          padding: 8px 12px;
          border-radius: 8px;
          color: var(--text-primary);
          outline: none;
        }

        .add-subtask button {
          background: var(--primary);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .text-emerald { color: var(--accent-emerald); }
        .text-secondary { color: var(--text-secondary); }

        .attachment-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          margin-bottom: 8px;
          font-size: 0.85rem;
        }

        .empty-text {
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-style: italic;
        }

        .w-full { width: 100%; }
        .mt-2 { margin-top: 8px; }
      `}</style>
    </div>
  );
};

export default TaskDetailsModal;
