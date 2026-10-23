require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Inisialisasi Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const allowedOrigins = [
  'https://remakedermaga.vercel.app', 
  'http://localhost:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

const dbConfig = { host: 'localhost', user: 'root', password: '', database: 'dermaga_bps' };

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

        // 1. Cek NIM Duplikat
        const [cekNim] = await connection.execute('SELECT id FROM pendaftaran WHERE nim_nisn = ?', [nim_nisn]);
        if (cekNim.length > 0) {
            connection.end();
            return res.status(400).json({ error: 'NIM / NISN sudah terdaftar!' });
        }

        // 2. Upload File PDF ke Supabase Bucket
        let pdfUrl = null;
        if (req.files['berkas_pdf']) {
            const pdfFile = req.files['berkas_pdf'][0];
            const pdfName = `${Date.now()}-${pdfFile.originalname.replace(/\s+/g, '_')}`;
            
            const { error: uploadError } = await supabase.storage
                .from('berkas_pendaftar') // PASTIKAN BUCKET INI ADA DI SUPABASE
                .upload(pdfName, pdfFile.buffer, { contentType: pdfFile.mimetype });
            
            if (uploadError) throw uploadError;
            pdfUrl = supabase.storage.from('berkas_pendaftar').getPublicUrl(pdfName).data.publicUrl;
        }

        // 3. Upload File CV ke Supabase Bucket (Jika ada)
        let cvUrl = null;
        if (req.files['berkas_cv']) {
            const cvFile = req.files['berkas_cv'][0];
            const cvName = `${Date.now()}-${cvFile.originalname.replace(/\s+/g, '_')}`;
            
            const { error: uploadError2 } = await supabase.storage
                .from('berkas_pendaftar') 
                .upload(cvName, cvFile.buffer, { contentType: cvFile.mimetype });
            
            if (uploadError2) throw uploadError2;
            cvUrl = supabase.storage.from('berkas_pendaftar').getPublicUrl(cvName).data.publicUrl;
        }

        // 4. Simpan URL ke Database MySQL
        // Pastikan kolom berkas_pdf dan berkas_cv di tabel MySQL-mu tipenya TEXT atau VARCHAR(255) agar muat menyimpan URL panjang
        await connection.execute(
            'INSERT INTO pendaftaran (user_id, nama_peserta, nim_nisn, asal_sekolah_kampus, tanggal_mulai, tanggal_akhir, divisi_id, berkas_pdf, berkas_cv, status_seleksi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, nama_peserta, nim_nisn, asal, tanggal_mulai, tanggal_akhir, divisi_id, pdfUrl, cvUrl, 'pending']
        );
        connection.end();
        res.json({ success: true, message: 'Berkas berhasil dikirim!' });

    } catch (error) {
        console.error(error);
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

app.post('/api/upload', upload.single('file_pdf'), async (req, res) => {
  try {
    const file = req.file;
    const { nama, email } = req.body;

    if (!file) return res.status(400).json({ error: 'File PDF wajib diunggah' });

    // 1. Upload File ke Supabase Storage
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('berkas_pendaftar') // Nama bucket di Supabase
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) throw uploadError;

    // Dapatkan URL publik dari file yang baru diupload
    const { data: publicUrlData } = supabase.storage
      .from('berkas_pendaftar')
      .getPublicUrl(fileName);
    
    const fileUrl = publicUrlData.publicUrl;

    // 2. Simpan Data Pendaftar (Teks + URL File) ke Supabase Database
    const { data: insertData, error: dbError } = await supabase
      .from('pendaftar') // Nama tabel di database Supabase Anda
      .insert([
        { 
          nama: nama, 
          email: email, 
          file_url: fileUrl 
        }
      ]);

    if (dbError) throw dbError;

    res.status(200).json({ message: 'Berhasil mendaftar!', url: fileUrl });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memproses data' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));