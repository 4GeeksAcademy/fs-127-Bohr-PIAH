import React from "react";

export default function ModalProject({
  isOpen,
  onClose,
  title = "Add New Project",
  data,
  onChange,
  onAddUser,
  onDeleteUser,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay-modern"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}
    >
      <div
        className="modal-modern"
        style={{
          background: "white",
          borderRadius: "12px",
          width: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}
      >
        <h3 className="modal-title">{title}</h3>

        <div className="modal-body-modern">
          <label className="form-label">Nombre</label>
          <input
            className="form-control mb-3"
            type="text"
            value={data.nombre}
            onChange={(e) => onChange("nombre", e.target.value)}
          />

          <label className="form-label">Default WP deadline</label>
          <input
            className="form-control mb-3"
            type="date"
            value={data.wpDeadline}
            onChange={(e) => onChange("wpDeadline", e.target.value)}
          />

          <label className="form-label">Default task deadline</label>
          <input
            className="form-control mb-3"
            type="date"
            value={data.taskDeadline}
            onChange={(e) => onChange("taskDeadline", e.target.value)}
          />

          <h5 className="mt-3">Add User</h5>
          <ul className="list-group mb-3">
            {data.users.map((u, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                {u}
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDeleteUser(i)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <button className="btn btn-outline-primary w-100 mb-3" onClick={onAddUser}>
            Añadir usuario
          </button>

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={data.notificaciones}
              onChange={(e) => onChange("notificaciones", e.target.checked)}
            />
            <label className="form-check-label">Notificaciones</label>
          </div>

          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              checked={data.finalizado}
              onChange={(e) => onChange("finalizado", e.target.checked)}
            />
            <label className="form-check-label">Finalizado</label>
          </div>
        </div>

        <div className="modal-footer-modern d-flex justify-content-end gap-2">
          <button className="btn btn-light" onClick={onClose}>Cancelar</button>
          <button className="btn btn-success" onClick={onSubmit}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
