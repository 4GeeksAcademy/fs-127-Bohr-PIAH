import { useEffect } from "react";
import { DashboardNavbar } from "../components/Dashboard/DashboardNavbar";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { MainBoard } from "../components/Dashboard/MainBoard"
import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import ModalProject from "../components/ModalProject/ModalProject"
import { Spinner } from "../components/Spinner";
import { getDepartmentWithUsers } from "../services/departmentService.js";
import { getAllUsers } from "../services/userService.js";
import { getAllDepartments } from "../services/departmentService.js";

export const Dashboard = () => {

    const { store, dispatch, actions } = useGlobalReducer();
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [sidebarView, setSidebarView] = useState("active");
    const [newProjectData, setNewProjectData] = useState({
        nombre: "",
        wpDeadline: "",
        taskDeadline: "",
        teamLeader: "",
        users: []
    });

    const isAdmin = store.user?.role === "admin";

    useEffect(() => {
        const loadData = async () => {
            if (!store.token || !store.user) { setIsLoading(false); return; }
            setIsLoading(true);

            try {
                try {
                    if (isAdmin) {
                        await actions.getProjects();
                    } else {
                        await actions.getUserProjects(store.user.id);
                    }
                } catch (err) {
                    console.error("Error cargando proyectos", err);
                }

                try {
                    const allUsers = await getAllUsers(store.token);
                    dispatch({ type: "set_users", payload: allUsers });
                } catch (err) {
                    console.error("Error cargando usuarios", err);
                }

                if (isAdmin) {
                    try {
                        const allDepts = await getAllDepartments(store.token);
                        dispatch({ type: "set_departments", payload: allDepts });
                    } catch (err) {
                        console.error("Error cargando departamentos", err);
                    }
                } else if (store.user.department_id) {
                    try {
                        const deptData = await getDepartmentWithUsers(store.token, store.user.department_id);
                        dispatch({ type: "set_current_department", payload: { id: deptData.id, name: deptData.name } });
                    } catch (err) {
                        console.error("Error cargando departamento del usuario", err);
                    }
                }
            } finally {
                setIsLoading(false);
            }
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
        if (!project) {
            openCreateModal();
            return;
        }
        setIsEditing(true);
        const projectUsers = (project.users && project.users.length > 0)
            ? project.users
            : store.users.filter(u => project.user_projects?.some(up => up.user_id === u.id));
        setNewProjectData({
            nombre: project.name || project.nombre || "",
            wpDeadline: project.created_at ? project.created_at.slice(0, 10) : "",
            taskDeadline: project.deadline ? project.deadline.slice(0, 10) : "",
            teamLeader: project.teamLeader || "",
            users: projectUsers.map(u => u.id),
            users_data: projectUsers,
            finalized: project.finalized || false
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
                        activeProjects={[...store.projects.filter(p => !p.finalized)].sort((a, b) => a.id - b.id)}
                        finishedProjects={[...store.projects.filter(p => p.finalized)].sort((a, b) => a.id - b.id)}
                        onNewProjectClick={() => openCreateModal()}
                        onProjectSelect={(id) => dispatch({ type: "set_current_project", payload: id })}
                        selectedId={store.currentProjectId}
                        view={sidebarView}
                        onViewChange={setSidebarView}
                    />

                    {/* LADO DERECHO */}
                    <MainBoard
                        openProjectModal={(project) => openEditModal(project)}
                    />

                </div>
            </div>

            <ModalProject
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                isEdit={isEditing}
                initialData={newProjectData}
                users={store.users}
                onFinalizedChange={(isFinalized) => setSidebarView(isFinalized ? "finished" : "active")}
            />
        </div>
    );
};
