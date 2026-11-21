# Rencana: Latihan Gabungan Halaman 5–24

## Konteks

Data saat ini sudah memuat tepat 90 soal: 30 Nahwu, 30 Shorof, dan 30 Pelajaran & Pemahaman. UI hanya menawarkan tiga section terpisah; keterangan halaman 5–24 juga masih melekat pada kartu Nahwu. Pengguna memilih tambahan satu jalur gabungan yang memuat semua 90 soal, tanpa menghapus jalur kategori.

## Perubahan yang Direncanakan

1. **Tambahkan section gabungan di `src/data.js`**
   - Definisikan ID stabil, misalnya `halaman-5-24`, dengan label “Latihan halaman 5–24” dan jumlah 90 soal.
   - Tandai section ini sebagai agregat, bukan menggandakan objek soal di `questions`, agar sumber data tetap satu dan ID/progres tidak berubah.
   - Pertahankan tiga section lama untuk latihan terarah per kategori.

2. **Sesuaikan pemilihan soal di `src/main.jsx`**
   - Ubah filter pool pada `startQuiz` agar section gabungan mengambil seluruh `questions`, sedangkan section lama tetap memakai `q.section === sectionId`.
   - Pastikan pemilihan topik tidak membatasi section gabungan secara keliru; pilihan gabungan menggunakan semua topik.
   - Tampilkan jumlah 90 soal dan label section yang benar pada halaman topik/quiz.
   - Pastikan hasil sesi menyimpan section gabungan dan topik “Semua topik” seperti sesi lain, tanpa mengubah format penyimpanan progres yang sudah ada.

3. **Perbarui teks dan tampilan beranda seperlunya**
   - Tambahkan kartu gabungan sebagai pilihan utama atau kartu terpisah yang jelas, dengan deskripsi bahwa halaman 5–24 mencakup 90 soal.
   - Perbaiki teks heading beranda yang saat ini menyebut “Dua jalur” karena setelah perubahan tersedia jalur gabungan dan tiga kategori.
   - Pertahankan gaya visual dan responsivitas yang sudah digunakan; tidak perlu mengubah sistem CSS kecuali penambahan kartu menyebabkan layout membutuhkan penyesuaian kecil.

## Risiko dan Keputusan

- Jangan menyalin 90 soal ke array baru: duplikasi dapat menyebabkan ID ganda dan progres salah.
- Filter agregat harus dibedakan dari filter section biasa.
- Pengacakan tetap dilakukan saat sesi dimulai, sehingga sesi 90 soal menampilkan semua soal sekali masing-masing.
- Perubahan migrasi localStorage tidak diperlukan karena struktur hasil sesi tetap kompatibel.

## Validasi

1. Jalankan `npm run build` untuk memastikan bundle berhasil.
2. Verifikasi secara statis/runtime bahwa `questions.length === 90` dan pool section gabungan juga berjumlah 90.
3. Buka jalur “Latihan halaman 5–24”, pastikan halaman topik menampilkan 90 soal tersedia.
4. Mulai sesi dan pastikan penghitung menunjukkan `/90`, soal berasal dari ketiga kategori, serta sesi dapat diselesaikan dan tersimpan.
5. Verifikasi tiga kartu kategori lama tetap menampilkan masing-masing 30 soal dan tidak terpengaruh.
