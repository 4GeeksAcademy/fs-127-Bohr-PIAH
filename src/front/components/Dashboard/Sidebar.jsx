import React from "react";
import { Orbit, UserCheck, Zap } from "lucide-react";


export const Sidebar = ({ activeProjects, finishedProjects, onNewProjectClick, onProjectSelect, selectedId, view, onViewChange }) => {
    const setView = onViewChange;

    const listStyle = {
        maxHeight: "300px", overflowY: "auto",
        padding: "10px 15px", margin: "0 10px",
        borderLeft: "1px solid rgba(39, 230, 214, 0.1)"
    };

    const renderList = (projects) => (
        <div className="projects-list-container d-flex flex-column gap-2" style={listStyle}>
            {projects.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", margin: 0 }}>
                    No projects
                </p>
            )}
            {projects.map((project) => (
                <div key={project.id}
                    onClick={() => onProjectSelect(project.id)}
                    className="feature-item w-100 py-2 px-3"
                    style={{
                        cursor: "pointer",
                        background: selectedId === project.id ? "rgba(39,230,214,0.1)" : "rgba(0,0,0,0.2)",
                        borderRadius: "10px"
                    }}
                >
                    <p className="feature-description mb-0 text-white opacity-75" style={{ fontSize: "0.8rem" }}>
                        • {project.name || project.nombre || "Untitled Project"}
                    </p>
                </div>
            ))}
        </div>
    );

    return (
        <aside className="col-lg-3 col-md-4">
            <div className="glass-card-yellow p-4 d-flex flex-column gap-3 h-100">

                {/* NEW PROJECT */}
                <div className="feature-item w-100 d-flex align-items-center gap-3 py-3 px-4"
                    style={{ cursor: "pointer", minHeight: "80px" }}
                    onClick={onNewProjectClick}>
                    <UserCheck size={32} strokeWidth={1.5} color="#27E6D6" />
                    <p className="feature-title mb-0" style={{ fontSize: "0.9rem" }}>NEW PROJECT</p>
                </div>

                {/* MY PROJECTS */}
                <div className="feature-item w-100 d-flex align-items-center gap-3 py-3 px-4"
                    style={{ cursor: "pointer", minHeight: "60px", opacity: view === "active" ? 1 : 0.5 }}
                    onClick={() => setView("active")}>
                    <Orbit size={28} strokeWidth={1.5} color="#27E6D6" />
                    <p className="feature-title mb-0" style={{ fontSize: "0.9rem" }}>MY PROJECTS</p>
                </div>

                {/* Active projects list */}
                {view === "active" && renderList(activeProjects)}

                {/* FINISHED */}
                <div className="feature-item w-100 d-flex align-items-center gap-3 py-3 px-4"
                    style={{ cursor: "pointer", minHeight: "80px", opacity: view === "finished" ? 1 : 0.5 }}
                    onClick={() => setView("finished")}>
                    <Zap size={32} strokeWidth={1.5} color="#27E6D6" />
                    <p className="feature-title mb-0" style={{ fontSize: "0.9rem" }}>FINISHED</p>
                </div>

                {/* Finished projects list */}
                {view === "finished" && renderList(finishedProjects)}

            </div>
        </aside>
    );
};
