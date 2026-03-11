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

                    {/* LADO IZQUIERDO */}
                    <div className="navbar-brand">
                        <Link to="/" 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                            style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                            
                            {/*SVG*/}

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
                            <Link to="/admin">
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
