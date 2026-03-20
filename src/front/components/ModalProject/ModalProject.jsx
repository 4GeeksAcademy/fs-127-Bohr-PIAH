import React from "react";
import "./CssModalProject.css";
import "./CssCard.css";

export default function ModalProject({
  isOpen,
  onClose,
  title = "Add New Project",
  data,
  isEdit,
  onDeleteProject,
  onChange,
  onAddUser,
  onDeleteUser,
  onChangeUser,
  onChangeLeader,
  onSubmit
}) {
  if (!isOpen) return null;

  const {
    nombre,
    wpDeadline,
    taskDeadline,
    users = [],
    teamLeader = ""
  } = data || {};

  return (
    <div className="modal-cyber-overlay" onClick={onClose}>
      <div className="modal-cyber-container" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-cyber-title">{title}</h3>

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

        <h4 className="cyber-subtitle">Team Leader</h4>
        <div className="cyber-user-item">
          <input
            className="cyber-input"
            type="text"
            placeholder="Nombre del líder"
            value={teamLeader}
            onChange={(e) => onChangeLeader(e.target.value)}
          />
        </div>

        <h4 className="cyber-subtitle">Users</h4>
        <div className="cyber-user-list">
          {users.map((u, i) => (
            <div key={i} className="cyber-user-item">
              <input
                className="cyber-input"
                type="text"
                placeholder="Nombre del usuario"
                value={u}
                onChange={(e) => onChangeUser(i, e.target.value)}
              />
              <button className="cyber-btn-danger" onClick={() => onDeleteUser(i)}>
                ✖
              </button>
            </div>
          ))}
        </div>

        <button className="cyber-btn-outline" style={{ width: "100%", marginTop: "10px" }} onClick={onAddUser}>
          Add User
        </button>

        <div className="modal-cyber-footer mt-4 d-flex justify-content-between align-items-center">
          <div>
            {/* Solo mostramos el botón eliminar si estamos en modo edición */}
            {isEdit && (
              <button 
                className="cyber-btn-danger" 
                onClick={() => {
                  if(window.confirm("¿Estás seguro de eliminar este proyecto?")) {
                    onDeleteProject();
                  }
                }}
              >
                Delete Project
              </button>
            )}
          </div>
           <div className="d-flex gap-2">
          <button className="cyber-btn-outline" onClick={onClose}>Cancel</button>
          <button className="cyber-btn" onClick={onSubmit}>Save</button>
        </div>
      </div>
      </div>
    </div>
  );
}
