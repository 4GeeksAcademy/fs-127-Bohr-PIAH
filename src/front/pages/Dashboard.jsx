import { useEffect } from "react";
import { DashboardNavbar } from "../components/Dashboard/DashboardNavbar";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { MainBoard } from "../components/Dashboard/MainBoard"
import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import ModalProject from "../components/ModalProject/ModalProject"
import { Spinner } from "../components/Spinner";
import { getDepartmentWithUsers } from "../services/departmentService.js";

export const Dashboard = () => {

    const { store, dispatch, actions } = useGlobalReducer();
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newProjectData, setNewProjectData] = useState({
        nombre: "",
        wpDeadline: "",
        taskDeadline: "",
        teamLeader: "",
        users: []
    });

    useEffect(() => {
        const loadData = async () => {
            if (!store.token || !store.user) return;
            setIsLoading(true);

            try {
                await actions.getProjects();
            } catch (err) {
                console.error("Error cargando proyectos del usuario", err);
            }

            if (store.currentDepartment && store.users.length === 0) {
                try {
                    const deptData = await getDepartmentWithUsers(store.token, store.currentDepartment.id);
                    dispatch({ type: "set_users", payload: deptData.users || [] });
                } catch (err) {
                    console.error("Error cargando usuarios del departamento", err);
                }
            }

            setTimeout(() => setIsLoading(false), 1000);
        };
        loadData();
    }, [store.token]);

    if (isLoading) {
        return <Spinner />;
    }

    const openCreateModal = () => {
        setIsEditing(false);
        setNewProjectData({
            nombre: "",
            wpDeadline: "",
            taskDeadline: "",
            teamLeader: "",
            users: []
        });
        setIsProjectModalOpen(true);
    };

    const openEditModal = (project) => {
        setIsEditing(true);
        setNewProjectData({
            nombre: project.nombre,
            wpDeadline: project.workPackages ? project.workPackages[0]?.deadline || "" : "",
            taskDeadline: project.workPackages && project.workPackages[0]?.tasks ? project.workPackages[0].tasks[0]?.deadline || "" : "",
            teamLeader: project.teamLeader || "",
            users: project.users ? project.users.map(u => u.username) : []
        });
        setIsProjectModalOpen(true);
    };

    return (
        <div className="home-wrapper v1 dashboard-container">
            <DashboardNavbar />

            <div className="container-fluid" style={{ paddingTop: "120px", paddingBottom: "60px" }}>
                <div className="row g-4 px-md-4">

                    {/* LADO IZQUIERDO */}
                    <Sidebar
                        activeProjects={store.projects}
                        onNewProjectClick={() => openCreateModal()}
                        onProjectSelect={(id) => dispatch({ type: "set_current_project", payload: id })}
                        selectedId={store.currentProjectId}
                    />

                    {/* LADO DERECHO */}
                    <MainBoard
                        openProjectModal={() => openEditModal(activeProject)}
                    />

                </div>
            </div>

            <ModalProject
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                isEdit={isEditing}
                initialData={newProjectData}
                users={store.users}
            />
        </div>
    );
};