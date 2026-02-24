import React from "react";
import "./CssModalProject.css";

export default function ModalProject({
  isOpen,
  onClose,
  title = "Add New Project",
  data,
  onChange,
  onAddUser,
  onDeleteUser,
  onChangeUser,
  onSubmit
}) {
  if (!isOpen) return null;

  const {
    nombre,
    wpDeadline,
    taskDeadline,
    users = [],
    notificaciones,
    finalizado
  } = data;

  return (
    <div className="modal-cyber-overlay" onClick={onClose}>
      <div
        className="modal-cyber-container"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="modal-cyber-title">{title}</h3>

        {/* Nombre */}
        <label className="cyber-label">Nombre</label>
        <input
          className="cyber-input"
          type="text"
          value={nombre}
          onChange={(e) => onChange("nombre", e.target.value)}
        />

        {/* WP Deadline */}
        <label className="cyber-label">Default WP deadline</label>
        <input
          className="cyber-input"
          type="date"
          value={wpDeadline}
          onChange={(e) => onChange("wpDeadline", e.target.value)}
        />

        {/* Task Deadline */}
        <label className="cyber-label">Default task deadline</label>
        <input
          className="cyber-input"
          type="date"
          value={taskDeadline}
          onChange={(e) => onChange("taskDeadline", e.target.value)}
        />

        {/* Usuarios */}
        <h4 className="cyber-subtitle">Usuarios</h4>

        <div className="cyber-user-list">
          {users.map((u, i) => (
            <div key={i} className="cyber-user-item">
              <input
                className="cyber-input"
                type="text"
                placeholder="Nombre del usuario"
                value={u.value}
                onChange={(e) => onChangeUser(i, e.target.value)}
              />

              <button
                className="cyber-btn-danger"
                onClick={() => onDeleteUser(i)}
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        <button
          className="cyber-btn-outline"
          style={{ width: "100%", marginTop: "10px" }}
          onClick={onAddUser}
        >
          Añadir usuario
        </button>

        {/* Checkboxes */}
        <div className="cyber-checkbox">
          <input
            type="checkbox"
            checked={notificaciones}
            onChange={(e) => onChange("notificaciones", e.target.checked)}
          />
          <label>Notificaciones</label>
        </div>

        {/*Footer */}
        <div className="modal-cyber-footer">
          <button className="cyber-btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button className="cyber-btn" onClick={onSubmit}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
