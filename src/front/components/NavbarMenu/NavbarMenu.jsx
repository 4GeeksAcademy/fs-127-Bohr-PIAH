import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllDepartments } from "../../services/departmentService";
import { UserDropdown } from "./UserDropdown";

export const DashboardNavbar = () => {

    const token = localStorage.getItem("token");

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                if (token) {
                    const data = await getAllDepartments(token);
                    setDepartments(data);
                }
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };
        loadDepartments();
    }, [token]);

    return (
        <nav className="navbar navbar-dark fixed-top"
            style={{ backgroundColor: "rgb(19, 22, 37)", borderBottom: "1px solid rgba(39, 230, 214, 0.1)", padding: "8px 0" }}>

            <div className="container d-flex align-items-center justify-content-between">

                {/* LOGO */}
                <div className="navbar-brand">
                    <Link to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>

                        <div className="atom-nav-container" style={{ width: "80px", height: "80px" }}>
                            {/* SVG aquí */}
                        </div>

                        <span className="wellcome-text ms-2"
                            style={{ fontSize: "1.2rem", textShadow: "0 0 10px var(--c-nuc)", color: "var(--c-nuc)" }}>
                            BOHR
                        </span>
                    </Link>
                </div>

                <div className="d-flex align-items-center">

                    {/* DEPARTAMENTOS DROPDOWN */}
                    <div className="dropdown me-3">
                        <button
                            className="btn btn-outline-info dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Departamentos
                        </button>

                        <ul className="dropdown-menu dropdown-menu-dark">
                            {departments.length > 0 ? (
                                departments.map((dept) => (
                                    <li key={dept.id}>
                                        <Link className="dropdown-item" to={`/departments/${dept.id}`}>
                                            {dept.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <span className="dropdown-item text-muted">Cargando...</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* PROFILE BUTTON */}
                    <div className="ms-2">
                        <UserDropdown onOpenProfile={() => setShowProfile(true)} />
                    </div>

                </div>

            </div>
        </nav>

    );
};
