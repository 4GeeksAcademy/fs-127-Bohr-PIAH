import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useState } from "react";
import "../index.css";
import Lottie from "lottie-react";
import atomo from "../assets/atomoLottie.json"
import { UserCheck, Orbit, Zap, Columns3, UserPlus, BellRing, ShieldCheck, Briefcase, User, ClipboardList, BarChart3, UserCog, Milestone, Gauge, FileDown, PieChart, FastForward, LayoutDashboard, Move, CheckSquare, ArrowUpCircle, Users, Bell, Clock } from 'lucide-react';
import { useRef } from "react";



export const Home = () => {

    const rolesRef = useRef(null);
    const seguimientoRef = useRef(null);
    const reportesRef = useRef(null);
    const kanbanRef = useRef(null);
    const alertasRef = useRef(null);
    const rolesSectionRef = useRef(null);


    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };


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
            <div className="glass-card-yellow">
                <div className="features-grid">

                    <div className="feature-item" onClick={() => scrollToSection(rolesSectionRef)} style={{ cursor: 'pointer' }}>
                        
                        <UserCheck size={40} strokeWidth={1.5} color="#27E6D6" />
                        <p className="feature-title">Roles Simplificados</p>
                        <p className="feature-description">
                            Admin, jefe de equipo y trabajador. <br />
                            Acceso con permisos ajustados.
                        </p>
                    </div>

                        <div className="feature-item" onClick={() => scrollToSection(seguimientoRef)} style={{ cursor: 'pointer' }}>
                        <Orbit size={40} strokeWidth={1.5} color="#27E6D6" />
                        <p className="feature-title">Seguimiento Intuitivo</p>
                        <p className="feature-description">
                            Reportes diarios y progreso semanal <br />
                            individual por proyecto.
                        </p>
                    </div>

                        <div className="feature-item" onClick={() => scrollToSection(reportesRef)} style={{ cursor: 'pointer' }}>
                        <Zap size={40} strokeWidth={1.5} color="#27E6D6" />
                        <p className="feature-title">Reportes Automatizados</p>
                        <p className="feature-description">
                            Análisis de datos en tiempo real. <br />
                            Exporta informe en un solo click
                        </p>
                    </div>

                        <div className="feature-item" onClick={() => scrollToSection(kanbanRef)} style={{ cursor: 'pointer' }}>
                        <Columns3 size={40} strokeWidth={1.5} color='#27E6D6' />
                        <p className="feature-title">Kanban Drag & Drop</p>
                        <p className="feature-description">
                            Mueva tareas con soltura entre estados.
                        </p>

                    </div>
                        <div className="feature-item" onClick={() => scrollToSection(alertasRef)} style={{ cursor: 'pointer' }}>
                        <UserPlus size={40} strokeWidth={1.5} color="#27E6D6" />
                        <p className="feature-title">Colaboración Externa</p>
                        <p className="feature-description">
                            Invita a terceros y clientes <br />
                            con un solo clic.
                        </p>
                    </div>


                      <div className="feature-item" onClick={() => scrollToSection(alertasRef)} style={{ cursor: 'pointer' }}>
                        <BellRing size={40} strokeWidth={1.5} color="#27E6D6" />
                        <p className="feature-title">Notificaciones</p>
                        <p className="feature-description">
                            Alertas en tiempo real.
                        </p>
                    </div>
                </div>
            </div>

            <div className="section-sub-title" ref={rolesSectionRef}>ROLES</div>
            <p className="roles-section-description">Asigne permisos específicos y garantice que cada miembro del equipo tenga las herramientas necesarias para su función.</p>

            <div className="glass-card-yellow">

                <div className="features-grid">

                    <div className="sub-feature">
                        <ShieldCheck size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Administrador</p>
                        <p className="feature-description">
                            Control total del sistema, <br />
                            gestión de usuarios y analíticas.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <Briefcase size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Jefe de Equipo</p>
                        <p className="feature-description">
                            Gestionar el equipo, <br />
                            crear proyectos.
                        </p>
                    </div>


                    <div className="sub-feature">
                        <User size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Trabajador</p>
                        <p className="feature-description">
                            Modifica tareas asignadas, <br />
                            ve el progreso del proyecto.
                        </p>
                    </div>

                </div>
            </div>

            <div className="section-sub-title" ref={seguimientoRef}>SEGUIMIENTO INTUITIVO</div>
            <p className="roles-section-description">
                Monitoree el avance con reportes diarios y progreso semanal <br />
                individualizado para cada miembro del proyecto.
            </p>

            <div className="glass-card-yellow">
                <div className="features-grid">
                    
                    <div className="sub-feature">
                        <ClipboardList size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Reportes Diarios</p>
                        <p className="feature-description">Documente el avance <br /> de cada jornada.</p>
                    </div>

                    
                    <div className="sub-feature">
                        <BarChart3 size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Progreso Semanal</p>
                        <p className="feature-description">Métricas de rendimiento <br /> y tendencias de equipo.</p>
                    </div>

                    <div className="sub-feature">
                        <UserCog size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Individual</p>
                        <p className="feature-description">Seguimiento detallado <br /> por cada integrante.</p>
                    </div>

                   
                    <div className="sub-feature">
                        <Milestone size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Hitos clave</p>
                        <p className="feature-description">Control de entregas <br /> y puntos de éxito.</p>
                    </div>
                </div>
            </div>

            <div className="section-sub-title" ref={reportesRef}>REPORTES AUTOMATIZADOS</div>
            <p className="roles-section-description">
                Genere informes detallados con un solo clic. <br />
                Visualice métricas de éxito y porcentajes de avance.
            </p>

            <div className="glass-card-yellow">
                <div className="features-grid">
                    
                    <div className="sub-feature">
                        <Gauge size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Análisis Real-Time</p>
                        <p className="feature-description">Datos actualizados al instante <br /> de cada movimiento.</p>
                    </div>

                    
                    <div className="sub-feature">
                        <FileDown size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Reporte One-Click</p>
                        <p className="feature-description">Botón inteligente para <br /> exportar PDF del proyecto.</p>
                    </div>

                   
                    <div className="sub-feature">
                        <PieChart size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Cálculo de Avance</p>
                        <p className="feature-description">Visualización clara del % <br /> trabajado vs pendiente.</p>
                    </div>

                    
                    <div className="sub-feature">
                        <FastForward size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Proyección</p>
                        <p className="feature-description">Estimación automática de <br /> fechas de cierre reales.</p>
                    </div>
                </div>
            </div>

            <div className="section-sub-title"ref={kanbanRef}>KANBAN DRAG & DROP</div>
            <p className="roles-section-description">
                Mueva tareas con soltura entre estados. <br />
                Organice su flujo de trabajo de forma visual y dinámica.
            </p>

            <div className="glass-card-yellow">
                <div className="features-grid">
                   
                    <div className="sub-feature">
                        <LayoutDashboard size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Flujo Dinámico</p>
                        <p className="feature-description">
                            Columnas adaptables <br />
                            según cada proyecto.
                        </p>
                    </div>

                   
                    <div className="sub-feature">
                        <Move size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Drag & Drop</p>
                        <p className="feature-description">
                            Mueva sus tareas <br />
                            con total libertad.
                        </p>
                    </div>

                  
                    <div className="sub-feature">
                        <CheckSquare size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Control Total</p>
                        <p className="feature-description">
                            Gestión de estados <br />
                            desde inicio a fin.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <ArrowUpCircle size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Priorización</p>
                        <p className="feature-description">
                            Destaque lo urgente <br />
                            con un solo clic.
                        </p>
                    </div>
                </div>
            </div>

            <div className="section-sub-title"ref={alertasRef}>COLABORACIÓN Y ALERTAS</div>
            <p className="roles-section-description">
                Invite a terceros y clientes con un solo clic. <br />
                Manténgase informado con notificaciones en tiempo real.
            </p>

            <div className="glass-card-yellow">
                <div className="features-grid">
                 
                    <div className="sub-feature">
                        <UserPlus size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Invitar Terceros</p>
                        <p className="feature-description">Añada colaboradores <br /> externos fácilmente.</p>
                    </div>

                   
                    <div className="sub-feature">
                        <Users size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Acceso Clientes</p>
                        <p className="feature-description">Permisos de lectura <br /> para sus clientes.</p>
                    </div>

                   
                    <div className="sub-feature">
                        <Bell size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Alertas</p>
                        <p className="feature-description">Notificaciones de <br /> cambios críticos.</p>
                    </div>

                   
                    <div className="sub-feature">
                        <Clock size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Historial</p>
                        <p className="feature-description">Registro de toda <br /> la actividad.</p>
                    </div>
                </div>
            </div>




        </div>
    );
};