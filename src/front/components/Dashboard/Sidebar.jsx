import React from "react";
import { BohrLogo } from "../BohrLogo";
import { Link } from "react-router-dom";
import { Orbit, UserCheck, Zap } from "lucide-react";


export const Sidebar = ({ activeProjects }) => {
    return (
        <aside className="col-lg-3 col-md-4">
            <div className="glass-card-yellow p-4 d-flex flex-column gap-3 h-100">

                {/* 3. BOTÓN NEW PROJECT */}
                <Link to="/menuprojects" className="text-decoration-none">
                <div className="feature-item w-100 d-flex align-items-center gap-3 py-3 px-4" style={{ cursor: 'pointer', minHeight: '80px' }}>
                    <UserCheck size={32} strokeWidth={1.5} color="#27E6D6" />
                    <p className="feature-title mb-0" style={{ fontSize: "0.9rem" }}>NEW PROJECT</p>
                </div>
                </Link>

                {/* 2. BOTÓN MY PROYECTS */}
                <div className="feature-item w-100 d-flex align-items-center gap-3 py-3 px-4 mb-2" style={{ cursor: 'pointer', minHeight: '60px' }}>
                    <Orbit size={28} strokeWidth={1.5} color="#27E6D6" />
                    <p className="feature-title mb-0" style={{ fontSize: "0.9rem" }}>MY PROJECTS</p>
                </div>

                {/* CONTENEDOR LISTA DE LOS PROYECTYOS */}
                <div className="projects-list-container d-flex flex-column gap-2"
                    style={{ maxHeight: "300px", overflowY: "auto", padding: "10px 15px", margin: "0 10px", borderLeft: "1px solid rgba(39, 230, 214, 0.1)" }}>

                    {activeProjects.map((project) => (
                        <div key={project.id}
                            className="feature-item w-100 py-2 px-3"
                            style={{ cursor: 'pointer', fontSize: "0.8rem", background: "rgba(0,0,0,0.2)", borderRadius: "10px" }}>
                            <p className="feature-description mb-0 text-white opacity-75" style={{ fontSize: "0.8rem" }}>
                                • {project.nombre || "Untitled Project"}
                            </p>
                        </div>
                    ))}
                </div>


                {/* 4. BOTÓN FINALIZADOS */}
                <div className="feature-item w-100 d-flex align-items-center gap-3 py-3 px-4" style={{ cursor: 'pointer', minHeight: '80px' }}>
                    <Zap size={32} strokeWidth={1.5} color="#27E6D6" />
                    <p className="feature-title mb-0" style={{ fontSize: "0.9rem" }}>FINISHED</p>
                </div>

            </div>
        </aside>
    );
};