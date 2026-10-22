"use client";

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        color: "#e2e8f0",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>📡</div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#f1f5f9",
            marginBottom: "12px",
          }}
        >
          You&apos;re Offline
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "#94a3b8",
            lineHeight: 1.6,
            marginBottom: "32px",
          }}
        >
          Campus ERP needs an internet connection to fetch your real-time
          attendance, assignments, and timetable from the college servers.
          Please reconnect and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            color: "white",
            border: "none",
            padding: "12px 32px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
