import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + store.token
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setMessage("Password changed successfully");
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (err) {
      setError("Connection error, please try again");
    }
  };

  return (
    <div className="home-wrapper">
      <h2 className="view-title">Change password</h2>
      <div className="login-box">
        <form className="cyber-form" onSubmit={handleSubmit}>
          <label className="cyber-label">Current password</label>
          <input
            type="password"
            className="cyber-input"
            placeholder="********"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <label className="cyber-label">New password</label>
          <input
            type="password"
            className="cyber-input"
            placeholder="********"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" className="cyber-btn-success login-btn">
            Save new password
          </button>
        </form>
      </div>
    </div>
  );
};