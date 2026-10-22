export default function OfflinePage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Offline — Campus ERP</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            min-height: 100vh;
            background: #0a0f1e;
            color: #e2e8f0;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }
          .container {
            text-align: center;
            max-width: 400px;
          }
          .icon {
            font-size: 64px;
            margin-bottom: 24px;
            display: block;
          }
          h1 {
            font-size: 24px;
            font-weight: 700;
            color: #f1f5f9;
            margin-bottom: 12px;
          }
          p {
            font-size: 15px;
            color: #94a3b8;
            line-height: 1.6;
            margin-bottom: 32px;
          }
          button {
            background: linear-gradient(135deg, #7c3aed, #4f46e5);
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <span className="icon">📡</span>
          <h1>You&apos;re Offline</h1>
          <p>
            Campus ERP needs an internet connection to fetch your real-time
            attendance, assignments, and timetable from the college servers.
            Please reconnect and try again.
          </p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </body>
    </html>
  );
}
