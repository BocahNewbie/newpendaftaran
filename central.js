/**
 * CYBERFEST 2026 - Central Web Configuration
 * Tempat pengeditan mudah untuk teks, sosial media, panitia, FAQ, dan sponsor.
 */

const APP_CONFIG = {
    // Brand Info
    brandName: "CYBERFEST",
    brandYear: "2026",
    
    // Admin Credentials (Bisa diubah di sini)
    adminAuth: {
        username: "admin",
        password: "cyber2026"
    },

    // Informasi Event Hero Section
    eventInfo: {
        date: "25-27 NOV 2026",
        location: "JAKARTA",
        prizePool: "Rp 75 JT+",
        targetParticipants: "1.500+",
        countdownTarget: "2026-11-10T23:59:59", // Tanggal hitung mundur
        panitiaWhatsapp: "6281234567890" // Nomor WA Panitia Konfirmasi
    },

    // Dynamic Categories for Form Registration
    competitionCategories: [
        "Web Development & Design",
        "UI/UX Innovation",
        "AI Solution & Data Science"
    ],

    // Tailwind Color Tokens
    tailwindTheme: {
        theme: {
            extend: {
                colors: {
                    darkbg: '#070a13',
                    cardbg: 'rgba(15, 23, 42, 0.75)',
                    neonCyan: '#00f3ff',
                    neonPurple: '#b026ff',
                    neonGreen: '#00ff88',
                },
                boxShadow: {
                    'neon-cyan': '0 0 15px rgba(0, 243, 255, 0.4), 0 0 30px rgba(0, 243, 255, 0.15)',
                    'neon-purple': '0 0 15px rgba(176, 38, 255, 0.4), 0 0 30px rgba(176, 38, 255, 0.15)',
                    'neon-green': '0 0 15px rgba(0, 255, 136, 0.4), 0 0 30px rgba(0, 255, 136, 0.15)',
                }
            }
        }
    },

    // Data FAQ (Bisa ditambah/dikurangi dengan mudah)
    faqItems: [
        {
            q: "Apakah kompetisi ini terbuka untuk umum atau mahasiswa saja?",
            a: "CYBERFEST 2026 terbuka untuk umum, termasuk pelajar SMA/K, mahasiswa seluruh jurusan, hingga profesional muda di bawah usia 28 tahun."
        },
        {
            q: "Apakah pendaftaran dilakukan secara individu atau tim?",
            a: "Pendaftaran dihitung per perwakilan/peserta. Untuk kategori lomba berbasis tim (maksimal 3 orang per tim), pengisian data anggota tim dilakukan setelah pendaftaran diautentikasi oleh panitia."
        },
        {
            q: "Bagaimana cara mengonfirmasi pembayaran pendaftaran?",
            a: "Setelah mengisi form pendaftaran, Anda akan mendapatkan QRIS unik beserta tombol 'Konfirmasi Pembayaran via WA' untuk mengirim bukti ke WhatsApp Panitia."
        }
    ],

    // Data Sosial Media & Komunitas
    sosmedLinks: [
        {
            name: "Instagram",
            handle: "@cyberfest2026",
            icon: "camera",
            colorClass: "bg-pink-500/10 text-pink-500",
            url: "https://instagram.com"
        },
        {
            name: "WhatsApp Group",
            handle: "Komunitas Peserta",
            icon: "message-square",
            colorClass: "bg-neonCyan/10 text-neonCyan",
            url: "https://whatsapp.com"
        },
        {
            name: "YouTube",
            handle: "CyberFest Official",
            icon: "video",
            colorClass: "bg-red-500/10 text-red-500",
            url: "https://youtube.com"
        },
        {
            name: "Telegram",
            handle: "Channel Info",
            icon: "send",
            colorClass: "bg-blue-500/10 text-blue-400",
            url: "https://telegram.org"
        }
    ],

    // Data Sponsor & Partner (Bisa tambah/ubah nama di sini)
    sponsors: [
        { name: "NEXUS AI" },
        { name: "CLOUDIFY" },
        { name: "DEVHUB" },
        { name: "CYBERLAB" },
        { name: "PIXELCRAFT" },
        { name: "DATAWAVE" }
    ],

    // Pesan Panitia Section
    panitiaSection: {
        message: `"Terima kasih atas antusiasme luar biasa dari seluruh calon peserta di seluruh Indonesia. Kami percaya bahwa setiap karya hebat dimulai dari satu langkah berani. Selamat berkompetisi, jaga semangat sportifitas, dan mari kita ciptakan inovasi terbaik bersama di CYBERFEST 2026!"`,
        signature: "— Panitia Pelaksana CYBERFEST 2026"
    }
};