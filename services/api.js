// services/api.js

const API_BASE = "/api";

/** ------------------ Door APIs ------------------ */
export async function getDoorStatus() {
  const res = await fetch(`${API_BASE}/door/status`);
  return res.json();
}

export async function toggleDoor(action) {
  const res = await fetch(`${API_BASE}/door/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  return res.json();
}

export async function unlockWithPasscode(passcode) {
  const res = await fetch(`${API_BASE}/door/passcode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passcode }),
  });
  return res.json();
}

/** ------------------ Camera APIs ------------------ */
export async function getCameraStatus() {
  const res = await fetch(`${API_BASE}/camera/status`);
  return res.json();
}

export async function toggleCamera(action) {
  const res = await fetch(`${API_BASE}/camera/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  return res.json();
}

export function getCameraStreamUrl() {
  return `${API_BASE}/camera/stream`;
}

export async function captureImage() {
  const res = await fetch(`${API_BASE}/camera/capture`, { method: "POST" });
  return res.json();
}

export async function getGallery(limit) {
  const url = limit ? `${API_BASE}/camera/gallery?limit=${limit}` : `${API_BASE}/camera/gallery`;
  const res = await fetch(url);
  return res.json();
}

export async function deleteImage(filename) {
  const res = await fetch(`${API_BASE}/camera/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename }),
  });
  return res.json();
}

/** ------------------ User APIs ------------------ */
export async function getUsers() {
  const res = await fetch(`${API_BASE}/users`);
  return res.json();
}

export async function addUser(userData) {
  const res = await fetch(`${API_BASE}/users/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function editUser(userData) {
  const res = await fetch(`${API_BASE}/users/edit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function deleteUser(username) {
  const res = await fetch(`${API_BASE}/users/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return res.json();
}

export async function approveUser(username) {
  const res = await fetch(`${API_BASE}/users/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return res.json();
}

/** ------------------ Profile APIs ------------------ */
export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile`);
  return res.json();
}

export async function updateProfile(data) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/user/current`);
  return res.json();
}

/** ------------------ Settings APIs ------------------ */
export async function getSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  return res.json();
}

export async function updateSettings(data) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

/** ------------------ Logs & Notifications ------------------ */
export async function getLogs() {
  const res = await fetch(`${API_BASE}/logs`);
  return res.json();
}

export async function addLogEntry(data) {
  const res = await fetch(`${API_BASE}/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getNotifications() {
  const res = await fetch(`${API_BASE}/notifications`);
  return res.json();
}

export async function clearNotifications() {
  const res = await fetch(`${API_BASE}/notifications/clear`, { method: "POST" });
  return res.json();
}

/** ------------------ Metrics ------------------ */
export async function getMetrics() {
  const res = await fetch(`${API_BASE}/metrics`);
  return res.json();
}

/** ------------------ Keypad APIs ------------------ */
export async function getKeypadStatus() {
  const res = await fetch(`${API_BASE}/keypad/status`);
  return res.json();
}

export async function resetKeypad() {
  const res = await fetch(`${API_BASE}/keypad/reset`, { method: "POST" });
  return res.json();
}

/** ------------------ Fingerprint APIs ------------------ */
export async function fingerprintAuthenticate() {
  const res = await fetch(`${API_BASE}/fingerprint/authenticate`, { method: "POST" });
  return res.json();
}

export async function fingerprintEnroll(username) {
  const res = await fetch(`${API_BASE}/fingerprint/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return res.json();
}

export async function fingerprintDelete(username) {
  const res = await fetch(`${API_BASE}/fingerprint/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return res.json();
}

export async function fingerprintStatus(username) {
  const res = await fetch(`${API_BASE}/fingerprint/status/${username}`);
  return res.json();
}

export async function testFingerprintSensor() {
  const res = await fetch(`${API_BASE}/fingerprint/sensor/test`);
  return res.json();
}

export async function getFingerprintSensorInfo() {
  const res = await fetch(`${API_BASE}/fingerprint/sensor/info`);
  return res.json();
}
