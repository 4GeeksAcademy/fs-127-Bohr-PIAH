import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Navbar } from "../components/Navbar";
import { DashboardNavbar } from "../components/Dashboard/DashboardNavbar";

export default function ContactPage() {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    return (
        <div className="home-wrapper v1" style={{ minHeight: "100vh" }}>
            {store.token ? <DashboardNavbar /> : <Navbar />}

            <div style={styles.container}>
                <button onClick={() => navigate(-1)} style={styles.backBtn}>
                    <ArrowLeft size={18} strokeWidth={2} />
                    Back
                </button>
                <h1 style={styles.title}>Contact Us</h1>
                <p style={styles.text}>
                    We would love to hear from you. If you have questions, feedback, or
                    need support, please contact us using the information below.
                </p>

                <section style={styles.card}>
                    <h2 style={styles.heading}>Support</h2>
                    <p style={styles.text}>
                        Email:{" "}
                        <a href="mailto:support@bohr.com" style={styles.link}>support@bohr.com</a>
                    </p>
                    <p style={styles.text}>
                        Website:{" "}
                        <a href="https://www.bohrmanager.com" target="_blank" rel="noreferrer" style={styles.link}>
                            www.bohrmanager.com
                        </a>
                    </p>
                </section>

                <section style={styles.card}>
                    <h2 style={styles.heading}>Support Hours</h2>
                    <p style={styles.text}>Monday – Friday</p>
                    <p style={styles.text}>9:00 AM – 5:00 PM</p>
                </section>

                <section style={styles.card}>
                    <h2 style={styles.heading}>Response Time</h2>
                    <p style={styles.text}>We aim to respond within 24–48 hours.</p>
                </section>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "900px",
        margin: "0 auto",
        padding: "140px 20px 60px",
        lineHeight: 1.8,
        color: "rgba(255,255,255,0.85)",
    },
    title: {
        fontSize: "2.2rem",
        marginBottom: "16px",
        color: "var(--c-cyber)",
        letterSpacing: "1.5px",
    },
    heading: {
        fontSize: "1.1rem",
        marginBottom: "10px",
        color: "var(--c-nuc)",
        fontWeight: "600",
        letterSpacing: "0.5px",
    },
    text: {
        color: "rgba(255,255,255,0.75)",
        marginBottom: "8px",
    },
    card: {
        border: "1px solid rgba(39,230,214,0.2)",
        borderRadius: "10px",
        padding: "20px 24px",
        marginBottom: "20px",
        background: "rgba(255,255,255,0.03)",
        borderLeft: "3px solid rgba(39,230,214,0.4)",
    },
    link: {
        color: "var(--c-cyber)",
    },
    backBtn: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "transparent",
        border: "1px solid rgba(39,230,214,0.3)",
        color: "rgba(39,230,214,0.8)",
        borderRadius: "8px",
        padding: "6px 14px",
        fontSize: "0.85rem",
        cursor: "pointer",
        marginBottom: "24px",
    },
};
