/**
 * Application Main Frontend Script
 */

let phaseState = JSON.parse(localStorage.getItem('cyberfest_phase_state')) || {
    p1: { 
        name: 'Early Bird Access', 
        price: 'Rp 99.000', 
        filled: 44, 
        total: 50, 
        open: true, 
        start: '2026-10-01T00:00', 
        end: '2026-11-10T23:59' 
    },
    p2: { 
        name: 'Regular Pass', 
        price: 'Rp 175.000', 
        filled: 55, 
        total: 100, 
        open: true, 
        start: '2026-10-01T00:00', 
        end: '2026-11-20T23:59' 
    },
    p3: { 
        name: 'VIP & Final On-Spot', 
        price: 'Rp 299.000', 
        filled: 12, 
        total: 30, 
        open: true, 
        start: '2026-10-01T00:00', 
        end: '2026-11-25T23:59' 
    }
};

let registrantsData = JSON.parse(localStorage.getItem('cyberfest_registrants')) || [
    { id: 1, regNo: 1, name: 'Ahmad Rizky', email: 'rizky@gmail.com', phone: '081234567891', phaseKey: 'p1', phase: 'Early Bird Access', category: 'Web Development & Design', date: '2026-11-01 10:30', status: 'approved' },
    { id: 2, regNo: 2, name: 'Siti Aminah', email: 'siti@yahoo.com', phone: '085712349988', phaseKey: 'p2', phase: 'Regular Pass', category: 'UI/UX Innovation', date: '2026-11-01 11:15', status: 'pending' }
];

let selectedPhaseKey = 'p1';
let currentRegistrationForPay = null;

// Initialize Dynamic HTML Data from config.js
function initAppFromConfig() {
    // Brand titles
    document.getElementById('nav-brand-title').innerHTML = `${APP_CONFIG.brandName}<span class="text-neonCyan">${APP_CONFIG.brandYear}</span>`;
    document.getElementById('footer-brand-title').innerText = `${APP_CONFIG.brandName} ${APP_CONFIG.brandYear}`;
    document.getElementById('footer-copyright').innerHTML = `© ${APP_CONFIG.brandYear} ${APP_CONFIG.brandName}. All rights reserved.<br><span class="text-slate-400">Designed with Neon Glow & Parallax Effect</span>`;

    // Event Info Badges
    document.getElementById('info-event-date').innerText = APP_CONFIG.eventInfo.date;
    document.getElementById('info-event-location').innerText = APP_CONFIG.eventInfo.location;
    document.getElementById('info-event-prizepool').innerText = APP_CONFIG.eventInfo.prizePool;
    document.getElementById('info-event-target').innerText = APP_CONFIG.eventInfo.targetParticipants;

    // Categories in Modal Form
    const categorySelect = document.getElementById('reg-category');
    if (categorySelect) {
        categorySelect.innerHTML = APP_CONFIG.competitionCategories.map(c => `<option>${c}</option>`).join('');
    }

    // Panitia Section
    document.getElementById('panitia-message').innerText = APP_CONFIG.panitiaSection.message;
    document.getElementById('panitia-signature').innerText = APP_CONFIG.panitiaSection.signature;

    // Render FAQ Accordion
    const faqContainer = document.getElementById('faq-container');
    if (faqContainer) {
        faqContainer.innerHTML = APP_CONFIG.faqItems.map(item => `
            <details class="glass-card rounded-xl p-5 border border-slate-800 group [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                <summary class="flex items-center justify-between font-bold text-white group-open:text-neonCyan transition-colors">
                    <span>${item.q}</span>
                    <span class="ml-2 text-neonCyan transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p class="mt-3 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    ${item.a}
                </p>
            </details>
        `).join('');
    }

    // Render Social Media Links
    const sosmedContainer = document.getElementById('sosmed-container');
    if (sosmedContainer) {
        sosmedContainer.innerHTML = APP_CONFIG.sosmedLinks.map(s => `
            <a href="${s.url}" target="_blank" class="glass-card p-6 rounded-2xl flex flex-col items-center glass-card-hover group">
                <div class="w-14 h-14 rounded-full ${s.colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <i data-lucide="${s.icon}" class="w-7 h-7"></i>
                </div>
                <span class="font-bold text-white mb-1">${s.name}</span>
                <span class="text-xs text-slate-400">${s.handle}</span>
            </a>
        `).join('');
    }

    // Render Sponsors
    const sponsorContainer = document.getElementById('sponsor-container');
    if (sponsorContainer) {
        sponsorContainer.innerHTML = APP_CONFIG.sponsors.map(sp => `
            <div class="p-4 glass-card rounded-xl hover:opacity-100 hover:border-neonCyan transition-all font-black text-xl text-slate-300">${sp.name}</div>
        `).join('');
    }

    updateSlotUI();
    initCountdown();
    initParallax();
}

// Mobile Menu Handler
document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Check Phase Availability
function isPhaseAvailable(key) {
    const p = phaseState[key];
    if (!p.open) return { available: false, reason: 'Pendaftaran Ditutup' };
    if (p.filled >= p.total) return { available: false, reason: 'Kuota Penuh' };

    const now = new Date();
    if (p.start && now < new Date(p.start)) return { available: false, reason: 'Belum Dibuka' };
    if (p.end && now > new Date(p.end)) return { available: false, reason: 'Pendaftaran Berakhir' };

    return { available: true, reason: 'Open' };
}

function formatDateRange(startStr, endStr) {
    if (!startStr && !endStr) return 'Jadwal fleksibel';
    if (endStr) {
        const endDate = new Date(endStr);
        if (!isNaN(endDate)) {
            return `Buka s/d ${endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        }
    }
    return 'Jadwal Pendaftaran';
}

function updateSlotUI() {
    const keys = ['p1', 'p2', 'p3'];
    
    keys.forEach((key, i) => {
        const idx = i + 1;
        const p = phaseState[key];
        const rem = Math.max(0, p.total - p.filled);
        const pct = Math.min(100, Math.round((p.filled / p.total) * 100)) || 0;
        const status = isPhaseAvailable(key);

        document.getElementById(`phase${idx}-title-display`).innerText = p.name;
        document.getElementById(`phase${idx}-price-display`).innerText = p.price;
        document.getElementById(`phase${idx}-slot-text`).innerText = `${rem} Slot Tersisa`;
        document.getElementById(`phase${idx}-progress`).style.width = `${pct}%`;
        document.getElementById(`phase${idx}-detail-text`).innerText = `${pct}% Terisi (${p.filled}/${p.total} Slot)`;
        document.getElementById(`phase${idx}-schedule-text`).innerText = formatDateRange(p.start, p.end);

        const btn = document.getElementById(`btn-phase-${idx}`);
        if (status.available) {
            btn.disabled = false;
            btn.innerText = `Pilih ${p.name} & Daftar`;
            btn.className = idx === 1 ? 'w-full py-3.5 rounded-xl font-bold text-slate-950 bg-neonCyan hover:bg-cyan-300 shadow-neon-cyan transition-all text-center cursor-pointer' :
                            idx === 2 ? 'w-full py-3.5 rounded-xl font-bold text-white bg-neonPurple hover:bg-purple-600 shadow-neon-purple transition-all text-center cursor-pointer' :
                            'w-full py-3.5 rounded-xl font-bold text-slate-950 bg-neonGreen hover:bg-emerald-400 shadow-neon-green transition-all text-center cursor-pointer';
        } else {
            btn.disabled = true;
            btn.innerText = `Tutup (${status.reason})`;
            btn.className = 'w-full py-3.5 rounded-xl font-bold text-slate-500 bg-slate-800 border border-slate-700 text-center cursor-not-allowed opacity-70';
        }
    });

    localStorage.setItem('cyberfest_phase_state', JSON.stringify(phaseState));
}

// Trigger Modal Pendaftaran
function triggerRegistration(key) {
    const status = isPhaseAvailable(key);
    if (!status.available) {
        alert(`Pendaftaran phase ini tidak tersedia: ${status.reason}`);
        return;
    }
    selectedPhaseKey = key;
    const p = phaseState[key];
    document.getElementById('modal-phase-tag').innerText = `${p.name} - ${p.price}`;
    document.getElementById('register-modal').classList.remove('hidden');
}

function closeRegisterModal() {
    document.getElementById('register-modal').classList.add('hidden');
}

// Form Submit Handler
function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const category = document.getElementById('reg-category').value;

    const nextRegNo = registrantsData.length > 0 ? Math.max(...registrantsData.map(r => r.regNo || 0)) + 1 : 1;

    phaseState[selectedPhaseKey].filled++;

    const newEntry = {
        id: Date.now(),
        regNo: nextRegNo,
        name,
        email,
        phone,
        phaseKey: selectedPhaseKey,
        phase: phaseState[selectedPhaseKey].name,
        price: phaseState[selectedPhaseKey].price,
        category,
        date: new Date().toLocaleString('id-ID'),
        status: 'pending'
    };

    registrantsData.push(newEntry);
    localStorage.setItem('cyberfest_registrants', JSON.stringify(registrantsData));

    updateSlotUI();
    closeRegisterModal();
    openPaymentModal(newEntry);
    
    showToast('Email Terkirim!', `Instruksi QRIS & No. Registrasi #${String(nextRegNo).padStart(3, '0')} dikirim ke ${email}`);
    event.target.reset();
}

// Payment & QR Code Modal
function openPaymentModal(registrant) {
    currentRegistrationForPay = registrant;
    const regNoFormatted = `#${String(registrant.regNo).padStart(3, '0')}`;
    
    document.getElementById('pay-regno').innerText = regNoFormatted;
    document.getElementById('pay-amount').innerText = registrant.price;
    document.getElementById('pay-email-target').innerText = registrant.email;

    const qrText = encodeURIComponent(`CYBERFEST2026|REG:${regNoFormatted}|NAME:${registrant.name}|AMOUNT:${registrant.price}`);
    document.getElementById('qr-code-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrText}&color=0f172a`;

    document.getElementById('payment-modal').classList.remove('hidden');
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.add('hidden');
}

function openWhatsAppConfirmation() {
    if (!currentRegistrationForPay) return;
    const regNoStr = `#${String(currentRegistrationForPay.regNo).padStart(3, '0')}`;
    const message = `Halo Panitia CYBERFEST 2026, saya ingin konfirmasi bukti pembayaran pendaftaran:\n\n` +
                    `• No. Registrasi: ${regNoStr}\n` +
                    `• Nama: ${currentRegistrationForPay.name}\n` +
                    `• Phase: ${currentRegistrationForPay.phase}\n` +
                    `• Nominal: ${currentRegistrationForPay.price}\n\n` +
                    `Mohon dilakukan verifikasi approval pada sistem. Terima kasih!`;
    
    const waUrl = `https://wa.me/${APP_CONFIG.eventInfo.panitiaWhatsapp}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
}

// E-Ticket View Modal
function viewEticket(id) {
    const r = registrantsData.find(item => item.id === id);
    if (!r) return;

    const regNoFormatted = `#${String(r.regNo).padStart(3, '0')}`;
    document.getElementById('eticket-regno').innerText = regNoFormatted;
    document.getElementById('eticket-name').innerText = r.name;
    document.getElementById('eticket-phase').innerText = r.phase;
    document.getElementById('eticket-category').innerText = r.category;

    const qrText = encodeURIComponent(`APPROVED_TICKET|CYBERFEST2026|${regNoFormatted}|${r.name}`);
    document.getElementById('eticket-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrText}`;

    document.getElementById('eticket-modal').classList.remove('hidden');
}

function closeEticketModal() {
    document.getElementById('eticket-modal').classList.add('hidden');
}

// Toast Helper
function showToast(title, desc) {
    const toast = document.getElementById('success-toast');
    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-desc').innerText = desc;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 5000);
}

// Parallax Effect Logic
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const bg1 = document.getElementById('parallax-bg-1');
        const bg2 = document.getElementById('parallax-bg-2');
        if (bg1 && bg2) {
            bg1.style.transform = `translateY(${scrolled * 0.25}px)`;
            bg2.style.transform = `translateY(${scrolled * -0.15}px)`;
        }
    });
}

// Countdown Timer Logic
function initCountdown() {
    const targetDate = new Date(APP_CONFIG.eventInfo.countdownTarget).getTime();
    
    function updateTimer() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            document.getElementById('cd-days').innerText = '00';
            document.getElementById('cd-hours').innerText = '00';
            document.getElementById('cd-minutes').innerText = '00';
            document.getElementById('cd-seconds').innerText = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
        document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('cd-minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('cd-seconds').innerText = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}