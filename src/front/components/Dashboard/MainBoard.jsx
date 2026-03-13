import React, { useState } from "react";
import { Zap, ShieldAlert, Users, FileText, Rocket, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { KanbanBoard } from "../Kanban/KanbanBoard";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import ModalWorkPackage from "./ModalWorkPackage";

export const MainBoard = ({ workModes, openProjectModal }) => {

    const { store, dispatch } = useGlobalReducer();


    // ESTADOS PARA EL MODAL

    const [isWpModalOpen, setIsWpModalOpen] = useState(false);
    const [wpTitleInput, setWpTitleInput] = useState("");

    // FUNCIÓN Guardar
    const handleAddWP = () => {
        if (!wpTitleInput.trim()) return;

        const currentProjectId = store.currentProjectId;

        dispatch({
            type: "add_work_package",
            payload: {
                id: crypto.randomUUID(),
                projectId: currentProjectId,
                title: wpTitleInput.toUpperCase(),
                status: "Active"
            }
        });

        setWpTitleInput("");     // Limpiar input correcto
        setIsWpModalOpen(false); // Cerrar modal correcto
    };

    return (

        <main className="col-lg-9 col-md-8">
            <div className="glass-card-yellow p-4 h-100 d-flex flex-column">

                {/* --- BOTONES DE ARRIBA --- */}
                <div className="d-flex gap-3 mb-5 flex-wrap">
                    <div className="ms-auto d-flex gap-3">
                        <Link to="/admin" className="text-decoration-none">
                            <button className="nav-login-cyber d-flex align-items-center gap-2" style={{ padding: "8px 15px", fontSize: "0.8rem" }}>Get Report
                            </button>
                        </Link>


                        <button
                            onClick={() => {

                                if (!store.currentProjectId) {
                                    openProjectModal();

                                } else {
                                    setIsWpModalOpen(true);
                                }
                            }}

                            className="nav-login-cyber d-flex align-items-center gap-2" style={{ padding: "8px 15px", fontSize: "0.8rem" }}>
                            Add Work Package
                        </button>




                    </div>
                </div>

                {/* Mensaje de crear tu primer proyecto para empezar */}
                
                {!store.currentProjectId ? (
                    <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-center animate__animated animate__fadeIn"
                        style={{ marginTop: "-50px" }}>

                        <h2 className="section-sub-title" style={{ color: "#27E6D6" }}>Ready to start?</h2>
                        <p className="text-white opacity-75 max-w-md">
                            Create your first PROJECT </p>

                    </div>
                ) : (

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


                                    {/* COMPONENTE DEL KANBAN */}

                                    <KanbanBoard packageId={wp.id} />



                                </div>
                            </div>

                        ))}
                    </div>
                )}
            </div>

            {/* MODAL NEW PROJECT) */}

            <ModalWorkPackage
                isOpen={isWpModalOpen} onClose={() => setIsWpModalOpen(false)} title={wpTitleInput} setTitle={setWpTitleInput} onSubmit={handleAddWP}
            />
        </main >
    );
};