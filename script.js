// Pre-configured Initial State (100% English)
const defaultState = {
  admin: { username: "admin", password: "admin123", name: "Admin", email: "" },
  courses: [
    { id: "CRS-101", name: "Full Stack Development", duration: "4 Months", fee: 25000, trainer: "Mahalakshmi", status: "Active" },
    { id: "CRS-102", name: "C Programming", duration: "2 Months", fee: 10000, trainer: "Hemalatha", status: "Active" },
    { id: "CRS-103", name: "Python Programming", duration: "3 Months", fee: 15000, trainer: "Rani", status: "Active" },
    { id: "CRS-104", name: "C++ Programming", duration: "3 Months", fee: 12000, trainer: "Latha", status: "Active" },
    { id: "CRS-105", name: "Data Structures & Algorithms", duration: "4 Months", fee: 18000, trainer: "Nandhini", status: "Active" }
  ],
  trainers: [
    { id: "TRN-101", name: "Mahalakshmi", expertise: "Full Stack Development", phone: "9876543210", status: "Active" },
    { id: "TRN-102", name: "Hemalatha", expertise: "C & C++ Programming", phone: "9876543211", status: "Active" },
    { id: "TRN-103", name: "Rani", expertise: "Python & AI", phone: "9876543212", status: "Active" },
    { id: "TRN-104", name: "Latha", expertise: "Software Engineering", phone: "9876543213", status: "Active" },
    { id: "TRN-105", name: "Nandhini", expertise: "Algorithms & Databases", phone: "9876543214", status: "Active" }
  ],
  students: [
    { id: "STU-101", name: "Praveen", email: "praveen@edu.com", phone: "9123456780", course: "Full Stack Development", status: "Active" },
    { id: "STU-102", name: "Pranav", email: "pranav@edu.com", phone: "9123456781", course: "C Programming", status: "Active" },
    { id: "STU-103", name: "Pragatheesh", email: "pragatheesh@edu.com", phone: "9123456782", course: "Python Programming", status: "Active" },
    { id: "STU-104", name: "Prabakaran", email: "prabakaran@edu.com", phone: "9123456783", course: "C++ Programming", status: "Active" },
    { id: "STU-105", name: "Haneesh", email: "haneesh@edu.com", phone: "9123456784", course: "Python Programming", status: "Active" }
  ],
  attendance: [],
  assignments: [
    { id: 1, title: "HTML & CSS Landing Page", course: "Full Stack Development", due: "2026-11-30", status: "Pending" }
  ],
  activities: ["System initialized with default academic records."]
};

let state = JSON.parse(localStorage.getItem("edupulse_db_v3")) || defaultState;

function saveState() {
  localStorage.setItem("edupulse_db_v3", JSON.stringify(state));
  refreshAll();
}

function logActivity(text) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.activities.unshift(`${text} (${time})`);
  if (state.activities.length > 6) state.activities.pop();
}

// --- AUTHENTICATION (Any username/password logs in) ---
const loginForm = document.getElementById("login-form");
const togglePassBtn = document.getElementById("toggle-pass");

togglePassBtn.addEventListener("click", () => {
  const passInput = document.getElementById("login-pass");
  const isPass = passInput.type === "password";
  passInput.type = isPass ? "text" : "password";
  togglePassBtn.textContent = isPass ? "Hide" : "Show";
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-screen").classList.remove("hidden");
  document.getElementById("att-date").valueAsDate = new Date();
  refreshAll();
});

document.getElementById("logout-btn").addEventListener("click", () => {
  document.getElementById("app-screen").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
});

// --- NAVIGATION ---
const navItems = document.querySelectorAll(".nav-item");
navItems.forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

function switchTab(tabId) {
  navItems.forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
  document.querySelectorAll(".tab-view").forEach((view) => view.classList.remove("active"));
  document.getElementById(`tab-${tabId}`).classList.add("active");
  document.getElementById("page-title").textContent = tabId.charAt(0).toUpperCase() + tabId.slice(1);
}

// --- MODALS ---
function openModal(id) {
  populateDropdowns();
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

function populateDropdowns() {
  const courseOptions = state.courses.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
  document.getElementById("stu-course").innerHTML = courseOptions || `<option value="General">General</option>`;
  document.getElementById("assign-course").innerHTML = courseOptions || `<option value="General">General</option>`;

  const filterOptions = `<option value="ALL">All Courses</option>` + courseOptions;
  document.getElementById("student-course-filter").innerHTML = filterOptions;

  const attOptions = `<option value="">-- Select Course --</option>` + courseOptions;
  document.getElementById("att-course-select").innerHTML = attOptions;

  const trainerOptions = `<option value="Unassigned">Unassigned</option>` +
    state.trainers.map(t => `<option value="${t.name}">${t.name}</option>`).join("");
  document.getElementById("crs-trainer").innerHTML = trainerOptions;
}

// --- ADD FORMS ---
document.getElementById("student-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const student = {
    id: "STU-" + (101 + state.students.length),
    name: document.getElementById("stu-name").value,
    email: document.getElementById("stu-email").value,
    phone: document.getElementById("stu-phone").value,
    course: document.getElementById("stu-course").value,
    status: document.getElementById("stu-status").value
  };
  state.students.push(student);
  logActivity(`Registered student ${student.name}`);
  e.target.reset();
  closeModal("student-modal");
  saveState();
});

document.getElementById("course-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const course = {
    id: "CRS-" + (100 + state.courses.length + 1),
    name: document.getElementById("crs-name").value,
    duration: document.getElementById("crs-duration").value,
    fee: Number(document.getElementById("crs-fee").value),
    trainer: document.getElementById("crs-trainer").value,
    status: "Active"
  };
  state.courses.push(course);
  logActivity(`Added course ${course.name}`);
  e.target.reset();
  closeModal("course-modal");
  saveState();
});

document.getElementById("trainer-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const trainer = {
    id: "TRN-" + (100 + state.trainers.length + 1),
    name: document.getElementById("trn-name").value,
    expertise: document.getElementById("trn-exp").value,
    phone: document.getElementById("trn-phone").value,
    status: "Active"
  };
  state.trainers.push(trainer);
  logActivity(`Added trainer ${trainer.name}`);
  e.target.reset();
  closeModal("trainer-modal");
  saveState();
});

document.getElementById("assignment-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const assignment = {
    id: Date.now(),
    title: document.getElementById("assign-title").value,
    course: document.getElementById("assign-course").value,
    due: document.getElementById("assign-due").value,
    status: document.getElementById("assign-status").value
  };
  state.assignments.push(assignment);
  logActivity(`Created assignment "${assignment.title}"`);
  e.target.reset();
  saveState();
});

// --- RENDER TABLES ---
function renderStudents() {
  const query = document.getElementById("student-search").value.toLowerCase();
  const courseFilter = document.getElementById("student-course-filter").value;
  const statusFilter = document.getElementById("student-status-filter").value;

  const filtered = state.students.filter(s => {
    const matchText = s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query) || s.email.toLowerCase().includes(query);
    const matchCourse = courseFilter === "ALL" || s.course === courseFilter;
    const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchText && matchCourse && matchStatus;
  });

  const tbody = document.getElementById("students-tbody");
  tbody.innerHTML = filtered.length ? filtered.map(s => `
    <tr>
      <td><b>${s.id}</b></td>
      <td>${s.name}</td>
      <td>${s.email}<br><small class="muted">${s.phone}</small></td>
      <td>${s.course}</td>
      <td><span class="badge ${s.status}">${s.status}</span></td>
      <td><button class="btn-danger" style="padding:4px 8px;font-size:12px;" onclick="deleteStudent('${s.id}')">Remove</button></td>
    </tr>
  `).join("") : `<tr><td colspan="6" class="muted center">No students found.</td></tr>`;
}

function deleteStudent(id) {
  state.students = state.students.filter(s => s.id !== id);
  saveState();
}

function renderCourses() {
  const query = document.getElementById("course-search").value.toLowerCase();
  const sortType = document.getElementById("course-sort").value;

  let list = state.courses.filter(c => c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query));

  if (sortType === "AZ") list.sort((a, b) => a.name.localeCompare(b.name));
  if (sortType === "ZA") list.sort((a, b) => b.name.localeCompare(a.name));
  if (sortType === "FEE_LOW") list.sort((a, b) => a.fee - b.fee);
  if (sortType === "FEE_HIGH") list.sort((a, b) => b.fee - a.fee);

  const tbody = document.getElementById("courses-tbody");
  tbody.innerHTML = list.length ? list.map(c => `
    <tr>
      <td><b>${c.id}</b></td>
      <td>${c.name}</td>
      <td>${c.duration}</td>
      <td>Rs. ${c.fee.toLocaleString()}</td>
      <td>${c.trainer}</td>
      <td><span class="badge Active">${c.status}</span></td>
    </tr>
  `).join("") : `<tr><td colspan="6" class="muted center">No courses available.</td></tr>`;
}

function renderTrainers() {
  const query = document.getElementById("trainer-search").value.toLowerCase();
  const list = state.trainers.filter(t => t.name.toLowerCase().includes(query) || t.expertise.toLowerCase().includes(query));

  const tbody = document.getElementById("trainers-tbody");
  tbody.innerHTML = list.length ? list.map(t => `
    <tr>
      <td><b>${t.id}</b></td>
      <td>${t.name}</td>
      <td>${t.expertise}</td>
      <td>${t.phone}</td>
      <td><span class="badge Active">${t.status}</span></td>
    </tr>
  `).join("") : `<tr><td colspan="5" class="muted center">No trainers added yet.</td></tr>`;
}

// --- ATTENDANCE ---
function loadAttendanceSheet() {
  const course = document.getElementById("att-course-select").value;
  const tbody = document.getElementById("attendance-tbody");

  if (!course) {
    tbody.innerHTML = `<tr><td colspan="3" class="muted center">Select a course and date to load students.</td></tr>`;
    return;
  }

  const enrolled = state.students.filter(s => s.course === course);
  if (!enrolled.length) {
    tbody.innerHTML = `<tr><td colspan="3" class="muted center">No students enrolled in this course.</td></tr>`;
    return;
  }

  tbody.innerHTML = enrolled.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>
        <select class="att-status-input" data-id="${s.id}" data-name="${s.name}">
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Leave">Leave</option>
        </select>
      </td>
    </tr>
  `).join("");
}

function saveAttendance() {
  const course = document.getElementById("att-course-select").value;
  const date = document.getElementById("att-date").value;
  const inputs = document.querySelectorAll(".att-status-input");

  if (!course || !date || !inputs.length) return alert("Please select a valid course with students.");

  inputs.forEach(sel => {
    state.attendance.unshift({
      date,
      course,
      studentName: sel.dataset.name,
      status: sel.value
    });
  });

  logActivity(`Saved attendance for ${course} (${date})`);
  saveState();
  alert("Attendance saved!");
}

function renderAttendanceHistory() {
  const tbody = document.getElementById("attendance-history-tbody");
  tbody.innerHTML = state.attendance.length ? state.attendance.map(a => `
    <tr>
      <td>${a.date}</td>
      <td>${a.course}</td>
      <td>${a.studentName}</td>
      <td><span class="badge ${a.status}">${a.status}</span></td>
    </tr>
  `).join("") : `<tr><td colspan="4" class="muted center">No attendance records saved yet.</td></tr>`;
}

// --- ASSIGNMENTS & REPORTS ---
function renderAssignments() {
  const container = document.getElementById("assignments-list");
  container.innerHTML = state.assignments.length ? state.assignments.map(a => `
    <div class="assign-item">
      <div>
        <b>${a.title}</b>
        <div class="muted" style="font-size:12px;">Course: ${a.course} | Due: ${a.due}</div>
      </div>
      <span class="badge ${a.status}">${a.status}</span>
    </div>
  `).join("") : `<p class="muted">No assignments published yet.</p>`;
}

function renderReports() {
  const tbody = document.getElementById("reports-tbody");
  tbody.innerHTML = state.courses.length ? state.courses.map(c => {
    const count = state.students.filter(s => s.course === c.name).length;
    return `
      <tr>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.trainer}</td>
        <td>${count}</td>
        <td>Rs. ${c.fee.toLocaleString()}</td>
      </tr>
    `;
  }).join("") : `<tr><td colspan="5" class="muted center">Add courses to generate enrollment reports.</td></tr>`;
}

function exportCSV() {
  let csv = "Course ID,Course Name,Trainer,Enrolled Students,Fee\n";
  state.courses.forEach(c => {
    const count = state.students.filter(s => s.course === c.name).length;
    csv += `${c.id},"${c.name}","${c.trainer}",${count},${c.fee}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "EduPulse_Course_Report.csv";
  link.click();
}

// --- PROFILE & PASSWORD ---
document.getElementById("profile-form").addEventListener("submit", (e) => {
  e.preventDefault();
  state.admin.name = document.getElementById("prof-name").value;
  state.admin.email = document.getElementById("prof-email").value;
  saveState();
  alert("Profile updated!");
});

document.getElementById("password-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const p1 = document.getElementById("new-pass").value;
  const p2 = document.getElementById("confirm-pass").value;
  if (p1 !== p2) return alert("Passwords do not match!");
  state.admin.password = p1;
  saveState();
  e.target.reset();
  alert("Password changed successfully!");
});

// --- REFRESH DASHBOARD & ALL VIEWS ---
function refreshAll() {
  document.getElementById("topbar-admin-name").textContent = state.admin.name;
  document.getElementById("welcome-heading").textContent = `Hello, ${state.admin.name}!`;
  document.getElementById("prof-name").value = state.admin.name;
  document.getElementById("prof-email").value = state.admin.email;

  document.getElementById("dash-students").textContent = state.students.length;
  document.getElementById("dash-courses").textContent = state.courses.length;
  document.getElementById("dash-trainers").textContent = state.trainers.length;

  const today = new Date().toISOString().split("T")[0];
  const presentToday = state.attendance.filter(a => a.date === today && a.status === "Present").length;
  document.getElementById("dash-present").textContent = presentToday;

  document.getElementById("dash-assign-pending").textContent = state.assignments.filter(a => a.status === "Pending").length;
  document.getElementById("dash-assign-overdue").textContent = state.assignments.filter(a => a.status === "Overdue").length;
  document.getElementById("dash-assign-completed").textContent = state.assignments.filter(a => a.status === "Completed").length;

  const feed = document.getElementById("activity-feed");
  feed.innerHTML = state.activities.length
    ? state.activities.map(act => `<li>• ${act}</li>`).join("")
    : `<li class="muted">No recent actions recorded yet.</li>`;

  populateDropdowns();
  renderStudents();
  renderCourses();
  renderTrainers();
  renderAttendanceHistory();
  renderAssignments();
  renderReports();
}

// Initial Call on Load
refreshAll();