import React from "react";
import { Link } from "react-router-dom";
import { DashboardNavbar } from "../components/Dashboard/DashboardNavbar";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { MainBoard } from "../components/Dashboard/MainBoard"
import { Orbit, UserCheck, Zap, ShieldAlert, BarChart3, Settings } from "lucide-react";
import { BohrLogo } from "../components/BohrLogo";
import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import ModalProject from "../components/ModalProject/ModalProject"


export const Dashboard = () => {

    const { store, dispatch } = useGlobalReducer();
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

    const [newProjectData, setNewProjectData] = useState({
        nombre: "",
        wpDeadline: "",
        taskDeadline: "",
        teamLeader: "",
        users: []
    });

    const workModes = [
        { id: 1, title: "WORK PACKAGE 1", status: "Active" },
        { id: 2, title: "WORK PACKAGE 2", status: "Pending" },
        { id: 3, title: "WORK PACKAGE 3", status: "Review" }
    ];



    const projectsToShow = store.projects || [];

    const handleAddProject = () => {
        dispatch({
            type: "add_project",
            payload: { id: crypto.randomUUID(), ...newProjectData, workPackages: [] }
        });
        setIsProjectModalOpen(false);
        setNewProjectData({ nombre: "", wpDeadline: "", taskDeadline: "", teamLeader: "", users: [] });
    };





    return (
        <div className="home-wrapper v1 dashboard-container">
            <DashboardNavbar />

            <div className="container-fluid" style={{ paddingTop: "120px", paddingBottom: "60px" }}>
                <div className="row g-4 px-md-4">

                    {/* LADO IZQUIERDO */}
                    <Sidebar activeProjects={projectsToShow} onNewProjectClick={() => setIsProjectModalOpen(true)} />

                    {/* LADO DERECHO */}
                    <MainBoard workModes={workModes} />

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