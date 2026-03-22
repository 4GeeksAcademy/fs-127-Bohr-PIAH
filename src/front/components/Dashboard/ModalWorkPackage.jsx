import React, { useState } from "react";
import "../ModalProject/CssModalProject.css";
import { X } from "lucide-react";

const ModalWorkPackage = ({ isOpen, onClose, title, setTitle, onSubmit }) => {
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            await onSubmit();
        } finally {
            setIsSaving(false);
        }
    };

    return (

        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(4px)'
        }}>

            <div className="glass-card-yellow p-4 shadow-lg" style={{ width: '350px', border: '1px solid #27E6D6' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="text-white mb-0" style={{ fontSize: "1rem" }}>NEW WORK PACKAGE</h5>
                    <X size={20} className="text-info" style={{ cursor: "pointer" }} onClick={onClose} />
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <input
                    type="text" className="form-control bg-dark text-white border-info mb-3 shadow-none" placeholder="WP Name (e.g. Design)" value={title}
                    onChange={(e) => setTitle(e.target.value)} autoFocus />

                <div className="modal-cyber-footer mt-3" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button type="button" className="cyber-btn-outline" style={{ flex: 1, height: "44px", fontSize: "0.85rem" }} onClick={onClose} disabled={isSaving}>Cancel</button>
                    <button type="submit" className="cyber-btn" style={{ flex: 1, height: "44px", fontSize: "0.85rem", width: "auto", marginTop: 0 }} disabled={isSaving}>
                        {isSaving ? "Creating..." : "Create"}
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
};

export default ModalWorkPackage;