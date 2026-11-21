const make = (section, topic, number, prompt, options, answer, arabic = '') => ({
  id: `${section}-${String(number).padStart(2, '0')}`,
  section, topic, title: `${topic} ${number}`, prompt, arabic, options,
  answer, explanation: options[answer]
});

const q = (section, topic, rows) => rows.map((row, index) => make(section, topic, index + 1, ...row));

const nahwu = q('nahwu', 'Nahwu', [
  ["Pada ungkapan بِسْمِ اللهِ, jar wa majrur بِسْمِ muta'allaq dengan kata yang dibuang berupa ...", ['Isim yang diawalkan', "Fi'il yang diakhirkan", 'Harf yang disambung', 'Masdar yang diawalkan'], 1],
  ["Dalam إِلَى صِرَاطِ الْعَزِيزِ الْحَمِيدِ اللَّهِ, lafaz اللَّهِ di-i'rab sebagai ...", ["Na'at (shifah)", 'Badal', "'Athaf bayan", 'Taukid'], 2],
  ['Jumlah الحَمْدُ لِلَّهِ merupakan jumlah ismiyah yang susunannya adalah ...', ["Fi'il dan fa'il", "Mubtada' dan khabar", 'Harf dan isim', "Mubtada' dan badal"], 1],
  ['Makna huruf lam pada لِلَّهِ dalam الحَمْدُ لِلَّهِ adalah ...', ['Al-ikhtishash dan al-istihqaq', 'Al-qasam dan at-ta’ajjub', "At-ta'lil dan al-intiha'", "Al-ibtidaiyah dan az-zarfiyah"], 0],
  ["Kedudukan i'rab حَمْداً pada الحَمْدُ لِلَّهِ حَمْداً لا يَنْفَدُ adalah ...", ['Hal manshub', 'Tamyiz manshub', "Masdar (maf'ul muthlaq) manshub", "Maf'ul li ajlih"], 2],
  ["'Amil yang menashabkan حَمْداً adalah ...", ["Fi'il yang dibuang", 'Masdar الحَمْدُ sebelumnya', 'Huruf lam pada لِلَّهِ', 'Jumlah لا يَنْفَدُ'], 1],
  ['Fungsi kalimat لا يَنْفَدُ setelah حَمْداً adalah sebagai ...', ['Sifat (na’at) yang menjelaskan jenis pujian', 'Khabar kedua', 'Badal', "Maf'ul bih"], 0],
  ["Pada أَفْضَلَ ما يَنْبَغِي أَنْ يُحْمَدَ, kedudukan أَفْضَلَ adalah ...", ["Mubtada' mu'akhkhar", 'Sifat kedua bagi حَمْداً', 'Hal dari dhamir يُحْمَدَ', "Maf'ul bih dari يَنْبَغِي"], 1],
  ['Jenis kata ما pada أَفْضَلَ ما يَنْبَغِي أَنْ يُحْمَدَ adalah ...', ['Ma nafiyah', 'Ma istifhamiyah', 'Ma nakirah maushufah', 'Ma mashdariyah'], 2],
  ['Status وَصَلَّى اللَّهُ وَسَلَّمَ dilihat dari lafaz dan maknanya adalah ...', ['Insya’iyah lafaznya, khabariyah maknanya', 'Khabariyah lafaznya, insya’iyah maknanya', 'Khabariyah lafaz dan maknanya', 'Insya’iyah lafaz dan maknanya'], 1],
  ["Pada عَلَى أَفْضَلِ المُصْطَفَيْنَ مُحَمَّدٍ, kedudukan مُحَمَّدٍ adalah ...", ["Na'at", 'Khabar', "'Athaf bayan", "Maf'ul bih"], 2],
  ['Pada وَمَنْ تَعَبَّدَ, مَنْ merupakan isim maushul yang berfaedah ...', ['Pengkhususan', 'Keumuman', 'Pertanyaan', 'Syarat'], 1],
  ['Pada أَمَّا بَعْدُ, fungsi أَمَّا adalah sebagai ...', ["Harf nida'", "Pengganti syarat dan fi'il syarat", 'Isim istifham', "Harf 'athaf"], 1],
  ["I'rab بَعْدُ pada أَمَّا بَعْدُ adalah zharaf yang ...", ['Mu’rab dan majrur', 'Mabni ‘ala al-fath', 'Mabni ‘ala adh-dhamm pada posisi nashab', "Marfu' sebagai mubtada'"], 2],
  ['Kata kerja yang menjadi muta’allaq bagi zharaf بَعْدُ adalah ...', ['كَانَ yang disebutkan', 'يَكُنْ yang dibuang bersama syaratnya', 'أَقْرَأُ yang ditakdirkan', 'قَالَ yang dibuang'], 1],
  ['Pada فَهَذَا مُخْتَصَرٌ فِي الفِقْهِ مِنْ مُقْنِعِ الإِمَامِ, مِنْ مُقْنِعِ berkedudukan sebagai ...', ['Khabar kedua', 'Hal dari هَذَا', 'Sifat bagi مُخْتَصَرٌ', "Maf'ul bih"], 2],
  ['Pada كَفَى الخَلْقَ بِالكَافِي, الخَلْقَ adalah ...', ["Fa'il", "Maf'ul bih", 'Tamyiz', 'Zharaf'], 1],
  ['Pada وَرُبَّمَا حَذَفْتُ مِنْهُ مَسَائِلَ, dhamir هُ kembali kepada ...', ['Imam Ahmad', "Kitab al-Muqni'", 'Kitab al-Kafi', 'Penulis'], 1],
  ['Mengapa مَسَائِلَ dibaca fathah tanpa tanwin?', ['Karena mabni', 'Karena mudhaf', "Karena mamnu' minash-sharf (shighah muntahal jumu')", "Karena kemasukan alif lam yang dibuang"], 2],
  ['Pada مَسَائِلَ نَادِرَةَ الوُقُوعِ, hubungan نَادِرَةَ dengan مَسَائِلَ adalah ...', ["Sifat (na'at), dan tidak bertanwin karena idhafah", "Badal, dan tidak bertanwin karena 'alamiyah", 'Hal, dan tidak bertanwin karena mu’annats', 'Tamyiz, dan tidak bertanwin karena jamak'], 0],
  ['Pada وَزِدْتُ مَا عَلَى مِثْلِهِ يُعْتَمَدُ, jenis dan kedudukan مَا adalah ...', ['Ma nafiyah, tidak berkedudukan', "Isim maushul bermakna الَّذِي, sebagai maf'ul bih", "Ma istifhamiyah, sebagai mubtada'", "Ma mashdariyah, sebagai fa'il"], 1],
  ['Jar wa majrur عَلَى مِثْلِهِ muta’allaq dengan ...', ['زِدْتُ', 'مَا', 'يُعْتَمَدُ', 'حَذَفْتُ'], 2],
  ['Pada إِذِ الهِمَمُ قَدْ قَصُرَتْ, fungsi إِذْ adalah ...', ['Harf mufaja’ah', 'Harf ta’lil', 'Isim syarat', 'Harf nafi'], 1],
  ['Yang menjadi khabar bagi mubtada’ الهِمَمُ adalah ...', ['إِذْ', 'قَدْ saja', 'Jumlah قَدْ قَصُرَتْ', 'Fa’il tersembunyi'], 2],
  ['Pada وَالأَسْبَابُ المُثَبِّطَةُ, المُثَبِّطَةُ berkedudukan sebagai ...', ['Khabar', 'Sifat bagi الأَسْبَابُ', 'Hal', "Maf'ul bih"], 1],
  ['Pada وَلا حَوْلَ وَلا قُوَّةَ إِلَّا بِاللَّهِ, لا pertama adalah ...', ['La nahiyah', 'La nafiyah lil-jinsi', 'La ‘athifah', 'La za’idah'], 1],
  ['Pada وَهُوَ حَسْبُنَا, حَسْبُنَا adalah ...', ["Na'at", "Fa'il", "Khabar dari mubtada' هُوَ", 'Badal'], 2],
  ['Pada وَنِعْمَ الوَكِيلُ, الوَكِيلُ adalah ...', ['Makhshush bil-madh', "Fa'il bagi نِعْمَ", "Maf'ul bih", 'Tamyiz'], 1],
  ['Unsur yang dibuang pada وَنِعْمَ الوَكِيلُ adalah ...', ["Fa'il-nya", "Fi'il-nya", "Makhshush bil-madh-nya (taqdirnya: اللَّهُ)", "Khabar-nya"], 2],
  ['Pada كَانَ شَيْخُنَا عَبْدُ الرَّحْمَنِ, عَبْدُ setelah شَيْخُنَا adalah ...', ['Khabar kana', "Badal atau 'athaf bayan", "Maf'ul bih", 'Tamyiz'], 1]
]);

const shorof = q('shorof', 'Shorof', [
  ["Bentuk fi'il madhi ma'lum dan masdar dari شُغِفَ adalah ...", ['شَغَفَ – شَغَفاً', 'شَاغَفَ – مُشَاغَفَةً', 'أَشْغَفَ – إِشْغَافاً', 'تَشَغَّفَ – تَشَغُّفاً'], 0],
  ['تَقْرِيرٌ berasal dari ق ر ر dan mengikuti wazan ...', ['تَفَاعُلٌ', 'تَفْعِيلٌ', 'تَفَعُّلٌ', 'اِفْتِعَالٌ'], 1],
  ['Fi’il madhi dari تَهْذِيبٌ dan تَرْتِيبٌ adalah ...', ['هَذَبَ dan رَتَبَ', 'أَهْذَبَ dan أَرْتَبَ', 'هَذَّبَ dan رَتَّبَ', 'تَهَذَّبَ dan تَرَتَّبَ'], 2],
  ['بَدَاءَةٌ adalah masdar dari بَدَأَ, termasuk bina’ ...', ['Mahmuz fa’', 'Mahmuz ‘ain', 'Mahmuz lam', 'Naqish wawi'], 2],
  ['مُؤَخَّرٌ termasuk shighah ...', ["Isim fa'il", "Isim maf'ul dari أَخَّرَ", 'Isim zaman', 'Masdar mimi'], 1],
  ['مُوصِلٌ adalah isim fa’il dari أَوْصَلَ dengan wazan ...', ['فَاعِلٌ', 'مُفَعِّلٌ', 'مُفْعِلٌ', 'مُفْتَعِلٌ'], 2],
  ['Fi’il madhi dari يَنْفَدُ beserta harakat ‘ain fi’il-nya adalah ...', ['نَفَدَ (fathah)', 'نَفِدَ (kasrah)', 'نَفُدَ (dhammah)', 'أَنْفَدَ (mazid)'], 1],
  ['مَعْمُولٌ termasuk shighah ...', ["Isim fa'il", 'Shifah musyabbahah', "Isim maf'ul dari عَمِلَ", 'Isim alat'], 2],
  ['مُؤَكِّدٌ adalah isim fa’il dari ...', ['أَكَدَ', 'أَكَّدَ', 'تَأَكَّدَ', 'اِئْتَكَدَ'], 1],
  ['Perubahan ت menjadi ط pada المُصْطَفَيْنَ terjadi karena ...', ['Bertemu wawu', 'Didahului shad (ithbaq) agar mudah diucapkan', 'Diakhiri ya', 'Diikuti fa’'], 1],
  ['Akar kata dan shighah المُصْطَفَيْنَ adalah ...', ['ص ف و – isim maf’ul', 'ص ط ف – isim fa’il', 'و ص ف – isim maf’ul', 'ص ف ح – isim fa’il'], 0],
  ['خَاتَمٌ dengan fathah pada ta’ berarti ...', ['Yang memulai', 'Penutup/yang terakhir menutup', 'Yang menyerupai', 'Yang menyertai'], 1],
  ['Akar kata tsulatsi خُلَاصَةٌ adalah ...', ['خ ل ص', 'خ ص ص', 'ل خ ص', 'خ ل ط'], 0],
  ['الآلُ sebelum i’lal berasal dari ...', ['أ ل ل', 'أ و ل (atau أ هـ ل)', 'و ل ي', 'أ ي ل'], 1],
  ['صَحْبٌ adalah isim jamak dari ...', ['صُحْبَةٌ', 'صَحَابِيٌّ', 'صَاحِبٌ', 'مُصَاحِبٌ'], 2],
  ['مَوْصُولٌ berasal dari وَصَلَ, termasuk bina’ ...', ['Ajwaf wawi', 'Mitsal wawi', 'Naqish wawi', 'Mudha’af'], 1],
  ['Masdar تَعَبَّدَ yang mengikuti تَفَعَّلَ adalah ...', ['تَعْبِيدٌ', 'تَعَابُدٌ', 'تَعَبُّدٌ', 'اِسْتِعْبَادٌ'], 2],
  ['Wazan dan jamak أُسْلُوبٌ adalah ...', ['أَفْعَلُ – أَسْلَابٌ', 'أُفْعُولٌ – أَسَالِيبُ', 'فُعْلُولٌ – سَلَابِيبُ', 'مَفْعُولٌ – مَسَالِيبُ'], 1],
  ['مُخْتَصَرٌ pada wazan مُفْتَعَلٌ termasuk ...', ["Isim fa'il", "Isim maf'ul", 'Isim alat', 'Shifah musyabbahah'], 1],
  ['اِخْتِصَارٌ mengikuti wazan ...', ['اِسْتِفْعَالٌ', 'اِنْفِعَالٌ', 'اِفْتِعَالٌ', 'إِفْعَالٌ'], 2],
  ['اِحْتِرَازاً adalah masdar dari wazan ...', ['اِفْتَعَلَ – اِفْتِعَالاً', 'اِنْفَعَلَ – اِنْفِعَالاً', 'اِسْتَفْعَلَ – اِسْتِفْعَالاً', 'أَفْعَلَ – إِفْعَالاً'], 0],
  ['مُقَلِّدٌ adalah isim fa’il dari ...', ['قَلَدَ', 'أَقْلَدَ', 'قَلَّدَ', 'تَقَلَّدَ'], 2],
  ['مُقْنِعٌ adalah isim fa’il dari ...', ['قَنَعَ', 'قَنَّعَ', 'أَقْنَعَ', 'اِقْتَنَعَ'], 2],
  ['المُوَفَّقُ adalah ...', ["Isim fa'il dari وَفَقَ", "Isim maf'ul dari وَفَّقَ", "Isim maf'ul dari أَوْفَقَ", "Isim fa'il dari تَوَفَّقَ"], 1],
  ['مُطَوَّلٌ adalah ...', ["Isim maf'ul dari طَوَّلَ", "Isim fa'il dari طَالَ", 'Isim tafdhil', 'Isim makan'], 0],
  ['مَذْهَبٌ secara bahasa dapat berupa ...', ["Isim fa'il, isim maf'ul, dan isim alat", 'Isim makan, isim zaman, dan masdar', 'Shifah musyabbahah, isim tafdhil, dan hal', "Jamak taksir, masdar, dan isim fa'il"], 1],
  ['قِيَاسٌ dari قَاسَ يَقِيسُ termasuk bina’ ...', ['Mitsal ya’i', 'Ajwaf ya’i', 'Naqish ya’i', 'Lafif maqrun'], 1],
  ['مُثَبِّطَةٌ adalah isim fa’il mu’annats dari ...', ['ثَبَتَ', 'أَثْبَتَ', 'ثَبَّطَ', 'تَثَبَّطَ'], 2],
  ['نَيْلٌ dari نَالَ يَنَالُ termasuk bina’ ...', ['Ajwaf ya’i', 'Naqish wawi', 'Shahih', 'Mudha’af'], 0],
  ['الوَكِيلُ sebagai fa’il bermakna maf’ul (الموكول إليه) berarti ...', ['Yang mewakilkan', 'Yang diserahi urusan', 'Yang meminta pertolongan', 'Yang menghukum'], 1]
]);

const pemahaman = q('pemahaman', 'Pelajaran & Pemahaman', [
  ['Nama lengkap pengarang Zad al-Mustaqni’ fi Ikhtishar al-Muqni’ adalah ...', ['Ibnu Qudamah al-Maqdisi', 'Abu an-Naja Musa bin Ahmad bin Musa al-Hajjawi', 'Mar’i bin Yusuf al-Karmi', 'Sulaiman bin Abdullah Aba al-Khail'], 1],
  ['Zad al-Mustaqni’ merupakan ringkasan dari ...', ['Al-Mughni', 'Al-Kafi', 'Al-Muqni’', 'Al-’Umdah'], 2],
  ['Metode penulisan al-Hajjawi dalam Zad al-Mustaqni’ adalah ...', ['Mengumpulkan seluruh pendapat mazhab', 'Mencukupkan satu pendapat rajih dalam mazhab Hanbali', 'Hanya menyebut hadis', 'Membahas ulama kontemporer'], 1],
  ['Guru Ibnu Utsaimin yang mendorong beliau menghafal Zad adalah ...', ['Abdul Aziz bin Baz', 'Abdurrahman bin Nashir as-Sa’di', 'Muhammad bin Ibrahim', 'Sulaiman al-Hafyan'], 1],
  ['Masjid tempat Ibnu Utsaimin mengajarkan Zad adalah ...', ['Masjidil Haram', 'Masjid Nabawi', "Masjid Jami' Kabir, 'Unaizah", 'Masjidil Aqsha'], 2],
  ['Dua ulama yang pertama menerbitkan Syarh al-Mumti’ dari rekaman dan catatan adalah ...', ['Dr. Sulaiman Aba al-Khail dan Dr. Khalid al-Musyaiqih', 'Ibnu Qudamah dan al-Hajjawi', 'Umar al-Hafyan dan as-Sa’di', 'Yahya ash-Sharshari dan Ibnu Taimiyah'], 0],
  ['Alasan revisi cetakan pertama Syarh al-Mumti’ adalah ...', ['Banyak kesalahan cetak ayat', 'Penjelasan lisan tidak sama dengan tulisan dalam pilihan kata dan kerapian', 'Murid meminta terjemahan', 'Kitab asal hilang'], 1],
  ['Yang mentakhrij hadis dan mengoreksi cetak coba edisi revisi adalah ...', ['Dr. Khalid al-Musyaiqih', 'Dr. Sulaiman Aba al-Khail', 'Umar bin Sulaiman al-Hafyan', 'Abdurrahman as-Sa’di'], 2],
  ['Mengawali kitab dengan basmalah meneladani ...', ['Kitab filsafat Yunani', 'Al-Qur’an dan kebiasaan Nabi saat menulis surat', 'Penyair Jahiliyah', 'Tradisi hakim'], 1],
  ['Ketika digabungkan, الرحمن dan الرحيم menunjukkan ...', ['Makna sama persis', 'Rahman luas sifat rahmat; Rahim sampainya rahmat kepada hamba yang dikehendaki', 'Rahman akhirat dan Rahim dunia', 'Rahman pengampun dan Rahim pemberi rezeki'], 1],
  ['Doa Nabi ketika tertimpa kesusahan adalah ...', ['Alhamdulillahilladzi bini’matihi tatimmush shalihat', 'Alhamdulillahi ‘ala kulli hal', 'Subhanallahi wa bihamdihi', 'La haula wa la quwwata illa billah'], 1],
  ['Allah berhak atas pujian yang la yanfad karena ...', ['Manusia hidup selamanya', 'Kesempurnaan Allah tidak pernah habis', 'Pujian bersuara keras', 'Malaikat mencatatnya'], 1],
  ['Definisi shalawat dari Allah menurut Abul Aliyah adalah ...', ['Ampunan malaikat', 'Doa kaum mukminin', 'Pujian Allah kepada yang dishalawati di al-mala’ al-a’la', 'Rahmat umum'], 2],
  ['Manfaat penggabungan shalawat dan salam adalah ...', ['Salam menghilangkan yang ditakuti/kekurangan; shalawat mencapai yang diharapkan/kesempurnaan', 'Sekadar memperindah kalimat', 'Salam untuk keluarga, shalawat untuk sahabat', 'Shalawat menghapus dosa, salam menambah harta'], 0],
  ['Yang bukan bukti keutamaan Nabi atas ulul azmi adalah ...', ['Penutup para nabi', 'Imam para nabi pada malam Mi’raj', 'Pemilik syafa’at al-’uzhma', 'Memiliki usia paling panjang'], 3],
  ['Makna الآل bersama الأصحاب dan من تعبّد adalah ...', ['Seluruh umat manusia', 'Kerabat Nabi yang beriman', 'Para malaikat', 'Penduduk Makkah'], 1],
  ['Dua fondasi ibadah dan syarat diterimanya adalah ...', ['Takut dan harap; kaya dan sehat', 'Cinta dan pengagungan; ikhlas dan mutaba’ah', 'Sabar dan syukur; wudhu dan kiblat', 'Zikir dan doa; masjid dan jamaah'], 1],
  ['أَمَّا بَعْدُ diucapkan ketika ...', ['Mengakhiri pembicaraan', 'Memasuki inti topik yang dituju', 'Berpindah gaya bahasa', 'Memulai salam penutup'], 1],
  ['Definisi al-fiqh secara istilah adalah ...', ['Memahami arti bahasa Arab', 'Mengetahui ilmu alam dan sejarah', "Mengetahui hukum syara' amaliyah beserta dalil terperinci", 'Menghafal matan tanpa dalil'], 2],
  ['Bagi yang mampu menggali dalil sendiri, taklid diserupakan dengan ...', ['Memakan makanan lezat', 'Memakan bangkai (akl al-maitah)', 'Minum zamzam', 'Menuntut ilmu wajib'], 1],
  ['Peringatan terkait gelar dan kesaksian adalah ...', ['Boleh menyebut siapa saja imam besar', 'Tidak bermudah memberi gelar Imam dan memastikan syahid kecuali ada nas', 'Wajib memberi gelar syahid', 'Imam hanya untuk ahli hadis'], 1],
  ['Kitab Ibnu Qudamah yang menyajikan fikih perbandingan lintas mazhab adalah ...', ['Al-’Umdah', 'Al-Muqni’', 'Al-Kafi', 'Al-Mughni'], 3],
  ['Al-Muwaffaq Abdullah bin Ahmad bin Qudamah wafat pada ...', ['520 H', '620 H', '720 H', '820 H'], 1],
  ['Mihnah Imam Ahmad berkaitan dengan akidah ...', ['Kemakhlukan Al-Qur’an', 'Jumlah rakaat tarawih', 'Awal Ramadhan', 'Mengusap khuf'], 0],
  ['Al-madzhab al-isthilahi adalah ...', ['Pendapat pribadi imam', 'Pendapat yang disepakati dan dijadikan istilah mazhab oleh penerusnya', 'Fatwa satu negeri', 'Pendapat tanpa dalil'], 1],
  ['Tiga langkah al-Hajjawi menyusun Zad adalah ...', ['Menambah pendapat dan syair serta menghapus thaharah', 'Memilih satu pendapat, menghapus masalah langka, menambah masalah penting', 'Menerjemahkan Persia dan menghapus dalil', 'Mengubah ke mazhab Syafi’i'], 1],
  ['Alasan membuang masalah langka adalah ...', ['Kertas mahal', 'Semangat menuntut ilmu melemah dan penghalang semakin banyak', 'Tidak ada guru', 'Perintah penguasa'], 1],
  ['Penghalang terbesar berpaling dari zikir dan ilmu serta amalan yang dianjurkan adalah ...', ['Kemiskinan; tidur', 'Dosa-dosa; memperbanyak istighfar', 'Kesibukan dagang; safar', 'Banyak bicara; puasa sebulan'], 1],
  ['Perbandingan Zad dan Dalil ath-Thalib adalah ...', ['Zad lebih padat/komprehensif, Dalil lebih rapi susunannya', 'Dalil lebih padat, Zad lebih panjang', 'Pengarang sama', 'Zad ibadah, Dalil muamalah'], 0],
  ['Yang mengucapkan حَسْبُنَا اللَّهُ وَنِعْمَ الوَكِيلُ ketika dilempar ke api adalah ...', ['Musa', 'Nuh', 'Ibrahim', 'Isa'], 2]
]);

export const questions = [...nahwu, ...shorof, ...pemahaman];
export const ALL_SECTION_ID = 'halaman-5-24';
export const sections = [
  { id: ALL_SECTION_ID, eyebrow: 'LATIHAN UTAMA', title: 'Latihan halaman 5–24 (Muqoddimah)', description: '90 soal lengkap dari Nahwu, Shorof, dan Pelajaran & Pemahaman.', icon: '90', topics: ['Nahwu', 'Shorof', 'Pelajaran & Pemahaman'] },
  { id: 'nahwu', eyebrow: 'Bagian 01', title: '30 Soal Nahwu', description: 'Latihan i\'rab dan pemahaman struktur bahasa Arab dari halaman 5–24.', icon: 'نحو', topics: ['Nahwu'] },
  { id: 'shorof', eyebrow: 'Bagian 02', title: '30 Soal Shorof', description: 'Latihan akar kata, wazan, bina, dan perubahan bentuk kata.', icon: 'صرف', topics: ['Shorof'] },
  { id: 'pemahaman', eyebrow: 'Bagian 03', title: '30 Soal Pemahaman', description: 'Uji pelajaran, sejarah kitab, dan pemahaman materi Syarh al-Mumti’.', icon: 'علم', topics: ['Pelajaran & Pemahaman'] }
];
export const getQuestionsForSection = (sectionId) => sectionId === ALL_SECTION_ID ? questions : questions.filter((item) => item.section === sectionId);
export const getTopics = (sectionId) => [...new Set(getQuestionsForSection(sectionId).map((item) => item.topic))];
export const getQuestionCount = (sectionId) => getQuestionsForSection(sectionId).length;
