import React, { useState, useEffect } from "react";
import "./CssNewDpto.css";
import "./CssCardDpto.css";

export default function New_Dpto({ onCancel, onCreate, initialData = null, isEdit = false, allUsers = [], currentUser = null }) {
  const [formDpto, setFormDpto] = useState({
    department_name: "",
    user_ids: [],
    head_id: null,
  });

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
  const eligibleLeaders = selectedUsers.filter(u => u.role === "admin" || u.role === "head");

  const addUser = (userId) => {
    const id = Number(userId);
    if (!id || formDpto.user_ids.includes(id)) return;
    setFormDpto(prev => ({ ...prev, user_ids: [...prev.user_ids, id] }));
  };

  const removeUser = (userId) => {
    setFormDpto(prev => ({
      ...prev,
      user_ids: prev.user_ids.filter(id => id !== userId),
      head_id: prev.head_id === userId ? null : prev.head_id,
    }));
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onCreate({
        department_name: formDpto.department_name.trim(),
        user_ids: formDpto.user_ids,
        head_id: formDpto.head_id,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const chipStyle = {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "#1a1a2e", border: "1px solid #27E6D6",
    borderRadius: "4px", padding: "4px 10px", color: "#e0e0e0", fontSize: "0.875rem"
  };

  return (
    <div className="modal-overlay-cyber">
      <div className="modal-cyber-box">
        <button className="modal-cyber-close" onClick={onCancel}>✕</button>
        <h3 className="modal-cyber-title">{isEdit ? "Edit Department" : "New Department"}</h3>

        <form className="cyber-form" onSubmit={handleSubmit}>
          <label className="cyber-label">Department name</label>
          <input
            type="text"
            className="cyber-input"
            value={formDpto.department_name}
            onChange={(e) => setFormDpto({ ...formDpto, department_name: e.target.value })}
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

          <label className="cyber-label mt-3">Team Leader</label>
          {eligibleLeaders.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.85rem", margin: "4px 0" }}>
              Add members with role admin or head to assign a leader.
            </p>
          ) : (
            <select
              className="cyber-input"
              value={formDpto.head_id || ""}
              onChange={(e) => setFormDpto({ ...formDpto, head_id: e.target.value ? Number(e.target.value) : null })}
            >
              <option value="">None</option>
              {eligibleLeaders.map(u => (
                <option key={u.id} value={u.id}>
                  {u.first_name} {u.last_name}
                </option>
              ))}
            </select>
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
