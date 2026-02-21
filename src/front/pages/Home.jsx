import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useState } from "react";
import "../index.css";
import Lottie from "lottie-react";
import atomo from "../assets/atomoLottie.json"
import { UserCheck, Orbit, Zap, Columns3, UserPlus, BellRing } from 'lucide-react';

export const Home = () => {
    return (
        <div className="home-wrapper v1">
            <div className="atom-scene">
                <div className="shadow-floor"></div>
                <div className="atom-loader">
                    {/* SVG con las 3 órbitas y animaciones */}
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
                <span>GESTION DE PROYECTOS PARA EQUIPOS QUE NO FALLAN</span>
                 <span>TODO LO QUE NECESITAS PARA LOGRAR EL ÉXITO DE UNA FORMA SENCILLA E INTUITIVA</span>
            </h2>

            <div className="features-grid">
                <div className="feature-item">
                    <UserCheck size={40} strokeWidth={1.5} color="#27E6D6" />
                    <p className="feature-title">Roles Simplificados</p>
                    <p className="feature-description">
                        Admin, jefe de equipo y trabajador. <br />
                        Acceso con permisos ajustados.
                    </p>
                </div>

                <div className="feature-item">
                    <Orbit size={40} strokeWidth={1.5} color="#27E6D6" />
                    <p className="feature-title">Seguimiento Intuitivo</p>
                    <p className="feature-description">
                        Reportes diarios y progreso semanal <br />
                        individual por proyecto.
                    </p>
                </div>

                <div className="feature-item">
                    <Zap size={40} strokeWidth={1.5} color="#27E6D6" />
                    <p className="feature-title">Reportes Automatizados</p>
                    <p className="feature-description">
                        Análisis de datos en tiempo real. <br />
                        Próximamente disponible.
                    </p>
                </div>

                <div className="feature-item">
                    <Columns3 size={40} strokeWidth={1.5} color='#27E6D6' />
                    <p className="feature-title">Kanban Drag & Drop</p>
                    <p className="feature-description">
                        Mueva tareas con soltura entre estados.
                    </p>

                </div>
                <div className="feature-item">
                    <UserPlus size={40} strokeWidth={1.5} color="#27E6D6" />
                    <p className="feature-title">Colaboración Externa</p>
                    <p className="feature-description">
                        Invita a terceros y clientes <br />
                        con un solo clic.
                    </p>
                </div>

                {/* Notificaciones */}
                <div className="feature-item">
                    <BellRing size={40} strokeWidth={1.5} color="#27E6D6" />
                    <p className="feature-title">Notificaciones</p>
                    <p className="feature-description">
                        Alertas en tiempo real.
                    </p>
                </div>
            </div>

        </div>
    );
};