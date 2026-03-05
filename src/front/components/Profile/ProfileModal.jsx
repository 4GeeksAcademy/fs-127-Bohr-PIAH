import { useState } from "react";
import { EditProfile } from "./EditProfile";
import "./Profilecss.css";

export const ProfileModal = ({ show, onHide }) => {
  const [name, setName] = useState("Add Name");
  const [role, setRole] = useState("Role");

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card-yellow">

        <button className="modal-close-btn" onClick={onHide}>✕</button>

        <div className="profile-layout">

          {/* IZQUIERDA */}
          <aside className="profile-left">
            <h2 style={{ color: "var(--c-nuc)", textShadow: "0 0 10px var(--c-nuc)" }}>
              {name}
            </h2>

            <section className="glass-card-yellow" style={{ padding: "20px", marginTop: "1px" }}>
              <h2 className="section-sub-title">Personal info</h2>

              <EditProfile label="Nombre" value={name} onSave={setName} />
              <EditProfile label="Role" value={role} onSave={setRole} />

              <button className="btn-small" style={{ marginTop: "30px" }}>
                Change password
              </button>
            </section>
          </aside>

          {/* DERECHA */}
          <main style={{ width: "100%" }}>
            <section className="glass-card-yellow" style={{ padding: "25px" }}>
              <h3 className="section-sub-title">My Projects</h3>

              <div className="features-grid">
                <div className="project-rect"><p>Project 1</p></div>
                <div className="project-rect"><p>Project 2</p></div>
                <div className="project-rect"><p>Project 3</p></div>
              </div>
            </section>
          </main>

        </div>
      </div>
    </div>
  );
};
