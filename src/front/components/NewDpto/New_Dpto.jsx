import { useState, useEffect } from "react";
import "./CssNewDpto.css";
import "./CssCardDpto.css";

export default function New_Dpto({ onCancel, onCreate, initialData = null, isEdit = false, allUsers = [], currentUser = null }) {
  const [formDpto, setFormDpto] = useState({
    department_name: "",
    user_ids: [],
    head_id: null,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEdit && initialData) {
      setFormDpto({
        department_name: initialData.department_name || "",
        user_ids: Array.isArray(initialData.user_ids) ? initialData.user_ids : [],
        head_id: initialData.head_id || null,
      });
    } else if (!isEdit && currentUser) {
      const canBeHead = currentUser.role === "admin" || currentUser.role === "head";
      setFormDpto({
        department_name: "",
        user_ids: [currentUser.id],
        head_id: canBeHead ? currentUser.id : null,
      });
    }
  }, [isEdit, initialData, currentUser]);

  const availableToAdd = allUsers.filter(u => !formDpto.user_ids.includes(u.id));
  const selectedUsers = allUsers.filter(u => formDpto.user_ids.includes(u.id));
  const currentHead = allUsers.find(u => u.id === formDpto.head_id) || null;
  // Todos los usuarios con role "head" o "admin" disponibles (no solo los ya miembros)
  const availableForHead = allUsers.filter(u => u.id !== formDpto.head_id && (u.role === "head" || u.role === "admin"));

  const addUser = (userId) => {
    const id = Number(userId);
    if (!id || formDpto.user_ids.includes(id)) return;
    setFormDpto(prev => ({ ...prev, user_ids: [...prev.user_ids, id] }));
  };

  const removeUser = (userId) => {
    const u = allUsers.find(u => u.id === userId);
    const name = u ? `${u.first_name} ${u.last_name}` : "este usuario";
    if (!window.confirm(`¿Quitar a ${name} del departamento?`)) return;
    setFormDpto(prev => ({
      ...prev,
      user_ids: prev.user_ids.filter(id => id !== userId),
      head_id: prev.head_id === userId ? null : prev.head_id,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formDpto.department_name.trim()) return;
    setIsSaving(true);
    try {
      await onCreate({
        department_name: formDpto.department_name.trim(),
        user_ids: formDpto.user_ids,
        head_id: formDpto.head_id,
      });
    } catch (err) {
      console.error("Error guardando departamento", err);
      alert(err.message || "Error al guardar el departamento.");
    } finally {
      setIsSaving(false);
    }
  };

  const chipStyle = {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "#1a1a2e", border: "1px solid #27E6D6",
    borderRadius: "4px", padding: "4px 10px", color: "#e0e0e0", fontSize: "0.875rem"
  };

  const headChipStyle = {
    ...chipStyle,
    border: "1px solid #8be0ff",
    background: "rgba(116,185,255,0.08)",
  };

  return (
    <div className="modal-overlay-cyber">
      <div className="modal-cyber-box">
        <button className="modal-cyber-close" onClick={onCancel} disabled={isSaving}>✕</button>
        <h3 className="modal-cyber-title">{isEdit ? "Edit Department" : "New Department"}</h3>

        <form className="cyber-form" onSubmit={handleSubmit}>
          <label className="cyber-label">Department name</label>
          <input
            type="text"
            className="cyber-input"
            value={formDpto.department_name}
            onChange={(e) => setFormDpto(prev => ({ ...prev, department_name: e.target.value }))}
            required
          />

          <label className="cyber-label">Team members</label>
          <select
            className="cyber-input"
            value=""
            onChange={(e) => addUser(e.target.value)}
            disabled={availableToAdd.length === 0}
          >
            <option value="" disabled>
              {availableToAdd.length === 0 ? "No more users available" : "Add a member..."}
            </option>
            {availableToAdd.map(u => (
              <option key={u.id} value={u.id}>
                {u.first_name} {u.last_name} — {u.email}
              </option>
            ))}
          </select>

          <div className="d-flex flex-wrap gap-2 mt-2">
            {selectedUsers.map(u => (
              <span key={u.id} style={chipStyle}>
                {u.first_name} {u.last_name}
                <span
                  onClick={() => removeUser(u.id)}
                  style={{ cursor: "pointer", color: "#ff4d4d", fontWeight: "bold", lineHeight: 1 }}
                >✕</span>
              </span>
            ))}
          </div>

          {/* TEAM LEAD — uno solo */}
          <label className="cyber-label mt-3">Team Lead</label>

          {currentHead ? (
            <div className="d-flex align-items-center gap-2 mt-1">
              <span style={headChipStyle}>
                {currentHead.first_name} {currentHead.last_name}
                <span
                  onClick={() => setFormDpto(prev => ({ ...prev, head_id: null }))}
                  style={{ cursor: "pointer", color: "#ff4d4d", fontWeight: "bold", lineHeight: 1 }}
                >✕</span>
              </span>
            </div>
          ) : (
            <select
              className="cyber-input"
              value=""
              onChange={(e) => {
                const newHeadId = Number(e.target.value);
                setFormDpto(prev => ({
                  ...prev,
                  head_id: newHeadId,
                  user_ids: prev.user_ids.includes(newHeadId) ? prev.user_ids : [...prev.user_ids, newHeadId],
                }));
              }}
              disabled={availableForHead.length === 0}
            >
              <option value="" disabled>
                {availableForHead.length === 0 ? "No users with 'head' or 'admin' role available" : "Select a team lead..."}
              </option>
              {availableForHead.map(u => (
                <option key={u.id} value={u.id}>
                  {u.first_name} {u.last_name} — {u.email}
                </option>
              ))}
            </select>
          )}

          {/* Si hay head asignado, mostrar dropdown para cambiarlo */}
          {currentHead && availableForHead.length > 0 && (
            <>
              <label className="cyber-label mt-2" style={{ fontSize: "0.8rem", color: "#888" }}>
                Change team lead
              </label>
              <select
                className="cyber-input"
                value=""
                onChange={(e) => {
                  const newHeadId = Number(e.target.value);
                  setFormDpto(prev => ({
                    ...prev,
                    head_id: newHeadId,
                    user_ids: prev.user_ids.includes(newHeadId) ? prev.user_ids : [...prev.user_ids, newHeadId],
                  }));
                }}
              >
                <option value="" disabled>Select another member...</option>
                {availableForHead.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.first_name} {u.last_name} — {u.email}
                  </option>
                ))}
              </select>
            </>
          )}

          <div className="modal-cyber-footer">
            <button type="button" className="cyber-btn-secondary" onClick={onCancel} disabled={isSaving}>Cancel</button>
            <button type="submit" className="cyber-btn-success" disabled={isSaving}>
              {isSaving ? "Saving..." : (isEdit ? "Save" : "Add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
