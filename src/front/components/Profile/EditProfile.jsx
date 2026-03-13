import { useState, useEffect } from "react";

export const EditProfile = ({ label, value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    if (tempValue.trim() === value.trim()) return;
    onSave(tempValue);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setTempValue(value);
      setEditing(false);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <p style={{ color: "white", marginTop: "5px" }}>
        <strong>{label}:</strong>{" "}
        {editing ? (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              padding: "3px 5px",
              borderRadius: "8px",
              border: "1px solid var(--c-cyber)",
              background: "rgba(0,0,0,0.4)",
              color: "white",
              marginLeft: "10px"
            }}
          />
        ) : (
          <span style={{ marginLeft: "10px" }}>{value}</span>
        )}
      </p>

      {editing ? (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="cyber-btn-secondary"
            style={{ marginTop: "10px", opacity: tempValue === value ? 0.5 : 1 }}
            disabled={tempValue === value}
            onClick={handleSave}
          >
            Save
          </button>

          <button
            className="cyber-btn-secondary"
            style={{ marginTop: "10px", background: "gray" }}
            onClick={() => {
              setTempValue(value);
              setEditing(false);
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className="nav-login-cyber"
          style={{ marginTop: "5px" }}
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
      )}
    </div>
  );
};
