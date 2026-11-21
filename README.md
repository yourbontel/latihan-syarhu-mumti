# Mumti Study

## Satu database Neon untuk lokal dan Vercel

1. Buat project Neon dari integrasi **Storage > Neon** di Vercel, atau gunakan database Neon yang sudah ada.
2. Salin connection string Neon ke environment variable `DATABASE_URL` pada Vercel untuk **Production**, **Preview**, dan **Development**.
3. Buat file `.env.local` dari `.env.example` dan isi `DATABASE_URL` dengan connection string database yang sama. Jangan commit `.env.local`.
4. Jalankan migrasi schema otomatis dengan membuka endpoint `/api/health` sekali. Tabel `users` dan `sessions` dibuat oleh API saat request pertama.

### Menjalankan lokal

Install Vercel CLI jika belum tersedia, lalu jalankan `vercel dev`. Perintah ini melayani frontend dan `/api` pada origin yang sama, sehingga cookie login dan database Neon bekerja seperti di deployment.

Alternatifnya, jalankan `npm run dev` dan set `VITE_API_PROXY` ke alamat server Vercel lokal yang menjalankan fungsi API. Jangan menaruh `DATABASE_URL` pada variabel `VITE_*`, karena variabel tersebut masuk ke bundle browser.

Data akun, password hash, sesi login, progres, draft, dan riwayat latihan sekarang disimpan di Neon. `localStorage` tidak lagi digunakan.

Login portal superadmin menggunakan akun database dengan kolom `role = 'admin'`. Buat akun peserta terlebih dahulu, lalu ubah role akun tersebut melalui Neon SQL Editor bila perlu:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```