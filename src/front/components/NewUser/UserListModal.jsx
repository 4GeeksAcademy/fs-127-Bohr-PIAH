import React from "react";
import "./CssAddUser.css"; 

const UserListModal = ({ users, onClose }) => {
    // Filtrar usuarios activos
    const activeUsers = users.filter(u => u.is_active !== false);
    
    return (
        <div className="modal-overlay-cyber">
            <div className="modal-cyber-box" style={{ position: "relative" }}>

                {/* Botón cerrar */}
                <button className="modal-cyber-close" onClick={onClose}>✕</button>

                <h2 className="modal-cyber-title">User List</h2>

                {/* LISTA DE USUARIOS */}
                {activeUsers.length === 0 ? (
                    <p style={{ color: "white", textAlign: "center" }}>
                        There are no active users.
                    </p>
                ) : (
                    <div>
                        {activeUsers.map((user, index) => (
                            <div
                                key={index}
                                style={{
                                    border: "1px solid #4da3ff",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    background: "rgba(255,255,255,0.05)"
                                }}
                            >
                                <p className="cyber-label">Name:</p>
                                <p className="cyber-input">{user.first_name}</p>

                                <p className="cyber-label">Last Name:</p>
                                <p className="cyber-input">{user.last_name}</p>

                                <p className="cyber-label">Departament:</p>
                                <p className="cyber-input">{user.department?.name || "No assigned"}</p>

                                <p className="cyber-label">Rol:</p>
                                <p className="cyber-input">{user.role}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="modal-cyber-footer">
                    <button className="cyber-btn-secondary" onClick={onClose}>
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    );
};
export default UserListModal;

