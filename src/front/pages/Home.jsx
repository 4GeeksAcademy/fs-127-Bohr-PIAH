import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useState } from "react";
import "../index.css";



export const Home = () => {
	// Estado para controlar la versión (1, 2 o 3)
	const [version, setVersion] = useState(1);

	return (
		<div className={`home-wrapper v${version}`}>
			{/* Selector flotante para la presentación */}
			<div className="presentation-controls">
				<button className={version === 1 ? 'active' : ''} onClick={() => setVersion(1)}>Opcion 1</button>
				<button className={version === 2 ? 'active' : ''} onClick={() => setVersion(2)}>Opcion 2</button>
				<button className={version === 3 ? 'active' : ''} onClick={() => setVersion(3)}>Opcion 3</button>
			</div>

			<div className="atom-scene">
				<div className="shadow-floor"></div>
				<div className="atom-loader">
					<svg viewBox="0 0 120 120" className="atom" xmlns="http://www.w3.org">
						<circle cx="60" cy="60" r="10" className="nucleus-glow" />
						<circle cx="60" cy="60" r="10" className="nucleus" />

						<g className="orbit">
							<path id="p1" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" />
							<circle r="5" className="electron">
								<animateMotion dur="2s" repeatCount="indefinite" rotate="auto"><mpath href="#p1" /></animateMotion>
							</circle>
						</g>
						<g className="orbit" transform="rotate(60 60 60)">
							<path id="p2" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" />
							<circle r="5" className="electron">
								<animateMotion dur="2.5s" repeatCount="indefinite" rotate="auto" begin="-0.5s"><mpath href="#p2" /></animateMotion>
							</circle>
						</g>
						<g className="orbit" transform="rotate(-60 60 60)">
							<path id="p3" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" />
							<circle r="5" className="electron">
								<animateMotion dur="2.2s" repeatCount="indefinite" rotate="auto" begin="-1s"><mpath href="#p3" /></animateMotion>
							</circle>
						</g>
					</svg>
				</div>
			</div>

			<h2 className="welcome-text">
				{version === 1 && "BOHR: Estructura Atómica para la Gestión de Proyectos"}
				{version === 2 && "BOHR: Estructura Atómica para la Gestión de Proyectos"}
				{version === 3 && "BOHR: Estructura Atómica para la Gestión de Proyectos"}
			</h2>
			<p className="description-text">
				{version === 1 && "Gestión de proyectos, refinada. Asignación de roles simplificada, seguimiento de estados intuitivo y reportes automatizados. Porque gestionar un equipo no debería ser tan complejo como la física cuántica. Todo lo que necesitas, exactamente donde lo necesitas."}
				{version === 2 && "Bohr es tu plataforma de gestión de proyectos y trabajo para tu organizacion y equipos"}
				{version === 3 && "Bohr es tu plataforma de gestión de proyectos y trabajo para tu organizacion y equipos"}
			</p>
		</div>
	);
};