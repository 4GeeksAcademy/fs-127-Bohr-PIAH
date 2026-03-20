import { useState } from "react";
import { EditProfile } from "./EditProfile";
import "./Profilecss.css";

export const ProfileModal = ({ show, onHide }) => {
  const [name, setName] = useState("Add Name");
  const [role, setRole] = useState("Role");

  // Estados para contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  if (!show) return null;

  const validatePassword = () => {
    if (newPassword.length < 8) {
      return "The password must have at least 8 characters.";
    }
    if (newPassword !== confirmPassword) {
      return "The passwords do not match.";
    }
    return null;
  };

  const handleChangePassword = async () => {
    const validationError = validatePassword();
    if (validationError) {
      setPasswordMessage({ type: "error", text: validationError });
      return;
    }

    setIsSavingPassword(true);
    setPasswordMessage(null);

    try {
      // Aquí iría la llamada real a API para cambiar la contraseña.





      await new Promise((r) => setTimeout(r, 800));

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({ type: "success", text: "Password updated successfully." });
    } catch (err) {
      setPasswordMessage({ type: "error", text: "Error updating the password." });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const passwordError = validatePassword();

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card-yellow">
        <button className="modal-close-btn" onClick={onHide}>✕</button>

        <div className="profile-layout">
          <div className="profile-left">
            <h2 className="name-user" style={{ color: "var(--c-nuc)", textShadow: "0 0 10px var(--c-nuc)", margin: "30px", padding: "30px" }}>
              {name}
            </h2>

            <div className="glass-card-yellow" style={{ padding: "20px", marginTop: "1px" }}>
              <h2 className="section-sub-title">Personal info</h2>

              <EditProfile label="Name" value={name} onSave={setName} />
              <EditProfile label="Role" value={role} onSave={setRole} />

              {/* Sección de cambiar contraseña */}
              <div className="password-section" style={{ marginTop: "30px" }}>
                <h3 className="section-sub-title">Change Password</h3>

                <label className="input-label">Password</label>
                <input
                  type="password"
                  className="cyber-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Old password"
                />

                <label className="input-label" style={{ marginTop: "10px" }}>New password</label>
                <input
                  type="password"
                  className="cyber-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Add your new password"
                />

                <label className="input-label" style={{ marginTop: "10px" }}>Check new password</label>
                <input
                  type="password"
                  className="cyber-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat the new password"
                />

                {passwordMessage && (
                  <p
                    style={{
                      color: passwordMessage.type === "error" ? "#c0392b" : "#27ae60",
                      marginTop: "10px",
                    }}
                  >
                    {passwordMessage.text}
                  </p>
                )}

                <button
                  className="cyber-btn-primary"
                  style={{ marginTop: "25px" }}
                  onClick={handleChangePassword}
                  disabled={isSavingPassword || !currentPassword || !!passwordError}
                >
                  {isSavingPassword ? "Saving..." : "Change password"}
                </button>

                {passwordError && (
                  <p style={{ color: "#c0392b", marginTop: "8px" }}>{passwordError}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
