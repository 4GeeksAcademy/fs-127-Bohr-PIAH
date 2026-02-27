import React from "react";
import { KanbanTask } from "./KanbanTask";

export const KanbanColumn = ({ columnRef, tasks, title, borderColor, ledColor }) => {
    return (
        <div className={`p-3 rounded-4 border ${borderColor} border-opacity-25 bg-black bg-opacity-25`} 
             style={{ minWidth: "260px", flex: "1" }}>
            
          
            <div className="d-flex align-items-center gap-3 mb-3">
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: ledColor, boxShadow: `0 0 10px ${ledColor}` }}></div>
                <p className="feature-title mb-0" style={{ fontSize: "0.85rem", color: "#FFFFFF" }}>{title}</p>
            </div>

            {/* map*/}
            <div ref={columnRef} className="d-flex flex-column gap-2" style={{ minHeight: "150px" }}>
                {tasks.map((task, index) => (
                    <KanbanTask key={`${title}-${index}`} task={task} />
                ))}
            </div>
        </div>
    );
};
