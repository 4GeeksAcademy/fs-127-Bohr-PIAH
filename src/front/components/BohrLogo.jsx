import React from "react";

export const BohrLogo = ({ size = "40px", color = "#27E6D6" }) => {
   

    return (
        <div style={{ width: size, height: size, display: "inline-block" }}>
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org">
                {/* Núcleo con brillo */}
                <circle cx="60" cy="60" r="12" fill={color} style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
                
                {/* Órbita 1 */}
                <ellipse cx="60" cy="60" rx="48" ry="20" fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.3" />
                <circle cx="108" cy="60" r="4" fill={color} />

                {/* Órbita 2 (60°) */}
                <g transform="rotate(60 60 60)">
                    <ellipse cx="60" cy="60" rx="48" ry="20" fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.3" />
                    <circle cx="108" cy="60" r="4" fill={color} />
                </g>

                {/* Órbita 3 (-60°) */}
                <g transform="rotate(-60 60 60)">
                    <ellipse cx="60" cy="60" rx="48" ry="20" fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.3" />
                    <circle cx="108" cy="60" r="4" fill={color} />
                </g>
            </svg>
        </div>
    );
};
