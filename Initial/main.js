// JavaScript for College Management System
// Handles login, student add/delete, navigation, and UI logic

// DOM Elements
const loginPage = document.getElementById('loginPage');
const appContainer = document.getElementById('appContainer');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const navLinks = document.querySelectorAll('.nav-links a');
const pages = document.querySelectorAll('.page');
const roleOptions = document.querySelectorAll('.role-option');

// Role selection
try {
    const roleOptions = document.querySelectorAll('.role-option');
    roleOptions.forEach(option => {
        option.addEventListener('click', () => {
            roleOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });
} catch (e) { console.error('Role selector error:', e); }

// Login function
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
        loginPage.style.display = 'none';
        appContainer.style.display = 'flex';
    } else {
        alert('Please enter both email and password');
    }
}

// Notification count
try {
    let notificationCount = 3;
    document.querySelector('.notification').addEventListener('click', function() {
        notificationCount = 0;
        document.querySelector('.notification-count').textContent = notificationCount;
        document.querySelector('.notification-count').style.display = notificationCount ? 'flex' : 'none';
    });
} catch (e) { console.error('Notification error:', e); }

// Navigation active state
try {
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('pageTitle');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            try {
                e.preventDefault();
                const targetPage = this.getAttribute('data-page');
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                pages.forEach(page => {
                    page.classList.remove('active');
                    page.removeAttribute('data-animation');
                });
                const pageElement = document.getElementById(`${targetPage}-page`);
                if (pageElement) {
                    pageElement.setAttribute('data-animation', 'slideInLeft');
                    setTimeout(() => {
                        pageElement.classList.add('active');
                    }, 10);
                    pageTitle.textContent = this.querySelector('span').textContent;
                }
            } catch (e) { alert('Navigation error: ' + e.message); }
        });
    });
} catch (e) { console.error('Navigation error:', e); }

// Sidebar toggle
try {
    document.getElementById('sidebarToggle').addEventListener('click', function() {
        try {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.querySelector('.main-content');
            if (sidebar.style.width === '70px' || sidebar.style.width === '') {
                sidebar.style.width = '250px';
                mainContent.style.marginLeft = '250px';
            } else {
                sidebar.style.width = '70px';
                mainContent.style.marginLeft = '70px';
            }
        } catch (e) { alert('Sidebar toggle error: ' + e.message); }
    });
} catch (e) { console.error('Sidebar toggle error:', e); }

// Attendance status buttons
function attachAttendanceStatusEvents() {
    try {
        document.querySelectorAll('[data-status]').forEach(button => {
            button.onclick = function() {
                try {
                    const status = this.getAttribute('data-status');
                    const row = this.closest('tr');
                    const statusCell = row.querySelector('.status');
                    statusCell.classList.remove('present', 'absent', 'pending');
                    if (status === 'present') {
                        statusCell.classList.add('present');
                        statusCell.textContent = 'Present';
                    } else if (status === 'absent') {
                        statusCell.classList.add('absent');
                        statusCell.textContent = 'Absent';
                    }
                } catch (e) { alert('Attendance status error: ' + e.message); }
            };
        });
    } catch (e) { console.error('Attendance status event error:', e); }
}
attachAttendanceStatusEvents();

// Add Student Modal and Logic
try {
    const addStudentModal = document.createElement('div');
    addStudentModal.id = 'addStudentModal';
    addStudentModal.style.display = 'none';
    addStudentModal.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);z-index:9999;display:flex;align-items:center;justify-content:center;">
            <form id="studentForm" style="background:#fff;padding:30px 40px;border-radius:10px;min-width:300px;box-shadow:0 5px 20px #0002;">
                <h2 style="margin-bottom:20px;">Add Student</h2>
                <input type="text" id="newStudentName" placeholder="Name" required style="width:100%;margin-bottom:10px;padding:10px;">
                <input type="text" id="newStudentCourse" placeholder="Course" required style="width:100%;margin-bottom:10px;padding:10px;">
                <input type="email" id="newStudentEmail" placeholder="Email" required style="width:100%;margin-bottom:10px;padding:10px;">
                <input type="text" id="newStudentPhone" placeholder="Phone" required style="width:100%;margin-bottom:10px;padding:10px;">
                <button type="submit" class="btn btn-primary" style="width:100%;margin-bottom:10px;">Add</button>
                <button type="button" id="closeStudentModal" class="btn btn-sm" style="width:100%;background:#eee;color:#333;">Cancel</button>
            </form>
        </div>
    `;
    document.body.appendChild(addStudentModal);
    document.getElementById('addStudentBtn').onclick = function() {
        addStudentModal.style.display = 'block';
    };
    addStudentModal.addEventListener('click', function(e) {
        if (e.target === addStudentModal || e.target.id === 'closeStudentModal') {
            addStudentModal.style.display = 'none';
        }
    });
    document.getElementById('studentForm').onsubmit = function(e) {
        try {
            e.preventDefault();
            const name = document.getElementById('newStudentName').value.trim();
            const course = document.getElementById('newStudentCourse').value.trim();
            const email = document.getElementById('newStudentEmail').value.trim();
            const phone = document.getElementById('newStudentPhone').value.trim();
            if (!name || !course || !email || !phone) {
                alert('All fields are required.');
                return;
            }
            const table = document.querySelector('#students-page table tbody');
            const newId = 'S' + String(table.rows.length + 1).padStart(3, '0');
            const row = table.insertRow();
            row.innerHTML = `<td>${newId}</td><td>${name}</td><td>${course}</td><td>${email}</td><td>${phone}</td><td><span class='status present'>Active</span> <button class='btn btn-sm delete-student'>Delete</button></td>`;
            const grid = document.querySelector('.student-grid');
            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `
                <div class="student-header">
                    <div class="student-avatar"><i class="fas fa-user"></i></div>
                    <h3>${name}</h3>
                    <p>${course}</p>
                </div>
                <div class="student-info">
                    <p><i class="fas fa-id-card"></i> ${newId}</p>
                    <p><i class="fas fa-envelope"></i> ${email}</p>
                    <p><i class="fas fa-phone"></i> ${phone}</p>
                    <div class="progress-bar"><div class="progress" style="width: 100%"></div></div>
                    <p>Attendance: 100%</p>
                    <button class='btn btn-sm delete-student'>Delete</button>
                </div>
            `;
            grid.appendChild(card);
            addStudentModal.style.display = 'none';
            attachDeleteEvents();
            this.reset();
        } catch (e) { alert('Add student error: ' + e.message); }
    };
    function attachDeleteEvents() {
        try {
            document.querySelectorAll('.delete-student').forEach(btn => {
                btn.onclick = function() {
                    try {
                        const tr = btn.closest('tr');
                        if (tr) tr.remove();
                        const card = btn.closest('.student-card');
                        if (card) card.remove();
                    } catch (e) { alert('Delete student error: ' + e.message); }
                };
            });
        } catch (e) { console.error('Delete event error:', e); }
    }
    attachDeleteEvents();
} catch (e) { console.error('Add student modal error:', e); }

// Simulate loading for charts
try {
    document.querySelectorAll('.chart-placeholder').forEach(chart => {
        setTimeout(() => {
            chart.innerHTML = '<i class="fas fa-chart-bar" style="font-size: 48px; color: #3498db; z-index: 2;"></i>';
        }, 1500);
    });
} catch (e) { console.error('Chart loading error:', e); }

// Add hover effect to cards
try {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
} catch (e) { console.error('Card hover error:', e); }

// Add ripple effect to buttons
try {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            try {
                const ripple = this.querySelector('.ripple');
                if (ripple) ripple.remove();
                const circle = document.createElement('span');
                circle.classList.add('ripple');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                circle.style.width = circle.style.height = `${size}px`;
                circle.style.left = `${x}px`;
                circle.style.top = `${y}px`;
                this.appendChild(circle);
                setTimeout(() => { circle.remove(); }, 600);
            } catch (e) { console.error('Ripple effect error:', e); }
        });
    });
} catch (e) { console.error('Button ripple error:', e); }

// Initialize Charts (Placeholder)
function initCharts() {
    // This is where you would initialize your charts
    // For example, using Chart.js or any other charting library
    console.log('Charts initialized');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize charts
    initCharts();
    
    // Add event listeners for buttons
    const addStudentBtn = document.getElementById('addStudentBtn');
    const addCourseBtn = document.getElementById('addCourseBtn');
    const addScheduleBtn = document.getElementById('addScheduleBtn');
    const takeAttendanceBtn = document.getElementById('takeAttendanceBtn');
    
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', () => {
            // Handle add student
            console.log('Add student clicked');
        });
    }
    
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', () => {
            // Handle add course
            console.log('Add course clicked');
        });
    }
    
    if (addScheduleBtn) {
        addScheduleBtn.addEventListener('click', () => {
            // Handle add schedule
            console.log('Add schedule clicked');
        });
    }
    
    if (takeAttendanceBtn) {
        takeAttendanceBtn.addEventListener('click', () => {
            // Handle take attendance
            console.log('Take attendance clicked');
        });
    }
    
    // Handle attendance status buttons
    const attendanceButtons = document.querySelectorAll('[data-status]');
    attendanceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.getAttribute('data-status');
            const row = button.closest('tr');
            const statusCell = row.querySelector('.status');
            
            // Update status
            statusCell.className = 'status ' + status;
            statusCell.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        });
    });
    
    // Handle course and date selection
    const courseSelect = document.getElementById('courseSelect');
    const dateSelect = document.getElementById('dateSelect');
    
    if (courseSelect) {
        courseSelect.addEventListener('change', () => {
            // Handle course selection
            console.log('Course selected:', courseSelect.value);
        });
    }
    
    if (dateSelect) {
        dateSelect.addEventListener('change', () => {
            // Handle date selection
            console.log('Date selected:', dateSelect.value);
        });
    }
});
