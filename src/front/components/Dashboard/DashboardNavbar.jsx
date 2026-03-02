import { Link, useLocation } from "react-router-dom";
import { UserDropdown } from "./UserDropdown";


export const DashboardNavbar = () => {


    return (
        <nav className="navbar navbar-dark fixed-top" style={{ backgroundColor: "rgb(19, 22, 37)", borderBottom: "1px solid rgba(39, 230, 214, 0.1)", padding: "8px 0" }}>
            <div className="container d-flex align-items-center justify-content-between">

                {/* LADO IZQUIERDO: Átomo Animado (Link a Home) */}
                <div className="navbar-brand">
                    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>


                        <div className="atom-nav-container" style={{ width: "80px", height: "80px" }}>
                            <svg viewBox="0 0 120 120" className="atom-nav" xmlns="http://www.w3.org">

                                <circle cx="60" cy="60" r="10" className="nucleus-glow" />
                                <circle cx="60" cy="60" r="10" className="nucleus" />

                                {/* Órbita 1  */}
                                <g className="orbit">
                                    <path id="nav-p1" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" strokeWidth="2" />
                                    <circle r="4" className="electron">
                                        <animateMotion dur="2s" repeatCount="indefinite" rotate="auto"><mpath href="#nav-p1" /></animateMotion>
                                    </circle>
                                </g>

                                {/* Órbita 2 (Rotada) */}
                                <g className="orbit" transform="rotate(60 60 60)">
                                    <path id="nav-p2" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" strokeWidth="2" />
                                    <circle r="4" className="electron">
                                        <animateMotion dur="2.5s" repeatCount="indefinite" rotate="auto" begin="-0.5s"><mpath href="#nav-p2" /></animateMotion>
                                    </circle>
                                </g>
                                <g className="orbit" transform="rotate(-60 60 60)">
                                    <path id="p3" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" strokeWidth="2" />
                                    <circle r="4" className="electron">
                                        <animateMotion dur="2.2s" repeatCount="indefinite" rotate="auto" begin="-1s"><mpath href="#p3" /></animateMotion>
                                    </circle>
                                </g>
                            </svg>
                        </div>
                        <span className="wellcome-text ms-2" style={{ fontSize: "1.2rem", marginTop: "0", display: "inline-block", textShadow: "0 0 10px var(--c-nuc)", color: "var(--c-nuc)" }} >BOHR</span>
                    </Link>
                </div>

                {/* Botones  */}
                <div className="d-flex align-items-center gap-3">

                    <div className="ms-auto">
                        <Link to="/report">
                            <button className="nav-login-cyber">
                                Reports
                            </button>
                        </Link>
                    </div>
                    <div className="ms-auto">
                        <Link to="/team">
                            <button className="nav-login-cyber">
                                My Team
                            </button>
                        </Link>
                    </div>
                    <div className="ms-auto">
                        <Link to="/admin">
                            <button className="nav-login-cyber">
                                Admin Panel
                            </button>
                        </Link>
                    </div>

                     {/* Boton del PROFILE!!  */}
                     
                    <div className="ms-2">
                        <UserDropdown />
                    </div>
                </div>
            </div>
        </nav>
    );
};

