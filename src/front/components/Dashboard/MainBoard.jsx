import React, { useState } from "react";
import { Zap, ShieldAlert, Users, FileText, Rocket, ArrowLeft, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { KanbanBoard } from "../Kanban/KanbanBoard";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import ModalWorkPackage from "./ModalWorkPackage";
import { createWorkPackage } from "../../services/WorkPackageService";

export const MainBoard = ({ openProjectModal }) => {

    const { store, dispatch } = useGlobalReducer();
    const currentProject = store.projects.find(p => p.id === store.currentProjectId);

    // ESTADOS PARA EL MODAL
    const [isWpModalOpen, setIsWpModalOpen] = useState(false);
    const [wpTitleInput, setWpTitleInput] = useState("");

    // FUNCIÓN Guardar
    const handleAddWP = async () => {
        if (!wpTitleInput.trim()) return;

        const currentProjectId = store.currentProjectId;

        try {
            const wp = await createWorkPackage(
                { name: wpTitleInput.toUpperCase(), project_id: currentProjectId },
                store.token
            );
            dispatch({
                type: "add_work_package",
                payload: { ...wp, projectId: wp.project_id, tasks: [] }
            });
        } catch (err) {
            console.error("Error creating work package", err);
        }

        setWpTitleInput("");
        setIsWpModalOpen(false);
    };

    return (

        <main className="col-lg-9 col-md-8">
            <div className="glass-card-yellow p-4 h-100 d-flex flex-column">

                {/* BOTONES DE ARRIBA*/}
                <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">

                    {/* TÍTULO DEL PROYECTO Y LAPIZ PARA EDITAR PROYECTO */}

                    {store.currentProjectId && (
                        <div className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}
                            onClick={() => {
                                const project = store.projects.find(p => p.id === store.currentProjectId);
                                openProjectModal(project);
                            }}
                        >
                            <h2 className="section-sub-title mb-0" style={{ color: "#27E6D6", fontSize: "1 rem", letterSpacing: "1.5px", borderBottom: "2px solid rgba(39, 230, 214, 0.3)", }}>
                                {store.projects.find(p => p.id === store.currentProjectId)?.name}
                            </h2>
                            <div style={{ padding: "2px", display: "flex", alignItems: "center" }}>
                                <Pencil
                                    size={16}
                                    color="#27E6D6"
                                    className="opacity-50 hover-opacity-100"
                                    style={{ transition: "opacity 0.2s" }}
                                />
                            </div>

                        </div>
                    )}
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
                        {currentProject?.workPackages?.map((wp) => {

                            const completed = wp.tasks.filter(t =>
                                t.status?.toLowerCase() === "done"
                            ).length;

                            const total = wp.tasks.length;
                            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;


                            return (
                                <div className="accordion-item bg-transparent border-info border-opacity-10 mb-3" key={wp.id}>
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed bg-transparent text-white shadow-none border-0 d-flex justify-content-between align-items-center w-100"
                                            type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${wp.id}`}>

                                            {/* TÍTULO A LA IZQUIERDA */}
                                            <span className="section-sub-title mb-0" style={{ fontSize: "1.1rem" }}>{wp.name}</span>

                                            {/* BARRA A LA DERECHA */}
                                            <div className="ms-auto me-4 d-flex align-items-center" style={{ width: "160px" }}>
                                                <span className="me-2 fw-bold" style={{ color: "#27E6D6", fontSize: "0.75rem", minWidth: "35px" }}>
                                                    {percentage}%
                                                </span>
                                                <div className="progress w-100" style={{ height: "6px", backgroundColor: "rgba(39, 230, 214, 0.1)", borderRadius: "10px" }}>
                                                    <div
                                                        className="progress-bar"
                                                        role="progressbar"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            backgroundColor: "#27E6D6",
                                                            boxShadow: "0 0 10px #27E6D6",
                                                            transition: "width 0.5s ease-in-out"
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </button>
                                    </h2>

                                    <div id={`collapse${wp.id}`} className="accordion-collapse collapse" data-bs-parent="#projectAccordion">
                                        {/* COMPONENTE DEL KANBAN */}
                                        <KanbanBoard packageId={wp.id} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* MODAL NEW WORK PACKAGE */}
            <ModalWorkPackage
                isOpen={isWpModalOpen} onClose={() => setIsWpModalOpen(false)} title={wpTitleInput} setTitle={setWpTitleInput} onSubmit={handleAddWP}
            />
        </main >
    );
};