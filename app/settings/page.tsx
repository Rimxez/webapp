"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    system_passcode: "",
    lockout_passcode: "",
    max_trials: 3,
    auto_lock_delay: 5,
    keypad_enabled: true,
    keypad_timeout: 30,
    camera_enabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch current settings on load
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setForm(data); // assuming backend returns same structure
      } catch (err) {
        console.error("Error fetching settings:", err);
        setMessage("⚠️ Failed to load settings.");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save settings");

      setMessage("✅ Settings saved successfully.");
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage("❌ Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <section className="section active">
      <div className="section-header">
        <h2>
          <i className="fas fa-cog" /> Settings
        </h2>
      </div>

      {message && <p>{message}</p>}

      <div className="card">
        <div className="card-header">
          <h3>
            <i className="fas fa-sliders-h" /> System Configuration
          </h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>System Passcode</label>
              <input
                type="password"
                name="system_passcode"
                value={form.system_passcode}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Lockout Override Passcode</label>
              <input
                type="password"
                name="lockout_passcode"
                value={form.lockout_passcode}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Maximum Failed Attempts</label>
              <input
                type="number"
                name="max_trials"
                value={form.max_trials}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Auto-Lock Delay</label>
              <input
                type="number"
                name="auto_lock_delay"
                value={form.auto_lock_delay}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="keypad_enabled"
                  checked={form.keypad_enabled}
                  onChange={handleChange}
                />
                Enable Physical Keypad
              </label>
            </div>

            <div className="form-group">
              <label>Keypad Timeout</label>
              <input
                type="number"
                name="keypad_timeout"
                value={form.keypad_timeout}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="camera_enabled"
                  checked={form.camera_enabled}
                  onChange={handleChange}
                />
                Enable Camera
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              <i className="fas fa-save" />{" "}
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>
      </div>

      {/* Hardware Info */}
      <div className="card">
        <div className="card-header">
          <h3>
            <i className="fas fa-microchip" /> Hardware Configuration
          </h3>
        </div>
        <div className="card-body">
          <div>Keypad GPIO Rows: 18, 23, 24, 25</div>
          <div>Keypad GPIO Columns: 4, 17, 27, 22</div>
          <div>Door Relay Pin: 21</div>
        </div>
      </div>

      {/* Security Info */}
      <div className="card">
        <div className="card-header">
          <h3>
            <i className="fas fa-shield-alt" /> Security Information
          </h3>
        </div>
        <div className="card-body">
          <p>Password Encryption: SHA-256</p>
          <p>Session Timeout: 24 hours</p>
          <p>Log Retention: 1000 entries</p>
        </div>
      </div>
    </section>
  );
}
