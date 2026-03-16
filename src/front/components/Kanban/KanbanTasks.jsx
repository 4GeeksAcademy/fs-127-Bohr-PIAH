import React from "react";
import { Pencil } from "lucide-react";

export const KanbanTask = ({ task, onEdit }) => {

    const { name, alert } = task;


    return (
        <div className="feature-item p-2 text-white small shadow-sm d-flex align-items-center w-100 flex-nowrap"
            style={{
                cursor: "grab",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(39, 230, 214, 0.1)",
                borderRadius: "6px",
                marginBottom: "4px",
                overflow: "hidden"
            }}>

            {/* NOMBRE de la tarea*/}
            <div className="text-truncate flex-grow-1" style={{ fontSize: "0.85rem", opacity: 0.9, minWidth: 0 }}>
                {name || "Untitled Task"}
            </div>

            {/* ICONOS */}
            <div className="d-flex align-items-center gap-2 ps-2" style={{ flexShrink: 0 }}>

                {/* PUNTO ROJO */}
                {alert === true && (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff4d4d', boxShadow: '0 0 8px #ff4d4d' }}></div>
                )}

                {/* LAPIZ */}
                <div style={{ cursor: "pointer", padding: "2px" }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(task);
                    }}
                >
                    <Pencil size={14} color="#27E6D6" className="opacity-50 hover-opacity-100" />
                </div>
            </div>
        </div>
    );
};