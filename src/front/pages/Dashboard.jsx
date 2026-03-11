import React from "react";
import { Link } from "react-router-dom";
import { DashboardNavbar } from "../components/Dashboard/DashboardNavbar";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { MainBoard } from "../components/Dashboard/MainBoard"
import { Orbit, UserCheck, Zap, ShieldAlert, BarChart3, Settings } from "lucide-react";
import { BohrLogo } from "../components/BohrLogo";
import { useState } from "react";


export const Dashboard = () => {


    const workModes = [
        { id: 1, title: "WORK PACKAGE 1", status: "Active" },
        { id: 2, title: "WORK PACKAGE 2", status: "Pending" },
        { id: 3, title: "WORK PACKAGE 3", status: "Review" }
    ];

    const [activeProjects, setActiveProjects] = useState([]);

    const exampleProjects = [
        { id: 101, name: "Project 1" },
        { id: 102, name: "Project 2" },
        { id: 103, name: "Project 3" }
    ];

     const projectsToShow = activeProjects.length ? activeProjects : exampleProjects;

    

    return (
        <div className="home-wrapper v1 dashboard-container">
            <DashboardNavbar />

            <div className="container-fluid" style={{ paddingTop: "120px", paddingBottom: "60px" }}>
                <div className="row g-4 px-md-4">

                    {/* LADO IZQUIERDO */}
                    <Sidebar activeProjects={projectsToShow} />

                    {/* LADO DERECHO */}
                    <MainBoard workModes={workModes} />

                </div>
            </div>
        </div>
    );
};