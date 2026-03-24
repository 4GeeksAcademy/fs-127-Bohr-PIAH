import { useState, useEffect } from "react";
import "./CssModalProject.css";
import "./CssCard.css";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { createProject, updateProject, deleteProject } from "../../services/projectService.js";
import { toast } from "react-toastify";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

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
  const [userSearch, setUserSearch] = useState("");
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [confirm, setConfirm] = useState({ isOpen: false, message: "", onConfirm: null });

  useEffect(() => {
    if (isOpen) {
      setFormData(isEdit && initialData ? initialData : emptyForm);
      setUserSearch("");
      setShowUserSuggestions(false);
    }
  }, [isOpen, isEdit, initialData]);

  if (!isOpen) return null;

  const { nombre, wpDeadline, taskDeadline, users: selectedUsers = [] } = formData;

  const onChange = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));
  const onAddUser = (userId) => {
    if (!userId || selectedUsers.includes(Number(userId))) return;
    setFormData(prev => ({ ...prev, users: [...prev.users, Number(userId)] }));
  };
  const onDeleteUser = (index) => setFormData(prev => ({ ...prev, users: prev.users.filter((_, i) => i !== index) }));

  const today = new Date().toISOString().split("T")[0];
  const isAdmin = store.user?.role === "admin";
  const effectiveDepartmentId = isAdmin ? formData.department_id : store.currentDepartment?.id;

  const handleCreate = async () => {
    if (!effectiveDepartmentId) {
      toast.error(isAdmin ? "Select a department for this project." : "No department assigned to your user.");
      return;
    }
    if (!formData.nombre?.trim()) {
      toast.error("Project name is required.");
      return;
    }
    if (formData.wpDeadline && formData.taskDeadline && formData.taskDeadline < formData.wpDeadline) {
      toast.error("End date must be on or after start date.");
      return;
    }
    setIsSaving(true);
    try {
      const user_emails = (formData.users || [])
        .map(id => users.find(u => u.id === id)?.email)
        .filter(Boolean);
      const data = await createProject(store.token, {
        name: formData.nombre,
        department_id: effectiveDepartmentId,
        created_by: store.user.id,
        created_at: formData.wpDeadline ? `${formData.wpDeadline}T00:00:00` : null,
        deadline: formData.taskDeadline ? `${formData.taskDeadline}T23:59:59` : null,
        user_emails,
      });
      if (data) {
        dispatch({ type: "add_project", payload: { ...data, workPackages: [] } });
        dispatch({ type: "set_current_project", payload: data.id });
      }
      onClose();
    } catch (err) {
      console.error("Error creando proyecto", err);
      toast.error(err.message || "Error creating project.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (formData.wpDeadline && formData.taskDeadline && formData.taskDeadline < formData.wpDeadline) {
      toast.error("End date must be on or after start date.");
      return;
    }
    setIsSaving(true);
    try {
      const selectedEmails = (formData.users || [])
        .map(id => users.find(u => u.id === id)?.email)
        .filter(Boolean);
      // Ensure the current user is never removed from their own project
      const currentUserEmail = store.user?.email;
      const user_emails = currentUserEmail && !selectedEmails.includes(currentUserEmail)
        ? [...selectedEmails, currentUserEmail]
        : selectedEmails;
      await updateProject(store.token, store.currentProjectId, {
        name: formData.nombre,
        created_at: formData.wpDeadline ? `${formData.wpDeadline}T00:00:00` : null,
        deadline: formData.taskDeadline ? `${formData.taskDeadline}T23:59:59` : null,
        finalized: formData.finalized,
        user_emails,
      });
      const savedProjectId = store.currentProjectId;
      await actions.getUserProjects(store.user.id);
      dispatch({ type: "validate_current_project", payload: savedProjectId });
      onClose();
    } catch (err) {
      console.error("Error actualizando proyecto", err);
      toast.error(err.message || "Error updating project.");
    } finally {
      setIsSaving(false);
    }
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
    if (user) return `${user.first_name} ${user.last_name}`;
    // Fallback: search in initialData.users_data if store.users hasn't loaded yet
    const fromInitial = initialData?.users_data?.find(u => u.id === id);
    return fromInitial ? `${fromInitial.first_name} ${fromInitial.last_name}` : `User #${id}`;
  };

  const availableUsers = users.filter(u => !selectedUsers.includes(u.id));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEdit) handleUpdate();
    else handleCreate();
  };

  return (
    <div className="modal-cyber-overlay" onClick={onClose}>
      <div className="modal-cyber-container" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-cyber-title">{isEdit ? "Edit Project" : title}</h3>

        <form onSubmit={handleFormSubmit}>
        {isAdmin && !isEdit && (
          <>
            <label className="cyber-label">Department</label>
            <select
              className="cyber-input"
              value={formData.department_id || ""}
              onChange={(e) => onChange("department_id", Number(e.target.value))}
            >
              <option value="" disabled>Select a department...</option>
              {store.departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </>
        )}

        <label className="cyber-label">Project</label>
        <input
          className="cyber-input"
          type="text"
          value={nombre}
          maxLength={255}
          onChange={(e) => onChange("nombre", e.target.value)}
        />

        <label className="cyber-label">Start Project</label>
        <input
          className="cyber-input"
          type="date"
          value={wpDeadline}
          onChange={(e) => {
            const start = e.target.value;
            onChange("wpDeadline", start);
            if (!isEdit && start) {
              const end = new Date(start);
              end.setMonth(end.getMonth() + 6);
              onChange("taskDeadline", end.toISOString().split("T")[0]);
            }
          }}
        />

        <label className="cyber-label">End Project</label>
        <input
          className="cyber-input"
          type="date"
          value={taskDeadline}
          min={wpDeadline || today}
          onChange={(e) => onChange("taskDeadline", e.target.value)}
        />

        {/* --- USERS AUTOCOMPLETE --- */}
        <h4 className="cyber-subtitle">Users</h4>

        <div style={{ position: "relative" }}>
          <input
            className="cyber-input"
            type="text"
            placeholder="Search user..."
            value={userSearch}
            onChange={(e) => { setUserSearch(e.target.value); setShowUserSuggestions(true); }}
            onFocus={() => setShowUserSuggestions(true)}
            onBlur={() => setTimeout(() => setShowUserSuggestions(false), 150)}
          />
          {showUserSuggestions && userSearch && (
            <ul style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 999,
              background: "#1a1a2e", border: "1px solid #27E6D6", borderRadius: "4px",
              listStyle: "none", margin: 0, padding: 0, maxHeight: "150px", overflowY: "auto"
            }}>
              {availableUsers
                .filter(u => `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase()))
                .map(u => (
                  <li
                    key={u.id}
                    onMouseDown={() => { onAddUser(u.id); setUserSearch(""); setShowUserSuggestions(false); }}
                    style={{ padding: "8px 12px", cursor: "pointer", color: "#e0e0e0", borderBottom: "1px solid #2a2a4a" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#27E6D620"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {u.first_name} {u.last_name}
                    <span style={{ fontSize: "0.75rem", color: "#888", marginLeft: "8px" }}>{u.email}</span>
                  </li>
                ))
              }
            </ul>
          )}
        </div>

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

        <div className="modal-cyber-footer mt-4" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {isEdit ? (
            <>
              <button
                type="button"
                className="cyber-btn-danger"
                style={{ flex: 1, height: "44px", fontSize: "0.85rem", width: "auto" }}
                disabled={isSaving}
                onClick={() => setConfirm({
                  isOpen: true,
                  message: "Are you sure you want to delete this project?",
                  onConfirm: () => { setConfirm(c => ({ ...c, isOpen: false })); handleDelete(); }
                })}
              >
                Delete
              </button>
              <button
                type="button"
                className="cyber-btn-primary"
                style={{ flex: 1, height: "44px", fontSize: "0.85rem", width: "auto", marginTop: 0 }}
                disabled={isSaving}
                onClick={async () => {
                  const newFinalized = !formData.finalized;
                  setIsSaving(true);
                  try {
                    await updateProject(store.token, store.currentProjectId, { finalized: newFinalized });
                    dispatch({
                      type: "set_projects",
                      payload: store.projects.map(p =>
                        p.id === store.currentProjectId ? { ...p, finalized: newFinalized } : p
                      )
                    });
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
          ) : <div style={{ flex: 2 }} />}
          <button type="button" className="cyber-btn-outline" style={{ flex: 1, height: "44px", fontSize: "0.85rem" }} onClick={onClose} disabled={isSaving}>Cancel</button>
          <button type="submit" className="cyber-btn" style={{ flex: 1, height: "44px", fontSize: "0.85rem", width: "auto", marginTop: 0 }} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
        </form>
        <ConfirmModal
          isOpen={confirm.isOpen}
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(c => ({ ...c, isOpen: false }))}
        />
      </div>
    </div>
  );
}
