import React from "react";
import { Zap, ShieldAlert, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { KanbanBoard } from "../Kanban/KanbanBoard";

export const MainBoard = ({ workModes }) => {
    return (

        <main className="col-lg-9 col-md-8">
            <div className="glass-card-yellow p-4 h-100 d-flex flex-column">

                {/* --- BOTONES ARRIBA --- */}
                <div className="d-flex gap-3 mb-5 flex-wrap">
                    <div className="ms-auto d-flex gap-3">
                        <Link to="/admin" className="text-decoration-none">
                            <button className="nav-login-cyber d-flex align-items-center gap-2" style={{ padding: "8px 15px", fontSize: "0.8rem" }}>Get Report
                            </button>
                        </Link>

                        <Link to="/team" className="text-decoration-none">
                            <button className="nav-login-cyber d-flex align-items-center gap-2" style={{ padding: "8px 15px", fontSize: "0.8rem" }}>Add Work Package
                            </button>
                        </Link>


                    </div>
                </div>



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


                                {/* COMPONENTE AQUI */}

                                <KanbanBoard packageId={wp.id} />



                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </main >
    );
};