import { Link } from "react-router-dom";

export const Footer = () => {
	return (
		<footer className="footer-cyber" style={{ backgroundColor: "rgb(13, 16, 28)", borderTop: "1px solid rgba(39, 230, 214, 0.1)", padding: "40px 0" }}>
			<div className="container d-flex justify-content-between align-items-center flex-wrap">

				{/* IZQUIERDA: Marca y Eslógan */}
				<div className="footer-left">
					<h2 className="welcome-text" style={{ fontSize: "1.8rem", margin: 0, color: "var(--c-nuc)", textShadow: "0 0 10px var(--c-nuc)", textAlign: "left" }}>
						BOHR
					</h2>
					<p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.85rem", letterSpacing: "1px", marginTop: "5px", marginBottom: 0 }}>
						LA ESTRUCTURA DETRÁS DE CADA PROYECTO
					</p>
				</div>

				<div className="footer-right d-flex gap-4">
					<Link to="/terms" className="footer-link-small">Terms</Link>
					<Link to="/privacy" className="footer-link-small">Privacy</Link>
					<Link to="/contact" className="footer-link-small">Contact</Link>
				</div>

			</div>
		</footer>
	);
};
