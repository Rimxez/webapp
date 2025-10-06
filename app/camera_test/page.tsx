"use client";

import { useState } from "react";

export default function CameraTestPage() {
  const [cameraInfo, setCameraInfo] = useState<JSX.Element | null>(
    <p>Click a test button to get camera information</p>
  );
  const [streamSrc, setStreamSrc] = useState("/placeholder.svg");
  const [diagnosticOutput, setDiagnosticOutput] = useState(
    "No diagnostic data available yet."
  );

  const showLoading = (target: "info" | "diagnostic") => {
    if (target === "info") {
      setCameraInfo(<p>Loading...</p>);
    } else {
      setDiagnosticOutput("Loading...");
    }
  };

  const testDirectStream = async () => {
    showLoading("info");
    try {
      const res = await fetch("/api/camera/status");
      const data = await res.json();
      setCameraInfo(
        <>
          <p><strong>Camera Type:</strong> {data.type || "Unknown"}</p>
          <p><strong>Status:</strong> {data.status || "Unknown"}</p>
          <p><strong>Resolution:</strong> {data.resolution || "Unknown"}</p>
          <p><strong>Enabled:</strong> {data.enabled ? "Yes" : "No"}</p>
        </>
      );
      setStreamSrc(`/api/camera/stream?t=${Date.now()}`);
    } catch (err) {
      setCameraInfo(<p className="error">Error getting camera info: {String(err)}</p>);
      setDiagnosticOutput("Error loading camera stream.");
    }
  };

  const testLibcamera = async () => {
    showLoading("info");
    showLoading("diagnostic");
    try {
      const res = await fetch("/api/camera/test/libcamera");
      const data = await res.json();
      setCameraInfo(
        <>
          <p><strong>Available:</strong> {data.available ? "Yes" : "No"}</p>
          <p><strong>Version:</strong> {data.version || "Unknown"}</p>
          <p><strong>Cameras:</strong> {data.cameras || "None detected"}</p>
        </>
      );
      setDiagnosticOutput(data.output || "No output available");
      if (data.image) setStreamSrc(`/static/test/${data.image}`);
    } catch (err) {
      setCameraInfo(<p className="error">Error testing libcamera: {String(err)}</p>);
      setDiagnosticOutput(`Error: ${String(err)}`);
    }
  };

  const testPicamera = async () => {
    showLoading("info");
    showLoading("diagnostic");
    try {
      const res = await fetch("/api/camera/test/picamera");
      const data = await res.json();
      setCameraInfo(
        <>
          <p><strong>Available:</strong> {data.available ? "Yes" : "No"}</p>
          <p><strong>Version:</strong> {data.version || "Unknown"}</p>
          <p><strong>Camera Model:</strong> {data.model || "Unknown"}</p>
        </>
      );
      setDiagnosticOutput(data.output || "No output available");
      if (data.image) setStreamSrc(`/static/test/${data.image}`);
    } catch (err) {
      setCameraInfo(<p className="error">Error testing PiCamera2: {String(err)}</p>);
      setDiagnosticOutput(`Error: ${String(err)}`);
    }
  };

  const runDiagnostics = async () => {
    showLoading("diagnostic");
    try {
      const res = await fetch("/api/camera/test/diagnostics");
      const data = await res.json();
      setDiagnosticOutput(data.output || "No diagnostic output available");
      if (data.summary) {
        setCameraInfo(
          <>
            <p><strong>Camera Detected:</strong> {data.summary.detected ? "Yes" : "No"}</p>
            <p><strong>Camera Enabled:</strong> {data.summary.enabled ? "Yes" : "No"}</p>
            <p><strong>Video Device:</strong> {data.summary.video_device || "Not found"}</p>
            <p><strong>Permission Issues:</strong> {data.summary.permission_issues ? "Yes" : "No"}</p>
          </>
        );
      }
    } catch (err) {
      setDiagnosticOutput(`Error running diagnostics: ${String(err)}`);
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2><i className="fas fa-camera"></i> Camera Test</h2>
      </div>
      <div className="card">
        <div className="card-header"><h3>Camera Diagnostics</h3></div>
        <div className="card-body">
          <div className="camera-test-controls">
            <button className="btn" onClick={testDirectStream}>
              <i className="fas fa-video"></i> Test Direct Stream
            </button>
            <button className="btn" onClick={testLibcamera}>
              <i className="fas fa-camera"></i> Test libcamera
            </button>
            <button className="btn" onClick={testPicamera}>
              <i className="fas fa-camera-retro"></i> Test PiCamera2
            </button>
            <button className="btn" onClick={runDiagnostics}>
              <i className="fas fa-stethoscope"></i> Run Full Diagnostics
            </button>
          </div>

          <div className="camera-test-results">
            <h4>Camera Information</h4>
            <div id="camera-info" className="info-panel">{cameraInfo}</div>

            <h4>Test Stream</h4>
            <div className="camera-test-stream">
              <img id="test-stream" className="camera-feed" src={streamSrc} alt="Camera Test Stream" />
            </div>

            <h4>Diagnostic Output</h4>
            <div id="diagnostic-output" className="diagnostic-panel">
              <pre>{diagnosticOutput}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
