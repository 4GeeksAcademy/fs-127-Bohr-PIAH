import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar navbar-dark" style={{ backgroundColor: "rgb(19, 22, 37)", borderBottom: "1px solid rgba(39, 230, 214, 0.1)" }}>
            <div className="container d-flex align-items-center justify-content-between">
                
                {/* LADO IZQUIERDO: Solo aparece si NO estamos en la Home */}
                <div className="navbar-brand">
                    {location.pathname !== "/" && (
                        <Link to="/">
                            <div className="atom-nav-container">
                                <svg viewBox="0 0 100 100" className="atom-nav">
                                    <circle className="nucleus" cx="50" cy="50" r="8" fill="#74B9FF" />
                                    <g className="atom-spin">
                                        <ellipse className="orbit-path" cx="50" cy="50" rx="35" ry="15" stroke="#DCDDE1" fill="none" strokeWidth="2" transform="rotate(0 50 50)" />
                                        <ellipse className="orbit-path" cx="50" cy="50" rx="35" ry="15" stroke="#DCDDE1" fill="none" strokeWidth="2" transform="rotate(60 50 50)" />
                                        <ellipse className="orbit-path" cx="50" cy="50" rx="35" ry="15" stroke="#DCDDE1" fill="none" strokeWidth="2" transform="rotate(120 50 50)" />
                                        <circle className="electron" cx="85" cy="50" r="3" fill="#B8E994" />
                                    </g>
                                </svg>
                            </div>
                        </Link>
                    )}
                </div>

                {/* LADO DERECHO: Login o Logout */}
                <div>
                    {location.pathname === "/" ? (
                        <Link to="/login">
                            <button className="nav-login-v5">Login</button>
                        </Link>
                    ) : (
                        <Link to="/">
                            <button className="nav-login-v5 btn-logout">Logout</button>
                        </Link>
                    )}
                </div>

            </div>
        </nav>
    );
};
