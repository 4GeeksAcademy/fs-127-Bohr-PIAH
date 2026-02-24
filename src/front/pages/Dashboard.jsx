import React from "react";
import { Link } from "react-router-dom";
import { DashboardNavbar } from "../components/DashboardNavbar"; // Tu componente con Reports, Teams, etc.
import { Orbit, UserCheck, Zap, ShieldAlert, BarChart3, Settings } from "lucide-react";
import { BohrLogo } from "../components/BohrLogo";


export const Dashboard = () => {
    return (
        <div className="home-wrapper v1 dashboard-container">
            <DashboardNavbar />

            <div className="container-fluid" style={{ paddingTop: "120px", paddingBottom: "60px" }}>
                <div className="row g-4 px-md-4">

                    {/* LADO IZQUIERDO: MENÚ VERTICAL */}
                    <aside className="col-lg-3 col-md-4">
                        <div className="glass-card-yellow p-4 d-flex flex-column gap-3 h-100">


                            {/* 1. BOTÓN NEW BOHR */}
                            <div className="feature-item w-100 d-flex align-items-center gap-3 py-3 px-4"
                                style={{ cursor: 'pointer', minHeight: '80px' }}
                                onClick={() => console.log("Abrir creador de proyecto")}>

                                <div style={{ flexShrink: 0 }}>
                                   
                                    <BohrLogo size="32px" color="#27E6D6" />
                                </div>

                                <div className="text-start">
                                    <p className="feature-title mb-0" style={{ fontSize: "0.9rem" }}>NEW BOHR</p>
                                   
                                </div>
                            </div>

                            {/* 2. BOTÓN PROYECTOS */}
                            <div className="feature-item w-100 d-flex align-items-center gap-3 py-3 px-4" style={{ cursor: 'pointer', minHeight: '80px' }}>
                                <Orbit size={32} strokeWidth={1.5} color="#27E6D6" />
                                <p className="feature-title mb-0" style={{ fontSize: "0.9rem" }}>PROYECTOS</p>
                            </div>

                            {/* 3. BOTÓN MI EQUIPO */}
                            <div className="feature-item w-100 d-flex align-items-center gap-3 py-3 px-4" style={{ cursor: 'pointer', minHeight: '80px' }}>
                                <UserCheck size={32} strokeWidth={1.5} color="#27E6D6" />
                                <p className="feature-title mb-0" style={{ fontSize: "0.9rem" }}>MI EQUIPO</p>
                            </div>

                            {/* 4. BOTÓN REPORTES */}
                            <div className="feature-item w-100 d-flex align-items-center gap-3 py-3 px-4" style={{ cursor: 'pointer', minHeight: '80px' }}>
                                <Zap size={32} strokeWidth={1.5} color="#27E6D6" />
                                <p className="feature-title mb-0" style={{ fontSize: "0.9rem" }}>REPORTES</p>
                            </div>

                        </div>
                    </aside>

                    {/* LADO DERECHO: CONTENEDOR DE DESPLEGABLES */}
                    <main className="col-lg-9 col-md-8">
                        <div className="glass-card-yellow p-4 p-md-5 h-100">
                            

                          
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
};