import React from "react";

import "../ModalProject/CssModalProject.css"
import "../ModalProject/CssCard.css"

export default function ModalTask({
  isOpen,
  onClose,
  title = "Add New",
  data,
  onChange,
  onSubmit,
  onDelete
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


  return (
    <div className="modal-cyber-overlay" onClick={onClose}>
      <div className="modal-cyber-container" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-cyber-title">{title}</h3>

        {/* --- CAMPO NOMBRE --- */}
        <label className="cyber-label">Task Name</label>
        <input
          className="cyber-input"
          type="text"
          value={name} // Usamos la constante directamente
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

        {/* --- DONE BY Y FECHA LÍMITE --- */}
        <div className="row">
          <div className="col-6">
            <label className="cyber-label">To Do By</label>
            <input
              className="cyber-input"
              type="text"
              value={todo_by}
              onChange={(e) => onChange("todo_by", e.target.value)}
            />
          </div>
          <div className="col-6">
            <label className="cyber-label">Deadline</label>
            <input
              className="cyber-input"
              type="date"
              value={deadline}
              onChange={(e) => onChange("deadline", e.target.value)}
            />
          </div>
        </div>

        {/* --- CHECKBOX DE ALERTA (Punto rojo) --- */}
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


          <button type="button" className="cyber-btn-outline" onClick={onClose}>Cancel</button>
          <button type="button" className="cyber-btn" onClick={onSubmit}>Save Task</button>
        </div>
      </div>
    </div>
  );
}