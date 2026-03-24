import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./Profilecss.css";
import { changePasswordService } from "../../services/authService";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const ProfileModal = ({ show, onHide }) => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const user = store.user || {};

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      setPasswordMessage({ type: "success", text: "Password updated. Redirecting to login..." });
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentDepartment");
        dispatch({ type: "set_token", payload: null });
        dispatch({ type: "set_user", payload: null });
        navigate("/login");
      }, 1500);
    } catch (err) {
      setPasswordMessage({ type: "error", text: err.message || "Error updating the password." });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const passwordError = validatePassword();

  const eyeStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "rgba(255,255,255,0.5)",
    padding: 0,
    display: "flex",
    alignItems: "center",
  };

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
              <div style={{ position: "relative" }}>
                <input
                  type={showCurrent ? "text" : "password"}
                  className="cyber-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Old password"
                  style={{ paddingRight: "36px" }}
                />
                <button type="button" style={eyeStyle} onClick={() => setShowCurrent(v => !v)}>
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <label className="profile-info-label" style={{ marginTop: "10px" }}>New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNew ? "text" : "password"}
                  className="cyber-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  style={{ paddingRight: "36px" }}
                />
                <button type="button" style={eyeStyle} onClick={() => setShowNew(v => !v)}>
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <label className="profile-info-label" style={{ marginTop: "10px" }}>Confirm New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  className="cyber-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  style={{ paddingRight: "36px" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isSavingPassword && currentPassword && !passwordError)
                      handleChangePassword();
                  }}
                />
                <button type="button" style={eyeStyle} onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

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
