import React from "react";

export const KanbanTask = ({ task }) => {
    return (
        <div className="feature-item p-2 text-white small shadow-sm" 
             style={{ cursor: "grab", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(39, 230, 214, 0.1)" }}>
            {task}
        </div>
    );
};
