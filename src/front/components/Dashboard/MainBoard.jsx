import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { Link } from "react-router-dom";
import { KanbanBoard } from "../Kanban/KanbanBoard";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import ModalWorkPackage from "./ModalWorkPackage";
import { getProjectReport } from "../../services/reportService";
import { createWorkPackage, updateWorkPackage, deleteWorkPackage } from "../../services/WorkPackageService";

export const MainBoard = ({ openProjectModal }) => {

    const { store, dispatch } = useGlobalReducer();
    const currentProject = store.projects.find(p => p.id === store.currentProjectId);
    const role = store.user?.role;
    const canEditWP = role === "admin" || role === "head";

    // Nombre del departamento del proyecto actual
    const currentDeptName =
        store.departments?.find(d => d.id === currentProject?.department_id)?.name
        || (store.currentDepartment?.id === currentProject?.department_id ? store.currentDepartment?.name : null);

    // ESTADOS PARA EL MODAL DE CREAR WP
    const [isWpModalOpen, setIsWpModalOpen] = useState(false);
    const [wpTitleInput, setWpTitleInput] = useState("");

    // ESTADOS PARA EL MODAL DE EDITAR/ELIMINAR WP
    const [isWpEditModalOpen, setIsWpEditModalOpen] = useState(false);
    const [editingWp, setEditingWp] = useState(null);
    const [wpEditTitle, setWpEditTitle] = useState("");
    const [isWpSaving, setIsWpSaving] = useState(false);

    const handleGetReport = async () => {
        try {
            const blob = await getProjectReport(store.currentProjectId, store.token);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `project_${store.currentProjectId}.pdf`;
            a.click();

        } catch (error) {
            console.error(error);
        }
    };

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

    const handleOpenEditWp = (e, wp) => {
        e.stopPropagation();
        setEditingWp(wp);
        setWpEditTitle(wp.name);
        setIsWpEditModalOpen(true);
    };

    const handleSaveEditWp = async () => {
        if (!wpEditTitle.trim() || !editingWp) return;
        setIsWpSaving(true);
        try {
            const updated = await updateWorkPackage(editingWp.id, { name: wpEditTitle.toUpperCase() }, store.token);
            dispatch({ type: "edit_work_package", payload: { ...editingWp, name: updated.name } });
            setIsWpEditModalOpen(false);
        } catch (err) {
            console.error("Error updating work package", err);
        } finally {
            setIsWpSaving(false);
        }
    };

    const handleDeleteWp = async () => {
        if (!editingWp) return;
        if (!window.confirm(`¿Eliminar "${editingWp.name}" y todas sus tareas?`)) return;
        setIsWpSaving(true);
        try {
            await deleteWorkPackage(editingWp.id, store.token);
            dispatch({ type: "delete_work_package", payload: editingWp.id });
            setIsWpEditModalOpen(false);
        } catch (err) {
            console.error("Error deleting work package", err);
        } finally {
            setIsWpSaving(false);
        }
    };

    return (

        <main className="col-lg-9 col-md-8">
            <div className="glass-card-yellow p-4 h-100 d-flex flex-column">

                {/* BOTONES DE ARRIBA*/}
                <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">

                    {/* TÍTULO DEL PROYECTO Y LAPIZ PARA EDITAR PROYECTO */}

                    {store.currentProjectId && (
                        <div className="d-flex align-items-center gap-2"
                            style={{ cursor: canEditWP ? "pointer" : "default" }}
                            onClick={() => {
                                if (!canEditWP) return;
                                const project = store.projects.find(p => p.id === store.currentProjectId);
                                openProjectModal(project);
                            }}
                        >
                            <h2 className="section-sub-title mb-0" style={{ color: "#27E6D6", fontSize: "1rem", letterSpacing: "1.5px", borderBottom: "2px solid rgba(39, 230, 214, 0.3)" }}>
                                {store.projects.find(p => p.id === store.currentProjectId)?.name}
                                {currentDeptName && (
                                    <span style={{ fontSize: "0.75rem", color: "#27E6D6", opacity: 0.7, fontWeight: 400, marginLeft: "8px" }}>
                                        — {currentDeptName}
                                    </span>
                                )}
                            </h2>
                            {canEditWP && (
                                <div style={{ padding: "2px", display: "flex", alignItems: "center" }}>
                                    <Pencil
                                        size={16}
                                        color="#27E6D6"
                                        className="opacity-50 hover-opacity-100"
                                        style={{ transition: "opacity 0.2s" }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <div className="ms-auto d-flex gap-3">
                        {/* <Link to="/admin" className="text-decoration-none">
                            <button className="nav-login-cyber d-flex align-items-center gap-2" style={{ padding: "8px 15px", fontSize: "0.8rem" }}>Get Report
                            </button>
                        </Link> */}
                        <button
                            onClick={handleGetReport}
                            className="nav-login-cyber d-flex align-items-center gap-2"
                            style={{ padding: "8px 15px", fontSize: "0.8rem" }}
                        >
                            Get Report
                        </button>


                        {canEditWP && (
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
                        )}


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

                            const wpTasks = store.tasks.filter(t => t.wp_id === wp.id);
                            const completed = wpTasks.filter(t =>
                                t.status?.toLowerCase() === "done"
                            ).length;

                            const total = wpTasks.length;
                            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;


                            return (
                                <div className="accordion-item bg-transparent border-info border-opacity-10 mb-3" key={wp.id}>
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed bg-transparent text-white shadow-none border-0 d-flex justify-content-between align-items-center w-100"
                                            type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${wp.id}`}>

                                            {/* TÍTULO A LA IZQUIERDA */}
                                            <span className="section-sub-title mb-0 d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                                                {wp.name}
                                                {canEditWP && (
                                                    <Pencil
                                                        size={14}
                                                        color="#27E6D6"
                                                        style={{ opacity: 0.6, cursor: "pointer", flexShrink: 0 }}
                                                        onClick={(e) => handleOpenEditWp(e, wp)}
                                                    />
                                                )}
                                            </span>

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

            {/* MODAL EDIT/DELETE WORK PACKAGE */}
            {isWpEditModalOpen && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}>
                    <div className="glass-card-yellow p-4 shadow-lg" style={{ width: "350px", border: "1px solid #27E6D6" }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="text-white mb-0" style={{ fontSize: "1rem" }}>EDIT WORK PACKAGE</h5>
                            <X size={20} className="text-info" style={{ cursor: "pointer" }} onClick={() => setIsWpEditModalOpen(false)} />
                        </div>
                        <input
                            type="text"
                            className="form-control bg-dark text-white border-info mb-3 shadow-none"
                            value={wpEditTitle}
                            onChange={(e) => setWpEditTitle(e.target.value)}
                            autoFocus
                        />
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <button
                                style={{ background: "transparent", border: "1px solid #ff4d4d", color: "#ff4d4d", borderRadius: "8px", padding: "5px 14px", fontSize: "0.8rem", cursor: "pointer" }}
                                onClick={handleDeleteWp}
                                disabled={isWpSaving}
                            >
                                Delete
                            </button>
                            <div className="d-flex gap-2">
                                <button
                                    style={{ background: "transparent", border: "1px solid rgba(39,230,214,0.4)", color: "rgba(39,230,214,0.6)", borderRadius: "8px", padding: "5px 14px", fontSize: "0.8rem", cursor: "pointer" }}
                                    onClick={() => setIsWpEditModalOpen(false)}
                                    disabled={isWpSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="nav-login-cyber"
                                    style={{ padding: "5px 14px", fontSize: "0.8rem" }}
                                    onClick={handleSaveEditWp}
                                    disabled={isWpSaving}
                                >
                                    {isWpSaving ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main >
    );
};