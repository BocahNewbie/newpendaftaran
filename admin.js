/**
 * Admin Panel Script System (Auth, Approval & Table Management)
 */

let currentSortField = 'regNo';
let currentSortAsc = true;
let activeAdminTab = 'pending';

// Helper function to safely render Lucide Icons without throw errors
function renderLucideSafely() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        try {
            window.lucide.createIcons();
        } catch (e) {
            console.warn('Lucide icons render warning:', e);
        }
    }
}

function openAdminLoginModal() {
    document.getElementById('admin-login-modal').classList.remove('hidden');
}

function closeAdminLoginModal() {
    document.getElementById('admin-login-modal').classList.add('hidden');
    document.getElementById('admin-error-msg').classList.add('hidden');
}

function handleAdminLogin(event) {
    event.preventDefault();
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;

    if (user === APP_CONFIG.adminAuth.username && pass === APP_CONFIG.adminAuth.password) {
        closeAdminLoginModal();
        openAdminDashboard();
        event.target.reset();
    } else {
        document.getElementById('admin-error-msg').classList.remove('hidden');
    }
}

function openAdminDashboard() {
    const keys = ['p1', 'p2', 'p3'];
    keys.forEach(k => {
        const p = phaseState[k];
        document.getElementById(`edit-${k}-name`).value = p.name;
        document.getElementById(`edit-${k}-price`).value = p.price;
        document.getElementById(`edit-${k}-filled`).value = p.filled;
        document.getElementById(`edit-${k}-total`).value = p.total;
        document.getElementById(`edit-${k}-open`).checked = p.open;
        document.getElementById(`edit-${k}-start`).value = p.start || '';
        document.getElementById(`edit-${k}-end`).value = p.end || '';
    });

    renderRegistrantsTable();
    document.getElementById('admin-dashboard-modal').classList.remove('hidden');
}

function closeAdminDashboard() {
    document.getElementById('admin-dashboard-modal').classList.add('hidden');
}

function switchAdminTab(tab) {
    activeAdminTab = tab;
    const btnPending = document.getElementById('tab-btn-pending');
    const btnApproved = document.getElementById('tab-btn-approved');

    if (tab === 'pending') {
        btnPending.className = 'px-4 py-2 rounded-lg text-xs font-bold transition-all bg-neonCyan text-slate-950 shadow-neon-cyan flex items-center gap-1.5';
        btnApproved.className = 'px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all flex items-center gap-1.5';
    } else {
        btnApproved.className = 'px-4 py-2 rounded-lg text-xs font-bold transition-all bg-neonGreen text-slate-950 shadow-neon-green flex items-center gap-1.5';
        btnPending.className = 'px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all flex items-center gap-1.5';
    }
    renderRegistrantsTable();
}

function approveRegistrant(id) {
    const r = registrantsData.find(item => item.id === id);
    if (!r) return;

    r.status = 'approved';
    localStorage.setItem('cyberfest_registrants', JSON.stringify(registrantsData));
    
    showToast('E-Ticket Terkirim!', `Pendaftaran ${r.name} disetujui. E-Ticket resmi telah dikirim ke ${r.email}`);
    renderRegistrantsTable();
}

function updatePhaseSlotsFromAdmin() {
    const keys = ['p1', 'p2', 'p3'];
    keys.forEach(k => {
        phaseState[k].name = document.getElementById(`edit-${k}-name`).value || `Phase ${k}`;
        phaseState[k].price = document.getElementById(`edit-${k}-price`).value || 'Free';
        phaseState[k].filled = parseInt(document.getElementById(`edit-${k}-filled`).value) || 0;
        phaseState[k].total = Math.max(1, parseInt(document.getElementById(`edit-${k}-total`).value) || 1);
        phaseState[k].open = document.getElementById(`edit-${k}-open`).checked;
        phaseState[k].start = document.getElementById(`edit-${k}-start`).value;
        phaseState[k].end = document.getElementById(`edit-${k}-end`).value;
    });

    updateSlotUI();
}

function sortByHeader(field) {
    if (currentSortField === field) {
        currentSortAsc = !currentSortAsc;
    } else {
        currentSortField = field;
        currentSortAsc = true;
    }
    
    ['regNo', 'name', 'email', 'phase', 'category', 'date'].forEach(f => {
        const el = document.getElementById(`sort-icon-${f}`);
        if (el) el.innerText = '↕';
    });
    const activeIcon = document.getElementById(`sort-icon-${field}`);
    if (activeIcon) activeIcon.innerText = currentSortAsc ? '↑' : '↓';

    renderRegistrantsTable();
}

function renderRegistrantsTable() {
    const tbody = document.getElementById('registrants-table-body');
    const searchQuery = document.getElementById('search-registrant').value.toLowerCase();
    tbody.innerHTML = '';

    const pendingCount = registrantsData.filter(r => r.status === 'pending').length;
    const approvedCount = registrantsData.filter(r => r.status === 'approved').length;
    document.getElementById('cnt-pending').innerText = pendingCount;
    document.getElementById('cnt-approved').innerText = approvedCount;

    let filtered = registrantsData.filter(r => {
        const isTabMatch = activeAdminTab === 'approved' ? (r.status === 'approved') : (r.status !== 'approved');
        const formattedRegNo = `#${String(r.regNo || 0).padStart(3, '0')}`;
        const isSearchMatch = r.name.toLowerCase().includes(searchQuery) || 
            r.email.toLowerCase().includes(searchQuery) ||
            r.phone.includes(searchQuery) ||
            formattedRegNo.toLowerCase().includes(searchQuery) ||
            (r.phase && r.phase.toLowerCase().includes(searchQuery)) ||
            (r.category && r.category.toLowerCase().includes(searchQuery));
        
        return isTabMatch && isSearchMatch;
    });

    filtered.sort((a, b) => {
        let valA = a[currentSortField] ?? '';
        let valB = b[currentSortField] ?? '';
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return currentSortAsc ? -1 : 1;
        if (valA > valB) return currentSortAsc ? 1 : -1;
        return 0;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center p-6 text-slate-500">Tidak ada data pendaftar pada kategori ini.</td></tr>`;
        return;
    }

    filtered.forEach((item) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-900/80 transition-colors';
        const badgeColor = item.phaseKey === 'p1' ? 'bg-neonCyan/20 text-neonCyan' : item.phaseKey === 'p2' ? 'bg-neonPurple/20 text-neonPurple' : 'bg-neonGreen/20 text-neonGreen';
        const formattedRegNo = `#${String(item.regNo || 0).padStart(3, '0')}`;

        let actionHtml = activeAdminTab === 'pending' ? `
            <div class="flex items-center justify-center gap-1.5">
                <button onclick="approveRegistrant(${item.id})" class="px-2.5 py-1 rounded-lg bg-neonGreen/20 text-neonGreen border border-neonGreen/40 hover:bg-neonGreen hover:text-black font-bold text-[11px] transition-all flex items-center gap-1" title="Setujui Pembayaran & Kirim E-Ticket">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i> ACC
                </button>
                <button onclick="deleteRegistrant(${item.id})" class="p-1 text-red-400 hover:text-red-300" title="Tolak / Hapus">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
            </div>
        ` : `
            <div class="flex items-center justify-center gap-1.5">
                <button onclick="viewEticket(${item.id})" class="px-2.5 py-1 rounded-lg bg-neonCyan/20 text-neonCyan border border-neonCyan/40 hover:bg-neonCyan hover:text-black font-bold text-[11px] transition-all flex items-center gap-1" title="Lihat E-Ticket">
                    <i data-lucide="ticket" class="w-3.5 h-3.5"></i> E-Ticket
                </button>
                <button onclick="deleteRegistrant(${item.id})" class="p-1 text-slate-500 hover:text-red-400" title="Hapus">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
            </div>
        `;

        tr.innerHTML = `
            <td class="p-3 font-mono text-neonCyan font-bold">${formattedRegNo}</td>
            <td class="p-3 font-semibold text-white">${item.name}</td>
            <td class="p-3 text-slate-400">${item.email}</td>
            <td class="p-3 text-slate-400">${item.phone}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}">${item.phase || item.phaseKey}</span></td>
            <td class="p-3 text-slate-300">${item.category}</td>
            <td class="p-3 text-slate-400 text-[11px]">${item.date}</td>
            <td class="p-3 text-center">${actionHtml}</td>
        `;
        tbody.appendChild(tr);
    });
    renderLucideSafely();
}

function deleteRegistrant(id) {
    registrantsData = registrantsData.filter(item => item.id !== id);
    localStorage.setItem('cyberfest_registrants', JSON.stringify(registrantsData));
    renderRegistrantsTable();
}

function downloadCSV() {
    if (registrantsData.length === 0) {
        alert('Belum ada data pendaftar untuk di-export.');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No. Urut,ID,Nama Lengkap,Email,WhatsApp,Phase,Kategori Lomba,Tanggal Daftar,Status Verification\n";

    registrantsData.forEach(r => {
        const regNoStr = `#${String(r.regNo || 0).padStart(3, '0')}`;
        const row = `"${regNoStr}","${r.id}","${r.name}","${r.email}","${r.phone}","${r.phase || r.phaseKey}","${r.category}","${r.date}","${r.status.toUpperCase()}"`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CYBERFEST_2026_Pendaftar_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}