import { useState, useEffect } from "react";
import "./CssModalProject.css";
import "./CssCard.css";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { createProject, updateProject, deleteProject } from "../../services/projectService.js";

const emptyForm = { nombre: "", wpDeadline: "", taskDeadline: "", users: [] };

export default function ModalProject({
  isOpen,
  onClose,
  title = "Add New Project",
  initialData,
  isEdit,
  users = [],
  onFinalizedChange
}) {
  const { store, dispatch, actions } = useGlobalReducer();
  const [formData, setFormData] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(isEdit && initialData ? initialData : emptyForm);
    }
  }, [isOpen, isEdit]);

  if (!isOpen) return null;

  const { nombre, wpDeadline, taskDeadline, users: selectedUsers = [] } = formData;

  const onChange = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));
  const onAddUser = (userId) => {
    if (!userId || selectedUsers.includes(Number(userId))) return;
    setFormData(prev => ({ ...prev, users: [...prev.users, Number(userId)] }));
  };
  const onDeleteUser = (index) => setFormData(prev => ({ ...prev, users: prev.users.filter((_, i) => i !== index) }));

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      const data = await createProject(store.token, {
        name: formData.nombre,
        department_id: store.currentDepartment?.id || null,
        created_by: store.user.id,
        deadline: formData.taskDeadline || null,
      });
      if (data) {
        dispatch({ type: "add_project", payload: data });
        dispatch({ type: "set_current_project", payload: data.id });
      }
    } catch (err) {
      console.error("Error creando proyecto", err);
    } finally {
      setIsSaving(false);
    }
    onClose();
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      await updateProject(store.token, store.currentProjectId, formData);
      await actions.getUserProjects(store.user.id);
    } catch (err) {
      console.error("Error actualizando proyecto", err);
    } finally {
      setIsSaving(false);
    }
    onClose();
  };

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      await deleteProject(store.token, store.currentProjectId);
      dispatch({ type: "set_current_project", payload: null });
      await actions.getUserProjects(store.user.id);
    } catch (err) {
      console.error("Error eliminando proyecto", err);
    } finally {
      setIsSaving(false);
    }
    onClose();
  };

  const getUserName = (id) => {
    const user = users.find(u => u.id === id);
    return user ? `${user.first_name} ${user.last_name}` : "";
  };

  const availableUsers = users.filter(u => !selectedUsers.includes(u.id));

  return (
    <div className="modal-cyber-overlay" onClick={onClose}>
      <div className="modal-cyber-container" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-cyber-title">{isEdit ? "Edit Project" : title}</h3>

        <label className="cyber-label">Project</label>
        <input
          className="cyber-input"
          type="text"
          value={nombre}
          onChange={(e) => onChange("nombre", e.target.value)}
        />

        <label className="cyber-label">Start Project</label>
        <input
          className="cyber-input"
          type="date"
          value={wpDeadline}
          onChange={(e) => onChange("wpDeadline", e.target.value)}
        />

        <label className="cyber-label">End Project</label>
        <input
          className="cyber-input"
          type="date"
          value={taskDeadline}
          onChange={(e) => onChange("taskDeadline", e.target.value)}
        />

        {/* --- USERS DROPDOWN --- */}
        <h4 className="cyber-subtitle">Users</h4>

        <select
          className="cyber-input"
          value=""
          onChange={(e) => onAddUser(e.target.value)}
          disabled={availableUsers.length === 0}
        >
          <option value="" disabled>
            {availableUsers.length === 0 ? "No users available" : "Select a user to add..."}
          </option>
          {availableUsers.map(u => (
            <option key={u.id} value={u.id}>
              {u.first_name} {u.last_name} — {u.email}
            </option>
          ))}
        </select>

        <div className="d-flex flex-wrap gap-2 mt-2">
          {selectedUsers.map((userId, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "#1a1a2e", border: "1px solid #27E6D6",
                borderRadius: "4px", padding: "4px 10px", color: "#e0e0e0", fontSize: "0.875rem"
              }}
            >
              {getUserName(userId)}
              <span
                onClick={() => onDeleteUser(i)}
                style={{ cursor: "pointer", color: "#ff4d4d", fontWeight: "bold", lineHeight: 1 }}
              >✕</span>
            </span>
          ))}
        </div>

        <div className="modal-cyber-footer mt-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex gap-2">
            {isEdit && (
              <>
                <button
                  className="cyber-btn-danger"
                  disabled={isSaving}
                  onClick={() => {
                    if (window.confirm("¿Estás seguro de eliminar este proyecto?")) {
                      handleDelete();
                    }
                  }}
                >
                  Delete
                </button>
                <button
                  className="cyber-btn"
                  style={{ background: "rgba(39,230,214,0.15)", borderColor: "#27E6D6" }}
                  disabled={isSaving}
                  onClick={async () => {
                    const newFinalized = !formData.finalized;
                    setIsSaving(true);
                    try {
                      await updateProject(store.token, store.currentProjectId, { finalized: newFinalized });
                      await actions.getUserProjects(store.user.id);
                      onFinalizedChange?.(newFinalized);
                    } catch (err) {
                      console.error("Error actualizando estado del proyecto", err);
                    } finally {
                      setIsSaving(false);
                    }
                    onClose();
                  }}
                >
                  {formData.finalized ? "Reactivate" : "Finished"}
                </button>
              </>
            )}
          </div>
          <div className="d-flex gap-2">
            <button className="cyber-btn-outline" onClick={onClose} disabled={isSaving}>Cancel</button>
            <button className="cyber-btn" onClick={isEdit ? handleUpdate : handleCreate} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
