import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useState } from "react";
import "../index.css";
import Lottie from "lottie-react";
import atomo from "../assets/atomoLottie.json"

export const Home = () => {
    return (
        <div className="home-wrapper v1">
            <div className="atom-scene">
                <div className="shadow-floor"></div>
                <div className="atom-loader">
                    {/* SVG con las 3 órbitas y animaciones nativas */}
                    <svg viewBox="0 0 120 120" className="atom" xmlns="http://www.w3.org">
                        <circle cx="60" cy="60" r="12" className="nucleus-glow" />
                        <circle cx="60" cy="60" r="10" className="nucleus" />
                        
                        {/* Órbita 1: Horizontal */}
                        <g className="orbit">
                            <path id="p1" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" />
                            <circle r="4" className="electron">
                                <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
                                    <mpath href="#p1" />
                                </animateMotion>
                            </circle>
                        </g>
                        
                        {/* Órbita 2: Rotada 60° */}
                        <g className="orbit" transform="rotate(60 60 60)">
                            <path id="p2" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" />
                            <circle r="4" className="electron">
                                <animateMotion dur="2.5s" repeatCount="indefinite" rotate="auto" begin="-0.5s">
                                    <mpath href="#p2" />
                                </animateMotion>
                            </circle>
                        </g>
                        
                        {/* Órbita 3: Rotada -60° */}
                        <g className="orbit" transform="rotate(-60 60 60)">
                            <path id="p3" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" />
                            <circle r="4" className="electron">
                                <animateMotion dur="2.2s" repeatCount="indefinite" rotate="auto" begin="-1s">
                                    <mpath href="#p3" />
                                </animateMotion>
                            </circle>
                        </g>
                    </svg>
                </div>
            </div>

            <h2 className="welcome-text">
                BOHR <br />
                <span>Estructura Atómica para la Gestión de Proyectos</span>
            </h2>

            <p className="description-text">
                Gestión de proyectos. Asignación de roles simplificada, seguimiento de estados intuitivo y reportes automatizados. Porque gestionar un equipo no debería ser tan complejo como la física cuántica. Todo lo que necesitas, exactamente donde lo necesitas.
            </p>
        </div>
    );
};