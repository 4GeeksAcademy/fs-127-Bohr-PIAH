import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { UserDropdown } from "./UserDropdown";
import { ProfileModal } from "../Profile/ProfileModal.jsx";
import useGlobalReducer from "../../hooks/useGlobalReducer.jsx";

export const DashboardNavbar = () => {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const [showReportDropdown, setShowReportDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const role = store.user?.role;
    const isAdmin = role === "admin";
    const isHead  = role === "head";

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowReportDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleReportNav = (path) => {
        setShowReportDropdown(false);
        navigate(path);
    };

    // Items del dropdown según rol
    const reportItems = isAdmin
        ? [
            ...(store.departments || []).map(d => ({ label: d.name, path: `/report?department_id=${d.id}` })),
            { label: "Organization", path: "/report?scope=organization" },
          ]
        : isHead && store.currentDepartment
        ? [{ label: store.currentDepartment.name, path: `/report?department_id=${store.currentDepartment.id}` }]
        : [];

    const dropdownMenuStyle = {
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        background: "rgb(19, 22, 37)",
        border: "1px solid rgba(39, 230, 214, 0.3)",
        borderRadius: "8px",
        minWidth: "200px",
        zIndex: 9999,
        padding: "6px 0",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    };

    return (
        <>
            <nav className="navbar navbar-dark fixed-top"
                style={{ backgroundColor: "rgb(19, 22, 37)", borderBottom: "1px solid rgba(39, 230, 214, 0.1)", padding: "8px 0" }}>

                <div className="container-fluid px-md-4">
                    <div className="row align-items-center w-100 g-0">

                        {/* LOGO — alineado con el sidebar (col-lg-3) */}
                        <div className="col-lg-3 col-md-4">
                            <Link to="/"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>

                                <div className="atom-nav-container" style={{ width: "80px", height: "80px" }}>
                                    <svg viewBox="0 0 120 120" className="atom-nav" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="60" cy="60" r="10" className="nucleus-glow" />
                                        <circle cx="60" cy="60" r="10" className="nucleus" />
                                        <g className="orbit">
                                            <path id="nav-p1" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" strokeWidth="2" fill="none" />
                                            <circle r="4" className="electron" fill="var(--c-nuc)">
                                                <animateMotion dur="2s" repeatCount="indefinite" rotate="auto"><mpath href="#nav-p1" /></animateMotion>
                                            </circle>
                                        </g>
                                        <g className="orbit" transform="rotate(60 60 60)">
                                            <path id="nav-p2" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" strokeWidth="2" fill="none" />
                                            <circle r="4" className="electron" fill="var(--c-nuc)">
                                                <animateMotion dur="2.5s" repeatCount="indefinite" rotate="auto" begin="-0.5s"><mpath href="#nav-p2" /></animateMotion>
                                            </circle>
                                        </g>
                                        <g className="orbit" transform="rotate(-60 60 60)">
                                            <path id="p3" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" strokeWidth="2" fill="none" />
                                            <circle r="4" className="electron" fill="var(--c-nuc)">
                                                <animateMotion dur="2.2s" repeatCount="indefinite" rotate="auto" begin="-1s"><mpath href="#p3" /></animateMotion>
                                            </circle>
                                        </g>
                                    </svg>
                                </div>

                                <span className="wellcome-text ms-2"
                                    style={{ fontSize: "1.2rem", textShadow: "0 0 10px var(--c-nuc)", color: "var(--c-nuc)" }}>
                                    BOHR
                                </span>
                            </Link>
                        </div>

                        {/* BOTONES — alineados con el mainboard (col-lg-9) */}
                        <div className="col-lg-9 col-md-8 d-flex justify-content-end align-items-center gap-3">

                            {/* REPORTS: dropdown para admin/head */}
                            {(isAdmin || isHead) && (
                                <div ref={dropdownRef} style={{ position: "relative" }}>
                                    <button
                                        className="nav-login-cyber d-flex align-items-center gap-1"
                                        onClick={() => setShowReportDropdown(prev => !prev)}
                                    >
                                        Reports <ChevronDown size={13} />
                                    </button>
                                    {showReportDropdown && reportItems.length > 0 && (
                                        <div style={dropdownMenuStyle}>
                                            {reportItems.map((item, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => handleReportNav(item.path)}
                                                    style={{
                                                        padding: "9px 16px",
                                                        cursor: "pointer",
                                                        color: "#27E6D6",
                                                        fontSize: "0.85rem",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(39,230,214,0.1)"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                                >
                                                    {item.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {isAdmin && (
                                <Link to="/menuadmin">
                                    <button className="nav-login-cyber">Admin Panel</button>
                                </Link>
                            )}

                            <UserDropdown onOpenProfile={() => setShowProfile(true)} />
                        </div>

                    </div>
                </div>
            </nav>

            <ProfileModal show={showProfile} onHide={() => setShowProfile(false)} />
        </>
    );
};
