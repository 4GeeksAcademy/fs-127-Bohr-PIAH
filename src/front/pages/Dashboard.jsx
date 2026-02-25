import React from "react";
import { Link } from "react-router-dom";
import { DashboardNavbar } from "../components/DashboardNavbar"; // Tu componente con Reports, Teams, etc.
import { Orbit, UserCheck, Zap, ShieldAlert, BarChart3, Settings } from "lucide-react";
import { BohrLogo } from "../components/BohrLogo";


export const Dashboard = () => {


    const workModes = [
        { id: 1, title: "WORK PACKAGE 1", status: "Active" },
        { id: 2, title: "WORK PACKAGE 2", status: "Pending" },
        { id: 3, title: "WORK PACKAGE 3", status: "Review" }
    ];

    const activeProjects = [
        { id: 101, name: "Proyecto 1" },
        { id: 102, name: "Proyecto 2" },
        { id: 103, name: "Proyecto 3" }
    ];

    return (
        <div className="home-wrapper v1 dashboard-container">
            <DashboardNavbar />

            <div className="container-fluid" style={{ paddingTop: "120px", paddingBottom: "60px" }}>
                <div className="row g-4 px-md-4">

                    {/* LADO IZQUIERDO: MENÚ VERTICAL */}
                    <aside className="col-lg-3 col-md-4">
                        <div className="glass-card-yellow p-4 d-flex flex-column gap-3 h-100">



                            {/* 2. BOTÓN PROYECTOS */}
                            <div className="feature-item w-100 d-flex align-items-center gap-3 py-3 px-4 mb-2" style={{ cursor: 'pointer', minHeight: '60px' }}>
                                <Orbit size={28} strokeWidth={1.5} color="#27E6D6" />
                                <p className="feature-title mb-0" style={{ fontSize: "0.9rem" }}>MY PROJECTS</p>
                            </div>

                            {/* CONTENEDOR LISTA */}
                            <div className="projects-list-container d-flex flex-column gap-2"
                                style={{maxHeight: "300px", overflowY: "auto", padding: "10px 15px", margin: "0 10px", borderLeft: "1px solid rgba(39, 230, 214, 0.1)"}}>

                                {activeProjects.map((project) => (
                                    <div key={project.id}
                                        className="feature-item w-100 py-2 px-3"
                                        style={{cursor: 'pointer',fontSize: "0.8rem", background: "rgba(0,0,0,0.2)", borderRadius: "10px"}}>
                                        <p className="feature-description mb-0 text-white opacity-75">
                                            • {project.name}
                                        </p>
                                    </div>
                                ))}
                            </div>



                            {/* 3. BOTÓN MI EQUIPO */}
                            <div className="feature-item w-100 d-flex align-items-center gap-3 py-3 px-4" style={{ cursor: 'pointer', minHeight: '80px' }}>
                                <UserCheck size={32} strokeWidth={1.5} color="#27E6D6" />
                                <p className="feature-title mb-0" style={{ fontSize: "0.9rem" }}>NEW PROYECT</p>
                            </div>

                            {/* 4. BOTÓN REPORTES */}
                            <div className="feature-item w-100 d-flex align-items-center gap-3 py-3 px-4" style={{ cursor: 'pointer', minHeight: '80px' }}>
                                <Zap size={32} strokeWidth={1.5} color="#27E6D6" />
                                <p className="feature-title mb-0" style={{ fontSize: "0.9rem" }}>FINALIZADOS</p>
                            </div>

                        </div>
                    </aside>

                    {/* LADO DERECHO: CONTENEDOR DE DESPLEGABLES */}
                    <main className="col-lg-9 col-md-8">
                        <div className="glass-card-yellow p-4 h-100">


                            <div className="accordion accordion-flush" id="projectAccordion">
                                {workModes.map((wp) => (
                                    <div className="accordion-item bg-transparent border-info border-opacity-10 mb-3" key={wp.id}>
                                        <h2 className="accordion-header">
                                            <button className="accordion-button collapsed bg-transparent text-white shadow-none border-0"
                                                type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${wp.id}`}>
                                                <span className="section-sub-title mb-0" style={{ fontSize: "1.1rem" }}>{wp.title}</span>
                                            </button>
                                        </h2>

                                        <div id={`collapse${wp.id}`} className="accordion-collapse collapse" data-bs-parent="#projectAccordion">
                                            <div id={`collapse${wp.id}`} className="accordion-collapse collapse" data-bs-parent="#projectAccordion">
                                                <div className="accordion-body d-flex flex-column gap-3">

                                                    {/* FILA TO DO */}
                                                    <div className="p-3 rounded-4 border border-info border-opacity-25 bg-black bg-opacity-25 w-100">
                                                        <div className="d-flex align-items-center gap-3 mb-2">
                                                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27E6D6", boxShadow: "0 0 8px #27E6D6" }}></div>
                                                            <p className="feature-title mb-0" style={{ fontSize: "0.85rem", letterSpacing: "1px", color: "#FFFFFF" }}>TO DO</p>
                                                        </div>


                                                    </div>

                                                    {/* FILA IN PROGRESS */}
                                                    <div className="p-3 rounded-4 border border-warning border-opacity-25 bg-black bg-opacity-25 w-100">
                                                        <div className="d-flex align-items-center gap-3 mb-2">
                                                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffc107", boxShadow: "0 0 8px #ffc107" }}></div>
                                                            <p className="feature-title mb-0 text-warning" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>IN PROGRESS</p>
                                                        </div>

                                                    </div>

                                                    {/* FILA IN REVIEW */}
                                                    <div className="p-3 rounded-4 border border-primary border-opacity-25 bg-black bg-opacity-25 w-100">
                                                        <div className="d-flex align-items-center gap-3 mb-2">
                                                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#0d6efd", boxShadow: "0 0 8px #0d6efd" }}></div>
                                                            <p className="feature-title mb-0 text-primary" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>IN REVIEW</p>
                                                        </div>
                                                    </div>

                                                    {/* FILA DONE */}
                                                    <div className="p-3 rounded-4 border border-success border-opacity-25 bg-black bg-opacity-25 w-100">
                                                        <div className="d-flex align-items-center gap-3 mb-2">
                                                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#198754", boxShadow: "0 0 8px #198754" }}></div>
                                                            <p className="feature-title mb-0 text-success" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>DONE</p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
};