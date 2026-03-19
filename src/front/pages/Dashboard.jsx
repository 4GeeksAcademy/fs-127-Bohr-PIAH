import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardNavbar } from "../components/Dashboard/DashboardNavbar";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { MainBoard } from "../components/Dashboard/MainBoard"
import { Orbit, UserCheck, Zap, ShieldAlert, BarChart3, Settings } from "lucide-react";
import { BohrLogo } from "../components/BohrLogo";
import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import ModalProject from "../components/ModalProject/ModalProject"
import { useActionState } from "react";
import { Spinner } from "../components/Spinner";
import { createProject } from "../services/projectService";

export const Dashboard = () => {

    const { store, dispatch, actions } = useGlobalReducer();
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    const [newProjectData, setNewProjectData] = useState({
        nombre: "",
        wpDeadline: "",
        taskDeadline: "",
        teamLeader: "",
        users: []
    });


    const activeProject = store.projects.find(p => p.id === store.currentProjectId);

   const projectsToShow = store.projects || [];

    

    // useEffect // MODIFICADO POR PATY//

    useEffect(() => {
        const loadData = async () => {
            if (!store.token) return; // ← espera a que haya token
            setIsLoading(true);
            await actions.getProjects();
            setTimeout(() => setIsLoading(false), 1000);
        };
        loadData();
    }, [store.token]);

    // SI ESTÁ CARGANDO, MUESTRA EL SPINNER
    if (isLoading) {
        return <Spinner />;
    }






    //MODIFICADO POR PATY//
    const handleAddProject = async () => {
        try {
            const data = await createProject(store.token, {
                name: newProjectData.nombre,
                department_id: 4, // temporal - departamento BOHR
                created_by: store.user.id,
                deadline: newProjectData.taskDeadline || null,
            });
            if (data) {
                dispatch({ type: "add_project", payload: data });
                dispatch({ type: "set_current_project", payload: data.id });
            }
        } catch (err) {
            console.error("Error creando proyecto", err);
        }
        setIsProjectModalOpen(false);
        setNewProjectData({ nombre: "", wpDeadline: "", taskDeadline: "", teamLeader: "", users: [] });
    };
    //DIN MODIFICACION PATY//


    // Sacamos sus Work Packages reales. Si no hay, devolvemos un array vacío.
    const realWPs = activeProject?.workPackages || [];

    // Si hay reales, usamos esos. Si no, usamos tus ejemplos (workModes).
    const workModesToShow = activeProject ? (activeProject.workPackages || []) : [];


   




    return (
        <div className="home-wrapper v1 dashboard-container">
            <DashboardNavbar />

            <div className="container-fluid" style={{ paddingTop: "120px", paddingBottom: "60px" }}>
                <div className="row g-4 px-md-4">

                    {/* LADO IZQUIERDO */}
                    <Sidebar activeProjects={projectsToShow}
                        onNewProjectClick={() => setIsProjectModalOpen(true)}
                        // manda el ID al store al hacer clic
                        onProjectSelect={(id) => dispatch({ type: "set_current_project", payload: id })}
                        // aqui se le pasa el ID al store asi sabe cual es el que tiene qu eiluminar
                        selectedId={store.currentProjectId} />

                    {/* LADO DERECHO */}
                    <MainBoard workModes={workModesToShow} openProjectModal={() => setIsProjectModalOpen(true)}
                        projectName={activeProject?.nombre} />

                </div>
            </div>
            <ModalProject
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                data={newProjectData}
                onChange={(field, val) => setNewProjectData({ ...newProjectData, [field]: val })}
                onAddUser={() => setNewProjectData({ ...newProjectData, users: [...newProjectData.users, ""] })}
                onChangeUser={(index, val) => {
                    const updated = [...newProjectData.users];
                    updated[index] = val;
                    setNewProjectData({ ...newProjectData, users: updated });
                }}
                onDeleteUser={(index) => {
                    const filtered = newProjectData.users.filter((_, i) => i !== index);
                    setNewProjectData({ ...newProjectData, users: filtered });
                }}
                onChangeLeader={(val) => setNewProjectData({ ...newProjectData, teamLeader: val })}
                onSubmit={handleAddProject}
            />
        </div>
    );
};