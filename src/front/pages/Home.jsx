import React, { useRef } from "react";
import "../index.css";
import {
    UserCheck,
    Orbit,
    Zap,
    Columns3,
    UserPlus,
    BellRing,
    ShieldCheck,
    Briefcase,
    User,
    ClipboardList,
    BarChart3,
    UserCog,
    Milestone,
    Gauge,
    FileDown,
    PieChart,
    FastForward,
    LayoutDashboard,
    Move,
    CheckSquare,
    ArrowUpCircle,
    Users,
    Bell,
    Clock
} from "lucide-react";

export const Home = () => {
    const seguimientoRef = useRef(null);
    const reportesRef = useRef(null);
    const kanbanRef = useRef(null);
    const alertasRef = useRef(null);
    const rolesSectionRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="home-wrapper v1">
            <div className="atom-scene">
                <div className="shadow-floor"></div>
                <div className="atom-loader">
                    <svg
                        viewBox="0 0 120 120"
                        className="atom"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="60" cy="60" r="12" className="nucleus-glow" />
                        <circle cx="60" cy="60" r="10" className="nucleus" />

                        <g className="orbit">
                            <path
                                id="p1"
                                d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0"
                                className="orbit-path"
                            />
                            <circle r="4" className="electron">
                                <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
                                    <mpath href="#p1" />
                                </animateMotion>
                            </circle>
                        </g>

                        <g className="orbit" transform="rotate(60 60 60)">
                            <path
                                id="p2"
                                d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0"
                                className="orbit-path"
                            />
                            <circle r="4" className="electron">
                                <animateMotion
                                    dur="2.5s"
                                    repeatCount="indefinite"
                                    rotate="auto"
                                    begin="-0.5s"
                                >
                                    <mpath href="#p2" />
                                </animateMotion>
                            </circle>
                        </g>

                        <g className="orbit" transform="rotate(-60 60 60)">
                            <path
                                id="p3"
                                d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0"
                                className="orbit-path"
                            />
                            <circle r="4" className="electron">
                                <animateMotion
                                    dur="2.2s"
                                    repeatCount="indefinite"
                                    rotate="auto"
                                    begin="-1s"
                                >
                                    <mpath href="#p3" />
                                </animateMotion>
                            </circle>
                        </g>
                    </svg>
                </div>
            </div>

            <h2 className="welcome-text">
                BOHR <br />
                <span>PROJECT MANAGEMENT FOR HIGH-PERFORMING TEAMS</span>
                <span>ALL THE TOOLS YOU NEED TO DELIVER RESULTS — SIMPLE, POWERFUL, INTUITIVE</span>
            </h2>

            <div className="glass-card-yellow">
                <div className="features-grid">
                    <div
                        className="feature-item"
                        onClick={() => scrollToSection(rolesSectionRef)}
                        style={{ cursor: "pointer" }}
                    >
                        <UserCheck size={40} strokeWidth={1.5} color="#27E6D6" />
                        <p className="feature-title">Simplified Roles</p>
                        <p className="feature-description">
                            Admin, team lead and contributor. <br />
                            Smart permission control out of the box.
                        </p>
                    </div>

                    <div
                        className="feature-item"
                        onClick={() => scrollToSection(seguimientoRef)}
                        style={{ cursor: "pointer" }}
                    >
                        <Orbit size={40} strokeWidth={1.5} color="#27E6D6" />
                        <p className="feature-title">Intuitive Tracking</p>
                        <p className="feature-description">
                            Daily updates and weekly insights <br />
                            across every project and team member.
                        </p>
                    </div>

                    <div
                        className="feature-item"
                        onClick={() => scrollToSection(reportesRef)}
                        style={{ cursor: "pointer" }}
                    >
                        <Zap size={40} strokeWidth={1.5} color="#27E6D6" />
                        <p className="feature-title">Automated Reports</p>
                        <p className="feature-description">
                            Real-time analytics. <br />
                            Export full reports in one click.
                        </p>
                    </div>

                    <div
                        className="feature-item"
                        onClick={() => scrollToSection(kanbanRef)}
                        style={{ cursor: "pointer" }}
                    >
                        <Columns3 size={40} strokeWidth={1.5} color="#27E6D6" />
                        <p className="feature-title">Kanban Drag & Drop</p>
                        <p className="feature-description">
                            Move tasks seamlessly between stages.
                        </p>
                    </div>

                    <div
                        className="feature-item"
                        onClick={() => scrollToSection(alertasRef)}
                        style={{ cursor: "pointer" }}
                    >
                        <UserPlus size={40} strokeWidth={1.5} color="#27E6D6" />
                        <p className="feature-title">External Collaboration</p>
                        <p className="feature-description">
                            Invite clients and collaborators <br />
                            instantly with one click.
                        </p>
                    </div>

                    <div
                        className="feature-item"
                        onClick={() => scrollToSection(alertasRef)}
                        style={{ cursor: "pointer" }}
                    >
                        <BellRing size={40} strokeWidth={1.5} color="#27E6D6" />
                        <p className="feature-title">Smart Notifications</p>
                        <p className="feature-description">
                            Real-time alerts that actually matter.
                        </p>
                    </div>
                </div>
            </div>

            <div className="section-sub-title" ref={rolesSectionRef}>
                ROLES
            </div>
            <p className="roles-section-description">
                Define clear responsibilities and give every team member exactly what they need to perform at their best.
            </p>

            <div className="glass-card-yellow">
                <div className="features-grid">
                    <div className="sub-feature">
                        <ShieldCheck size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Administrator</p>
                        <p className="feature-description">
                            Full system control, <br />
                            user management and analytics.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <Briefcase size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Team Lead</p>
                        <p className="feature-description">
                            Manage teams, <br />
                            create and oversee projects.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <User size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Contributor</p>
                        <p className="feature-description">
                            Update assigned tasks, <br />
                            track project progress.
                        </p>
                    </div>
                </div>
            </div>

            <div className="section-sub-title" ref={seguimientoRef}>
                INTUITIVE TRACKING
            </div>
            <p className="roles-section-description">
                Stay on top of progress with daily updates and weekly insights <br />
                tailored to every team member.
            </p>

            <div className="glass-card-yellow">
                <div className="features-grid">
                    <div className="sub-feature">
                        <ClipboardList size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Daily Reports</p>
                        <p className="feature-description">
                            Capture progress <br />
                            every single day.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <BarChart3 size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Weekly Insights</p>
                        <p className="feature-description">
                            Performance metrics <br />
                            and team trends.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <UserCog size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Individual Tracking</p>
                        <p className="feature-description">
                            Detailed tracking <br />
                            per team member.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <Milestone size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Key Milestones</p>
                        <p className="feature-description">
                            Track deliverables <br />
                            and success checkpoints.
                        </p>
                    </div>
                </div>
            </div>

            <div className="section-sub-title" ref={reportesRef}>
                AUTOMATED REPORTS
            </div>
            <p className="roles-section-description">
                Generate powerful reports instantly. <br />
                Understand performance, progress, and outcomes at a glance.
            </p>

            <div className="glass-card-yellow">
                <div className="features-grid">
                    <div className="sub-feature">
                        <Gauge size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Real-Time Analytics</p>
                        <p className="feature-description">
                            Always up-to-date data <br />
                            across your entire workflow.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <FileDown size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">One-Click Export</p>
                        <p className="feature-description">
                            Export professional reports <br />
                            in seconds.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <PieChart size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Progress Visualization</p>
                        <p className="feature-description">
                            Instantly see what’s done <br />
                            and what’s pending.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <FastForward size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Smart Forecasting</p>
                        <p className="feature-description">
                            Predict realistic delivery dates <br />
                            automatically.
                        </p>
                    </div>
                </div>
            </div>

            <div className="section-sub-title" ref={kanbanRef}>
                KANBAN DRAG & DROP
            </div>
            <p className="roles-section-description">
                Move tasks effortlessly across stages. <br />
                Visualize and optimize your workflow in real time.
            </p>

            <div className="glass-card-yellow">
                <div className="features-grid">
                    <div className="sub-feature">
                        <LayoutDashboard size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Dynamic Workflow</p>
                        <p className="feature-description">
                            Flexible columns <br />
                            for every project.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <Move size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Drag & Drop</p>
                        <p className="feature-description">
                            Move tasks freely <br />
                            with total ease.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <CheckSquare size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Full Control</p>
                        <p className="feature-description">
                            Manage every stage <br />
                            from start to finish.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <ArrowUpCircle size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Smart Prioritization</p>
                        <p className="feature-description">
                            Highlight what matters most <br />
                            instantly.
                        </p>
                    </div>
                </div>
            </div>

            <div className="section-sub-title" ref={alertasRef}>
                COLLABORATION & ALERTS
            </div>
            <p className="roles-section-description">
                Bring everyone into the workflow. <br />
                Stay informed with real-time updates that keep your team aligned.
            </p>

            <div className="glass-card-yellow">
                <div className="features-grid">
                    <div className="sub-feature">
                        <UserPlus size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Invite External Users</p>
                        <p className="feature-description">
                            Add collaborators <br />
                            in seconds.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <Users size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Client Access</p>
                        <p className="feature-description">
                            Secure read-only access <br />
                            for your clients.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <Bell size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Alerts</p>
                        <p className="feature-description">
                            Get notified about <br />
                            critical changes.
                        </p>
                    </div>

                    <div className="sub-feature">
                        <Clock size={40} strokeWidth={1.5} color="var(--c-nuc)" />
                        <p className="feature-title">Activity Log</p>
                        <p className="feature-description">
                            Full visibility of <br />
                            everything that happens.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};