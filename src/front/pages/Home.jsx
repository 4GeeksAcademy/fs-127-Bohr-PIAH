import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useState } from "react";
import "../index.css";
import Lottie from "lottie-react";
import atomo from "../assets/atomoLottie.json"


export const Home = () => {
	const [version, setVersion] = useState(1);

	return (
		<div className={`home-wrapper v${version}`}>
			<div className="presentation-controls">
				<button className={version === 1 ? 'active' : ''} onClick={() => setVersion(1)}>Opción 1</button>
				<button className={version === 2 ? 'active' : ''} onClick={() => setVersion(2)}>Opción 2</button>
				<button className={version === 3 ? 'active' : ''} onClick={() => setVersion(3)}>Opción 3</button>
				<button className={version === 4 ? 'active' : ''} onClick={() => setVersion(4)}>V4 Lottie</button>
				<button className={version === 5 ? 'active' : ''} onClick={() => setVersion(5)}>V5 Lottie</button>
			</div>

			<div className="atom-scene">
				{(version === 4 || version === 5) ? (
					<div className="lottie-container">

						<Lottie animationData={atomo} loop={true} />
					</div>
				) : (
					<>
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
					</>
				)}
			</div>

			<h2 className="welcome-text">
				BOHR <br />
				<span>Estructura Atómica para la Gestión de Proyectos</span>
			</h2>

			<p className="description-text">
				{version === 1 && "Gestión de proyectos. Asignación de roles simplificada, seguimiento de estados intuitivo y reportes automatizados. Porque gestionar un equipo no debería ser tan complejo como la física cuántica. Todo lo que necesitas, exactamente donde lo necesitas."}
				{version === 2 && "Gestión de proyectos. Asignación de roles simplificada, seguimiento de estados intuitivo y reportes automatizados. Porque gestionar un equipo no debería ser tan complejo como la física cuántica. Todo lo que necesitas, exactamente donde lo necesitas."}
				{version === 3 && "Gestión de proyectos. Asignación de roles simplificada, seguimiento de estados intuitivo y reportes automatizados. Porque gestionar un equipo no debería ser tan complejo como la física cuántica. Todo lo que necesitas, exactamente donde lo necesitas."}
				{version === 4 && "Gestión de proyectos. Asignación de roles simplificada, seguimiento de estados intuitivo y reportes automatizados. Porque gestionar un equipo no debería ser tan complejo como la física cuántica. Todo lo que necesitas, exactamente donde lo necesitas."}
				{version === 5 && "Gestión de proyectos. Asignación de roles simplificada, seguimiento de estados intuitivo y reportes automatizados. Porque gestionar un equipo no debería ser tan complejo como la física cuántica. Todo lo que necesitas, exactamente donde lo necesitas."}
			</p>
		</div>
	);
};