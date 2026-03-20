import React from "react";
import { Pencil } from "lucide-react";

export const KanbanTask = ({ task, onEdit }) => {

    // Modificado por Paty: añadimos más campos para mostrar en la tarjeta
    const { name, alert, deadline, todo_by_user } = task;

    // Formateamos la fecha si existe
    const formattedDeadline = deadline
        ? new Date(deadline).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
        : null;

    return (
        <div className="feature-item p-2 text-white small shadow-sm w-100"
            style={{
                cursor: "grab",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(39, 230, 214, 0.1)",
                borderRadius: "6px",
                marginBottom: "4px",
                overflow: "hidden"
            }}>

            {/* FILA SUPERIOR: nombre + punto rojo + lápiz */}
            <div className="d-flex align-items-center w-100 flex-nowrap">
                <div className="text-truncate flex-grow-1" style={{ fontSize: "0.85rem", opacity: 0.9, minWidth: 0 }}>
                    {name || "Untitled Task"}
                </div>

                <div className="d-flex align-items-center gap-2 ps-2" style={{ flexShrink: 0 }}>
                    {alert === true && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff4d4d', boxShadow: '0 0 8px #ff4d4d' }}></div>
                    )}
                    <div style={{ cursor: "pointer", padding: "2px" }}
                        onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                        <Pencil size={14} color="#27E6D6" className="opacity-50" />
                    </div>
                </div>
            </div>

            {/* FILA INFERIOR: usuario asignado + deadline — Añadido por Paty */}
            {(todo_by_user || formattedDeadline) && (
                <div className="d-flex justify-content-between align-items-center mt-1" style={{ fontSize: "0.72rem", opacity: 0.6 }}>
                    
                    {/* Usuario asignado */}
                    {todo_by_user && (
                        <span style={{ color: "#27E6D6" }}>
                            👤 {todo_by_user.first_name} {todo_by_user.last_name}
                        </span>
                    )}

                    {/* Deadline */}
                    {formattedDeadline && (
                        <span style={{ color: "#ffc107" }}>
                            📅 {formattedDeadline}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};