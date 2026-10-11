# Panduan Agen — Dev Research

## Tujuan proyek

Bangun aplikasi **Dev Research** untuk membantu pengguna melakukan riset pengembangan perangkat lunak dengan Gemini API. Aplikasi menggunakan **Express.js** sebagai backend dan **EJS** untuk merender tampilan.

## Teknologi yang digunakan

- Node.js dengan ES modules (`import`/`export`)
- Express.js
- EJS
- Google Gemini API melalui paket `@google/genai`
- `dotenv` untuk konfigurasi environment
- `multer` untuk unggahan file bila diperlukan
- `cors` dan `morgan` untuk middleware

Pertahankan teknologi dan pola yang sudah ada. Jangan menambahkan dependensi baru tanpa alasan yang jelas.

## Struktur dan pola kode

- Pisahkan routing, controller, dan layanan Gemini jika struktur proyek mendukungnya.
- Simpan template EJS di direktori `views/`.
- Simpan aset statis di direktori `public/` dan sajikan menggunakan `express.static`.
- Gunakan nama variabel dan fungsi yang deskriptif.
- Gunakan `async`/`await` dan tangani error pada operasi asynchronous.
- Jangan menaruh API key atau rahasia lain di dalam source code.

## Gemini API

- Inisialisasi klien Gemini menggunakan konfigurasi dari environment.
- Baca API key dari `.env`; jangan pernah mengirimkannya ke browser atau mencatatnya ke log.
- Pertahankan penggunaan `ai.interactions.create` yang sudah ada kecuali perubahan API memang diperlukan.
- Validasi prompt dan file sebelum mengirim permintaan ke Gemini.
- Berikan respons error dengan status HTTP yang sesuai tanpa membocorkan detail internal.

## Express dan tampilan

- Gunakan EJS untuk halaman yang dirender di server.
- Pisahkan endpoint halaman dari endpoint API.
- Validasi dan sanitasi data yang berasal dari pengguna.
- Untuk unggahan, tetapkan batas ukuran dan tipe file yang diizinkan.
- Pastikan middleware dipasang sebelum route yang menggunakannya.

## Catatan atas kode yang tersedia

`index.js` saat ini sudah menggunakan Express, Gemini, Multer, CORS, dan Morgan, serta memiliki endpoint `/api/generate-text` dan `/api/process-media`.

Saat mengubah file tersebut, perhatikan bahwa:

- `/api/generate-text` membaca `req.file`, tetapi route itu belum memasang middleware unggahan.
- Tetapkan status HTTP sebelum memanggil `.json()`.
- Respons error sebaiknya menggunakan status HTTP yang sesuai, misalnya `500`.
- Hapus variabel atau import yang tidak digunakan setelah perubahan.

## Cara bekerja

- Sebelum mengubah kode, periksa file dan struktur proyek yang tersedia.
- Ikuti gaya serta konvensi yang sudah digunakan proyek.
- Buat perubahan sekecil mungkin untuk memenuhi kebutuhan.
- Jangan mengklaim telah membaca atau mengubah file yang tidak tersedia.
- Jika menjalankan tes atau perintah, laporkan hasilnya secara akurat.