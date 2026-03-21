export default function PrivacyPage() {
    const lastUpdated = "March 21, 2026";

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Privacy Policy</h1>
            <p style={styles.updated}>Last updated: {lastUpdated}</p>

            <section style={styles.section}>
                <p>
                    This Privacy Policy explains how <strong>Bohr</strong>{" "}
                    collects, uses, and protects your information when you use our
                    application.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>1. Information We Collect</h2>
                <p>We may collect the following types of information:</p>
                <ul style={styles.list}>
                    <li>Personal information such as name and email address</li>
                    <li>Usage data such as log information and feature interactions</li>
                    <li>Cookies and similar tracking technologies</li>
                </ul>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>2. How We Use Information</h2>
                <p>We use the collected information to:</p>
                <ul style={styles.list}>
                    <li>Provide, maintain, and improve the service</li>
                    <li>Communicate with users</li>
                    <li>Protect the security and integrity of the platform</li>
                    <li>Prevent fraud and misuse</li>
                </ul>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>3. Data Sharing</h2>
                <p>
                    We do not sell your personal data. We may share your information with
                    trusted service providers who help us operate the service, or when
                    required by law.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>4. Data Security</h2>
                <p>
                    We implement reasonable technical and organizational measures to
                    protect your information. However, no method of transmission or
                    storage is completely secure.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>5. Data Retention</h2>
                <p>
                    We retain personal data only for as long as necessary to provide the
                    service, comply with legal obligations, resolve disputes, and enforce
                    our agreements.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>6. Your Rights</h2>
                <p>
                    Depending on your location, you may have rights to access, correct,
                    delete, or restrict the use of your personal information.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>7. Changes to This Privacy Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. Any changes will
                    be posted on this page with a revised “Last updated” date.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>8. Contact Us</h2>
                <p>
                    If you have questions about this Privacy Policy, contact us at{" "}
                    <a href="mailto:privacy@yourapp.com">privacy@bohr.com</a>.
                </p>
            </section>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 20px",
        lineHeight: 1.7,
        color: "#222",
        fontFamily: "Arial, sans-serif",
    },
    title: {
        fontSize: "2.2rem",
        marginBottom: "10px",
    },
    updated: {
        color: "#666",
        marginBottom: "30px",
    },
    section: {
        marginBottom: "24px",
    },
    heading: {
        fontSize: "1.2rem",
        marginBottom: "8px",
    },
    list: {
        paddingLeft: "20px",
    },
};