"use client";

import { useEffect, useState } from "react";

interface Activity {
  timestamp: string;
  action: string;
  status: string;
  user: string;
  details: string;
}

export default function DashboardPage() {
  const [doorLocked, setDoorLocked] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [cameraFeed, setCameraFeed] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  // Fetch recent activity
  const fetchActivity = async () => {
    try {
      const res = await fetch("/api/logs/recent");
      const data = await res.json();
      setActivity(data || []);
    } catch {
      setActivity([]);
    }
  };

  // Fetch door status on mount
  const fetchDoorStatus = async () => {
    try {
      const res = await fetch("/api/door/status");
      const data = await res.json();
      setDoorLocked(data.locked);
    } catch {}
  };

  // Fetch camera status on mount
  const fetchCameraStatus = async () => {
    try {
      const res = await fetch("/api/camera/status");
      const data = await res.json();
      setCameraOn(data.enabled);
      setCameraFeed(data.enabled ? `/api/camera/stream?t=${Date.now()}` : null);
    } catch {}
  };

  useEffect(() => {
    fetchActivity();
    fetchDoorStatus();
    fetchCameraStatus();

    // Optional: auto-refresh activity every 10s
    const interval = setInterval(fetchActivity, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleDoor = async () => {
    try {
      await fetch("/api/door/toggle", { method: "POST" });
      setDoorLocked(!doorLocked);
    } catch {
      alert("Error toggling door");
    }
  };

  const toggleCamera = async () => {
    if (cameraOn) {
      setCameraOn(false);
      setCameraFeed(null);
      await fetch("/api/camera/stop", { method: "POST" });
    } else {
      try {
        await fetch("/api/camera/start", { method: "POST" });
        setCameraOn(true);
        setCameraFeed(`/api/camera/stream?t=${Date.now()}`);
      } catch {
        alert("Error starting camera");
      }
    }
  };

  const captureImage = async () => {
    try {
      const res = await fetch("/api/camera/capture", { method: "POST" });
      const data = await res.json();
      if (data.image) alert(`Image captured: ${data.image}`);
    } catch {
      alert("Error capturing image");
    }
  };

  const loadGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setGallery(data.images || []);
      setShowGallery(true);
    } catch {
      alert("Error loading gallery");
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2><i className="fas fa-home"></i> Dashboard</h2>
      </div>

      <div className="dashboard-grid-expanded">
        {/* Door Control */}
        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-door-open"></i> Door Control</h3>
          </div>
          <div className="card-body">
            <div className="door-status">
              <div className="status-indicator">
                <i className={`fas ${doorLocked ? "fa-lock" : "fa-unlock"}`}></i>
                <span>{doorLocked ? "Locked" : "Unlocked"}</span>
              </div>
              <button className="btn btn-primary" onClick={toggleDoor}>
                <i className={`fas ${doorLocked ? "fa-unlock" : "fa-lock"}`}></i>
                {doorLocked ? " Unlock Door" : " Lock Door"}
              </button>
            </div>
          </div>
        </div>

        {/* Camera Control */}
        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-camera"></i> Livestream</h3>
            <div className="card-actions">
              <button className="btn btn-icon" onClick={loadGallery} title="View Gallery">
                <i className="fas fa-images"></i>
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="camera-controls">
              <button className="btn" onClick={toggleCamera}>
                <i className="fas fa-video"></i> {cameraOn ? "Stop Stream" : "Start Stream"}
              </button>
              <button className="btn" onClick={captureImage} disabled={!cameraOn}>
                <i className="fas fa-camera"></i> Capture Image
              </button>
            </div>
            <div className="camera-stream">
              {!cameraOn ? (
                <div className="camera-placeholder">
                  <i className="fas fa-video-slash"></i>
                  <p>Camera Not Available</p>
                  <p className="small-text">Check camera connection</p>
                </div>
              ) : (
                <img className="camera-feed" src={cameraFeed!} alt="Camera Feed" />
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card expanded-activity">
          <div className="card-header">
            <h3><i className="fas fa-history"></i> Recent Activity</h3>
          </div>
          <div className="card-body">
            <div className="activity-list">
              {activity.length > 0 ? (
                activity.map((log, i) => (
                  <div key={i} className="activity-item">
                    {new Date(log.timestamp).toLocaleString()} — {log.action} — {log.status}
                  </div>
                ))
              ) : (
                <div className="activity-item">No activity found.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="modal" onClick={() => setShowGallery(false)}>
          <div className="modal-content gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Photo Gallery</h3>
              <span className="close" onClick={() => setShowGallery(false)}>&times;</span>
            </div>
            <div className="modal-body">
              <div className="gallery-grid">
                {gallery.map((img, i) => (
                  <img key={i} src={`/static/gallery/${img}`} alt={`Gallery ${i}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
