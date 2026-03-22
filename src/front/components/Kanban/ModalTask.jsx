import React, { useState } from "react";
import "../ModalProject/CssModalProject.css";
import "../ModalProject/CssCard.css";

export default function ModalTask({
  isOpen,
  onClose,
  title = "Add New",
  data,
  onChange,
  onSubmit,
  onDelete,
  users = [],
  minDate = ""
}) {
  if (!isOpen) return null;

  const {
    name = "",
    task_description = "",
    todo_by = "",
    deadline = "",
    alert = false,
    status = "to_do"
  } = data;

  const [userSearch, setUserSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredUsers = users.filter(u =>
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Busca en el array de usuarios; si no están cargados aún, usa el objeto embebido en la tarea
  const assignedUser = users.find(u => u.id === todo_by);
  const assignedName = assignedUser
    ? `${assignedUser.first_name} ${assignedUser.last_name}`
    : (data.todo_by_user ? `${data.todo_by_user.first_name} ${data.todo_by_user.last_name}` : "");

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSubmit();
    } finally {
      setIsSaving(false);
    }
  };

  // Cuando el usuario hace clic en una sugerencia
  const handleSelectUser = (user) => {
    onChange("todo_by", user.id);  // Guardamos el ID (integer) que espera el backend
    setUserSearch("");
    setShowSuggestions(false);
  };

  // Cuando limpia la selección
  const handleClearUser = () => {
    onChange("todo_by", null);
    setUserSearch("");
  };

  return (
    <div className="modal-cyber-overlay" onClick={onClose}>
      <div className="modal-cyber-container" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-cyber-title">{title}</h3>

        {/* --- CAMPO NOMBRE --- */}
        <label className="cyber-label">Task Name</label>
        <input
          className="cyber-input"
          type="text"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
        />

        {/* --- CAMPO DESCRIPCIÓN --- */}
        <label className="cyber-label">Description</label>
        <textarea
          className="cyber-input"
          rows="3"
          value={task_description}
          onChange={(e) => onChange("task_description", e.target.value)}
        />

        {/* --- TO DO BY Y DEADLINE --- */}
        <div className="row">
          <div className="col-6">
            <label className="cyber-label">To Do By</label>

            {/* Modificado por Paty: autocompletado en vez de input libre */}
            <div style={{ position: "relative" }}>

              {/* Si ya hay usuario asignado, mostramos su nombre con botón para limpiar */}
              {todo_by && assignedName ? (
                <div className="cyber-input d-flex justify-content-between align-items-center">
                  <span>{assignedName}</span>
                  <span
                    onClick={handleClearUser}
                    style={{ cursor: "pointer", color: "#ff4d4d", fontWeight: "bold" }}
                  >✕</span>
                </div>
              ) : (
                // Si no hay usuario asignado, mostramos el buscador
                <input
                  className="cyber-input"
                  type="text"
                  placeholder="Search user..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                />
              )}

              {/* Lista de sugerencias */}
              {showSuggestions && filteredUsers.length > 0 && (
                <ul style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 999,
                  background: "#1a1a2e",
                  border: "1px solid #27E6D6",
                  borderRadius: "4px",
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  maxHeight: "150px",
                  overflowY: "auto"
                }}>
                  {filteredUsers.map(user => (
                    <li
                      key={user.id}
                      onMouseDown={() => handleSelectUser(user)}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        color: "#e0e0e0",
                        borderBottom: "1px solid #2a2a4a"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#27E6D620"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      {user.first_name} {user.last_name}
                      <span style={{ fontSize: "0.75rem", color: "#888", marginLeft: "8px" }}>
                        {user.email}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="col-6">
            <label className="cyber-label">Deadline</label>
            <input
              className="cyber-input"
              type="date"
              value={deadline ? deadline.split("T")[0] : ""}
              min={minDate}
              onChange={(e) => onChange("deadline", e.target.value)}
            />
          </div>
        </div>

        {/* --- CHECKBOX ALERTA --- */}
        <div className="d-flex align-items-center gap-3 mt-3">
          <input
            type="checkbox"
            checked={alert}
            onChange={(e) => onChange("alert", e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label className="cyber-label mb-0">Urgent Alert</label>
        </div>

        <div className="modal-cyber-footer mt-4 d-flex justify-content-between">
          <div>
            {data.id ? (
              <button
                type="button"
                className="cyber-btn-danger"
                style={{ padding: "8px 15px", fontSize: "0.8rem" }}
                onClick={() => {
                  if (window.confirm("Delete task?")) {
                    onDelete(data.id);
                  }
                }}
              >
                Delete
              </button>
            ) : null}
          </div>
          <button type="button" className="cyber-btn-outline" onClick={onClose} disabled={isSaving}>Cancel</button>
          <button type="button" className="cyber-btn" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Task"}
          </button>
        </div>
      </div>
    </div>
  );
}