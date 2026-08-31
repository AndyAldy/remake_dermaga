const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Izinkan frontend mengakses folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Konfigurasi Database MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root', // Sesuaikan dengan user XAMPP/MySQL Anda
    password: '', // Kosongkan jika pakai XAMPP default
    database: 'dermaga_bps'
};

// Konfigurasi Multer (Untuk Upload PDF)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});
const upload = multer({ storage: storage });

// ==========================================
// 1. ENDPOINT AUTENTIKASI (LOGIN & REGISTER)
// ==========================================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, nama_lengkap } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO users (username, password, nama_lengkap, role, status_akun) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, nama_lengkap, 'peserta', 'seleksi']
        );
        connection.end();
        res.json({ success: true, message: 'Registrasi berhasil!' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Username sudah digunakan atau terjadi kesalahan.' });
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
        // Untuk admin bawaan yang password-nya belum di-hash di SQL
        const isMatch = (username === 'admin' && password === 'admin123') ? true : await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ error: 'Password salah' });

        res.json({
            id: user.id,
            name: user.nama_lengkap,
            email: user.username,
            role: user.role,
            status: user.status_akun
        });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// ==========================================
// 2. ENDPOINT DATA (KUOTA & PENDAFTAR)
// ==========================================
app.get('/api/quotas', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM divisi');
    connection.end();
    // Sesuaikan format data dengan frontend
    const formatted = rows.map(r => ({ id: r.id, divisi: r.nama_divisi, total: r.total_kuota, terisi: r.terisi }));
    res.json(formatted);
});

app.get('/api/pendaftar', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT p.*, d.nama_divisi FROM pendaftaran p JOIN divisi d ON p.divisi_id = d.id');
    connection.end();
    res.json(rows);
});

// ==========================================
// 3. ENDPOINT KIRIM FORMULIR (DENGAN FILE PDF)
// ==========================================
app.post('/api/pendaftar', upload.single('berkas_pdf'), async (req, res) => {
    try {
        const { user_id, nama_peserta, nim_nisn, asal, tanggal_mulai, tanggal_akhir, divisi_id } = req.body;
        const filename = req.file.filename;

        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO pendaftaran (user_id, nama_peserta, nim_nisn, asal_sekolah_kampus, tanggal_mulai, tanggal_akhir, divisi_id, berkas_pdf, status_seleksi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, nama_peserta, nim_nisn, asal, tanggal_mulai, tanggal_akhir, divisi_id, filename, 'pending']
        );
        connection.end();
        res.json({ success: true, message: 'Berkas berhasil dikirim!' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengirim berkas.' });
    }
});

// ==========================================
// 4. ENDPOINT ADMIN: TERIMA PESERTA (SOLUSI BUG)
// ==========================================
app.put('/api/admin/terima/:id', async (req, res) => {
    try {
        const pendaftarId = req.params.id;
        const connection = await mysql.createConnection(dbConfig);

        // Ambil data pendaftar untuk mengetahui user_id dan divisi_id
        const [pendaftar] = await connection.execute('SELECT user_id, divisi_id FROM pendaftaran WHERE id = ?', [pendaftarId]);
        if (pendaftar.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan' });
        
        const { user_id, divisi_id } = pendaftar[0];

        // Jalankan 3 aksi secara berurutan (Bisa diganti pakai Transaction agar lebih aman)
        await connection.execute("UPDATE pendaftaran SET status_seleksi = 'diterima' WHERE id = ?", [pendaftarId]);
        await connection.execute("UPDATE divisi SET terisi = terisi + 1 WHERE id = ?", [divisi_id]);
        
        // INI KUNCI UTAMANYA: Mengubah status akun menjadi lulus
        await connection.execute("UPDATE users SET status_akun = 'lulus' WHERE id = ?", [user_id]);

        connection.end();
        res.json({ success: true, message: 'Peserta berhasil diterima, kuota berkurang, dan status akun menjadi Lulus!' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menerima peserta.' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend Server berjalan di http://localhost:${PORT}`);
});