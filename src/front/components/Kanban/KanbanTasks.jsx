import React from "react";

export const KanbanTask = ({ task }) => {

    const { name, alert } = task;


    return (
        <div className="feature-item p-2 text-white small shadow-sm" 
             style={{ 
                 cursor: "grab", 
                 background: "rgba(255, 255, 255, 0.05)", 
                 border: "1px solid rgba(39, 230, 214, 0.1)",
                 borderRadius: "6px",
                 marginBottom: "4px"
             }}>

             {/* PUNTO ROJO DE ALERTA */}
        
            {alert === true && (
                <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#ff4d4d', 
                    boxShadow: '0 0 8px #ff4d4d', 
                    flexShrink: 0 
                }}></div>
            )}
            
            {/* 3. MOSTRAMOS EL NOMBRE */}
            <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                {name || "Untitled Task"}</span>
        </div>
    );
};
