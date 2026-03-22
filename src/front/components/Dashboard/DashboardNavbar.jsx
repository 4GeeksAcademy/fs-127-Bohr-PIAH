import { Link } from "react-router-dom";
import { useState } from "react";
import { UserDropdown } from "./UserDropdown";
import { ProfileModal } from "../Profile/ProfileModal.jsx";

export const DashboardNavbar = () => {

    const [showProfile, setShowProfile] = useState(false);

    return (
        <>
            <nav className="navbar navbar-dark fixed-top"
                style={{ backgroundColor: "rgb(19, 22, 37)", borderBottom: "1px solid rgba(39, 230, 214, 0.1)", padding: "8px 0" }}>

                <div className="container d-flex align-items-center justify-content-between">

                    {/* LOGO */}
                    <div className="navbar-brand">
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

                    {/* BOTONES */}
                    <div className="d-flex align-items-center gap-3">

                        <div className="ms-auto">
                            <Link to="/report">
                                <button className="nav-login-cyber">Reports</button>
                            </Link>
                        </div>

                        <div className="ms-auto">
                            <Link to="/team">
                                <button className="nav-login-cyber">My Team</button>
                            </Link>
                        </div>

                        <div className="ms-auto">
                            <Link to="/menuadmin">
                                <button className="nav-login-cyber">Admin Panel</button>
                            </Link>
                        </div>

                        {/* PROFILE BUTTON */}
                        <div className="ms-2">
                            <UserDropdown onOpenProfile={() => setShowProfile(true)} />
                        </div>
                    </div>
                </div>
            </nav>

            {/* MODAL DE PERFIL */}
            <ProfileModal show={showProfile} onHide={() => setShowProfile(false)} />
        </>
    );
};
