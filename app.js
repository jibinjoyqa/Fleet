/* ============================================
   FleetEdge — App Logic & Charts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThemeToggle();
    initMobileMenu();
    populateMileageTable();
    populateAlerts();
    populateDashboardV2();
    initDashboardQuickActions();
    populateFleetPage();
    populateBusRegistryPage();
    populateMileageFullPage();
    populateFuelPage();
    populateFeePage();
    populateRoutesPage();
    populateDriversPage();
    initFeeCalculator();
    initSettingsSync();
    initCharts();
    populateTrackingPage();
    populateMaintenancePage();
    populateAttendancePage();
    populateVaultPage();
    populateVendorsPage();
    populateHRPage();
    initOptimizerSim();
    populateIncidentsPage();
    populateInventoryPage();
    populateDevicesPage();
    populatePerformancePage();
    populateBudgetPage();
    populateParentPortalPage();
    populateExamTimetablePage();
    populateGeofencingPage();
    populateFuelAnalyticsPage();
    populateCompliancePage();
    populateHelpdeskPage();

});

/* ---- Navigation ---- */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
            const target = document.getElementById('page-' + page);
            if (target) target.classList.add('active');
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebarOverlay').classList.remove('active');
            // Lazy init charts
            if (page === 'analytics') initAnalyticsCharts();
            if (page === 'fuel') initFuelChart();
            if (page === 'fleet') initFleetStatusChart();
            if (page === 'mileage') initMileageWeeklyChart();
            if (page === 'routes') initRouteOccupancyChart();
            if (page === 'tracking') initTrackingCharts();
            if (page === 'maintenance') initMaintenanceCostChart();
            if (page === 'attendance') initAttendanceTrendChart();
            if (page === 'trips') initTripsCostChart();
            if (page === 'vendors') initVendorSpendChart();
            if (page === 'hr') initPayrollChart();
            if (page === 'inventory') initInventoryChart();
            if (page === 'performance') initSafetyTrendChart();
            if (page === 'budget') initBudgetChart();
            if (page === 'parent-portal') initParentPortalCharts();
            if (page === 'geofencing') initGeofenceViolationsChart();
            if (page === 'fuel-analytics') initFuelAnalyticsCharts();
            if (page === 'compliance') initComplianceScoreChart();
            if (page === 'helpdesk') initHelpdeskCharts();
        });
    });
}

/* ---- Theme Toggle ---- */
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
    syncSettingsDarkMode(saved);
    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
    syncSettingsDarkMode(theme);
    destroyAllCharts();
    initCharts();
    reinitChartsForActivePage();
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function syncSettingsDarkMode(theme) {
    const cb = document.getElementById('settingsDarkMode');
    if (cb) cb.checked = theme === 'dark';
}

function initSettingsSync() {
    const cb = document.getElementById('settingsDarkMode');
    if (cb) cb.addEventListener('change', () => applyTheme(cb.checked ? 'dark' : 'light'));
}

function reinitChartsForActivePage() {
    const active = document.querySelector('.page-view.active');
    if (!active) return;
    const page = active.id?.startsWith('page-') ? active.id.slice('page-'.length) : '';
    if (page === 'analytics') initAnalyticsCharts();
    if (page === 'fuel') initFuelChart();
    if (page === 'fleet') initFleetStatusChart();
    if (page === 'mileage') initMileageWeeklyChart();
    if (page === 'routes') initRouteOccupancyChart();
    if (page === 'tracking') initTrackingCharts();
    if (page === 'maintenance') initMaintenanceCostChart();
    if (page === 'attendance') initAttendanceTrendChart();
    if (page === 'trips') initTripsCostChart();
    if (page === 'vendors') initVendorSpendChart();
    if (page === 'hr') initPayrollChart();
    if (page === 'inventory') initInventoryChart();
    if (page === 'performance') initSafetyTrendChart();
    if (page === 'budget') initBudgetChart();
    if (page === 'parent-portal') initParentPortalCharts();
    if (page === 'geofencing') initGeofenceViolationsChart();
    if (page === 'fuel-analytics') initFuelAnalyticsCharts();
    if (page === 'compliance') initComplianceScoreChart();
    if (page === 'helpdesk') initHelpdeskCharts();
}

/* ---- Mobile Menu ---- */
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    btn.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('active'); });
    overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('active'); });
}

/* ---- Mileage Data ---- */
const mileageData = [
    { bus: 'Bus 101', seats: 25, expected: 6.5, actual: 6.3, efficiency: 96.9 },
    { bus: 'Bus 202', seats: 30, expected: 5.8, actual: 5.6, efficiency: 96.6 },
    { bus: 'Bus 303', seats: 45, expected: 4.5, actual: 4.2, efficiency: 93.3 },
    { bus: 'Bus 404', seats: 30, expected: 5.8, actual: 5.9, efficiency: 101.7 },
    { bus: 'Bus 505', seats: 25, expected: 6.5, actual: 5.1, efficiency: 78.5 },
    { bus: 'Bus 606', seats: 45, expected: 4.5, actual: 4.4, efficiency: 97.8 },
    { bus: 'Bus 707', seats: 30, expected: 5.8, actual: 4.7, efficiency: 81.0 },
    { bus: 'Bus 808', seats: 25, expected: 6.5, actual: 6.4, efficiency: 98.5 },
];

function sb(eff) {
    if (eff >= 95) return '<span class="status-badge good"><span class="status-dot"></span>Good</span>';
    if (eff >= 85) return '<span class="status-badge warning"><span class="status-dot"></span>Warning</span>';
    return '<span class="status-badge critical"><span class="status-dot"></span>Low</span>';
}

function populateMileageTable() {
    const tbody = document.querySelector('#mileageTable tbody');
    if (!tbody) return;
    tbody.innerHTML = mileageData.map(d => `<tr>
    <td>${d.bus}</td><td>${d.seats} seats</td><td>${d.expected} km/l</td><td>${d.actual} km/l</td>
    <td><div class="progress-bar-wrapper"><div class="progress-bar" style="width:90px"><div class="progress-fill ${d.efficiency >= 95 ? 'green' : d.efficiency >= 85 ? 'amber' : 'red'}" style="width:${Math.min(d.efficiency, 100)}%"></div></div><span class="progress-text">${d.efficiency}%</span></div></td>
    <td>${sb(d.efficiency)}</td></tr>`).join('');
}

/* ============================================
   DASHBOARD V2 (reference-style modules)
   ============================================ */

const dashboardV2Kpis = {
    totalBuses: 25,
    totalDrivers: 22,
    totalHelpers: 18,
    totalStudents: 650,
    totalSeats: 800,
    occupiedSeats: 560,
    vacantSeats: 240
};

const dashboardV2BusPerformance = [
    { bus: 'Bus 101', seats: 61, filled: 92, expense: 2360, pnl: 210, status: 'Active', statusClass: 'good' },
    { bus: 'Bus 202', seats: 60, filled: 50, expense: 2300, pnl: 560, status: 'Active', statusClass: 'good' },
    { bus: 'Bus 305', seats: 60, filled: 70, expense: 1900, pnl: -480, status: 'Active', statusClass: 'good' },
    { bus: 'Bus 412', seats: 62, filled: 50, expense: 1650, pnl: 220, status: 'Active', statusClass: 'good' },
    { bus: 'Bus 508', seats: 50, filled: 40, expense: 1200, pnl: -260, status: 'In Maintenance', statusClass: 'warning' }
];

const dashboardV2DriverRankings = [
    { name: 'Rajesh', onTime: 98, trips: 120 },
    { name: 'Anita', onTime: 92, trips: 110 },
    { name: 'Suresh', onTime: 88, trips: 105 },
    { name: 'Naveen', onTime: 85, trips: 95 },
    { name: 'Vikram', onTime: 80, trips: 90 }
];

const dashboardV2FleetStatus = [
    { name: 'Running Now', count: 18, color: 'var(--success-500)' },
    { name: 'Not Started', count: 3, color: 'var(--danger-500)' },
    { name: 'In Maintenance', count: 4, color: 'var(--warning-500)' }
];

const dashboardV2Alerts = [
    { text: 'Insurance expiring soon', badge: { text: 'Due', cls: 'warning' } },
    { text: 'Permit renewal due', badge: { text: 'Due', cls: 'warning' } },
    { text: 'Pending fees: ₹45,000', badge: { text: 'Action', cls: 'critical' } }
];

const dashboardV2Finance = {
    income: {
        labels: ['Student Fees', 'Other Income'],
        values: [78, 22]
    },
    expense: {
        labels: ['Fuel', 'Salaries', 'Maintenance', 'Other'],
        values: [38, 32, 18, 12]
    },
    monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        income: [80, 120, 95, 110, 105, 130],
        expense: [55, 78, 62, 70, 66, 82]
    }
};

function populateDashboardV2() {
    const set = (id, v) => {
        const el = document.getElementById(id);
        if (el) el.textContent = v;
    };

    set('kpiTotalBuses', dashboardV2Kpis.totalBuses);
    set('kpiTotalDrivers', dashboardV2Kpis.totalDrivers);
    set('kpiTotalHelpers', dashboardV2Kpis.totalHelpers);
    set('kpiTotalStudents', dashboardV2Kpis.totalStudents);
    set('kpiTotalSeats', dashboardV2Kpis.totalSeats);
    set('kpiOccupiedSeats', dashboardV2Kpis.occupiedSeats);
    set('kpiVacantSeats', dashboardV2Kpis.vacantSeats);

    set('bestDriverName', dashboardV2DriverRankings[0]?.name || '—');

    const perfBody = document.querySelector('#busPerformanceTable tbody');
    if (perfBody) {
        perfBody.innerHTML = dashboardV2BusPerformance.map(r => {
            const pnl = r.pnl;
            const pnlBadge = pnl >= 0
                ? `<span class="badge-profit positive"><i class="fas fa-arrow-up"></i> ₹${Math.abs(pnl).toLocaleString('en-IN')}</span>`
                : `<span class="badge-profit negative"><i class="fas fa-arrow-down"></i> ₹${Math.abs(pnl).toLocaleString('en-IN')}</span>`;
            return `<tr>
                <td>${r.bus}</td>
                <td>${r.seats}</td>
                <td>${r.filled}%</td>
                <td>₹${r.expense.toLocaleString('en-IN')}</td>
                <td>${pnlBadge}</td>
                <td><span class="status-badge ${r.statusClass}"><span class="status-dot"></span>${r.status}</span></td>
            </tr>`;
        }).join('');
    }

    const rankBody = document.querySelector('#driverRankingsTable tbody');
    if (rankBody) {
        rankBody.innerHTML = dashboardV2DriverRankings.map((d, idx) => `<tr>
            <td style="font-weight:800;color:var(--text-primary)">${idx + 1}</td>
            <td>${idx === 0 ? `${d.name} <span style="margin-left:6px;color:var(--warning-500)">★</span>` : d.name}</td>
            <td style="font-weight:700;color:var(--text-primary)">${d.onTime}%</td>
            <td>${d.trips}</td>
        </tr>`).join('');
    }

    const statusEl = document.getElementById('fleetStatusList');
    if (statusEl) {
        statusEl.innerHTML = `<div class="status-list">${dashboardV2FleetStatus.map(s => `
            <div class="status-row">
                <div class="status-left">
                    <span class="status-dot-lg" style="background:${s.color}"></span>
                    <span class="status-name">${s.name}</span>
                </div>
                <span class="status-count">${s.count}</span>
            </div>
        `).join('')}</div>`;
    }

    const alertsEl = document.getElementById('dashboardAlertsList');
    if (alertsEl) {
        alertsEl.innerHTML = `<div class="mini-alerts">${dashboardV2Alerts.map(a => `
            <div class="mini-alert">
                <div class="mini-alert-text">${a.text}</div>
                <span class="mini-alert-badge status-badge ${a.badge.cls}"><span class="status-dot"></span>${a.badge.text}</span>
            </div>
        `).join('')}</div>`;
    }
}

function initDashboardQuickActions() {
    const buttons = document.querySelectorAll('[data-goto]');
    if (!buttons.length) return;
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.getAttribute('data-goto');
            const nav = document.querySelector(`.nav-item[data-page="${page}"]`);
            if (nav) nav.click();
        });
    });
}

/* ============================================
   BUDGET & FINANCE MODULE
   ============================================ */

const budgetMonthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    planned: [120000, 125000, 130000, 128000, 132000, 135000],
    actual: [118000, 129000, 127000, 131000, 130500, 136500]
};

const budgetCategories = [
    { name: 'Fuel', planned: 45000, actual: 46800 },
    { name: 'Driver Salaries', planned: 52000, actual: 51500 },
    { name: 'Maintenance', planned: 18000, actual: 21000 },
    { name: 'Permits & Compliance', planned: 8000, actual: 7200 },
    { name: 'Miscellaneous', planned: 7000, actual: 6400 }
];

function populateBudgetPage() {
    const tbody = document.querySelector('#budgetCategoryTable tbody');
    if (!tbody) return;
    tbody.innerHTML = budgetCategories.map(cat => {
        const variance = cat.actual - cat.planned;
        const isOver = variance > 0;
        const badgeCls = isOver ? 'critical' : 'good';
        const badgeText = isOver ? 'Over Budget' : 'Under Budget';
        const varianceText = (isOver ? '▲ ' : '▼ ') + '₹' + Math.abs(variance).toLocaleString('en-IN');
        return `<tr>
            <td>${cat.name}</td>
            <td>₹${cat.planned.toLocaleString('en-IN')}</td>
            <td>₹${cat.actual.toLocaleString('en-IN')}</td>
            <td>${varianceText}</td>
            <td><span class="status-badge ${badgeCls}"><span class="status-dot"></span>${badgeText}</span></td>
        </tr>`;
    }).join('');

    const ytdBadge = document.getElementById('budgetYtdBadge');
    if (ytdBadge) {
        const totalPlanned = budgetMonthlyData.planned.reduce((a, b) => a + b, 0);
        const totalActual = budgetMonthlyData.actual.reduce((a, b) => a + b, 0);
        const diff = totalPlanned - totalActual;
        const positive = diff >= 0;
        ytdBadge.className = 'badge-profit ' + (positive ? 'positive' : 'negative');
        ytdBadge.innerHTML = `<i class="fas fa-${positive ? 'arrow-up' : 'arrow-down'}"></i> ${positive ? '₹' + Math.abs(diff).toLocaleString('en-IN') + ' Saved' : '₹' + Math.abs(diff).toLocaleString('en-IN') + ' Over'}`;
    }
}

/* ---- Alerts ---- */
const alertsData = [
    { type: 'alert-danger', icon: 'fa-exclamation-circle', title: 'Low Mileage: Bus 505', desc: 'Actual mileage 5.1 km/l is 21.5% below expected 6.5 km/l', time: '12 min ago' },
    { type: 'alert-danger', icon: 'fa-exclamation-circle', title: 'Low Mileage: Bus 707', desc: 'Actual mileage 4.7 km/l is 19% below expected 5.8 km/l', time: '35 min ago' },
    { type: 'alert-warning', icon: 'fa-gas-pump', title: 'Overfuel Consumption: Bus 303', desc: 'Fuel consumption 15% above normal this week', time: '1 hr ago' },
    { type: 'alert-warning', icon: 'fa-wrench', title: 'Maintenance Due: Bus 606', desc: 'Scheduled service in 3 days — 45,000 km milestone', time: '2 hrs ago' },
    { type: 'alert-info', icon: 'fa-users', title: 'Under Break-even: Bus 404', desc: 'Occupancy at 60% (18/30) — needs 22 students to break even', time: '3 hrs ago' },
];

function populateAlerts() {
    const html = alertsData.map(a => `<div class="alert-item ${a.type}">
    <div class="alert-icon"><i class="fas ${a.icon}"></i></div>
    <div class="alert-content"><div class="alert-title">${a.title}</div><div class="alert-desc">${a.desc}</div></div>
    <div class="alert-time">${a.time}</div></div>`).join('');
    ['alertsContainer', 'alertsPageContainer'].forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = html; });
}

/* ---- Fleet Overview ---- */
function populateFleetPage() {
    const m = document.getElementById('fleetMetrics');
    if (!m) return;
    m.innerHTML = `
    <div class="metric-card blue"><div class="metric-header"><div class="metric-icon"><i class="fas fa-bus"></i></div><span class="metric-change up">↑ 8%</span></div><div class="metric-value">24</div><div class="metric-label">Total Fleet Size</div></div>
    <div class="metric-card green"><div class="metric-header"><div class="metric-icon"><i class="fas fa-road"></i></div></div><div class="metric-value">14</div><div class="metric-label">Active Routes</div></div>
    <div class="metric-card purple"><div class="metric-header"><div class="metric-icon"><i class="fas fa-user-tie"></i></div></div><div class="metric-value">28</div><div class="metric-label">Total Drivers</div></div>
    <div class="metric-card teal"><div class="metric-header"><div class="metric-icon"><i class="fas fa-map-marker-alt"></i></div></div><div class="metric-value">86</div><div class="metric-label">Total Stops</div></div>`;
    const rows = [
        ['Bus 101', 'AC Deluxe', '25', 'Ramesh S.', 'Green Valley - Sec 22', '<span class="status-badge good"><span class="status-dot"></span>Active</span>', 'Feb 15, 2026'],
        ['Bus 202', 'Standard', '30', 'Suresh K.', 'Riverside - DLF Phase 3', '<span class="status-badge good"><span class="status-dot"></span>Active</span>', 'Feb 20, 2026'],
        ['Bus 303', 'AC Premium', '45', 'Vijay M.', 'Old City - Tech Park', '<span class="status-badge warning"><span class="status-dot"></span>Service Due</span>', 'Jan 10, 2026'],
        ['Bus 404', 'Standard', '30', 'Mahesh R.', 'Hill View - Sec 45', '<span class="status-badge good"><span class="status-dot"></span>Active</span>', 'Mar 01, 2026'],
        ['Bus 505', 'Mini', '25', 'Anil P.', 'Lake Road - Sec 12', '<span class="status-badge critical"><span class="status-dot"></span>Maintenance</span>', 'Dec 22, 2025'],
        ['Bus 606', 'AC Premium', '45', 'Ravi D.', 'Airport Road - IT Hub', '<span class="status-badge good"><span class="status-dot"></span>Active</span>', 'Feb 28, 2026'],
        ['Bus 707', 'Standard', '30', 'Kumar N.', 'Station Rd - Model Town', '<span class="status-badge critical"><span class="status-dot"></span>Maintenance</span>', 'Jan 18, 2026'],
        ['Bus 808', 'Mini', '25', 'Deepak T.', 'MG Road - Civil Lines', '<span class="status-badge good"><span class="status-dot"></span>Active</span>', 'Mar 02, 2026'],
    ];
    document.querySelector('#fleetTable tbody').innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

/* ---- Bus Registry ---- */
function populateBusRegistryPage() {
    const rows = [
        ['Bus 101', 'DL-1P-AB-1234', 'Tata Starbus', '2022', '25', '<span class="status-badge good"><span class="status-dot"></span>Valid till Dec 2026</span>', '<span class="status-badge good"><span class="status-dot"></span>Valid</span>', '<button class="btn btn-sm btn-secondary"><i class="fas fa-eye"></i></button>'],
        ['Bus 202', 'DL-1P-CD-5678', 'Ashok Leyland', '2021', '30', '<span class="status-badge good"><span class="status-dot"></span>Valid till Sep 2026</span>', '<span class="status-badge good"><span class="status-dot"></span>Valid</span>', '<button class="btn btn-sm btn-secondary"><i class="fas fa-eye"></i></button>'],
        ['Bus 303', 'DL-1P-EF-9012', 'Eicher Pro', '2020', '45', '<span class="status-badge good"><span class="status-dot"></span>Valid till Jul 2026</span>', '<span class="status-badge warning"><span class="status-dot"></span>Due Soon</span>', '<button class="btn btn-sm btn-secondary"><i class="fas fa-eye"></i></button>'],
        ['Bus 404', 'DL-1P-GH-3456', 'BharatBenz', '2023', '30', '<span class="status-badge good"><span class="status-dot"></span>Valid till Nov 2026</span>', '<span class="status-badge good"><span class="status-dot"></span>Valid</span>', '<button class="btn btn-sm btn-secondary"><i class="fas fa-eye"></i></button>'],
        ['Bus 505', 'DL-1P-IJ-7890', 'Tata Starbus', '2019', '25', '<span class="status-badge warning"><span class="status-dot"></span>Expiring Apr 2026</span>', '<span class="status-badge critical"><span class="status-dot"></span>Expired</span>', '<button class="btn btn-sm btn-secondary"><i class="fas fa-eye"></i></button>'],
        ['Bus 606', 'DL-1P-KL-1357', 'Force Traveller', '2022', '45', '<span class="status-badge good"><span class="status-dot"></span>Valid till Aug 2026</span>', '<span class="status-badge good"><span class="status-dot"></span>Valid</span>', '<button class="btn btn-sm btn-secondary"><i class="fas fa-eye"></i></button>'],
        ['Bus 707', 'DL-1P-MN-2468', 'Ashok Leyland', '2020', '30', '<span class="status-badge good"><span class="status-dot"></span>Valid till Oct 2026</span>', '<span class="status-badge warning"><span class="status-dot"></span>Due Soon</span>', '<button class="btn btn-sm btn-secondary"><i class="fas fa-eye"></i></button>'],
        ['Bus 808', 'DL-1P-OP-3579', 'Tata Winger', '2023', '25', '<span class="status-badge good"><span class="status-dot"></span>Valid till Jan 2027</span>', '<span class="status-badge good"><span class="status-dot"></span>Valid</span>', '<button class="btn btn-sm btn-secondary"><i class="fas fa-eye"></i></button>'],
    ];
    const t = document.querySelector('#busRegistryTable tbody');
    if (t) t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

/* ---- Mileage Full Page ---- */
function populateMileageFullPage() {
    const rows = [
        ['Bus 101', 'Mar 03', '145', '23.0', '6.30', '6.50', '-3.1%', '<span class="status-badge good"><span class="status-dot"></span>Good</span>'],
        ['Bus 202', 'Mar 03', '132', '23.6', '5.59', '5.80', '-3.6%', '<span class="status-badge good"><span class="status-dot"></span>Good</span>'],
        ['Bus 303', 'Mar 03', '168', '40.0', '4.20', '4.50', '-6.7%', '<span class="status-badge warning"><span class="status-dot"></span>Warning</span>'],
        ['Bus 404', 'Mar 03', '148', '25.1', '5.90', '5.80', '+1.7%', '<span class="status-badge good"><span class="status-dot"></span>Good</span>'],
        ['Bus 505', 'Mar 03', '122', '23.9', '5.10', '6.50', '-21.5%', '<span class="status-badge critical"><span class="status-dot"></span>Low</span>'],
        ['Bus 606', 'Mar 03', '155', '35.2', '4.40', '4.50', '-2.2%', '<span class="status-badge good"><span class="status-dot"></span>Good</span>'],
        ['Bus 707', 'Mar 03', '118', '25.1', '4.70', '5.80', '-19.0%', '<span class="status-badge critical"><span class="status-dot"></span>Low</span>'],
        ['Bus 808', 'Mar 03', '138', '21.6', '6.39', '6.50', '-1.7%', '<span class="status-badge good"><span class="status-dot"></span>Good</span>'],
        ['Bus 101', 'Mar 02', '140', '21.5', '6.51', '6.50', '+0.2%', '<span class="status-badge good"><span class="status-dot"></span>Good</span>'],
        ['Bus 202', 'Mar 02', '130', '22.8', '5.70', '5.80', '-1.7%', '<span class="status-badge good"><span class="status-dot"></span>Good</span>'],
    ];
    const t = document.querySelector('#mileageFullTable tbody');
    if (t) t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

/* ---- Fuel Page ---- */
function populateFuelPage() {
    const rows = [
        ['Bus 101', 'Mar 03', '45 L', '₹95.00', '₹4,275', '34,520 km', 'Indian Oil — Sec 22'],
        ['Bus 303', 'Mar 03', '60 L', '₹95.00', '₹5,700', '28,430 km', 'HP Petrol — MG Rd'],
        ['Bus 505', 'Mar 02', '42 L', '₹95.00', '₹3,990', '41,200 km', 'Indian Oil — Sec 22'],
        ['Bus 202', 'Mar 02', '48 L', '₹95.00', '₹4,560', '36,780 km', 'BPCL — DLF Phase 3'],
        ['Bus 707', 'Mar 01', '50 L', '₹95.00', '₹4,750', '39,100 km', 'HP Petrol — Model Town'],
        ['Bus 606', 'Mar 01', '55 L', '₹95.00', '₹5,225', '31,650 km', 'Indian Oil — IT Hub'],
        ['Bus 808', 'Mar 01', '38 L', '₹95.00', '₹3,610', '22,840 km', 'BPCL — Civil Lines'],
        ['Bus 404', 'Feb 28', '46 L', '₹94.50', '₹4,347', '44,120 km', 'Indian Oil — Sec 45'],
    ];
    const t = document.querySelector('#fuelTable tbody');
    if (t) t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

/* ---- Fee Management Page ---- */
function populateFeePage() {
    const pbadge = s => s === 'Paid' ? '<span class="status-badge good"><span class="status-dot"></span>Paid</span>' : s === 'Pending' ? '<span class="status-badge warning"><span class="status-dot"></span>Pending</span>' : '<span class="status-badge critical"><span class="status-dot"></span>Overdue</span>';
    const rows = [
        ['Aarav Patel', '8-B', 'Bus 101', '₹3,250', pbadge('Paid'), pbadge('Paid'), pbadge('Paid'), '₹0'],
        ['Priya Sharma', '7-A', 'Bus 202', '₹2,800', pbadge('Paid'), pbadge('Paid'), pbadge('Pending'), '₹2,800'],
        ['Rohan Gupta', '9-C', 'Bus 303', '₹3,600', pbadge('Pending'), pbadge('Paid'), pbadge('Paid'), '₹3,600'],
        ['Ananya Singh', '6-B', 'Bus 101', '₹3,250', pbadge('Paid'), pbadge('Paid'), pbadge('Paid'), '₹0'],
        ['Vikram Reddy', '10-A', 'Bus 404', '₹4,100', pbadge('Paid'), pbadge('Overdue'), pbadge('Overdue'), '₹8,200'],
        ['Diya Nair', '5-A', 'Bus 606', '₹3,800', pbadge('Paid'), pbadge('Paid'), pbadge('Paid'), '₹0'],
        ['Karthik M.', '8-A', 'Bus 808', '₹2,400', pbadge('Pending'), pbadge('Paid'), pbadge('Paid'), '₹2,400'],
        ['Sneha Joshi', '7-C', 'Bus 202', '₹2,800', pbadge('Paid'), pbadge('Paid'), pbadge('Paid'), '₹0'],
        ['Arjun Kapoor', '11-B', 'Bus 303', '₹3,600', pbadge('Paid'), pbadge('Paid'), pbadge('Pending'), '₹3,600'],
        ['Meera Das', '6-A', 'Bus 505', '₹3,000', pbadge('Overdue'), pbadge('Overdue'), pbadge('Paid'), '₹6,000'],
    ];
    const t = document.querySelector('#feeTable tbody');
    if (t) t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

/* ---- Routes Page ---- */
function populateRoutesPage() {
    const occ = (s, c) => { const p = Math.round(s / c * 100); return `<div class="progress-bar-wrapper"><div class="progress-bar" style="width:80px"><div class="progress-fill ${p >= 80 ? 'green' : p >= 60 ? 'amber' : 'red'}" style="width:${p}%"></div></div><span class="progress-text">${p}%</span></div>`; };
    const rows = [
        ['Green Valley - Sector 22', 'Bus 101', '18.5 km', '22', '8', occ(22, 25), '<span class="status-badge good"><span class="status-dot"></span>Active</span>'],
        ['Riverside - DLF Phase 3', 'Bus 202', '22.0 km', '28', '10', occ(28, 30), '<span class="status-badge good"><span class="status-dot"></span>Active</span>'],
        ['Old City - Tech Park', 'Bus 303', '15.0 km', '38', '12', occ(38, 45), '<span class="status-badge good"><span class="status-dot"></span>Active</span>'],
        ['Hill View - Sector 45', 'Bus 404', '25.0 km', '18', '9', occ(18, 30), '<span class="status-badge warning"><span class="status-dot"></span>Low Occupancy</span>'],
        ['Lake Road - Sector 12', 'Bus 505', '14.0 km', '20', '7', occ(20, 25), '<span class="status-badge good"><span class="status-dot"></span>Active</span>'],
        ['Airport Rd - IT Hub', 'Bus 606', '28.0 km', '40', '14', occ(40, 45), '<span class="status-badge good"><span class="status-dot"></span>Active</span>'],
        ['Station Rd - Model Town', 'Bus 707', '16.0 km', '16', '8', occ(16, 30), '<span class="status-badge warning"><span class="status-dot"></span>Low Occupancy</span>'],
        ['MG Road - Civil Lines', 'Bus 808', '12.0 km', '20', '6', occ(20, 25), '<span class="status-badge good"><span class="status-dot"></span>Active</span>'],
    ];
    const t = document.querySelector('#routeTable tbody');
    if (t) t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

/* ---- Drivers Page ---- */
function populateDriversPage() {
    const star = r => { let s = ''; for (let i = 0; i < 5; i++) s += `<i class="fas fa-star" style="color:${i < Math.round(r) ? '#f59e0b' : 'var(--gray-300)'};font-size:11px;"></i>`; return `${s} <span style="font-size:12px;font-weight:600;margin-left:4px">${r}</span>`; };
    const rows = [
        ['Ramesh Sharma', 'DL-0420261234', 'Bus 101', '12 yrs', '98765-43210', star(4.8), '<span class="status-badge good"><span class="status-dot"></span>On Duty</span>'],
        ['Suresh Kumar', 'DL-0420265678', 'Bus 202', '8 yrs', '98765-43211', star(4.5), '<span class="status-badge good"><span class="status-dot"></span>On Duty</span>'],
        ['Vijay Malhotra', 'DL-0420269012', 'Bus 303', '15 yrs', '98765-43212', star(4.9), '<span class="status-badge good"><span class="status-dot"></span>On Duty</span>'],
        ['Mahesh Reddy', 'DL-0420263456', 'Bus 404', '6 yrs', '98765-43213', star(4.2), '<span class="status-badge good"><span class="status-dot"></span>On Duty</span>'],
        ['Anil Patil', 'DL-0420267890', 'Bus 505', '10 yrs', '98765-43214', star(4.6), '<span class="status-badge warning"><span class="status-dot"></span>On Leave</span>'],
        ['Ravi Dubey', 'DL-0420261357', 'Bus 606', '14 yrs', '98765-43215', star(4.7), '<span class="status-badge good"><span class="status-dot"></span>On Duty</span>'],
        ['Kumar Naidu', 'DL-0420262580', 'Bus 707', '9 yrs', '98765-43216', star(4.3), '<span class="status-badge critical"><span class="status-dot"></span>License Exp.</span>'],
        ['Deepak Tiwari', 'DL-0420263691', 'Bus 808', '5 yrs', '98765-43217', star(4.4), '<span class="status-badge good"><span class="status-dot"></span>On Duty</span>'],
    ];
    const t = document.querySelector('#driverTable tbody');
    if (t) t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

/* ---- Fee Calculator ---- */
function initFeeCalculator() {
    const d = document.getElementById('distanceInput'), rt = document.getElementById('roundTrip'),
        ms = document.getElementById('profitMargin'), mv = document.getElementById('marginValue'),
        fd = document.getElementById('suggestedFee'), sd = document.getElementById('schoolDays');
    function calc() {
        const dist = parseFloat(d.value) || 0;
        rt.value = (dist * 2).toFixed(1) + ' km';
        const margin = parseInt(ms.value); mv.textContent = margin + '%';
        const days = parseInt(sd.value) || 24;
        const fee = Math.round(dist * 2 * days * 18.5 / 25 * (1 + margin / 100) / 50) * 50;
        fd.textContent = '₹' + fee.toLocaleString('en-IN');
        const l = fd.closest('.suggested-fee-card').querySelector('.fee-label:last-child');
        if (l) l.textContent = `Including ${margin}% margin`;
    }
    if (d) { d.addEventListener('input', calc); ms.addEventListener('input', calc); sd.addEventListener('input', calc); }
}

/* ---- Chart Helpers ---- */
const CI = {};
function gc() {
    const dk = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        text: dk ? '#94a3b8' : '#6b7280', grid: dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        blue: '#3b82f6', green: '#22c55e', amber: '#f59e0b', red: '#ef4444', purple: '#8b5cf6', teal: '#14b8a6',
        yellow: '#eab308',
        blueBg: dk ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)',
        greenBg: dk ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.1)',
        purpleBg: dk ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)'
    };
}
function destroyAllCharts() { Object.keys(CI).forEach(k => { CI[k].destroy(); delete CI[k]; }); }
function ds() { const c = gc(); return { x: { grid: { color: c.grid }, ticks: { color: c.text, font: { size: 11 } } }, y: { grid: { color: c.grid }, ticks: { color: c.text, font: { size: 11 } } } }; }
function lp(c) { return { labels: { color: c.text, usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 11 } } }; }

/* ---- Dashboard Charts ---- */
function initCharts() {
    const c = gc();

    // Dashboard v2: Income vs Expense (mixed)
    const ie = document.getElementById('incomeExpenseChart');
    if (ie) CI.ie = new Chart(ie, {
        data: {
            labels: dashboardV2Finance.monthly.labels,
            datasets: [
                { type: 'bar', label: 'Income', data: dashboardV2Finance.monthly.income, backgroundColor: c.blue, borderRadius: 6, barPercentage: 0.65 },
                { type: 'bar', label: 'Expense', data: dashboardV2Finance.monthly.expense, backgroundColor: c.red, borderRadius: 6, barPercentage: 0.65 },
                {
                    type: 'line',
                    label: 'Net Profit',
                    data: dashboardV2Finance.monthly.income.map((v, i) => v - dashboardV2Finance.monthly.expense[i]),
                    borderColor: c.green,
                    backgroundColor: c.greenBg,
                    tension: 0.35,
                    fill: true,
                    pointRadius: 3,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: lp(c) },
            scales: {
                ...ds(),
                y: { ...ds().y, title: { display: true, text: 'Amount', color: c.text, font: { size: 11 } } }
            }
        }
    });

    // Dashboard v2: Donut breakdowns + legends
    const ib = document.getElementById('incomeBreakdownChart');
    if (ib) {
        const incomeColors = [c.blue, c.teal];
        CI.ib = new Chart(ib, {
            type: 'doughnut',
            data: { labels: dashboardV2Finance.income.labels, datasets: [{ data: dashboardV2Finance.income.values, backgroundColor: incomeColors, borderWidth: 0, spacing: 2 }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false } } }
        });
        const el = document.getElementById('incomeBreakdownLegend');
        if (el) el.innerHTML = dashboardV2Finance.income.labels.map((l, i) => `<span class="legend-pill"><span class="legend-swatch" style="background:${incomeColors[i]}"></span>${l}</span>`).join('');
    }

    const eb = document.getElementById('expenseBreakdownChart');
    if (eb) {
        const expColors = [c.red, c.purple, c.amber, 'rgba(148,163,184,0.6)'];
        CI.eb = new Chart(eb, {
            type: 'doughnut',
            data: { labels: dashboardV2Finance.expense.labels, datasets: [{ data: dashboardV2Finance.expense.values, backgroundColor: expColors, borderWidth: 0, spacing: 2 }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false } } }
        });
        const el = document.getElementById('expenseBreakdownLegend');
        if (el) el.innerHTML = dashboardV2Finance.expense.labels.map((l, i) => `<span class="legend-pill"><span class="legend-swatch" style="background:${expColors[i]}"></span>${l}</span>`).join('');
    }

    const ctx1 = document.getElementById('mileageTrendChart');
    if (ctx1) CI.mt = new Chart(ctx1, {
        type: 'line', data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [
                { label: 'Bus 101', data: [6.3, 6.5, 6.4, 6.2, 6.3, 6.5], borderColor: c.blue, backgroundColor: c.blueBg, tension: 0.4, fill: true, pointRadius: 3 },
                { label: 'Bus 505', data: [5.4, 5.2, 5.0, 5.1, 4.9, 5.1], borderColor: c.red, backgroundColor: 'rgba(239,68,68,0.1)', tension: 0.4, fill: true, pointRadius: 3 },
                { label: 'Bus 303', data: [4.3, 4.4, 4.2, 4.1, 4.2, 4.2], borderColor: c.amber, backgroundColor: 'rgba(245,158,11,0.1)', tension: 0.4, fill: true, pointRadius: 3 }
            ]
        }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: lp(c) }, scales: ds() }
    });

    const ctx2 = document.getElementById('revenueFuelChart');
    if (ctx2) CI.rf = new Chart(ctx2, {
        type: 'bar', data: {
            labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            datasets: [
                { label: 'Revenue (₹L)', data: [15.2, 16.0, 16.8, 17.1, 17.8, 18.4], backgroundColor: c.blue, borderRadius: 6 },
                { label: 'Fuel Cost (₹L)', data: [3.8, 4.0, 4.2, 4.1, 4.5, 4.8], backgroundColor: c.red, borderRadius: 6 }
            ]
        }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: lp(c) }, scales: ds() }
    });

    const ctx3 = document.getElementById('busProfitChart');
    if (ctx3) CI.bp = new Chart(ctx3, {
        type: 'bar', data: {
            labels: ['Bus 101', 'Bus 202', 'Bus 303', 'Bus 404', 'Bus 505', 'Bus 606', 'Bus 707', 'Bus 808'],
            datasets: [{
                label: 'Monthly Profit (₹K)', data: [24.5, 18.2, 32.0, -5.2, 12.8, 35.6, -8.4, 15.0],
                backgroundColor: [c.green, c.green, c.green, c.red, c.green, c.green, c.red, c.green], borderRadius: 6
            }]
        }, options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: ds() }
    });
}

function initBudgetChart() {
    if (CI.bg) return;
    const canvas = document.getElementById('budgetVarianceChart');
    if (!canvas) return;
    const c = gc();
    CI.bg = new Chart(canvas, {
        data: {
            labels: budgetMonthlyData.labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Planned',
                    data: budgetMonthlyData.planned,
                    backgroundColor: c.blue,
                    borderRadius: 6,
                    barPercentage: 0.7
                },
                {
                    type: 'bar',
                    label: 'Actual',
                    data: budgetMonthlyData.actual,
                    backgroundColor: c.amber,
                    borderRadius: 6,
                    barPercentage: 0.7
                },
                {
                    type: 'line',
                    label: 'Variance',
                    data: budgetMonthlyData.actual.map((v, i) => v - budgetMonthlyData.planned[i]),
                    borderColor: c.red,
                    backgroundColor: 'rgba(239,68,68,0.12)',
                    tension: 0.35,
                    fill: true,
                    pointRadius: 3,
                    borderWidth: 2,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: lp(c) },
            scales: {
                x: ds().x,
                y: {
                    ...ds().y,
                    title: { display: true, text: 'Amount (₹)', color: c.text, font: { size: 11 } }
                },
                y1: {
                    position: 'right',
                    grid: { drawOnChartArea: false, color: c.grid },
                    ticks: { color: c.text, font: { size: 11 } },
                    title: { display: true, text: 'Variance', color: c.text, font: { size: 11 } }
                }
            }
        }
    });
}

/* ---- Fleet Status Chart (Doughnut) ---- */
function initFleetStatusChart() {
    if (CI.fs) return;
    const ctx = document.getElementById('fleetStatusChart'); if (!ctx) return;
    const c = gc();
    CI.fs = new Chart(ctx, {
        type: 'doughnut', data: {
            labels: ['Active', 'Service Due', 'Maintenance'],
            datasets: [{ data: [21, 1, 2], backgroundColor: [c.green, c.amber, c.red], borderWidth: 0, spacing: 3 }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: c.text, padding: 16, usePointStyle: true, pointStyle: 'circle' } } } }
    });
}

/* ---- Mileage Weekly Chart ---- */
function initMileageWeeklyChart() {
    if (CI.mw) return;
    const ctx = document.getElementById('mileageWeeklyChart'); if (!ctx) return;
    const c = gc();
    CI.mw = new Chart(ctx, {
        type: 'line', data: {
            labels: ['Feb 25', 'Feb 26', 'Feb 27', 'Feb 28', 'Mar 01', 'Mar 02', 'Mar 03'],
            datasets: [
                { label: 'Fleet Avg', data: [6.1, 6.0, 6.2, 6.3, 6.1, 6.2, 6.2], borderColor: c.blue, backgroundColor: c.blueBg, fill: true, tension: 0.4, pointRadius: 4 },
                { label: 'Threshold (85%)', data: [5.5, 5.5, 5.5, 5.5, 5.5, 5.5, 5.5], borderColor: c.red, borderDash: [6, 4], pointRadius: 0, fill: false }
            ]
        }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: lp(c) }, scales: ds() }
    });
}

/* ---- Route Occupancy Chart ---- */
function initRouteOccupancyChart() {
    if (CI.ro) return;
    const ctx = document.getElementById('routeOccupancyChart'); if (!ctx) return;
    const c = gc();
    CI.ro = new Chart(ctx, {
        type: 'bar', data: {
            labels: ['Green Valley', 'Riverside', 'Old City', 'Hill View', 'Lake Road', 'Airport Rd', 'Station Rd', 'MG Road'],
            datasets: [
                { label: 'Capacity', data: [25, 30, 45, 30, 25, 45, 30, 25], backgroundColor: 'rgba(99,102,241,0.2)', borderColor: '#6366f1', borderWidth: 1, borderRadius: 4 },
                { label: 'Enrolled', data: [22, 28, 38, 18, 20, 40, 16, 20], backgroundColor: (ctx) => { const v = ctx.raw, cap = ctx.chart.data.datasets[0].data[ctx.dataIndex]; return v / cap >= 0.8 ? c.green : v / cap >= 0.6 ? c.amber : c.red; }, borderRadius: 4 }
            ]
        }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: lp(c) }, scales: ds() }
    });
}

/* ---- Analytics Charts (lazy) ---- */
let aInit = false;
function initAnalyticsCharts() {
    if (aInit && CI.ar) return; aInit = true;
    const c = gc();
    const c1 = document.getElementById('analyticsRevenueChart');
    if (c1) {
        if (CI.ar) CI.ar.destroy();
        CI.ar = new Chart(c1, {
            type: 'line', data: {
                labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
                datasets: [{ label: 'Revenue', data: [12.1, 13.5, 14.0, 14.8, 15.0, 15.2, 15.8, 16.5, 16.8, 17.1, 17.8, 18.4], borderColor: c.blue, backgroundColor: c.blueBg, fill: true, tension: 0.4 },
                { label: 'Fuel Cost', data: [3.2, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.2, 4.1, 4.5, 4.8], borderColor: c.red, backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: lp(c) }, scales: ds() }
        });
    }

    const c2 = document.getElementById('analyticsMileageChart');
    if (c2) {
        if (CI.am) CI.am.destroy();
        CI.am = new Chart(c2, {
            type: 'bar', data: {
                labels: ['Bus 101', 'Bus 202', 'Bus 303', 'Bus 404', 'Bus 505', 'Bus 606', 'Bus 707', 'Bus 808'],
                datasets: [{ label: 'Expected', data: [6.5, 5.8, 4.5, 5.8, 6.5, 4.5, 5.8, 6.5], backgroundColor: c.blue, borderRadius: 6 },
                { label: 'Actual', data: [6.3, 5.6, 4.2, 5.9, 5.1, 4.4, 4.7, 6.4], backgroundColor: ctx => ctx.raw < ctx.chart.data.datasets[0].data[ctx.dataIndex] * 0.85 ? c.red : c.green, borderRadius: 6 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: lp(c) }, scales: ds() }
        });
    }

    const c3 = document.getElementById('analyticsProfitChart');
    if (c3) {
        if (CI.ap) CI.ap.destroy();
        CI.ap = new Chart(c3, {
            type: 'doughnut', data: {
                labels: ['Bus 101', 'Bus 202', 'Bus 303', 'Bus 404', 'Bus 505', 'Bus 606', 'Bus 707', 'Bus 808'],
                datasets: [{ data: [24.5, 18.2, 32.0, 5.2, 12.8, 35.6, 8.4, 15.0], backgroundColor: [c.blue, '#6366f1', c.green, c.red, c.teal, c.purple, c.amber, '#ec4899'], borderWidth: 0, spacing: 2 }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right', labels: { color: c.text, padding: 12, usePointStyle: true, pointStyle: 'circle' } } } }
        });
    }

    const c4 = document.getElementById('analyticsBreakevenChart');
    if (c4) {
        if (CI.ab) CI.ab.destroy();
        CI.ab = new Chart(c4, {
            type: 'bar', data: {
                labels: ['Bus 101', 'Bus 202', 'Bus 303', 'Bus 404', 'Bus 505', 'Bus 606', 'Bus 707', 'Bus 808'],
                datasets: [{ label: 'Break-even', data: [18, 22, 30, 22, 18, 30, 22, 18], backgroundColor: 'rgba(239,68,68,0.3)', borderColor: c.red, borderWidth: 1, borderRadius: 4 },
                { label: 'Current', data: [22, 26, 38, 18, 20, 40, 16, 20], backgroundColor: ctx => ctx.raw >= ctx.chart.data.datasets[0].data[ctx.dataIndex] ? c.green : c.amber, borderRadius: 4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: lp(c) }, scales: ds() }
        });
    }
}

/* ---- Fuel Chart (lazy) ---- */
function initFuelChart() {
    if (CI.ft) return;
    const ctx = document.getElementById('fuelTrendChart'); if (!ctx) return;
    const c = gc();
    CI.ft = new Chart(ctx, {
        type: 'line', data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{ label: 'Bus 101', data: [180, 175, 190, 185], borderColor: c.blue, tension: 0.4, pointRadius: 4 },
            { label: 'Bus 303', data: [240, 255, 250, 260], borderColor: c.red, tension: 0.4, pointRadius: 4 },
            { label: 'Bus 606', data: [220, 215, 225, 230], borderColor: c.green, tension: 0.4, pointRadius: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: lp(c) }, scales: ds() }
    });
}

/* ============================================
   LIVE TRACKING MODULE
   ============================================ */

/* Bus tracking data */
const trackingBuses = [
    { id: '101', name: 'Bus 101', driver: 'Ramesh S.', route: 'Green Valley → Sector 22', speed: 38, eta: '8:22 AM', status: 'on-time', students: 22, capacity: 25 },
    { id: '202', name: 'Bus 202', driver: 'Suresh K.', route: 'Riverside → DLF Phase 3', speed: 42, eta: '8:18 AM', status: 'on-time', students: 28, capacity: 30 },
    { id: '303', name: 'Bus 303', driver: 'Vijay M.', route: 'Old City → Tech Park', speed: 22, eta: '8:35 AM', status: 'delayed', students: 38, capacity: 45 },
    { id: '404', name: 'Bus 404', driver: 'Mahesh R.', route: 'Hill View → Sector 45', speed: 35, eta: '8:25 AM', status: 'on-time', students: 18, capacity: 30 },
    { id: '606', name: 'Bus 606', driver: 'Ravi D.', route: 'Airport Rd → IT Hub', speed: 40, eta: '8:20 AM', status: 'on-time', students: 40, capacity: 45 },
    { id: '808', name: 'Bus 808', driver: 'Deepak T.', route: 'MG Road → Civil Lines', speed: 12, eta: '8:45 AM', status: 'late', students: 20, capacity: 25 },
];

/* Bus positions for animation (path waypoints) */
const busPositions = {
    '101': [{ x: 120, y: 220 }, { x: 180, y: 200 }, { x: 250, y: 195 }, { x: 320, y: 220 }, { x: 380, y: 245 }],
    '202': [{ x: 680, y: 270 }, { x: 620, y: 290 }, { x: 560, y: 300 }, { x: 490, y: 280 }, { x: 420, y: 255 }],
    '303': [{ x: 350, y: 120 }, { x: 370, y: 160 }, { x: 385, y: 200 }, { x: 395, y: 230 }],
    '404': [{ x: 640, y: 120 }, { x: 650, y: 180 }, { x: 645, y: 230 }, { x: 600, y: 260 }],
    '606': [{ x: 160, y: 380 }, { x: 230, y: 360 }, { x: 320, y: 370 }, { x: 400, y: 380 }],
    '808': [{ x: 700, y: 400 }, { x: 640, y: 390 }, { x: 560, y: 380 }, { x: 480, y: 360 }],
};

let busAnimFrame = {};
let busAnimInterval;

function populateTrackingPage() {
    populateActiveBusList();
    populateTripTimeline();
    populateParentNotifications();
    startBusAnimation();

    // Refresh button
    const refreshBtn = document.getElementById('trackingRefreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.querySelector('i').style.animation = 'spin 0.8s linear';
            setTimeout(() => { refreshBtn.querySelector('i').style.animation = ''; }, 800);
            // Simulate data refresh
            trackingBuses.forEach(b => { b.speed = Math.max(10, b.speed + Math.floor(Math.random() * 10 - 5)); });
            populateActiveBusList();
        });
    }
}

function populateActiveBusList() {
    const container = document.getElementById('activeBusList');
    if (!container) return;
    container.innerHTML = trackingBuses.map(b => `
        <div class="bus-status-card" data-bus="${b.id}">
            <div class="bus-status-icon ${b.status === 'on-time' ? 'on-time' : b.status === 'delayed' ? 'delayed' : 'late'}">
                <i class="fas fa-bus"></i>
            </div>
            <div class="bus-status-info">
                <div class="bus-status-name">${b.name} <span style="font-weight:400;color:var(--text-tertiary);font-size:11px;">• ${b.driver}</span></div>
                <div class="bus-status-route">${b.route}</div>
            </div>
            <div class="bus-status-meta">
                <div class="bus-speed">${b.speed} km/h</div>
                <div class="bus-eta">ETA ${b.eta}</div>
                <span class="status-badge ${b.status === 'on-time' ? 'good' : b.status === 'delayed' ? 'warning' : 'critical'}"><span class="status-dot"></span>${b.status === 'on-time' ? 'On Time' : b.status === 'delayed' ? 'Delayed' : 'Late'}</span>
            </div>
        </div>
    `).join('');
}

function populateTripTimeline() {
    const container = document.getElementById('tripTimelineBody');
    if (!container) return;
    const stops = [
        { name: 'Green Valley Colony', time: '7:30 AM', meta: 'Picked up 5 students', status: 'completed' },
        { name: 'Sunshine Apartments', time: '7:38 AM', meta: 'Picked up 4 students', status: 'completed' },
        { name: 'Maple Heights', time: '7:45 AM', meta: 'Picked up 3 students', status: 'completed' },
        { name: 'Park View Society', time: '7:52 AM', meta: 'Picked up 6 students', status: 'completed' },
        { name: 'Sector 22 Main Gate', time: '8:05 AM', meta: 'Currently en route — 2.1 km away', status: 'current' },
        { name: 'Sector 22 Market', time: '8:12 AM', meta: '2 students to pick up', status: 'upcoming' },
        { name: 'Sector 23 Crossing', time: '8:18 AM', meta: '2 students to pick up', status: 'upcoming' },
        { name: 'DPS School Gate', time: '8:25 AM', meta: 'Final destination — drop-off all', status: 'upcoming' },
    ];
    container.innerHTML = `<div class="trip-timeline">${stops.map(s => `
        <div class="timeline-stop ${s.status}">
            <div class="timeline-top">
                <span class="timeline-name">${s.name}</span>
                <span class="timeline-time">${s.time}</span>
            </div>
            <div class="timeline-meta">${s.meta}</div>
        </div>
    `).join('')}</div>`;
}

function populateParentNotifications() {
    const container = document.getElementById('parentNotificationsBody');
    if (!container) return;
    const notifs = [
        { type: 'pickup', initials: 'AP', text: '<strong>Aarav Patel</strong> picked up from Green Valley Colony', time: '7:31 AM', icon: '🟢' },
        { type: 'pickup', initials: 'PS', text: '<strong>Priya Sharma</strong> picked up from Sunshine Apartments', time: '7:39 AM', icon: '🟢' },
        { type: 'pickup', initials: 'RG', text: '<strong>Rohan Gupta</strong> picked up from Maple Heights', time: '7:46 AM', icon: '🟢' },
        { type: 'delay', initials: 'AS', text: '<strong>Bus 303</strong> delayed by ~5 min on Old City route', time: '7:50 AM', icon: '⚠️' },
        { type: 'pickup', initials: 'DN', text: '<strong>Diya Nair</strong> picked up from Park View Society', time: '7:53 AM', icon: '🟢' },
        { type: 'dropoff', initials: 'VR', text: '<strong>Vikram Reddy</strong> drop-off confirmed at DPS School', time: '8:02 AM', icon: '🔵' },
        { type: 'delay', initials: 'DT', text: '<strong>Bus 808</strong> running late — traffic on MG Road', time: '8:10 AM', icon: '⚠️' },
        { type: 'pickup', initials: 'KM', text: '<strong>Karthik M.</strong> picked up from Lake Road Stop', time: '8:05 AM', icon: '🟢' },
    ];
    container.innerHTML = notifs.map(n => `
        <div class="parent-notif-item">
            <div class="notif-avatar ${n.type}">${n.initials}</div>
            <div class="notif-content">
                <div class="notif-text">${n.text}</div>
                <div class="notif-time">${n.icon} ${n.time}</div>
            </div>
        </div>
    `).join('');
}

/* ---- Bus Map Animation ---- */
function startBusAnimation() {
    // Initialize positions
    Object.keys(busPositions).forEach(id => {
        busAnimFrame[id] = 0;
        const marker = document.getElementById('busMarker' + id);
        if (marker) {
            const pos = busPositions[id][0];
            marker.setAttribute('transform', `translate(${pos.x},${pos.y})`);
        }
    });

    let tick = 0;
    if (busAnimInterval) clearInterval(busAnimInterval);
    busAnimInterval = setInterval(() => {
        tick++;
        Object.keys(busPositions).forEach(id => {
            const waypoints = busPositions[id];
            const frameIndex = Math.floor(tick / 3) % waypoints.length;
            const nextIndex = (frameIndex + 1) % waypoints.length;
            const progress = (tick % 3) / 3;

            const cx = waypoints[frameIndex].x + (waypoints[nextIndex].x - waypoints[frameIndex].x) * progress;
            const cy = waypoints[frameIndex].y + (waypoints[nextIndex].y - waypoints[frameIndex].y) * progress;

            const marker = document.getElementById('busMarker' + id);
            if (marker) {
                marker.setAttribute('transform', `translate(${cx.toFixed(1)},${cy.toFixed(1)})`);
            }
        });
    }, 600);
}

/* ---- Tracking Charts (lazy) ---- */
function initTrackingCharts() {
    if (CI.ts) return;
    const c = gc();

    const ctx1 = document.getElementById('trackingSpeedChart');
    if (ctx1) {
        CI.ts = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['7:00', '7:15', '7:30', '7:45', '8:00', '8:15', '8:30', '8:45'],
                datasets: [
                    { label: 'Bus 101', data: [0, 25, 38, 42, 35, 40, 38, 20], borderColor: c.blue, backgroundColor: c.blueBg, fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2 },
                    { label: 'Bus 303', data: [0, 15, 22, 18, 25, 20, 22, 15], borderColor: c.amber, backgroundColor: 'rgba(245,158,11,0.1)', fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2 },
                    { label: 'Bus 808', data: [0, 10, 15, 12, 8, 14, 12, 10], borderColor: c.red, backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4, pointRadius: 3, borderWidth: 2 },
                    { label: 'Speed Limit (40)', data: [40, 40, 40, 40, 40, 40, 40, 40], borderColor: 'rgba(139,92,246,0.5)', borderDash: [6, 4], pointRadius: 0, fill: false, borderWidth: 1 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: lp(c) },
                scales: {
                    ...ds(),
                    y: { ...ds().y, title: { display: true, text: 'km/h', color: c.text, font: { size: 11 } } }
                }
            }
        });
    }

    const ctx2 = document.getElementById('trackingCompletionChart');
    if (ctx2) {
        CI.tc = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Not Started'],
                datasets: [{
                    data: [14, 12, 6],
                    backgroundColor: [c.green, c.blue, 'rgba(148,163,184,0.3)'],
                    borderWidth: 0,
                    spacing: 3
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '65%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: c.text, padding: 16, usePointStyle: true, pointStyle: 'circle', font: { size: 11 } } }
                }
            }
        });
    }
}

/* Spin animation for refresh button */
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
document.head.appendChild(spinStyle);

/* ============================================
   MAINTENANCE & SERVICE MODULE
   ============================================ */

function populateMaintenancePage() {
    populateUpcomingService();
    populateWorkOrders();
    populateServiceHistory();
    populatePartsInventory();
}

function populateUpcomingService() {
    const container = document.getElementById('upcomingServiceBody');
    if (!container) return;
    const services = [
        { bus: 'Bus 303', type: 'Oil Change + Filter Replacement', days: 1, urgency: 'urgent', odometer: '45,200 km', date: 'Mar 07, 2026' },
        { bus: 'Bus 505', type: 'Brake Pad Replacement', days: 2, urgency: 'urgent', odometer: '41,500 km', date: 'Mar 08, 2026' },
        { bus: 'Bus 707', type: 'Engine Tune-up & Diagnostics', days: 4, urgency: 'warning', odometer: '39,800 km', date: 'Mar 10, 2026' },
        { bus: 'Bus 101', type: 'Tyre Rotation & Alignment', days: 7, urgency: 'normal', odometer: '35,100 km', date: 'Mar 13, 2026' },
        { bus: 'Bus 606', type: 'AC Servicing & Gas Refill', days: 10, urgency: 'normal', odometer: '32,200 km', date: 'Mar 16, 2026' },
    ];
    container.innerHTML = services.map(s => `
        <div class="service-schedule-item">
            <div class="service-countdown ${s.urgency}">
                <span class="countdown-num">${s.days}</span>
                <span class="countdown-label">${s.days === 1 ? 'day' : 'days'}</span>
            </div>
            <div class="service-info">
                <div class="service-bus-name">${s.bus}</div>
                <div class="service-type">${s.type}</div>
            </div>
            <div class="service-meta-right">
                <div class="service-odometer">${s.odometer}</div>
                <div class="service-date">${s.date}</div>
            </div>
        </div>
    `).join('');
}

function populateWorkOrders() {
    const container = document.getElementById('workOrdersBody');
    if (!container) return;
    const orders = [
        { id: 'WO-2026-042', title: 'Bus 505 — Brake System Overhaul', desc: 'Front & rear brake pad replacement, rotor inspection, brake fluid flush.', assigned: 'Sunil M.', initials: 'SM', status: 'In Progress', statusClass: 'warning' },
        { id: 'WO-2026-041', title: 'Bus 707 — Engine Diagnostics', desc: 'Check engine light on. Full OBD scan, compression test, and emission check.', assigned: 'Rajan K.', initials: 'RK', status: 'Pending', statusClass: 'critical' },
        { id: 'WO-2026-040', title: 'Bus 303 — Oil & Filter Service', desc: 'Scheduled 45K km service. Engine oil, oil filter, and air filter change.', assigned: 'Vikash T.', initials: 'VT', status: 'Scheduled', statusClass: 'info' },
        { id: 'WO-2026-039', title: 'Bus 808 — Suspension Check', desc: 'Reported bumpy ride. Inspect shock absorbers, bushings, and spring assembly.', assigned: 'Deepak R.', initials: 'DR', status: 'In Progress', statusClass: 'warning' },
    ];
    container.innerHTML = orders.map(o => `
        <div class="work-order-item">
            <div class="wo-header">
                <span class="wo-id">${o.id}</span>
                <span class="status-badge ${o.statusClass}"><span class="status-dot"></span>${o.status}</span>
            </div>
            <div class="wo-title">${o.title}</div>
            <div class="wo-desc">${o.desc}</div>
            <div class="wo-footer">
                <div class="wo-assigned"><div class="wo-assigned-avatar">${o.initials}</div>${o.assigned}</div>
            </div>
        </div>
    `).join('');
}

function populateServiceHistory() {
    const rows = [
        ['Bus 101', 'Oil Change', 'Mar 01, 2026', '34,520 km', '₹3,200', 'AutoCare Sec-22', '<span class="status-badge good"><span class="status-dot"></span>Done</span>', 'Mar 13, 2026'],
        ['Bus 202', 'Tyre Replacement (2x)', 'Feb 25, 2026', '36,780 km', '₹12,400', 'Tyre Zone DLF', '<span class="status-badge good"><span class="status-dot"></span>Done</span>', 'Aug 25, 2026'],
        ['Bus 404', 'Full Service', 'Feb 20, 2026', '44,120 km', '₹8,500', 'Fleet Garage Sec-45', '<span class="status-badge good"><span class="status-dot"></span>Done</span>', 'May 20, 2026'],
        ['Bus 606', 'Battery Replacement', 'Feb 18, 2026', '31,200 km', '₹6,800', 'AutoCare Sec-22', '<span class="status-badge good"><span class="status-dot"></span>Done</span>', 'Feb 18, 2028'],
        ['Bus 808', 'Clutch Plate Replacement', 'Feb 15, 2026', '22,500 km', '₹9,200', 'SpeedFix Motors', '<span class="status-badge good"><span class="status-dot"></span>Done</span>', 'Aug 15, 2026'],
        ['Bus 303', 'Brake Service', 'Feb 10, 2026', '44,800 km', '₹4,100', 'Fleet Garage Sec-45', '<span class="status-badge good"><span class="status-dot"></span>Done</span>', 'May 10, 2026'],
        ['Bus 505', 'AC Repair', 'Feb 05, 2026', '40,600 km', '₹5,600', 'CoolTech Services', '<span class="status-badge good"><span class="status-dot"></span>Done</span>', 'May 05, 2026'],
        ['Bus 707', 'Suspension Overhaul', 'Jan 28, 2026', '38,900 km', '₹15,200', 'SpeedFix Motors', '<span class="status-badge good"><span class="status-dot"></span>Done</span>', 'Jul 28, 2026'],
    ];
    const t = document.querySelector('#serviceHistoryTable tbody');
    if (t) t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

function populatePartsInventory() {
    const container = document.getElementById('partsInventoryBody');
    if (!container) return;
    const parts = [
        { name: 'Engine Oil (15W-40)', sku: 'SKU-OIL-1540', icon: 'fa-oil-can', qty: 24, unit: 'litres', status: 'good' },
        { name: 'Oil Filter (Universal)', sku: 'SKU-FLT-001', icon: 'fa-filter', qty: 12, unit: 'pcs', status: 'good' },
        { name: 'Brake Pads (Front)', sku: 'SKU-BRK-F01', icon: 'fa-compact-disc', qty: 4, unit: 'sets', status: 'low' },
        { name: 'Air Filter Element', sku: 'SKU-FLT-AIR', icon: 'fa-wind', qty: 8, unit: 'pcs', status: 'good' },
        { name: 'Coolant (Green)', sku: 'SKU-CLT-GRN', icon: 'fa-tint', qty: 2, unit: 'litres', status: 'critical' },
        { name: 'Wiper Blades (Pair)', sku: 'SKU-WPR-001', icon: 'fa-water', qty: 6, unit: 'pairs', status: 'good' },
        { name: 'Spark Plugs', sku: 'SKU-SPK-001', icon: 'fa-bolt', qty: 3, unit: 'sets', status: 'low' },
    ];
    container.innerHTML = parts.map(p => `
        <div class="parts-row">
            <div class="parts-icon"><i class="fas ${p.icon}"></i></div>
            <div class="parts-name">
                <div class="parts-name-text">${p.name}</div>
                <div class="parts-sku">${p.sku}</div>
            </div>
            <div class="parts-stock">
                <div class="stock-qty">${p.qty} ${p.unit}</div>
                <div class="stock-status ${p.status}">${p.status === 'good' ? 'In Stock' : p.status === 'low' ? 'Low Stock' : 'Reorder Now'}</div>
            </div>
        </div>
    `).join('');
}

function initMaintenanceCostChart() {
    if (CI.mc) return;
    const ctx = document.getElementById('maintenanceCostChart'); if (!ctx) return;
    const c = gc();
    CI.mc = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            datasets: [
                { label: 'Parts', data: [28, 35, 22, 40, 32, 38], backgroundColor: c.blue, borderRadius: 6, barPercentage: 0.6 },
                { label: 'Labour', data: [15, 18, 12, 20, 16, 22], backgroundColor: c.purple, borderRadius: 6, barPercentage: 0.6 },
                { label: 'External Vendor', data: [8, 12, 18, 10, 14, 20], backgroundColor: c.amber, borderRadius: 6, barPercentage: 0.6 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: lp(c) },
            scales: {
                ...ds(),
                x: { ...ds().x, stacked: true },
                y: { ...ds().y, stacked: true, title: { display: true, text: '₹ (thousands)', color: c.text, font: { size: 11 } } }
            }
        }
    });
}

/* ============================================
   ATTENDANCE & SAFETY MODULE
   ============================================ */

function populateAttendancePage() {
    populateAttendanceTable();
    populateSafetyChecklist();
    populateEmergencyContacts();
    populateAbsentStudents();
    populateIncidentLog();
}

function populateAttendanceTable() {
    const checkBadge = '<span class="status-badge good"><span class="status-dot"></span>Checked In</span>';
    const dropBadge = '<span class="status-badge good"><span class="status-dot"></span>Dropped Off</span>';
    const transitBadge = '<span class="status-badge info"><span class="status-dot"></span>In Transit</span>';
    const pendingBadge = '<span class="status-badge warning"><span class="status-dot"></span>Pending</span>';
    const rows = [
        ['Aarav Patel', '8-B', 'Bus 101', '7:31 AM', 'Green Valley', checkBadge, dropBadge],
        ['Priya Sharma', '7-A', 'Bus 202', '7:28 AM', 'Riverside Stop 3', checkBadge, dropBadge],
        ['Rohan Gupta', '9-C', 'Bus 303', '7:42 AM', 'Old City Gate', checkBadge, transitBadge],
        ['Ananya Singh', '6-B', 'Bus 101', '7:33 AM', 'Sunshine Apts', checkBadge, dropBadge],
        ['Vikram Reddy', '10-A', 'Bus 404', '7:35 AM', 'Hill View Colony', checkBadge, transitBadge],
        ['Diya Nair', '5-A', 'Bus 606', '7:38 AM', 'Airport Rd Stop', checkBadge, transitBadge],
        ['Karthik M.', '8-A', 'Bus 808', '7:40 AM', 'MG Road Stop 2', checkBadge, pendingBadge],
        ['Sneha Joshi', '7-C', 'Bus 202', '7:29 AM', 'DLF Phase 3', checkBadge, dropBadge],
        ['Arjun Kapoor', '11-B', 'Bus 303', '7:44 AM', 'Tech Park Gate', checkBadge, transitBadge],
        ['Meera Das', '6-A', 'Bus 505', '—', '—', pendingBadge, pendingBadge],
    ];
    const t = document.querySelector('#attendanceTable tbody');
    if (t) t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

function populateSafetyChecklist() {
    const container = document.getElementById('safetyChecklistBody');
    if (!container) return;
    const checks = [
        { name: 'First Aid Kit', detail: 'All 24 buses — verified today', icon: 'fa-check-circle', status: 'passed' },
        { name: 'Fire Extinguisher', detail: 'All 24 buses — last inspected Feb 28', icon: 'fa-check-circle', status: 'passed' },
        { name: 'Emergency Exits', detail: 'All buses — tested Mar 01', icon: 'fa-check-circle', status: 'passed' },
        { name: 'CCTV Cameras', detail: '23/24 buses operational — Bus 707 camera offline', icon: 'fa-exclamation-triangle', status: 'warning' },
        { name: 'Speed Governor', detail: 'All buses — calibrated at 50 km/h', icon: 'fa-check-circle', status: 'passed' },
        { name: 'GPS Tracking Device', detail: '24/24 active — real-time tracking enabled', icon: 'fa-check-circle', status: 'passed' },
        { name: 'Driver Background Check', detail: '28/28 drivers — all verified', icon: 'fa-check-circle', status: 'passed' },
        { name: 'Vehicle Fitness Certificate', detail: '22/24 valid — Bus 505, 707 due for renewal', icon: 'fa-exclamation-triangle', status: 'warning' },
    ];
    container.innerHTML = checks.map(c => `
        <div class="safety-checklist-item">
            <div class="safety-check-icon ${c.status}"><i class="fas ${c.icon}"></i></div>
            <div class="safety-check-info">
                <div class="safety-check-name">${c.name}</div>
                <div class="safety-check-detail">${c.detail}</div>
            </div>
            <span class="status-badge ${c.status === 'passed' ? 'good' : 'warning'}"><span class="status-dot"></span>${c.status === 'passed' ? 'Compliant' : 'Action Needed'}</span>
        </div>
    `).join('');
}

function populateEmergencyContacts() {
    const container = document.getElementById('emergencyContactsBody');
    if (!container) return;
    const contacts = [
        { name: 'Police Control Room', role: 'Law Enforcement', phone: '100', icon: 'fa-shield-alt', type: 'police' },
        { name: 'Ambulance Service', role: 'Medical Emergency', phone: '108', icon: 'fa-ambulance', type: 'ambulance' },
        { name: 'Dr. Meena Kapoor', role: 'School Medical Officer', phone: '98765-43100', icon: 'fa-user-md', type: 'school' },
        { name: 'Rajesh Kumar', role: 'Fleet Administrator', phone: '98765-43210', icon: 'fa-bus', type: 'transport' },
        { name: 'Principal — Mr. Sinha', role: 'School Principal', phone: '98765-43200', icon: 'fa-school', type: 'school' },
        { name: 'RTO Helpline', role: 'Regional Transport Office', phone: '1800-180-1234', icon: 'fa-landmark', type: 'police' },
    ];
    container.innerHTML = contacts.map(c => `
        <div class="emergency-contact-item">
            <div class="emergency-avatar ${c.type}"><i class="fas ${c.icon}"></i></div>
            <div class="emergency-info">
                <div class="emergency-name">${c.name}</div>
                <div class="emergency-role">${c.role}</div>
            </div>
            <div class="emergency-phone"><i class="fas fa-phone-alt" style="font-size:11px;margin-right:4px;"></i>${c.phone}</div>
        </div>
    `).join('');
}

function populateAbsentStudents() {
    const container = document.getElementById('absentStudentsBody');
    if (!container) return;
    const absent = [
        { name: 'Meera Das', class: '6-A', bus: 'Bus 505', reason: 'informed', note: 'Medical leave' },
        { name: 'Rahul Verma', class: '8-C', bus: 'Bus 303', reason: 'uninformed', note: 'No notification' },
        { name: 'Sanya Kapoor', class: '5-B', bus: 'Bus 101', reason: 'informed', note: 'Family event' },
        { name: 'Amit Jain', class: '9-A', bus: 'Bus 404', reason: 'uninformed', note: 'No notification' },
        { name: 'Pooja Mehta', class: '7-B', bus: 'Bus 202', reason: 'informed', note: 'Sick leave' },
        { name: 'Nikhil Sharma', class: '10-B', bus: 'Bus 606', reason: 'informed', note: 'Sports tournament' },
        { name: 'Kavita Singh', class: '6-C', bus: 'Bus 808', reason: 'uninformed', note: 'No notification' },
    ];
    container.innerHTML = absent.map(a => `
        <div class="absent-student-item">
            <div class="absent-avatar">${a.name.split(' ').map(w => w[0]).join('')}</div>
            <div class="absent-info">
                <div class="absent-name">${a.name}</div>
                <div class="absent-meta">${a.class} • ${a.bus}</div>
            </div>
            <span class="absent-reason ${a.reason}">${a.reason === 'informed' ? a.note : 'Not Informed'}</span>
        </div>
    `).join('');
}

function populateIncidentLog() {
    const container = document.getElementById('incidentLogBody');
    if (!container) return;
    const incidents = [
        { severity: 'low', title: 'Minor fender scratch — Bus 808', time: 'Mar 04, 2:30 PM', desc: 'Small scratch on rear bumper while parking. No injuries. Photos documented.' },
        { severity: 'medium', title: 'Student left item on bus — Bus 202', time: 'Mar 03, 3:45 PM', desc: 'Water bottle and lunchbox left behind. Items returned to parent next day.' },
        { severity: 'low', title: 'Late departure — Bus 303', time: 'Mar 02, 7:20 AM', desc: 'Delayed by 10 min due to traffic jam at MG Road intersection.' },
        { severity: 'high', title: 'Near-miss traffic incident — Bus 707', time: 'Feb 28, 8:10 AM', desc: 'Two-wheeler cut in front suddenly. Emergency brake applied. All students safe. Dashcam footage saved.' },
        { severity: 'medium', title: 'AC malfunction — Bus 505', time: 'Feb 26, 1:00 PM', desc: 'AC stopped working during afternoon route. Temporary alternate bus arranged for affected students.' },
    ];
    container.innerHTML = incidents.map(i => `
        <div class="incident-item">
            <div class="incident-header">
                <span class="incident-severity ${i.severity}"></span>
                <span class="incident-title">${i.title}</span>
                <span class="incident-time">${i.time}</span>
            </div>
            <div class="incident-desc">${i.desc}</div>
        </div>
    `).join('');
}

function initAttendanceTrendChart() {
    if (CI.at) return;
    const ctx = document.getElementById('attendanceTrendChart'); if (!ctx) return;
    const c = gc();
    CI.at = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Feb 28', 'Mar 01', 'Mar 02', 'Mar 03', 'Mar 04', 'Mar 05', 'Mar 06'],
            datasets: [
                { label: 'Boarding Rate (%)', data: [95.2, 96.1, 94.8, 97.0, 95.5, 96.8, 96.4], borderColor: c.green, backgroundColor: c.greenBg, fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: c.green, borderWidth: 2.5 },
                { label: 'Target (95%)', data: [95, 95, 95, 95, 95, 95, 95], borderColor: 'rgba(139,92,246,0.5)', borderDash: [6, 4], pointRadius: 0, fill: false, borderWidth: 1.5 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: lp(c) },
            scales: {
                ...ds(),
                y: { ...ds().y, min: 90, max: 100, title: { display: true, text: '%', color: c.text, font: { size: 11 } } }
            }
        }
    });
}

/* ============================================
   SPECIAL TRIPS MODULE
   ============================================ */
function initTripsCostChart() {
    if (CI.trc) return;
    const ctx = document.getElementById('tripsCostChart'); if (!ctx) return;
    const c = gc();
    CI.trc = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Fuel Extra', 'Driver Allowance', 'Permits', 'Profit Margin'],
            datasets: [{
                data: [15.2, 8.5, 4.0, 17.5],
                backgroundColor: [c.red, c.amber, c.purple, c.green],
                borderWidth: 0,
                spacing: 3
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '65%',
            plugins: {
                legend: { position: 'right', labels: { color: c.text, padding: 16, usePointStyle: true, pointStyle: 'circle', font: { size: 11 } } }
            }
        }
    });
}

/* ============================================
   ADMIN & COMPLIANCE (VAULT & VENDORS)
   ============================================ */
function populateVaultPage() {
    const t = document.querySelector('#vaultTable tbody');
    if (!t) return;
    const docBadge = s => s === 'Valid' ? '<span class="status-badge good"><span class="status-dot"></span>Valid</span>' : s === 'Expiring' ? '<span class="status-badge warning"><span class="status-dot"></span>Expiring Soon</span>' : '<span class="status-badge critical"><span class="status-dot"></span>Expired</span>';
    const rows = [
        ['Bus 101 - Tata Starbus', 'Vehicle Insurance', 'Jan 15, 2025', 'Jan 14, 2026', docBadge('Valid'), '<button class="btn btn-sm btn-secondary"><i class="fas fa-download"></i></button>'],
        ['Bus 202 - Ashok Leyland', 'Fitness Certificate', 'Mar 01, 2025', 'Feb 28, 2026', docBadge('Valid'), '<button class="btn btn-sm btn-secondary"><i class="fas fa-download"></i></button>'],
        ['Ramesh Sharma (Driver)', 'Driving License', 'May 10, 2016', 'May 09, 2026', docBadge('Valid'), '<button class="btn btn-sm btn-secondary"><i class="fas fa-download"></i></button>'],
        ['Bus 505 - Tata Starbus', 'Pollution Under Control', 'Sep 20, 2025', 'Mar 20, 2026', docBadge('Expiring'), '<button class="btn btn-sm btn-secondary"><i class="fas fa-download"></i></button>'],
        ['Bus 707 - Ashok Leyland', 'Road Tax Receipt', 'Apr 01, 2025', 'Mar 31, 2026', docBadge('Expiring'), '<button class="btn btn-sm btn-secondary"><i class="fas fa-download"></i></button>'],
        ['Kumar Naidu (Driver)', 'Driving License', 'Feb 15, 2011', 'Feb 14, 2026', docBadge('Expired'), '<button class="btn btn-sm btn-secondary"><i class="fas fa-download"></i></button>'],
        ['Bus 404 - BharatBenz', 'Vehicle Insurance', 'Dec 05, 2025', 'Dec 04, 2026', docBadge('Valid'), '<button class="btn btn-sm btn-secondary"><i class="fas fa-download"></i></button>']
    ];
    t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

function populateVendorsPage() {
    const t = document.querySelector('#vendorTable tbody');
    if (!t) return;
    const statBadge = s => s === 'Active' ? '<span class="status-badge good"><span class="status-dot"></span>Active</span>' : '<span class="status-badge warning"><span class="status-dot"></span>On Hold</span>';
    const star = r => { let s = ''; for (let i = 0; i < 5; i++) s += `<i class="fas fa-star" style="color:${i < Math.round(r) ? '#f59e0b' : 'var(--gray-300)'};font-size:11px;"></i>`; return `${s} <span style="font-size:12px;font-weight:600;margin-left:4px">${r}</span>`; };
    const rows = [
        ['Indian Oil - Sec 22', 'Fuel Station', star(4.8), '₹45,200', statBadge('Active')],
        ['AutoCare Sec-22', 'Service Garage', star(4.5), '₹12,400', statBadge('Active')],
        ['HP Petrol - MG Rd', 'Fuel Station', star(4.2), '₹38,000', statBadge('Active')],
        ['Fleet Garage Sec-45', 'Service Garage', star(4.6), '₹5,500', statBadge('Active')],
        ['Tyre Zone DLF', 'Spare Parts', star(4.9), '₹0', statBadge('Active')],
        ['SpeedFix Motors', 'Service Garage', star(3.8), '₹22,100', statBadge('On Hold')],
        ['BPCL - Civil Lines', 'Fuel Station', star(4.4), '₹18,500', statBadge('Active')]
    ];
    t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

function initVendorSpendChart() {
    if (CI.vsc) return;
    const ctx = document.getElementById('vendorSpendChart'); if (!ctx) return;
    const c = gc();
    CI.vsc = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            datasets: [
                { label: 'Fuel Spend (₹L)', data: [3.8, 4.0, 4.2, 4.1, 4.5, 4.8], backgroundColor: c.blue, borderRadius: 4 },
                { label: 'Service/Spares Spend (₹L)', data: [1.2, 1.5, 0.8, 1.1, 1.4, 1.6], backgroundColor: c.purple, borderRadius: 4 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: lp(c) },
            scales: ds()
        }
    });
}

/* ============================================
   HR & PAYROLL MODULE
   ============================================ */
function populateHRPage() {
    const t = document.querySelector('#hrTable tbody');
    if (!t) return;
    const sBadge = s => s === 'Present' ? '<span class="status-badge good"><span class="status-dot"></span>Present</span>' : s === 'On Leave' ? '<span class="status-badge warning"><span class="status-dot"></span>On Leave</span>' : '<span class="status-badge critical"><span class="status-dot"></span>Absent</span>';
    const rows = [
        ['Suresh Kumar', 'Driver (Route 1)', 'Morning & Afternoon', '98%', sBadge('Present')],
        ['Ramesh Sharma', 'Driver (Route 4)', 'Morning & Afternoon', '95%', sBadge('Present')],
        ['Rajeev Singh', 'Mechanic', 'Full Day (Garage)', '92%', sBadge('On Leave')],
        ['Preeti Verma', 'Attendant (Bus 101)', 'Morning & Afternoon', '99%', sBadge('Present')],
        ['Amit Patel', 'Driver (Backup)', 'Standby', '88%', sBadge('Absent')]
    ];
    t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

function initPayrollChart() {
    if (CI.prc) return;
    const ctx = document.getElementById('payrollChart'); if (!ctx) return;
    const c = gc();
    CI.prc = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            datasets: [
                { label: 'Basic Salary (₹L)', data: [5.2, 5.2, 5.2, 5.4, 5.4, 5.4], backgroundColor: c.blue, stacked: true },
                { label: 'Overtime/Allowances (₹L)', data: [1.8, 2.1, 1.5, 2.0, 1.9, 2.2], backgroundColor: c.green, stacked: true },
                { label: 'Bonuses (₹L)', data: [0.5, 0, 1.2, 0, 0, 0.8], backgroundColor: c.yellow, stacked: true }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: lp(c) },
            scales: {
                x: { ...ds().x, stacked: true },
                y: { ...ds().y, stacked: true }
            }
        }
    });
}

/* ============================================
   ROUTE OPTIMIZER (AI) SIMULATION
   ============================================ */
function initOptimizerSim() {
    const btn = document.getElementById('btn-run-optimizer');
    if (!btn) return;
    btn.addEventListener('click', () => {
        document.getElementById('optimizer-results').style.display = 'none';
        document.getElementById('optimizer-status').style.display = 'block';
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';

        setTimeout(() => {
            document.getElementById('optimizer-status').style.display = 'none';
            document.getElementById('optimizer-results').style.display = 'block';
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-magic"></i> Re-run Optimizer';
        }, 2500);
    });
}

/* ============================================
   INCIDENTS & ACCIDENTS MODULE
   ============================================ */
function populateIncidentsPage() {
    const t = document.querySelector('#incidentsTable tbody');
    if (!t) return;
    const sBadge = s => s === 'Resolved' ? '<span class="status-badge good"><span class="status-dot"></span>Resolved</span>' : s === 'Under Review' ? '<span class="status-badge warning"><span class="status-dot"></span>Under Review</span>' : '<span class="status-badge critical"><span class="status-dot"></span>Open</span>';
    const rows = [
        ['Mar 05, 08:30 AM', 'Minor Collision', 'MG Road / Route 4', 'Bus 404 / Suresh K.', 'Medium', sBadge('Under Review')],
        ['Mar 02, 14:15 PM', 'Breakdown', 'NH-8 Highway / Route 7', 'Bus 202 / Ramesh S.', 'High', sBadge('Resolved')],
        ['Feb 28, 07:45 AM', 'Behavioral (Student)', 'Sector 14 / Route 1', 'Bus 101 / Anil T.', 'Low', sBadge('Resolved')],
        ['Feb 22, 15:30 PM', 'Flat Tire', 'Golf Course Rd / Route 2', 'Bus 505 / Naidu K.', 'Low', sBadge('Resolved')],
        ['Feb 15, 08:00 AM', 'Traffic Violation', 'Cyber City / Route 5', 'Bus 707 / Vikas M.', 'Medium', sBadge('Open')]
    ];
    t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

/* ============================================
   PARTS & INVENTORY MODULE
   ============================================ */
function populateInventoryPage() {
    const t = document.querySelector('#inventoryTable tbody');
    if (!t) return;
    const sBadge = s => s === 'Good' ? '<span class="status-badge good"><span class="status-dot"></span>Good</span>' : s === 'Low Stock' ? '<span class="status-badge warning"><span class="status-dot"></span>Low Stock</span>' : '<span class="status-badge critical"><span class="status-dot"></span>Out of Stock</span>';
    const rows = [
        ['Engine Oil (15W-40) [L]', 'Consumables', '120 L', sBadge('Good'), '<button class="btn btn-sm btn-secondary"><i class="fas fa-edit"></i></button>'],
        ['Brake Pads (Front) [Set]', 'Spares', '4 Sets', sBadge('Low Stock'), '<button class="btn btn-sm btn-secondary"><i class="fas fa-edit"></i></button>'],
        ['Wiper Blades (24in) [pcs]', 'Spares', '22 pcs', sBadge('Good'), '<button class="btn btn-sm btn-secondary"><i class="fas fa-edit"></i></button>'],
        ['Radiator Coolant [L]', 'Consumables', '0 L', sBadge('Out of Stock'), '<button class="btn btn-sm btn-secondary"><i class="fas fa-edit"></i></button>'],
        ['Headlight Bulbs (H4) [pcs]', 'Electrical', '12 pcs', sBadge('Good'), '<button class="btn btn-sm btn-secondary"><i class="fas fa-edit"></i></button>'],
        ['Tires (295/80R22.5) [pcs]', 'Tires & Wheels', '2 pcs', sBadge('Low Stock'), '<button class="btn btn-sm btn-secondary"><i class="fas fa-edit"></i></button>']
    ];
    t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

function initInventoryChart() {
    if (CI.ivc) return;
    const ctx = document.getElementById('inventoryChart'); if (!ctx) return;
    const c = gc();
    CI.ivc = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Spares', 'Consumables', 'Tires', 'Electrical'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [c.blue, c.purple, c.amber, c.green],
                borderWidth: 0,
                spacing: 3
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '70%',
            plugins: {
                legend: { position: 'right', labels: { color: c.text, padding: 16, usePointStyle: true, pointStyle: 'circle', font: { size: 11 } } }
            }
        }
    });
}

/* ============================================
   IT & HARDWARE DEVICES MODULE
   ============================================ */
function populateDevicesPage() {
    const t = document.querySelector('#devicesTable tbody');
    if (!t) return;
    const sBadge = s => s === 'Online' ? '<span class="status-badge good"><span class="status-dot"></span>Online</span>' : s === 'Weak Signal' ? '<span class="status-badge warning"><span class="status-dot"></span>Weak Signal</span>' : '<span class="status-badge critical"><span class="status-dot"></span>Offline</span>';
    const rows = [
        ['GPS-TRK-101', 'Bus 101', 'Just now', 'v2.4.1', sBadge('Online')],
        ['CAM-DSH-202', 'Bus 202', '2 mins ago', 'v1.8.0', sBadge('Online')],
        ['RFID-SCN-505', 'Bus 505', '14 mins ago', 'v3.0.2', sBadge('Weak Signal')],
        ['GPS-TRK-707', 'Bus 707', 'Just now', 'v2.4.1', sBadge('Online')],
        ['CAM-DSH-404', 'Bus 404', '3 hours ago', 'v1.7.9', sBadge('Offline')]
    ];
    t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

/* ============================================
   DRIVER PERFORMANCE MODULE
   ============================================ */
function populatePerformancePage() {
    const t = document.querySelector('#performanceTable tbody');
    if (!t) return;
    const badge = (s, cls) => `<span class="status-badge ${cls}">${s}</span>`;
    const rows = [
        ['Suresh Kumar', '98 / 100', badge('Low Risk', 'good'), '<button class="btn btn-sm btn-secondary">View Profile</button>'],
        ['Anil Tiwari', '94 / 100', badge('Low Risk', 'good'), '<button class="btn btn-sm btn-secondary">View Profile</button>'],
        ['Ramesh Sharma', '82 / 100', badge('Medium Risk', 'warning'), '<button class="btn btn-sm btn-secondary">View Profile</button>'],
        ['Vikas Mishra', '65 / 100', badge('High Risk', 'critical'), '<button class="btn btn-sm btn-danger">Schedule Training</button>'],
        ['Naidu K.', '91 / 100', badge('Low Risk', 'good'), '<button class="btn btn-sm btn-secondary">View Profile</button>']
    ];
    t.innerHTML = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
}

function initSafetyTrendChart() {
    if (CI.stc) return;
    const ctx = document.getElementById('safetyTrendChart'); if (!ctx) return;
    const c = gc();
    CI.stc = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [{
                label: 'Avg Safety Score',
                data: [88, 89, 87, 91, 92],
                borderColor: c.purple, backgroundColor: c.purpleBg,
                fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: c.purple, borderWidth: 2.5
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                ...ds(),
                y: { ...ds().y, min: 80, max: 100 }
            }
        }
    });
}

/* ============================================
   PARENT PORTAL MODULE
   ============================================ */

function populateParentPortalPage() {
    const pickupData = [
        { student: 'Aarav Patel', cls: '8-B', bus: 'Bus 101', pickup: '7:15 AM', drop: '2:30 PM', status: 'good', statusText: 'On Time' },
        { student: 'Priya Sharma', cls: '7-A', bus: 'Bus 202', pickup: '7:20 AM', drop: '2:35 PM', status: 'good', statusText: 'On Time' },
        { student: 'Rohan Gupta', cls: '9-C', bus: 'Bus 303', pickup: '7:10 AM', drop: '2:25 PM', status: 'warning', statusText: 'Delayed' },
        { student: 'Ananya Singh', cls: '6-B', bus: 'Bus 101', pickup: '7:18 AM', drop: '2:32 PM', status: 'good', statusText: 'On Time' },
        { student: 'Vikram Reddy', cls: '10-A', bus: 'Bus 404', pickup: '7:25 AM', drop: '—', status: 'critical', statusText: 'Absent' },
        { student: 'Diya Nair', cls: '5-A', bus: 'Bus 606', pickup: '7:05 AM', drop: '2:20 PM', status: 'good', statusText: 'On Time' },
        { student: 'Karthik M.', cls: '8-A', bus: 'Bus 808', pickup: '7:22 AM', drop: '2:38 PM', status: 'good', statusText: 'On Time' },
        { student: 'Sneha Joshi', cls: '7-C', bus: 'Bus 202', pickup: '7:19 AM', drop: '2:34 PM', status: 'good', statusText: 'On Time' },
    ];
    const pt = document.querySelector('#parentPickupTable tbody');
    if (pt) pt.innerHTML = pickupData.map(d => `<tr>
        <td>${d.student}</td><td>${d.cls}</td><td>${d.bus}</td><td>${d.pickup}</td><td>${d.drop}</td>
        <td><span class="status-badge ${d.status}"><span class="status-dot"></span>${d.statusText}</span></td>
    </tr>`).join('');

    const receipts = [
        { id: 'REC-2026-1245', student: 'Aarav Patel', amount: '\u20b93,250', date: 'Mar 01, 2026', mode: 'Online' },
        { id: 'REC-2026-1244', student: 'Priya Sharma', amount: '\u20b92,800', date: 'Mar 01, 2026', mode: 'Cash' },
        { id: 'REC-2026-1240', student: 'Diya Nair', amount: '\u20b93,800', date: 'Feb 28, 2026', mode: 'Cheque' },
        { id: 'REC-2026-1238', student: 'Karthik M.', amount: '\u20b92,400', date: 'Feb 28, 2026', mode: 'Online' },
    ];
    const fr = document.getElementById('parentFeeReceipts');
    if (fr) fr.innerHTML = receipts.map(r => `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-light)">
        <div>
            <div style="font-weight:600;font-size:13px;color:var(--text-primary)">${r.id} \u2014 ${r.student}</div>
            <div style="font-size:12px;color:var(--text-tertiary)">${r.date} \u00b7 ${r.mode}</div>
        </div>
        <div style="font-weight:700;color:var(--success-500)">${r.amount}</div>
    </div>`).join('');

    const feedbackItems = [
        { parent: 'Mrs. Meena Patel', rating: 5, text: 'Very happy with the bus service. Driver is punctual.', time: '2 days ago' },
        { parent: 'Mr. Raj Sharma', rating: 4, text: 'Good service, but bus was late twice last week.', time: '3 days ago' },
        { parent: 'Mrs. Sunita Gupta', rating: 3, text: 'AC not working properly in Bus 303.', time: '5 days ago' },
    ];
    const fb = document.getElementById('parentFeedback');
    if (fb) fb.innerHTML = feedbackItems.map(f => {
        const stars = Array.from({ length: 5 }, (_, i) => `<i class="fas fa-star" style="color:${i < f.rating ? '#f59e0b' : 'var(--gray-300)'};font-size:11px;"></i>`).join('');
        return `<div style="padding:12px 0;border-bottom:1px solid var(--border-light)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <div style="font-weight:600;font-size:13px;color:var(--text-primary)">${f.parent}</div>
                <div>${stars}</div>
            </div>
            <div style="font-size:13px;color:var(--text-secondary)">${f.text}</div>
            <div style="font-size:11px;color:var(--text-tertiary);margin-top:4px">${f.time}</div>
        </div>`;
    }).join('');
}

function initParentPortalCharts() {
    if (CI.pe) return;
    const c = gc();
    const pe = document.getElementById('parentEngagementChart');
    if (pe) {
        CI.pe = new Chart(pe, {
            type: 'line',
            data: {
                labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
                datasets: [
                    { label: 'Daily Active Users', data: [420, 480, 510, 560, 620, 680], borderColor: c.blue, backgroundColor: c.blueBg, fill: true, tension: 0.4, pointRadius: 4 },
                    { label: 'Notifications Read', data: [380, 410, 450, 510, 580, 640], borderColor: c.green, backgroundColor: c.greenBg, fill: true, tension: 0.4, pointRadius: 4 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: lp(c) }, scales: ds() }
        });
    }
    const fc = document.getElementById('feedbackCategoryChart');
    if (fc) {
        CI.fc = new Chart(fc, {
            type: 'doughnut',
            data: {
                labels: ['Punctuality', 'Driver Behavior', 'Bus Condition', 'Route Issues', 'Fee Queries'],
                datasets: [{ data: [35, 20, 18, 15, 12], backgroundColor: [c.blue, c.green, c.amber, c.red, c.purple], borderWidth: 0, spacing: 3 }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { color: c.text, padding: 12, usePointStyle: true, pointStyle: 'circle' } } } }
        });
    }
}

/* ============================================
   EXAM & TIMETABLE MODULE
   ============================================ */

function populateExamTimetablePage() {
    const examData = [
        { date: 'Mar 10', exam: 'Unit Test 4 \u2014 Maths', classes: '6-8', pickup: '7:00 AM', drop: '11:30 AM', routes: '14/18', status: 'good', statusText: 'Confirmed' },
        { date: 'Mar 12', exam: 'Unit Test 4 \u2014 Science', classes: '6-8', pickup: '7:00 AM', drop: '11:30 AM', routes: '14/18', status: 'good', statusText: 'Confirmed' },
        { date: 'Mar 15', exam: 'Pre-Board \u2014 English', classes: '10, 12', pickup: '7:30 AM', drop: '12:30 PM', routes: '8/18', status: 'warning', statusText: 'Pending' },
        { date: 'Mar 17', exam: 'Pre-Board \u2014 Maths', classes: '10, 12', pickup: '7:30 AM', drop: '12:30 PM', routes: '8/18', status: 'warning', statusText: 'Pending' },
        { date: 'Mar 22', exam: 'Annual Exam Day 1', classes: 'All', pickup: '7:00 AM', drop: '1:00 PM', routes: '18/18', status: 'critical', statusText: 'Draft' },
        { date: 'Mar 24', exam: 'Annual Exam Day 2', classes: 'All', pickup: '7:00 AM', drop: '1:00 PM', routes: '18/18', status: 'critical', statusText: 'Draft' },
    ];
    const et = document.querySelector('#examScheduleTable tbody');
    if (et) et.innerHTML = examData.map(d => `<tr>
        <td style="font-weight:600">${d.date}</td><td>${d.exam}</td><td>${d.classes}</td>
        <td>${d.pickup}</td><td>${d.drop}</td><td>${d.routes}</td>
        <td><span class="status-badge ${d.status}"><span class="status-dot"></span>${d.statusText}</span></td>
    </tr>`).join('');

    const changes = [
        { text: 'Pre-Board pickup time changed from 7:00 AM to 7:30 AM', time: 'Today, 10:15 AM', color: 'var(--warning-500)' },
        { text: 'Annual Exam route allocation updated \u2014 all 18 routes active', time: 'Yesterday, 4:30 PM', color: 'var(--primary-500)' },
        { text: 'Unit Test 4 schedule confirmed by Principal', time: 'Mar 04, 11:00 AM', color: 'var(--success-500)' },
    ];
    const tc = document.getElementById('timetableChanges');
    if (tc) tc.innerHTML = changes.map(ch => `<div style="border-left:4px solid ${ch.color};background:var(--bg-surface);padding:12px;margin-bottom:10px;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
        <div style="font-weight:600;font-size:13px;color:var(--text-primary);margin-bottom:4px">${ch.text}</div>
        <div style="font-size:12px;color:var(--text-tertiary)">${ch.time}</div>
    </div>`).join('');
}

/* ============================================
   GPS GEOFENCING MODULE
   ============================================ */

function populateGeofencingPage() {
    const zones = [
        { name: 'DPS School Campus', type: 'School Zone', radius: '200m', speed: '15 km/h', buses: '24/24', status: 'good', statusText: 'Active' },
        { name: 'Sector 22 Residential', type: 'Safe Zone', radius: '500m', speed: '30 km/h', buses: '6/6', status: 'good', statusText: 'Active' },
        { name: 'NH-48 Highway Section', type: 'Speed Zone', radius: '2 km', speed: '50 km/h', buses: '8/8', status: 'good', statusText: 'Active' },
        { name: 'Railway Crossing - MG Rd', type: 'Caution Zone', radius: '150m', speed: '10 km/h', buses: '4/4', status: 'warning', statusText: 'Alert' },
        { name: 'IT Park Drop Zone', type: 'Safe Zone', radius: '300m', speed: '20 km/h', buses: '5/5', status: 'good', statusText: 'Active' },
        { name: 'Civil Lines Market', type: 'Speed Zone', radius: '400m', speed: '25 km/h', buses: '3/3', status: 'good', statusText: 'Active' },
        { name: 'Lake Road School Zone', type: 'School Zone', radius: '200m', speed: '15 km/h', buses: '4/4', status: 'good', statusText: 'Active' },
        { name: 'DLF Phase 3 Colony', type: 'Safe Zone', radius: '600m', speed: '25 km/h', buses: '5/5', status: 'good', statusText: 'Active' },
    ];
    const gt = document.querySelector('#geofenceTable tbody');
    if (gt) gt.innerHTML = zones.map(z => {
        const colorMap = { 'School Zone': 'primary', 'Speed Zone': 'warning', 'Caution Zone': 'danger', 'Safe Zone': 'success' };
        const tc = colorMap[z.type] || 'primary';
        return `<tr>
            <td style="font-weight:600">${z.name}</td>
            <td><span class="status-badge" style="background:var(--${tc}-50);color:var(--${tc}-600);border:1px solid var(--${tc}-200)">${z.type}</span></td>
            <td>${z.radius}</td><td>${z.speed}</td><td>${z.buses}</td>
            <td><span class="status-badge ${z.status}"><span class="status-dot"></span>${z.statusText}</span></td>
            <td><button class="btn btn-sm btn-secondary"><i class="fas fa-edit"></i></button></td>
        </tr>`;
    }).join('');

    const violations = [
        { bus: 'Bus 303', zone: 'DPS School Campus', type: 'Speed', detail: '28 km/h in 15 km/h zone', time: 'Today, 7:42 AM', color: 'var(--danger-500)' },
        { bus: 'Bus 707', zone: 'Railway Crossing', type: 'Speed', detail: '22 km/h in 10 km/h zone', time: 'Today, 7:38 AM', color: 'var(--danger-500)' },
        { bus: 'Bus 404', zone: 'NH-48 Highway', type: 'Route Deviation', detail: 'Left geofenced corridor for 3.2 km', time: 'Today, 7:25 AM', color: 'var(--warning-500)' },
        { bus: 'Bus 505', zone: 'Sector 22', type: 'Unauthorized Stop', detail: 'Stopped outside designated zone for 8 mins', time: 'Yesterday, 2:15 PM', color: 'var(--warning-500)' },
        { bus: 'Bus 101', zone: 'Civil Lines', type: 'Speed', detail: '35 km/h in 25 km/h zone', time: 'Yesterday, 7:55 AM', color: 'var(--danger-500)' },
    ];
    const gv = document.getElementById('geofenceViolations');
    if (gv) gv.innerHTML = violations.map(v => `<div style="border-left:4px solid ${v.color};background:var(--bg-surface);padding:12px;margin-bottom:10px;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <div style="font-weight:600;font-size:13px;color:var(--text-primary)">${v.bus} \u2014 ${v.type}</div>
            <span class="status-badge critical" style="font-size:10px"><span class="status-dot"></span>${v.type}</span>
        </div>
        <div style="font-size:12px;color:var(--text-secondary)">${v.detail}</div>
        <div style="font-size:11px;color:var(--text-tertiary);margin-top:4px">${v.zone} \u00b7 ${v.time}</div>
    </div>`).join('');
}

function initGeofenceViolationsChart() {
    if (CI.gv) return;
    const ctx = document.getElementById('geofenceViolationsChart');
    if (!ctx) return;
    const c = gc();
    CI.gv = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [
                { label: 'Speed Violations', data: [3, 2, 4, 1, 3, 2], backgroundColor: c.red, borderRadius: 4, barPercentage: 0.7 },
                { label: 'Route Deviations', data: [1, 1, 0, 2, 1, 0], backgroundColor: c.amber, borderRadius: 4, barPercentage: 0.7 },
                { label: 'Zone Exits', data: [0, 1, 1, 0, 1, 1], backgroundColor: c.blue, borderRadius: 4, barPercentage: 0.7 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: lp(c) }, scales: { ...ds(), x: { ...ds().x, stacked: true }, y: { ...ds().y, stacked: true } } }
    });
}

/* ============================================
   FUEL ANALYTICS MODULE
   ============================================ */

function populateFuelAnalyticsPage() {
    const anomalies = [
        { bus: 'Bus 505', date: 'Mar 05', expected: '38', actual: '52', deviation: '+36.8%', type: 'Suspected Theft', status: 'critical', statusText: 'Investigating' },
        { bus: 'Bus 707', date: 'Mar 04', expected: '42', actual: '55', deviation: '+31.0%', type: 'Excess Consumption', status: 'warning', statusText: 'Under Review' },
        { bus: 'Bus 303', date: 'Mar 03', expected: '58', actual: '72', deviation: '+24.1%', type: 'Route Deviation', status: 'warning', statusText: 'Noted' },
    ];
    const at = document.querySelector('#fuelAnomalyTable tbody');
    if (at) at.innerHTML = anomalies.map(a => `<tr>
        <td style="font-weight:600">${a.bus}</td><td>${a.date}</td><td>${a.expected}</td><td>${a.actual}</td>
        <td style="font-weight:700;color:var(--danger-500)">${a.deviation}</td>
        <td><span class="status-badge ${a.status}" style="font-size:11px"><span class="status-dot"></span>${a.type}</span></td>
        <td><span class="status-badge ${a.status}"><span class="status-dot"></span>${a.statusText}</span></td>
    </tr>`).join('');

    const insights = [
        { icon: 'fa-route', title: 'Optimize Route 4', desc: 'Shorten by 2.3 km \u2192 Save \u20b98,400/month in fuel', color: 'var(--success-500)' },
        { icon: 'fa-tachometer-alt', title: 'Speed Compliance', desc: 'Enforce 40 km/h limit \u2192 12% fuel efficiency gain', color: 'var(--primary-500)' },
        { icon: 'fa-gas-pump', title: 'Bulk Fuel Purchase', desc: 'Partner with Indian Oil for \u20b92.50/L discount \u2192 \u20b915,000/month savings', color: 'var(--warning-500)' },
        { icon: 'fa-wrench', title: 'Engine Tune-up', desc: 'Bus 505 & 707 need urgent service \u2192 18% efficiency drop detected', color: 'var(--danger-500)' },
    ];
    const si = document.getElementById('fuelSavingsInsights');
    if (si) si.innerHTML = insights.map(ins => `<div style="display:flex;gap:12px;align-items:flex-start;padding:14px 0;border-bottom:1px solid var(--border-light)">
        <div style="width:36px;height:36px;border-radius:8px;background:${ins.color}15;display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fas ${ins.icon}" style="color:${ins.color};font-size:14px"></i></div>
        <div>
            <div style="font-weight:600;font-size:13px;color:var(--text-primary)">${ins.title}</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${ins.desc}</div>
        </div>
    </div>`).join('');
}

function initFuelAnalyticsCharts() {
    const c = gc();
    if (!CI.fct) {
        const ctx = document.getElementById('fuelConsumptionTrendChart');
        if (ctx) {
            CI.fct = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    datasets: [
                        { label: 'Fleet Average (L)', data: [285, 290, 275, 295, 288, 270], borderColor: c.blue, backgroundColor: c.blueBg, fill: true, tension: 0.4, pointRadius: 5, borderWidth: 2.5 },
                        { label: 'Expected (L)', data: [280, 280, 280, 280, 280, 280], borderColor: c.green, borderDash: [6, 4], pointRadius: 0, fill: false, borderWidth: 2 },
                        { label: 'Bus 505 (L)', data: [52, 55, 48, 58, 54, 50], borderColor: c.red, tension: 0.4, pointRadius: 4, borderWidth: 2 }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: lp(c) }, scales: ds() }
            });
        }
    }
    if (!CI.fck) {
        const ctx2 = document.getElementById('fuelCostPerKmChart');
        if (ctx2) {
            CI.fck = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['Bus 101', 'Bus 202', 'Bus 303', 'Bus 404', 'Bus 505', 'Bus 606', 'Bus 707', 'Bus 808'],
                    datasets: [{
                        label: 'Cost/km (\u20b9)',
                        data: [14.8, 15.2, 16.8, 15.5, 19.2, 14.1, 18.5, 13.9],
                        backgroundColor: function (ctx) { return ctx.raw > 17 ? c.red : ctx.raw > 15 ? c.amber : c.green; },
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { ...ds(), y: { ...ds().y, title: { display: true, text: 'Cost per KM (\u20b9)', color: c.text, font: { size: 11 } } } }
                }
            });
        }
    }
}

/* ============================================
   COMPLIANCE & AUDIT MODULE
   ============================================ */

function populateCompliancePage() {
    const complianceData = [
        { bus: 'Bus 101', insurance: 'Valid', permit: 'Valid', puc: 'Valid', fitness: 'Valid', license: 'Valid', score: 100 },
        { bus: 'Bus 202', insurance: 'Valid', permit: 'Valid', puc: 'Expiring', fitness: 'Valid', license: 'Valid', score: 90 },
        { bus: 'Bus 303', insurance: 'Valid', permit: 'Expiring', puc: 'Valid', fitness: 'Expired', license: 'Valid', score: 70 },
        { bus: 'Bus 404', insurance: 'Valid', permit: 'Valid', puc: 'Valid', fitness: 'Valid', license: 'Expiring', score: 85 },
        { bus: 'Bus 505', insurance: 'Expired', permit: 'Valid', puc: 'Expired', fitness: 'Valid', license: 'Valid', score: 60 },
        { bus: 'Bus 606', insurance: 'Valid', permit: 'Valid', puc: 'Valid', fitness: 'Valid', license: 'Valid', score: 100 },
        { bus: 'Bus 707', insurance: 'Valid', permit: 'Expiring', puc: 'Valid', fitness: 'Valid', license: 'Expired', score: 65 },
        { bus: 'Bus 808', insurance: 'Valid', permit: 'Valid', puc: 'Valid', fitness: 'Valid', license: 'Valid', score: 100 },
    ];
    const badgeFn = function (s) { return s === 'Valid' ? '<span class="status-badge good"><span class="status-dot"></span>Valid</span>' : s === 'Expiring' ? '<span class="status-badge warning"><span class="status-dot"></span>Expiring</span>' : '<span class="status-badge critical"><span class="status-dot"></span>Expired</span>'; };
    const scoreBadge = function (s) {
        const cls = s >= 90 ? 'green' : s >= 70 ? 'amber' : 'red';
        return '<div style="display:flex;align-items:center;gap:8px"><div class="progress-bar" style="width:60px"><div class="progress-fill ' + cls + '" style="width:' + s + '%"></div></div><span style="font-weight:700;font-size:12px;color:var(--text-primary)">' + s + '%</span></div>';
    };
    const ct = document.querySelector('#complianceTable tbody');
    if (ct) ct.innerHTML = complianceData.map(d => `<tr>
        <td style="font-weight:600">${d.bus}</td>
        <td>${badgeFn(d.insurance)}</td><td>${badgeFn(d.permit)}</td><td>${badgeFn(d.puc)}</td>
        <td>${badgeFn(d.fitness)}</td><td>${badgeFn(d.license)}</td><td>${scoreBadge(d.score)}</td>
    </tr>`).join('');

    const auditItems = [
        { action: 'Insurance renewed for Bus 202', user: 'Rajesh Kumar', time: 'Today, 11:30 AM', icon: 'fa-shield-alt', color: 'var(--success-500)' },
        { action: 'PUC test scheduled for Bus 505', user: 'Admin', time: 'Yesterday, 3:15 PM', icon: 'fa-calendar-check', color: 'var(--primary-500)' },
        { action: 'Fitness certificate expired \u2014 Bus 303', user: 'System', time: 'Mar 02, 9:00 AM', icon: 'fa-exclamation-triangle', color: 'var(--danger-500)' },
        { action: 'RTO inspection cleared \u2014 Bus 606', user: 'Vijay M.', time: 'Feb 28, 4:00 PM', icon: 'fa-check-circle', color: 'var(--success-500)' },
        { action: 'Driver license renewal reminder \u2014 Bus 707', user: 'System', time: 'Feb 26, 10:00 AM', icon: 'fa-id-card', color: 'var(--warning-500)' },
    ];
    const al = document.getElementById('auditTrailList');
    if (al) al.innerHTML = auditItems.map(a => `<div style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--border-light)">
        <div style="width:32px;height:32px;border-radius:8px;background:${a.color}15;display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fas ${a.icon}" style="color:${a.color};font-size:13px"></i></div>
        <div style="flex:1">
            <div style="font-weight:600;font-size:13px;color:var(--text-primary)">${a.action}</div>
            <div style="font-size:11px;color:var(--text-tertiary);margin-top:2px">by ${a.user} \u00b7 ${a.time}</div>
        </div>
    </div>`).join('');
}

function initComplianceScoreChart() {
    if (CI.cs) return;
    const ctx = document.getElementById('complianceScoreChart');
    if (!ctx) return;
    const c = gc();
    CI.cs = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Fully Compliant', 'Expiring Soon', 'Non-Compliant'],
            datasets: [{
                data: [5, 2, 1],
                backgroundColor: [c.green, c.amber, c.red],
                borderWidth: 0,
                spacing: 3
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '65%',
            plugins: { legend: { position: 'bottom', labels: { color: c.text, padding: 14, usePointStyle: true, pointStyle: 'circle' } } }
        }
    });
}

/* ============================================
   HELP DESK & TICKETING MODULE
   ============================================ */

function populateHelpdeskPage() {
    const tickets = [
        { id: 'TKT-2026-0089', subject: 'Bus 303 AC not working', from: 'Mrs. Sunita Gupta (Parent)', priority: 'High', priorityCls: 'critical', status: 'Open', statusCls: 'critical', assigned: 'Maintenance Team', age: '2h' },
        { id: 'TKT-2026-0088', subject: 'Late pickup \u2014 Sector 22 route', from: 'Mr. Raj Sharma (Parent)', priority: 'High', priorityCls: 'critical', status: 'In Progress', statusCls: 'warning', assigned: 'Route Manager', age: '5h' },
        { id: 'TKT-2026-0087', subject: 'Fee receipt not generated', from: 'Mrs. Anita Reddy (Parent)', priority: 'Medium', priorityCls: 'warning', status: 'Open', statusCls: 'critical', assigned: 'Finance Team', age: '1d' },
        { id: 'TKT-2026-0086', subject: 'GPS device malfunction Bus 505', from: 'Anil Patil (Driver)', priority: 'High', priorityCls: 'critical', status: 'In Progress', statusCls: 'warning', assigned: 'IT Team', age: '1d' },
        { id: 'TKT-2026-0085', subject: 'Request for route change', from: 'Mr. Patel (Parent)', priority: 'Low', priorityCls: 'good', status: 'Open', statusCls: 'critical', assigned: 'Route Manager', age: '2d' },
        { id: 'TKT-2026-0084', subject: 'Bus seat damaged \u2014 Bus 707', from: 'Kumar Naidu (Driver)', priority: 'Medium', priorityCls: 'warning', status: 'In Progress', statusCls: 'warning', assigned: 'Maintenance Team', age: '2d' },
        { id: 'TKT-2026-0083', subject: 'Monthly pass not activated', from: 'Mrs. Nair (Parent)', priority: 'Low', priorityCls: 'good', status: 'Resolved', statusCls: 'good', assigned: 'Admin', age: '3d' },
        { id: 'TKT-2026-0082', subject: 'Emergency button test failed', from: 'Safety Officer', priority: 'High', priorityCls: 'critical', status: 'In Progress', statusCls: 'warning', assigned: 'IT Team', age: '3d' },
    ];
    const ht = document.querySelector('#helpdeskTable tbody');
    if (ht) ht.innerHTML = tickets.map(t => `<tr>
        <td style="font-weight:600;color:var(--primary-600)">${t.id}</td>
        <td>${t.subject}</td>
        <td style="font-size:12px">${t.from}</td>
        <td><span class="status-badge ${t.priorityCls}"><span class="status-dot"></span>${t.priority}</span></td>
        <td><span class="status-badge ${t.statusCls}"><span class="status-dot"></span>${t.status}</span></td>
        <td style="font-size:12px">${t.assigned}</td>
        <td>${t.age}</td>
    </tr>`).join('');
}

function initHelpdeskCharts() {
    const c = gc();
    if (!CI.tr) {
        const ctx = document.getElementById('ticketResolutionChart');
        if (ctx) {
            CI.tr = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    datasets: [
                        { label: 'Opened', data: [5, 3, 6, 4, 3, 2], borderColor: c.red, tension: 0.4, pointRadius: 4, borderWidth: 2.5 },
                        { label: 'Resolved', data: [4, 5, 3, 5, 4, 3], borderColor: c.green, backgroundColor: c.greenBg, fill: true, tension: 0.4, pointRadius: 4, borderWidth: 2.5 }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: lp(c) }, scales: ds() }
            });
        }
    }
    if (!CI.tkc) {
        const ctx2 = document.getElementById('ticketCategoryChart');
        if (ctx2) {
            CI.tkc = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['Route Issues', 'Bus Maintenance', 'Fee/Billing', 'Safety', 'IT/Device', 'Other'],
                    datasets: [{ data: [25, 20, 18, 15, 12, 10], backgroundColor: [c.blue, c.amber, c.green, c.red, c.purple, c.teal], borderWidth: 0, spacing: 3 }]
                },
                options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { color: c.text, padding: 10, usePointStyle: true, pointStyle: 'circle', font: { size: 11 } } } } }
            });
        }
    }
}
