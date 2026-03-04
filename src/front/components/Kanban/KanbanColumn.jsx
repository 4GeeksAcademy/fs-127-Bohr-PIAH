import React from "react";
import { KanbanTask } from "./KanbanTasks";
import { CirclePlus } from "lucide-react";
import { useRef } from "react";

export const KanbanColumn = ({ columnRef, tasks, title, borderColor, ledColor, onAddTask, addingTask, newTaskText, setNewTaskText, confirmAddTask, setAddingTask }) => {


    const containerRef = useRef(null);

    // Maneja click dentro de la columna: si hay input visible, se oculta
    const handleColumnClick = (event) => {
        // Evita cerrar el input si se hace click sobre el input o el botón +
        if (
            addingTask &&
            !event.target.closest('input') &&
            !event.target.closest('button')
        ) {
            setNewTaskText("");
            setAddingTask(false); // <--- oculta el input
        }
    };

    return (

        <div
            ref={containerRef}
            className={`p-3 rounded-4 border ${borderColor} border-opacity-25 bg-black bg-opacity-25`}
            style={{ minWidth: "260px", flex: "1" }}
            onClick={handleColumnClick}
        >

            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center gap-3">
                    <div
                        style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: ledColor,
                            boxShadow: `0 0 10px ${ledColor}`
                        }}
                    />
                    <p className="feature-title mb-0" style={{ fontSize: "0.85rem", color: "#FFFFFF" }}>{title}</p>
                </div>

                {onAddTask && (
                    <button
                        className="btn btn-sm btn-outline-light d-flex align-items-center justify-content-center"
                        onClick={onAddTask}
                        style={{ width: "28px", height: "28px", padding: 0 }}
                    >
                        <CirclePlus size={20} />
                    </button>
                )}
            </div>

            {/* Input para nueva tarea */}
            {addingTask && (
                <div className="d-flex gap-2 mb-2">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && confirmAddTask()}
                        placeholder="Nueva tarea..."
                        autoFocus
                    />
                    <button className="btn btn-sm btn-success" onClick={confirmAddTask}>Add</button>
                </div>
            )}

            {/* Lista de tareas */}
            <div ref={columnRef} className="d-flex flex-column gap-2" style={{ minHeight: "150px" }}>
                {tasks.map((task, index) => (
                    <KanbanTask key={`${title}-${index}`} task={task} />
                ))}
            </div>

        </div>
    );
};