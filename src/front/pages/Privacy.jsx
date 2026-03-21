import useGlobalReducer from "../hooks/useGlobalReducer";
import { Navbar } from "../components/Navbar";
import { DashboardNavbar } from "../components/Dashboard/DashboardNavbar";

export default function PrivacyPage() {
    const { store } = useGlobalReducer();
    const lastUpdated = "March 21, 2026";

    return (
        <div className="home-wrapper v1" style={{ minHeight: "100vh" }}>
            {store.token ? <DashboardNavbar /> : <Navbar />}

            <div style={styles.container}>
                <h1 style={styles.title}>Privacy Policy</h1>
                <p style={styles.updated}>Last updated: {lastUpdated}</p>

                <section style={styles.section}>
                    <p style={styles.text}>
                        This Privacy Policy explains how <strong style={{ color: "var(--c-cyber)" }}>Bohr</strong>{" "}
                        collects, uses, and protects your information when you use our application.
                    </p>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.heading}>1. Information We Collect</h2>
                    <p style={styles.text}>We may collect the following types of information:</p>
                    <ul style={styles.list}>
                        <li>Personal information such as name and email address</li>
                        <li>Usage data such as log information and feature interactions</li>
                        <li>Cookies and similar tracking technologies</li>
                    </ul>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.heading}>2. How We Use Information</h2>
                    <p style={styles.text}>We use the collected information to:</p>
                    <ul style={styles.list}>
                        <li>Provide, maintain, and improve the service</li>
                        <li>Communicate with users</li>
                        <li>Protect the security and integrity of the platform</li>
                        <li>Prevent fraud and misuse</li>
                    </ul>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.heading}>3. Data Sharing</h2>
                    <p style={styles.text}>
                        We do not sell your personal data. We may share your information with
                        trusted service providers who help us operate the service, or when
                        required by law.
                    </p>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.heading}>4. Data Security</h2>
                    <p style={styles.text}>
                        We implement reasonable technical and organizational measures to
                        protect your information. However, no method of transmission or
                        storage is completely secure.
                    </p>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.heading}>5. Data Retention</h2>
                    <p style={styles.text}>
                        We retain personal data only for as long as necessary to provide the
                        service, comply with legal obligations, resolve disputes, and enforce
                        our agreements.
                    </p>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.heading}>6. Your Rights</h2>
                    <p style={styles.text}>
                        Depending on your location, you may have rights to access, correct,
                        delete, or restrict the use of your personal information.
                    </p>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.heading}>7. Changes to This Privacy Policy</h2>
                    <p style={styles.text}>
                        We may update this Privacy Policy from time to time. Any changes will
                        be posted on this page with a revised "Last updated" date.
                    </p>
                </section>

                <section style={styles.section}>
                    <h2 style={styles.heading}>8. Contact Us</h2>
                    <p style={styles.text}>
                        If you have questions about this Privacy Policy, contact us at{" "}
                        <a href="mailto:privacy@bohr.com" style={styles.link}>privacy@bohr.com</a>.
                    </p>
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
        marginBottom: "10px",
        color: "var(--c-cyber)",
        letterSpacing: "1.5px",
    },
    updated: {
        color: "rgba(255,255,255,0.4)",
        marginBottom: "30px",
        fontSize: "0.9rem",
    },
    section: {
        marginBottom: "28px",
        borderLeft: "2px solid rgba(39,230,214,0.2)",
        paddingLeft: "16px",
    },
    heading: {
        fontSize: "1.1rem",
        marginBottom: "8px",
        color: "var(--c-nuc)",
        fontWeight: "600",
        letterSpacing: "0.5px",
    },
    text: {
        color: "rgba(255,255,255,0.75)",
        marginBottom: "6px",
    },
    list: {
        paddingLeft: "20px",
        color: "rgba(255,255,255,0.75)",
        marginTop: "6px",
    },
    link: {
        color: "var(--c-cyber)",
    },
};
