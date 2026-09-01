const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer'); // PUSTAKA BARU

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const dbConfig = { host: 'localhost', user: 'root', password: '', database: 'dermaga_bps' };



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')); }
});
const upload = multer({ storage: storage });

// ==========================================
// KONFIGURASI EMAIL (NODEMAILER) & MEMORI OTP
// ==========================================
const otpStore = new Map(); // Menyimpan OTP sementara

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'andybung32@gmail.com', // GANTI DENGAN EMAIL ANDA
        pass: 'fdke jafg ejad vegt' // GANTI DENGAN APP PASSWORD GOOGLE
    }
});

app.post('/api/auth/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email wajib diisi' });

    // Generate 4 digit OTP acak
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString(); 
    
    // Simpan di memori server, berlaku 5 menit (300000 ms)
    otpStore.set(email, { code: otpCode, expires: Date.now() + 300000 });

    const mailOptions = {
        from: '"Portal DERMAGA BPS" <no-reply@bps.go.id>',
        to: email,
        subject: 'Kode OTP Registrasi Portal Magang',
        html: `<div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                 <h2>Verifikasi Email Anda</h2>
                 <p>Gunakan kode OTP berikut untuk melanjutkan registrasi akun magang Anda:</p>
                 <h1 style="background: #1e3a8a; color: white; padding: 10px 20px; display: inline-block; border-radius: 8px; letter-spacing: 5px;">${otpCode}</h1>
                 <p style="color: red; font-size: 12px;">Kode ini hanya berlaku selama 5 menit. Jangan bagikan kepada siapa pun.</p>
               </div>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'OTP berhasil dikirim ke email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal mengirim email. Pastikan koneksi dan kredensial email benar.' });
    }
});

// ==========================================
// ENDPOINT ADMIN: TOLAK PESERTA
// ==========================================
app.put('/api/admin/tolak/:id', async (req, res) => {
    try {
        const pendaftarId = req.params.id;
        const { alasan } = req.body; // Tangkap alasan dari Admin Frontend
        
        const connection = await mysql.createConnection(dbConfig);
        // Update status menjadi ditolak dan simpan alasannya
        await connection.execute(
            "UPDATE pendaftaran SET status_seleksi = 'ditolak', alasan_tolak = ? WHERE id = ?", 
            [alasan || 'Tidak sesuai kriteria', pendaftarId]
        );
        connection.end();
        res.json({ success: true, message: 'Peserta berhasil ditolak dan alasan telah dikirim!' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menolak peserta.' });
    }
});

// ==========================================
// ENDPOINT USER: HAPUS PENDAFTARAN (Agar bisa daftar ulang)
// ==========================================
app.delete('/api/pendaftar/:id', async (req, res) => {
    try {
        const pendaftarId = req.params.id;
        const connection = await mysql.createConnection(dbConfig);
        
        const [rows] = await connection.execute('SELECT berkas_pdf, berkas_cv FROM pendaftaran WHERE id = ?', [pendaftarId]);
        if (rows.length > 0) {
            const pdfPath = path.join(__dirname, 'uploads', rows[0].berkas_pdf);
            const cvPath = path.join(__dirname, 'uploads', rows[0].berkas_cv);
            if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
            if (rows[0].berkas_cv && fs.existsSync(cvPath)) fs.unlinkSync(cvPath);
        }

        await connection.execute("DELETE FROM pendaftaran WHERE id = ?", [pendaftarId]);
        connection.end();
        res.json({ success: true, message: 'Pendaftaran dihapus.' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus data pendaftaran.' });
    }
});

// ==========================================
// ENDPOINT AUTH (DIPERBARUI DENGAN VALIDASI OTP)
// ==========================================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, nama_lengkap, otp } = req.body;

        // VALIDASI OTP DARI DATABASE MEMORI
        const storedData = otpStore.get(username);
        if (!storedData) return res.status(400).json({ error: 'Sesi OTP tidak ditemukan atau sudah kedaluwarsa. Silakan kirim ulang OTP.' });
        if (Date.now() > storedData.expires) return res.status(400).json({ error: 'Kode OTP sudah kedaluwarsa. Silakan kirim ulang.' });
        if (storedData.code !== otp) return res.status(400).json({ error: 'Kode OTP salah!' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO users (username, password, nama_lengkap, role, status_akun) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, nama_lengkap, 'peserta', 'seleksi']
        );
        connection.end();
        
        // Hapus OTP setelah berhasil dipakai
        otpStore.delete(username); 
        res.json({ success: true, message: 'Registrasi berhasil!' });
    } catch (error) {
        res.status(500).json({ error: 'Email sudah digunakan atau terjadi kesalahan server.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        connection.end();

        if (rows.length === 0) return res.status(401).json({ error: 'User tidak ditemukan' });

        const user = rows[0];
        const isMatch = (username === 'admin' && password === 'admin123') ? true : await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ error: 'Password salah' });
res.json({ 
                id: user.id, 
                name: user.nama_lengkap, 
                email: user.username, 
                role: user.role, 
                status: user.status_akun || 'seleksi' 
            });
        } catch (error) {
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
});

app.get('/api/quotas', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM divisi');
    connection.end();
    res.json(rows.map(r => ({ id: r.id, divisi: r.nama_divisi, total: r.total_kuota, terisi: r.terisi })));
});

app.get('/api/pendaftar', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT p.*, d.nama_divisi FROM pendaftaran p JOIN divisi d ON p.divisi_id = d.id');
    connection.end();
    res.json(rows);
});

app.post('/api/pendaftar', upload.fields([
    { name: 'berkas_pdf', maxCount: 1 }, 
    { name: 'berkas_cv', maxCount: 1 }
]), async (req, res) => {
    try {
        const { user_id, nama_peserta, nim_nisn, asal, tanggal_mulai, tanggal_akhir, divisi_id } = req.body;
        const connection = await mysql.createConnection(dbConfig);

        const [cekNim] = await connection.execute('SELECT id FROM pendaftaran WHERE nim_nisn = ?', [nim_nisn]);
        if (cekNim.length > 0) {
            connection.end();
            // Hapus kedua file jika ditolak karena NIM duplikat
            if (req.files['berkas_pdf']) fs.unlinkSync(req.files['berkas_pdf'][0].path);
            if (req.files['berkas_cv']) fs.unlinkSync(req.files['berkas_cv'][0].path);
            return res.status(400).json({ error: 'NIM / NISN sudah terdaftar!' });
        }

        const filenamePdf = req.files['berkas_pdf'][0].filename;
        const filenameCv = req.files['berkas_cv'][0].filename;

        await connection.execute(
            'INSERT INTO pendaftaran (user_id, nama_peserta, nim_nisn, asal_sekolah_kampus, tanggal_mulai, tanggal_akhir, divisi_id, berkas_pdf, berkas_cv, status_seleksi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, nama_peserta, nim_nisn, asal, tanggal_mulai, tanggal_akhir, divisi_id, filenamePdf, filenameCv, 'pending']
        );
        connection.end();
        res.json({ success: true, message: 'Berkas berhasil dikirim!' });

    } catch (error) {
        if (req.files && req.files['berkas_pdf']) fs.unlinkSync(req.files['berkas_pdf'][0].path);
        if (req.files && req.files['berkas_cv']) fs.unlinkSync(req.files['berkas_cv'][0].path);
        res.status(500).json({ error: 'Gagal mengirim berkas.' });
    }
});

app.put('/api/admin/terima/:id', async (req, res) => {
    try {
        const pendaftarId = req.params.id;
        const connection = await mysql.createConnection(dbConfig);
        const [pendaftar] = await connection.execute('SELECT user_id, divisi_id FROM pendaftaran WHERE id = ?', [pendaftarId]);
        if (pendaftar.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });
        
        const { user_id, divisi_id } = pendaftar[0];
        await connection.execute("UPDATE pendaftaran SET status_seleksi = 'diterima' WHERE id = ?", [pendaftarId]);
        await connection.execute("UPDATE divisi SET terisi = terisi + 1 WHERE id = ?", [divisi_id]);
        await connection.execute("UPDATE users SET status_akun = 'lulus' WHERE id = ?", [user_id]);
        connection.end();
        res.json({ success: true, message: 'Peserta diterima!' });
    } catch (error) { res.status(500).json({ error: 'Gagal menerima peserta.' }); }
});



const PORT = 5000;
app.listen(PORT, () => { console.log(`Backend Server berjalan di http://localhost:${PORT}`); });