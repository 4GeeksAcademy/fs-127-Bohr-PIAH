export default function TermsPage() {
    const lastUpdated = "March 21, 2026";

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Terms of Service</h1>
            <p style={styles.updated}>Last updated: {lastUpdated}</p>

            <section style={styles.section}>
                <p>
                    Welcome to <strong>Bohr</strong>. By accessing or using our
                    application, you agree to be bound by these Terms of Service.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>1. Use of the Service</h2>
                <p>
                    You agree to use the service only for lawful purposes and in
                    accordance with these Terms. You must not misuse the platform or
                    attempt to access it using unauthorized methods.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>2. Accounts</h2>
                <p>
                    You are responsible for maintaining the confidentiality of your
                    account credentials and for all activities that occur under your
                    account.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>3. Intellectual Property</h2>
                <p>
                    All content, features, and functionality of the service are owned by{" "}
                    <strong>Bohr</strong> and are protected by applicable
                    intellectual property laws.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>4. User Content</h2>
                <p>
                    You retain ownership of the content you submit to the platform.
                    However, by submitting content, you grant us a limited license to use,
                    store, and display it as necessary to operate and improve the service.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>5. Termination</h2>
                <p>
                    We may suspend or terminate your access to the service at any time if
                    you violate these Terms or use the platform in a way that may harm the
                    service or other users.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>6. Limitation of Liability</h2>
                <p>
                    To the fullest extent permitted by law, we are not liable for any
                    indirect, incidental, special, consequential, or punitive damages
                    arising from your use of the service.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>7. Changes to These Terms</h2>
                <p>
                    We may update these Terms from time to time. Continued use of the
                    service after changes become effective means you accept the revised
                    Terms.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>8. Contact</h2>
                <p>
                    If you have any questions about these Terms, contact us at{" "}
                    <a href="mailto:support@yourapp.com">support@bohr.com</a>
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
};