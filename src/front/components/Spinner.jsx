import React from "react";
import "./Spinner.jsx"

export const Spinner = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 w-100 bg-black">
           
            <div className="atom-nav-container" style={{ width: "150px", height: "150px" }}>
                <svg viewBox="0 0 120 120" className="atom-nav" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="10" className="nucleus-glow" />
                    <circle cx="60" cy="60" r="10" className="nucleus" />

                    {/* Órbita 1 */}
                    <g className="orbit">
                        <path id="spin-p1" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" strokeWidth="2" />
                        <circle r="4" className="electron">
                            <animateMotion dur="2s" repeatCount="indefinite" rotate="auto"><mpath href="#spin-p1" /></animateMotion>
                        </circle>
                    </g>

                    {/* Órbita 2 */}
                    <g className="orbit" transform="rotate(60 60 60)">
                        <path id="spin-p2" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" strokeWidth="2" />
                        <circle r="4" className="electron">
                            <animateMotion dur="2.5s" repeatCount="indefinite" rotate="auto" begin="-0.5s"><mpath href="#spin-p2" /></animateMotion>
                        </circle>
                    </g>

                    {/* Órbita 3 */}
                    <g className="orbit" transform="rotate(-60 60 60)">
                        <path id="spin-p3" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" strokeWidth="2" />
                        <circle r="4" className="electron">
                            <animateMotion dur="2.2s" repeatCount="indefinite" rotate="auto" begin="-1s"><mpath href="#spin-p3" /></animateMotion>
                        </circle>
                    </g>
                </svg>
            </div>

            {/* Texto BOHR con brillo */}
            <span className="wellcome-text mt-4" style={{ 
                fontSize: "2rem", 
                textShadow: "0 0 20px var(--c-nuc)", 
                color: "var(--c-nuc)",
                letterSpacing: "8px"
            }}>
                LOADING...
            </span>
        </div>
    );
};