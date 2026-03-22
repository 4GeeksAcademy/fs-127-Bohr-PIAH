import "../ModalProject/CssModalProject.css";

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-cyber-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-cyber-container" style={{ maxWidth: "400px" }}>
        <p style={{ color: "#e0e0e0", marginBottom: "24px", fontSize: "1rem" }}>{message}</p>
        <div className="modal-cyber-footer d-flex justify-content-end gap-2">
          <button type="button" className="cyber-btn-outline" onClick={onCancel}>Cancel</button>
          <button type="button" className="cyber-btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
