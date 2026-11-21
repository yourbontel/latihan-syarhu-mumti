# Rencana: Validasi 90 Soal Halaman 5–24

## Temuan

- `src/data.js` sudah menggabungkan 30 soal Nahwu, 30 Shorof, dan 30 Pelajaran & Pemahaman ke dalam `questions`, sehingga totalnya 90.
- Section `halaman-5-24` sudah didefinisikan sebagai agregat dan `getQuestionsForSection` sudah mengembalikan seluruh `questions` untuk section tersebut.
- `src/main.jsx` sudah memakai `getQuestionsForSection(sectionId)` saat membuat sesi, sehingga sesi “Latihan halaman 5–24” mengambil 90 soal tanpa menggandakan data atau ID.

## Langkah Implementasi/Verifikasi

1. Pertahankan satu sumber data `questions`; jangan menyalin 90 objek ke array baru.
2. Jalankan build produksi dengan `npm run build`.
3. Verifikasi statis/runtime bahwa `questions.length` dan pool `halaman-5-24` sama-sama 90, dengan distribusi 30 soal untuk setiap kategori.
4. Buka kartu “Latihan halaman 5–24”, pastikan halaman topik menampilkan “90 soal tersedia”.
5. Mulai “Semua topik”, pastikan label kuis menampilkan 90 soal dan penghitung berakhir di `/90`; pastikan soal berasal dari Nahwu, Shorof, dan Pelajaran & Pemahaman.
6. Selesaikan sesi dan pastikan hasil/progres tersimpan dengan `section: halaman-5-24` serta total 90.
7. Pastikan tiga section kategori tetap masing-masing berisi 30 soal dan tidak terpengaruh.

## Catatan Risiko

- Jangan mengubah ID soal atau format hasil sesi karena progres tersimpan di localStorage bergantung pada ID tersebut.
- Jangan memfilter ulang section agregat dengan `q.section === 'halaman-5-24'`; soal tetap memiliki section asalnya (`nahwu`, `shorof`, atau `pemahaman`).
- Jika validasi menemukan kartu beranda hanya menonjolkan jumlah topik, perubahan visual minimal dapat menampilkan jumlah 90 soal secara eksplisit tanpa mengubah alur data.

## Kriteria Selesai

- Build berhasil.
- Jalur latihan halaman 5–24 menyediakan tepat 90 soal unik dari tiga kategori.
- Sesi, hasil, dan progres berjalan normal.
- Latihan kategori lama tetap menyediakan 30 soal per kategori.
