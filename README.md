# Mumti Study

## Progres database

Akun, sesi login, hasil latihan, dan draft **Lanjutkan pelajaran** disimpan di Prisma Postgres melalui `/api/auth` dan `/api/progress`. Progres dipisahkan berdasarkan ID akun. Browser hanya membawa cookie sesi HttpOnly; kredensial database tidak dikirim ke browser.

### Lokal

1. Jalankan `npm install`.
2. Salin `.env.example` menjadi `.env.local` dan isi `DATABASE_URL` dari environment Development proyek Vercel **latihan-syarhu-mumti**. Alternatif: `npx vercel link`, lalu `npx vercel env pull .env.local`.
3. Jalankan `npm run dev`. Vite menjalankan API lokal juga. Restart setelah mengubah environment.
4. Daftar akun baru, lalu gunakan email dan kata sandi yang sama di lokal dan Vercel. Keduanya harus memakai database yang sama.

### Vercel

Database Prisma Postgres sudah terhubung ke proyek. Pastikan `DATABASE_URL` atau `DATABASE_URL_POOLED` tersedia pada target deployment. Deploy perubahan ini melalui Git. Folder `api` dijalankan sebagai Vercel Functions. Tabel berawalan `mumti_` dibuat otomatis pada koneksi pertama; akun database memerlukan izin CREATE TABLE.

Tidak ada fallback progres ke localStorage. Klik **Simpan progres** sebelum menutup halaman dan tunggu notifikasi **Progres berhasil disimpan**. Notifikasi hilang otomatis setelah 4 detik atau dapat ditutup manual. Jika koneksi gagal, aplikasi menampilkan **Belum tersimpan** dan tombol coba lagi. Login lokal dan Vercel dilakukan terpisah karena cookie berbeda origin; data akun tetap sama.

**Akun dan progres browser versi lama tidak otomatis diimpor**, karena data lama tidak memiliki pemilik akun yang dapat diverifikasi. Akun demo bersama dan login admin hardcoded dihapus dari autentikasi. Untuk administrator, ubah `role` akun yang telah terdaftar menjadi `admin` melalui akses database tepercaya. Halaman ringkasan admin masih menggunakan data contoh.

### Verifikasi

`npm test` dan `npm run build`.

Untuk uji integrasi: daftar akun; jawab sebagian latihan; klik **Simpan progres**; tunggu notifikasi berhasil; muat ulang; lanjutkan pelajaran; masuk akun yang sama dari origin lain; pastikan posisi dan jawaban sama. Pastikan akun lain tidak melihat progres tersebut. Uji juga penghapusan draft, penyelesaian, reset, dan putus koneksi. Jangan memakai akun produksi untuk reset pengujian.

Sebelum membuka pendaftaran ke publik berskala besar, tambahkan rate limiting login di Vercel Firewall dan alur pemulihan kata sandi. Environment rahasia tidak boleh diberi awalan `VITE_` atau dikomit.