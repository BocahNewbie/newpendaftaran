// Logika Pengiriman Form Pendaftaran
function handleSubmit(event) {
    event.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = 'Mengirim Data...';

    // Kumpulkan data form
    const formData = {
        namaOrtu: document.getElementById('namaOrtu').value,
        noWa: document.getElementById('noWa').value,
        email: document.getElementById('email').value,
        namaBayi: document.getElementById('namaBayi').value,
        usiaBayi: document.getElementById('usiaBayi').value,
        jenisKelamin: document.getElementById('jenisKelamin').value,
        kategoriLomba: document.querySelector('input[name="kategoriLomba"]:checked').value
    };

    // Simulasi pengiriman data (bisa dihubungkan ke endpoint Google Apps Script Web App Anda)
    setTimeout(() => {
        document.getElementById('formPendaftaran').classList.add('hidden');
        document.getElementById('successMessage').classList.remove('hidden');
    }, 1000);
}

// Fungsi Reset Form untuk pendaftaran baru
function resetForm() {
    document.getElementById('formPendaftaran').reset();
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('formPendaftaran').classList.remove('hidden');
    document.getElementById('submitBtn').disabled = false;
    document.getElementById('submitBtn').innerText = 'Daftar Sekarang ✨';
}
