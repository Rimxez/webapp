document.addEventListener("DOMContentLoaded", () => {
  // Load users data
  loadUsersData()

  // Set up event listeners
  setupEventListeners()
})

// Load users data
function loadUsersData() {
  const usersTableBody = document.getElementById("users-table-body")
  const pendingUsersTableBody = document.getElementById("pending-users-table-body")

  if (usersTableBody && pendingUsersTableBody) {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        const users = data.users || {}
        usersTableBody.innerHTML = ""
        pendingUsersTableBody.innerHTML = ""

        if (Object.keys(users).length === 0) {
          usersTableBody.innerHTML = '<tr><td colspan="6">No users found</td></tr>'
          pendingUsersTableBody.innerHTML = '<tr><td colspan="4">No pending approvals</td></tr>'
        } else {
          let approvedCount = 0
          let pendingCount = 0

          for (const [username, user] of Object.entries(users)) {
            const isApproved = user.approved !== false
            const accessType = user.access_type || "full"
            const accessUntil = user.access_until ? ` (until ${user.access_until})` : ""
            const hasFingerprint = user.fingerprint_enrolled === true

            if (isApproved) {
              approvedCount++
              const row = document.createElement("tr")
              row.innerHTML = `
                <td>${username}</td>
                <td>${user.email || ""}</td>
                <td>${user.role}</td>
                <td><span class="approval-badge approved">Approved</span></td>
                <td>
                  <span class="access-badge ${accessType}">
                    ${accessType}${accessType === "limited" ? accessUntil : ""}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm edit-user" data-username="${username}">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-danger delete-user" data-username="${username}">
                    <i class="fas fa-trash"></i>
                  </button>
                  ${
                    hasFingerprint
                      ? '<span class="fingerprint-badge" title="Fingerprint enrolled"><i class="fas fa-fingerprint"></i></span>'
                      : ""
                  }
                </td>
              `
              usersTableBody.appendChild(row)
            } else {
              pendingCount++
              const row = document.createElement("tr")
              row.innerHTML = `
                <td>${username}</td>
                <td>${user.email || ""}</td>
                <td>${user.role}</td>
                <td>
                  <button class="btn btn-sm btn-primary approve-user" data-username="${username}">
                    <i class="fas fa-check"></i> Approve
                  </button>
                  <button class="btn btn-sm btn-danger delete-user" data-username="${username}">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              `
              pendingUsersTableBody.appendChild(row)
            }
          }

          if (approvedCount === 0) {
            usersTableBody.innerHTML = '<tr><td colspan="6">No approved users found</td></tr>'
          }

          if (pendingCount === 0) {
            pendingUsersTableBody.innerHTML = '<tr><td colspan="4">No pending approvals</td></tr>'
          }

          // Add event listeners to edit and delete buttons
          document.querySelectorAll(".edit-user").forEach((btn) => {
            btn.addEventListener("click", function () {
              const username = this.getAttribute("data-username")
              editUser(username, users[username])
            })
          })

          document.querySelectorAll(".delete-user").forEach((btn) => {
            btn.addEventListener("click", function () {
              const username = this.getAttribute("data-username")
              if (confirm(`Are you sure you want to delete user ${username}?`)) {
                deleteUser(username)
              }
            })
          })

          // Add event listeners to approve buttons
          document.querySelectorAll(".approve-user").forEach((btn) => {
            btn.addEventListener("click", function () {
              const username = this.getAttribute("data-username")
              approveUser(username)
            })
          })
        }
      })
      .catch((error) => console.error("Error loading users data:", error))
  }
}

// Set up event listeners
function setupEventListeners() {
  // User management
  const addUserBtn = document.getElementById("add-user-btn")
  const closeUserModal = document.getElementById("close-user-modal")
  const userForm = document.getElementById("user-form")
  const userModal = document.getElementById("user-modal")

  if (addUserBtn) {
    addUserBtn.addEventListener("click", () => {
      document.getElementById("user-form-mode").value = "add"
      document.getElementById("user-modal-title").textContent = "Add User"
      document.getElementById("user-username").disabled = false
      document.getElementById("user-username").value = ""
      document.getElementById("user-email").value = ""
      document.getElementById("user-role").value = "guest"

      // Reset checkboxes
      document.getElementById("perm-unlock").checked = true
      document.getElementById("perm-view-logs").checked = false
      document.getElementById("perm-manage-users").checked = false
      document.getElementById("perm-change-settings").checked = false

      // Hide fingerprint section for new users
      const fingerprintSection = document.getElementById("fingerprint-section")
      if (fingerprintSection) {
        fingerprintSection.style.display = "none"
      }

      userModal.classList.add("active")
    })
  }

  if (closeUserModal) {
    closeUserModal.addEventListener("click", () => {
      userModal.classList.remove("active")
    })
  }

  const userAccessType = document.getElementById("user-access-type")
  if (userAccessType) {
    userAccessType.addEventListener("change", function () {
      const accessUntilGroup = document.getElementById("access-until-group")
      if (this.value === "limited") {
        accessUntilGroup.style.display = "block"
      } else {
        accessUntilGroup.style.display = "none"
      }
    })
  }

  // Update the userForm event listener to include the new fields
  if (userForm) {
    userForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const mode = document.getElementById("user-form-mode").value
      const username = document.getElementById("user-username").value
      const email = document.getElementById("user-email").value
      const role = document.getElementById("user-role").value
      const accessType = document.getElementById("user-access-type").value
      const accessUntil = accessType === "limited" ? document.getElementById("user-access-until").value : null

      // Get permissions
      const permissions = []
      if (document.getElementById("perm-unlock").checked) permissions.push("unlock")
      if (document.getElementById("perm-view-logs").checked) permissions.push("view_logs")
      if (document.getElementById("perm-manage-users").checked) permissions.push("manage_users")
      if (document.getElementById("perm-change-settings").checked) permissions.push("change_settings")

      const userData = {
        username,
        email,
        role,
        permissions,
        access_type: accessType,
        access_until: accessUntil,
        approved: false, // Pre-registered users are not approved until they sign up
        pre_approved: true, // Mark as pre-approved for automatic approval after signup
      }

      const endpoint = mode === "add" ? "/api/users/add" : "/api/users/edit"

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            if (mode === "add") {
              showPopupNotification(
                `User ${username} pre-registered successfully. They can now sign up with this username and email.`,
                "success",
              )
            } else {
              showPopupNotification(`User ${username} updated successfully`, "success")
            }
            userModal.classList.remove("active")
            loadUsersData()
          } else {
            showPopupNotification(data.message || "Operation failed", "error")
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          showPopupNotification("An error occurred", "error")
        })
    })
  }







  // Fingerprint enrollment
  const enrollFingerprintBtn = document.getElementById("enroll-fingerprint-btn")
  if (enrollFingerprintBtn) {
    enrollFingerprintBtn.addEventListener("click", () => {
      const username = document.getElementById("user-username").value

      // Show fingerprint enrollment modal
      showFingerprintEnrollmentModal(username)
    })
  }

  // Delete fingerprint
  const deleteFingerprintBtn = document.getElementById("delete-fingerprint-btn")
  if (deleteFingerprintBtn) {
    deleteFingerprintBtn.addEventListener("click", () => {
      const username = document.getElementById("user-username").value

      if (confirm("Are you sure you want to delete this user's fingerprint data?")) {
        fetch("/api/fingerprint/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              showPopupNotification("Fingerprint data deleted successfully", "success")

              // Update UI to show fingerprint is not enrolled
              document.getElementById("fingerprint-status").textContent = "Not enrolled"
              document.getElementById("fingerprint-status").className = "status-text not-enrolled"

              // Hide delete button, show enroll button
              document.getElementById("delete-fingerprint-btn").style.display = "none"
              document.getElementById("enroll-fingerprint-btn").style.display = "inline-block"
            } else {
              showPopupNotification(data.message || "Failed to delete fingerprint data", "error")
            }
          })
          .catch((error) => {
            console.error("Error:", error)
            showPopupNotification("An error occurred", "error")
          })
      }
    })
  }
}

// Edit user - improved version with fingerprint status
function editUser(username, userData) {
  if (!userData) {
    showPopupNotification("User data not found", "error")
    return
  }

  const modal = document.getElementById("user-modal")
  if (!modal) {
    showPopupNotification("User modal not found", "error")
    return
  }

  // Set form mode and title
  const formMode = document.getElementById("user-form-mode")
  const modalTitle = document.getElementById("user-modal-title")
  const usernameField = document.getElementById("user-username")

  if (formMode) formMode.value = "edit"
  if (modalTitle) modalTitle.textContent = "Edit User"
  if (usernameField) {
    usernameField.value = username
    usernameField.disabled = true
  }

  // Populate form fields safely
  const fields = {
    "user-email": userData.email || "",
    "user-role": userData.role || "guest",
    "user-access-type": userData.access_type || "full",
    "user-access-until": userData.access_until || "",
  }

  Object.entries(fields).forEach(([id, value]) => {
    const element = document.getElementById(id)
    if (element) element.value = value
  })

  // Handle access until date visibility
  const accessUntilGroup = document.getElementById("access-until-group")
  if (accessUntilGroup) {
    accessUntilGroup.style.display = userData.access_type === "limited" ? "block" : "none"
  }

  // Set permissions checkboxes
  const permissions = userData.permissions || []
  const permissionCheckboxes = {
    "perm-unlock": permissions.includes("unlock"),
    "perm-view-logs": permissions.includes("view_logs"),
    "perm-manage-users": permissions.includes("manage_users"),
    "perm-change-settings": permissions.includes("change_settings"),
  }

  Object.entries(permissionCheckboxes).forEach(([id, checked]) => {
    const checkbox = document.getElementById(id)
    if (checkbox) checkbox.checked = checked
  })

  // Handle fingerprint section
  const fingerprintSection = document.getElementById("fingerprint-section")
  if (fingerprintSection) {
    fingerprintSection.style.display = "block"

    // Check current fingerprint status from server
    checkFingerprintStatus(username).then((enrolled) => {
      updateFingerprintStatus(enrolled)
    })
  }

  // Show modal
  modal.classList.add("active")
}

// Update fingerprint status display
function updateFingerprintStatus(isEnrolled) {
  const fingerprintStatus = document.getElementById("fingerprint-status")
  const enrollBtn = document.getElementById("enroll-fingerprint-btn")
  const deleteBtn = document.getElementById("delete-fingerprint-btn")

  if (fingerprintStatus) {
    fingerprintStatus.textContent = isEnrolled ? "Enrolled" : "Not enrolled"
    fingerprintStatus.className = `status-text ${isEnrolled ? "enrolled" : "not-enrolled"}`
  }

  if (enrollBtn) {
    enrollBtn.style.display = isEnrolled ? "none" : "inline-block"
  }

  if (deleteBtn) {
    deleteBtn.style.display = isEnrolled ? "inline-block" : "none"
  }
}

// Delete user
function deleteUser(username) {
  fetch("/api/users/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showPopupNotification("User deleted successfully", "success")
        loadUsersData()
      } else {
        showPopupNotification(data.message || "Failed to delete user", "error")
      }
    })
    .catch((error) => {
      console.error("Error deleting user:", error)
      showPopupNotification("An error occurred", "error")
    })
}

// Approve user
function approveUser(username) {
  fetch("/api/users/approve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showPopupNotification("User approved successfully", "success")
        loadUsersData()
      } else {
        showPopupNotification(data.message || "Failed to approve user", "error")
      }
    })
    .catch((error) => {
      console.error("Error approving user:", error)
      showPopupNotification("An error occurred", "error")
    })
}


// Show popup notification
function showPopupNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `popup-notification ${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
  `

  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Hide and remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Get notification icon based on type
function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "fa-check-circle"
    case "error":
      return "fa-exclamation-circle"
    case "warning":
      return "fa-exclamation-triangle"
    case "info":
    default:
      return "fa-info-circle"
  }
}




// Enroll Fingerprint
const enrollFingerprintBtn = document.getElementById("enroll-fingerprint-btn")
if (enrollFingerprintBtn) {
  enrollFingerprintBtn.addEventListener("click", () => {
    const username = document.getElementById("user-username").value
    showFingerprintEnrollmentModal(username)
  })
}

// Delete Fingerprint
const deleteFingerprintBtn = document.getElementById("delete-fingerprint-btn")
if (deleteFingerprintBtn) {
  deleteFingerprintBtn.addEventListener("click", () => {
    const username = document.getElementById("user-username").value

    if (confirm("Are you sure you want to delete this user's fingerprint data?")) {
      fetch("/api/fingerprint/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            showPopupNotification("Fingerprint data deleted successfully", "success")
            updateFingerprintStatus(false)
          } else {
            showPopupNotification(data.message || "Failed to delete fingerprint", "error")
          }
        })
        .catch(() => showPopupNotification("An error occurred", "error"))
    }
  })
}

// Edit User and Load Fingerprint Status
function editUser(username, userData) {
  if (!userData) return showPopupNotification("User data not found", "error")

  const modal = document.getElementById("user-modal")
  if (!modal) return showPopupNotification("User modal not found", "error")

  document.getElementById("user-form-mode").value = "edit"
  document.getElementById("user-modal-title").textContent = "Edit User"
  const usernameField = document.getElementById("user-username")
  usernameField.value = username
  usernameField.disabled = true

  const fields = {
    "user-email": userData.email || "",
    "user-role": userData.role || "guest",
    "user-access-type": userData.access_type || "full",
    "user-access-until": userData.access_until || "",
  }
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id)
    if (el) el.value = val
  })

  document.getElementById("access-until-group").style.display = userData.access_type === "limited" ? "block" : "none"

  const perms = userData.permissions || []
  const checks = {
    "perm-unlock": perms.includes("unlock"),
    "perm-view-logs": perms.includes("view_logs"),
    "perm-manage-users": perms.includes("manage_users"),
    "perm-change-settings": perms.includes("change_settings"),
  }
  Object.entries(checks).forEach(([id, check]) => {
    const cb = document.getElementById(id)
    if (cb) cb.checked = check
  })

  // Show fingerprint section
  const fingerprintSection = document.getElementById("fingerprint-section")
  if (fingerprintSection) {
    fingerprintSection.style.display = "block"
    fetch(`/api/fingerprint/status/${username}`)
      .then(res => res.json())
      .then(data => updateFingerprintStatus(data.enrolled))
      .catch(() => updateFingerprintStatus(false))
  }

  modal.classList.add("active")
}

function updateFingerprintStatus(isEnrolled) {
  const statusText = document.getElementById("fingerprint-status")
  const enrollBtn = document.getElementById("enroll-fingerprint-btn")
  const deleteBtn = document.getElementById("delete-fingerprint-btn")

  statusText.textContent = isEnrolled ? "Enrolled" : "Not enrolled"
  statusText.className = `status-text ${isEnrolled ? "enrolled" : "not-enrolled"}`

  enrollBtn.style.display = isEnrolled ? "none" : "inline-block"
  deleteBtn.style.display = isEnrolled ? "inline-block" : "none"
}

function showFingerprintEnrollmentModal(username) {
  let modal = document.getElementById("fingerprint-modal")
  if (!modal) {
    modal = document.createElement("div")
    modal.id = "fingerprint-modal"
    modal.className = "modal"

    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Fingerprint Enrollment</h3>
          <span class="close" onclick="this.closest('.modal').classList.remove('active')">&times;</span>
        </div>
        <div class="modal-body">
          <div class="fingerprint-enrollment">
            <div class="fingerprint-scanner scanning" id="scanner-icon">
              <i class="fas fa-fingerprint"></i>
              <div class="scanner-status" id="scanner-status">Initializing...</div>
            </div>
            <div class="enrollment-status" id="enrollment-status">Waiting...</div>
          </div>
        </div>
      </div>`

    document.body.appendChild(modal)
    const style = document.createElement("style")
    style.textContent = `
      .fingerprint-scanner.scanning i { color: #2ecc71; animation: pulse 1.5s infinite; }
      .fingerprint-scanner.error i { color: #e74c3c; }
      @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
    `
    document.head.appendChild(style)
  }

  document.getElementById("scanner-status").textContent = "Initializing scanner..."
  document.getElementById("enrollment-status").textContent = ""
  modal.classList.add("active")

  // Start actual enrollment
  fetch("/api/fingerprint/enroll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("scanner-status").textContent = "Complete"
        document.getElementById("enrollment-status").textContent = "Enrollment successful!"
        updateFingerprintStatus(true)
        showPopupNotification("Fingerprint enrolled successfully", "success")
        setTimeout(() => modal.classList.remove("active"), 2000)
      } else {
        document.getElementById("scanner-status").textContent = "Error"
        document.getElementById("enrollment-status").textContent = data.message || "Enrollment failed"
        showPopupNotification(data.message || "Enrollment failed", "error")
      }
    })
    .catch(err => {
      console.error(err)
      document.getElementById("scanner-status").textContent = "Error"
      document.getElementById("enrollment-status").textContent = "An error occurred"
      showPopupNotification("Enrollment error", "error")
    })
}

function showPopupNotification(msg, type) {
  alert(`${type.toUpperCase()}: ${msg}`)  // You can replace this with actual styled popup



