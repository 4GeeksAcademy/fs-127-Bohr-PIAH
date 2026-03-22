import { useState } from "react";
import "./Profilecss.css";
import { changePasswordService } from "../../services/authService";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const ProfileModal = ({ show, onHide }) => {
  const { store } = useGlobalReducer();
  const user = store.user || {};

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  if (!show) return null;

  const validatePassword = () => {
    if (newPassword.length < 8) return "The password must have at least 8 characters.";
    if (newPassword !== confirmPassword) return "The passwords do not match.";
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
      await changePasswordService(currentPassword, newPassword, store.token);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({ type: "success", text: "Password updated successfully." });
    } catch (err) {
      setPasswordMessage({ type: "error", text: err.message || "Error updating the password." });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const passwordError = validatePassword();

  return (
    <div className="modal-overlay" onClick={onHide}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close-btn" onClick={onHide}>✕</button>

        <div className="profile-layout">

          {/* COLUMNA IZQUIERDA */}
          <div className="profile-col">
            <h2 className="profile-username">
              {user.first_name} {user.last_name}
            </h2>

            <div className="profile-section">
              <p className="profile-section-title">Personal Info</p>

              <p className="profile-info-label">Email</p>
              <p className="profile-info-value">{user.email || "—"}</p>

              <p className="profile-info-label" style={{ marginTop: "12px" }}>Role</p>
              <p className="profile-info-value">
                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "—"}
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="profile-col">
            <h2 className="profile-username" style={{ opacity: 0, pointerEvents: "none" }}>·</h2>

            <div className="profile-section">
              <p className="profile-section-title">Change Password</p>

              <label className="profile-info-label">Current Password</label>
              <input
                type="password"
                className="cyber-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Old password"
              />

              <label className="profile-info-label" style={{ marginTop: "10px" }}>New Password</label>
              <input
                type="password"
                className="cyber-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
              />

              <label className="profile-info-label" style={{ marginTop: "10px" }}>Confirm New Password</label>
              <input
                type="password"
                className="cyber-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSavingPassword && currentPassword && !passwordError)
                    handleChangePassword();
                }}
              />

              {passwordMessage && (
                <p className={passwordMessage.type === "error" ? "profile-msg-error" : "profile-msg-success"}>
                  {passwordMessage.text}
                </p>
              )}

              <button
                className="cyber-btn-primary"
                style={{ marginTop: "14px", width: "100%" }}
                onClick={handleChangePassword}
                disabled={isSavingPassword || !currentPassword || !!passwordError}
              >
                {isSavingPassword ? "Saving..." : "Change Password"}
              </button>

              {passwordError && currentPassword && (
                <p className="profile-msg-error">{passwordError}</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
