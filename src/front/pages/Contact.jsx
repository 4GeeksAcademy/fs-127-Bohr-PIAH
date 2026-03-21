import React from "react";

export default function ContactPage() {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Contact Us</h1>
            <p style={styles.text}>
                We would love to hear from you. If you have questions, feedback, or
                need support, please contact us using the information below.
            </p>

            <section style={styles.card}>
                <h2 style={styles.heading}>Support</h2>
                <p style={styles.text}>
                    Email: <a href="mailto:support@bohr.com">support@bohr.com</a>
                </p>
                <p style={styles.text}>
                    Website:{" "}
                    <a
                        href="https://www.bohrmanager.com"
                        target="_blank"
                        rel="noreferrer"
                    >
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
        marginBottom: "16px",
    },
    heading: {
        fontSize: "1.2rem",
        marginBottom: "10px",
    },
    text: {
        marginBottom: "10px",
    },
    card: {
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "20px",
        backgroundColor: "#fafafa",
    },
};