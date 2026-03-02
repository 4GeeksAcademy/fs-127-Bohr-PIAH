import React from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

export const KanbanBoard = () => {

    const [todoRef, todoTasks] = useDragAndDrop(["Tarea 1", "Tarea 2"], { group: "bohrTasks" });
    const [progressRef, progressTasks] = useDragAndDrop(["Tarea 3"], { group: "bohrTasks" });
    const [reviewRef, reviewTasks] = useDragAndDrop(["Tarea 4"], { group: "bohrTasks" });
    const [doneRef, doneTasks] = useDragAndDrop(["Tarea 5"], { group: "bohrTasks" });


    {/* AQUI VENDRIA EL USEEFFECT */ }

    const renderColumn = (ref, tasks, title, color, shadow) => (
        <div className={`p-3 rounded-4 border ${color} border-opacity-25 bg-black bg-opacity-25`} style={{ minWidth: "250px", flex: "1" }}>
            <div className="d-flex align-items-center gap-3 mb-3">
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: shadow, boxShadow: `0 0 10px ${shadow}` }}></div>
                <p className="feature-title mb-0" style={{ fontSize: "0.85rem", color: "#FFFFFF" }}>{title}</p>
            </div>

            {/* PINTAMOS LAS TAREAS */}

            <div ref={ref} className="d-flex flex-column gap-2" style={{ minHeight: "150px" }}>
                {tasks.map((task) => (
                    <div key={task} className="feature-item p-2 text-white small" style={{ cursor: "grab", background: "rgba(255, 255, 255, 0.05)" }}>
                        {task}
                    </div>
                ))}
            </div>
        </div>
    );
 return (
        <div className="accordion-body d-flex flex-row gap-3 align-items-start overflow-auto pb-3">
            {renderColumn(todoRef, todoTasks, "TO DO", "border-info", "#27E6D6")}
            {renderColumn(progressRef, progressTasks, "IN PROGRESS", "border-warning", "#ffc107")}
            {renderColumn(reviewRef, reviewTasks, "IN REVIEW", "border-primary", "#0d6efd")}
            {renderColumn(doneRef, doneTasks, "DONE", "border-success", "#198754")}
        </div>
    );
};