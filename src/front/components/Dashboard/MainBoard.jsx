import React from "react";
import { Zap, ShieldAlert, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";

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
                            <button className="nav-login-cyber d-flex align-items-center gap-2" style={{ padding: "8px 15px", fontSize: "0.8rem" }}>Get Work Package
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

                                <div className="accordion-body d-flex flex-row gap-3 align-items-start overflow-auto pb-3">

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

                    ))}
                </div>
            </div>
        </main >
    );
};