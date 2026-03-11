import React, { useState } from "react";
import { Zap, ShieldAlert, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { KanbanBoard } from "../Kanban/KanbanBoard";
import useGlobalReducer from "../../hooks/useGlobalReducer"; 
import ModalWorkPackage from "./ModalWorkPackage"; 

export const MainBoard = ({ workModes }) => {

    const { dispatch } = useGlobalReducer();


    // ESTADOS PARA EL MODAL

    const [isWpModalOpen, setIsWpModalOpen] = useState(false);
    const [wpTitleInput, setWpTitleInput] = useState("");

    // FUNCIÓN Guardar
    const handleAddWP = () => {
         if (!wpTitleInput.trim()) return;

        dispatch({
            type: "add_work_package",
            payload: {
                id: crypto.randomUUID(),
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

                {/* --- BOTONES ARRIBA --- */}
                <div className="d-flex gap-3 mb-5 flex-wrap">
                    <div className="ms-auto d-flex gap-3">
                        <Link to="/admin" className="text-decoration-none">
                            <button className="nav-login-cyber d-flex align-items-center gap-2" style={{ padding: "8px 15px", fontSize: "0.8rem" }}>Get Report
                            </button>
                        </Link>

                        
                            <button
                                onClick={() => setIsWpModalOpen(true)}
                                className="nav-login-cyber d-flex align-items-center gap-2"
                                style={{ padding: "8px 15px", fontSize: "0.8rem" }}
                            >
                                Add Work Package
                            </button>

                       


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

             {/* 2. EL MODAL AQUÍ (Fuera de la caja, pero dentro del <main>) */}
            {/* Al estar aquí, se superpone a todo el MainBoard cuando se abre */}
            <ModalWorkPackage 
                isOpen={isWpModalOpen}
                onClose={() => setIsWpModalOpen(false)}
                title={wpTitleInput}
                setTitle={setWpTitleInput}
                onSubmit={handleAddWP}
            />
        </main >
    );
};