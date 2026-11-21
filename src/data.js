const make = (section, topic, number, prompt, options, answer, arabic = '') => ({
  id: `${section}-${String(number).padStart(2, '0')}`,
  section, topic, title: `${topic} ${number}`, prompt, arabic, options,
  answer, explanation: options[answer]
});

const q = (section, topic, rows) => rows.map((row, index) => make(section, topic, index + 1, ...row));

const nahwu = q('nahwu', 'Nahwu', [
  ["Pada ungkapan بِسْمِ اللهِ, jar wa majrur (بِسْمِ) muta'allaq dengan kata yang dibuang (mahdzuf) berupa ...", ['Isim yang diawalkan', "Fi'il yang diakhirkan", 'Harf yang disambung', 'Masdar yang diawalkan'], 1],
  ["Dalam QS. Ibrahim: 1–2 (إِلَى صِرَاطِ الْعَزِيزِ الْحَمِيدِ اللَّهِ), lafaz اللَّهِ di-i'rab sebagai ...", ["Na'at (shifah)", 'Badal', "'Athaf bayan", 'Taukid'], 2],
  ['Jumlah الحَمْدُ لِلَّهِ merupakan jumlah ismiyah yang susunannya adalah ...', ["Fi'il dan fa'il", "Mubtada' dan khabar", 'Harf dan isim', "Mubtada' dan badal"], 1],
  ['Makna huruf lam pada kata لِلَّهِ dalam kalimat الحَمْدُ لِلَّهِ adalah ...', ['Al-ikhtishash dan al-istihqaq', "Al-qasam dan at-ta'ajjub", "At-ta'lil dan al-intiha'", "Al-ibtidaiyah dan az-zarfiyah"], 0],
  ["Kedudukan i'rab kata حَمْداً pada frasa الحَمْدُ لِلَّهِ حَمْداً لا يَنْفَدُ adalah ...", ['Hal yang manshub', 'Tamyiz yang manshub', "Masdar (maf'ul muthlaq) yang manshub", "Maf'ul li ajlih"], 2],
  ["'Amil yang menashabkan kata حَمْداً pada kalimat الحَمْدُ لِلَّهِ حَمْداً لا يَنْفَدُ adalah ...", ["Fi'il yang dibuang", 'Masdar الحَمْدُ sebelumnya', 'Huruf lam pada لِلَّهِ', 'Jumlah لا يَنْفَدُ'], 1],
  ['Fungsi kalimat لا يَنْفَدُ setelah kata حَمْداً adalah sebagai ...', ["Sifat (na'at) yang menjelaskan jenis pujian", 'Khabar kedua', 'Badal', "Maf'ul bih"], 0],
  ["Pada frasa أَفْضَلَ ما يَنْبَغِي أَنْ يُحْمَدَ, kedudukan i'rab kata أَفْضَلَ adalah ...", ["Mubtada' mu'akhkhar", 'Sifat kedua bagi حَمْداً', 'Hal dari dhamir يُحْمَدَ', "Maf'ul bih dari يَنْبَغِي"], 1],
  ['Jenis kata ما pada frasa أَفْضَلَ ما يَنْبَغِي أَنْ يُحْمَدَ adalah ...', ['Ma nafiyah', 'Ma istifhamiyah', 'Ma nakirah maushufah', 'Ma mashdariyah'], 2],
  ['Status kalimat وَصَلَّى اللَّهُ وَسَلَّمَ dilihat dari lafaz dan maknanya adalah ...', ["Insya'iyah lafaznya, khabariyah maknanya", "Khabariyah lafaznya, insya'iyah maknanya", 'Khabariyah lafaz dan maknanya', "Insya'iyah lafaz dan maknanya"], 1],
  ['Pada ungkapan عَلَى أَفْضَلِ المُصْطَفَيْنَ مُحَمَّدٍ, kedudukan kata مُحَمَّدٍ adalah ...', ["Na'at", 'Khabar', "'Athaf bayan", "Maf'ul bih"], 2],
  ['Pada frasa وَمَنْ تَعَبَّدَ, kata مَنْ merupakan isim maushul yang berfaedah ...', ['Pengkhususan (lil-khushush)', "Keumuman (lil-'umum)", 'Pertanyaan (lil-istifham)', 'Syarat (lisy-syarth)'], 1],
  ['Pada ungkapan أَمَّا بَعْدُ, fungsi kata أَمَّا adalah sebagai ...', ["Harf nida'", "Pengganti syarat dan fi'il syarat", 'Isim istifham', "Harf 'athaf"], 1],
  ["I'rab kata بَعْدُ pada أَمَّا بَعْدُ adalah zharaf yang ...", ["Mu'rab dan majrur", "Mabni 'ala al-fath", "Mabni 'ala adh-dhamm pada posisi nashab", "Marfu' sebagai mubtada'"], 2],
  ["Kata kerja yang menjadi muta'allaq bagi zharaf بَعْدُ pada أَمَّا بَعْدُ adalah ...", ['كَانَ yang disebutkan', 'يَكُنْ yang dibuang bersama syaratnya', 'أَقْرَأُ yang ditakdirkan', 'قَالَ yang dibuang'], 1],
  ['Pada frasa فَهَذَا مُخْتَصَرٌ فِي الفِقْهِ مِنْ مُقْنِعِ الإِمَامِ, kedudukan jar wa majrur مِنْ مُقْنِعِ adalah ...', ['Khabar kedua', 'Hal dari هَذَا', 'Sifat bagi مُخْتَصَرٌ', "Maf'ul bih"], 2],
  ["Pada bait syair كَفَى الخَلْقَ بِالكَافِي (hal. 19), kedudukan i'rab kata الخَلْقَ adalah ...", ["Fa'il", "Maf'ul bih", 'Tamyiz', 'Zharaf'], 1],
  ['Pada kalimat وَرُبَّمَا حَذَفْتُ مِنْهُ مَسَائِلَ, ke mana kembalinya dhamir هُ pada kata مِنْهُ?', ['Imam Ahmad', "Kitab al-Muqni'", 'Kitab al-Kafi', 'Penulis (al-Hajjawi)'], 1],
  ['Pada kalimat وَرُبَّمَا حَذَفْتُ مِنْهُ مَسَائِلَ, mengapa kata مَسَائِلَ dibaca fathah tanpa tanwin?', ['Karena mabni', 'Karena mudhaf', "Karena mamnu' minash-sharf (shighah muntahal jumu')", 'Karena kemasukan alif lam yang dibuang'], 2],
  ['Pada frasa مَسَائِلَ نَادِرَةَ الوُقُوعِ, hubungan kata نَادِرَةَ dengan مَسَائِلَ adalah ...', ["Sifat (na'at), dan tidak bertanwin karena idhafah", "Badal, dan tidak bertanwin karena 'alamiyah", "Hal, dan tidak bertanwin karena mu'annats", 'Tamyiz, dan tidak bertanwin karena jamak'], 0],
  ['Pada kalimat وَزِدْتُ مَا عَلَى مِثْلِهِ يُعْتَمَدُ, jenis dan kedudukan kata مَا adalah ...', ['Ma nafiyah, tidak berkedudukan', "Isim maushul bermakna الَّذِي, sebagai maf'ul bih", "Ma istifhamiyah, sebagai mubtada'", "Ma mashdariyah, sebagai fa'il"], 1],
  ["Masih pada frasa مَا عَلَى مِثْلِهِ يُعْتَمَدُ, jar wa majrur عَلَى مِثْلِهِ muta'allaq dengan ...", ['زِدْتُ', 'مَا', 'يُعْتَمَدُ', 'حَذَفْتُ'], 2],
  ['Pada kalimat إِذِ الهِمَمُ قَدْ قَصُرَتْ, fungsi huruf إِذْ di sini adalah ...', ["Harf mufaja'ah (kejutan)", "Harf ta'lil (penjelas sebab/alasan)", 'Isim syarat', 'Harf nafi'], 1],
  ["Pada kalimat إِذِ الهِمَمُ قَدْ قَصُرَتْ, yang menjadi khabar bagi mubtada' الهِمَمُ adalah ...", ['إِذْ', 'قَدْ saja', 'Jumlah قَدْ قَصُرَتْ', "Fa'il yang tersembunyi"], 2],
  ['Pada kalimat وَالأَسْبَابُ المُثَبِّطَةُ عَنْ نَيْلِ المُرَادِ قَدْ كَثُرَتْ, kedudukan kata المُثَبِّطَةُ adalah ...', ['Khabar', "Sifat (na'at) bagi الأَسْبَابُ", 'Hal', "Maf'ul bih"], 1],
  ['Pada ungkapan وَلا حَوْلَ وَلا قُوَّةَ إِلَّا بِاللَّهِ, huruf لا yang pertama adalah ...', ['La nahiyah', 'La nafiyah lil-jinsi', "La 'athifah", "La za'idah"], 1],
  ['Pada kalimat وَهُوَ حَسْبُنَا, kedudukan kata حَسْبُنَا adalah ...', ["Na'at", "Fa'il", "Khabar dari mubtada' هُوَ", 'Badal'], 2],
  ["Pada kalimat وَنِعْمَ الوَكِيلُ, kedudukan i'rab kata الوَكِيلُ adalah ...", ['Makhshush bil-madh', "Fa'il bagi نِعْمَ", "Maf'ul bih", 'Tamyiz'], 1],
  ['Pada kalimat وَنِعْمَ الوَكِيلُ, unsur yang dibuang (mahdzuf) adalah ...', ["Fa'il-nya", "Fi'il-nya", 'Makhshush bil-madh-nya (taqdirnya: اللَّهُ)', 'Khabar-nya'], 2],
  ['Pada kalimat كَانَ شَيْخُنَا عَبْدُ الرَّحْمَنِ ... يَحُثُّنَا, kedudukan kata عَبْدُ setelah شَيْخُنَا adalah ...', ['Khabar kana', "Badal atau 'athaf bayan", "Maf'ul bih", 'Tamyiz'], 1]
]);

const shorof = q('shorof', 'Shorof', [
  ["Bentuk fi'il madhi ma'lum dan masdar dari kata شُغِفَ (hal. 5) adalah ...", ['شَغَفَ – شَغَفاً', 'شَاغَفَ – مُشَاغَفَةً', 'أَشْغَفَ – إِشْغَافاً', 'تَشَغَّفَ – تَشَغُّفاً'], 0],
  ['Kata تَقْرِيرٌ (hal. 6: الشرح بالتقرير) berasal dari akar kata ق ر ر dan mengikuti wazan ...', ['تَفَاعُلٌ', 'تَفْعِيلٌ', 'تَفَعُّلٌ', 'اِفْتِعَالٌ'], 1],
  ["Kata kerja fi'il madhi dari masdar تَهْذِيبٌ dan تَرْتِيبٌ (hal. 6) adalah ...", ['هَذَبَ dan رَتَبَ', 'أَهْذَبَ dan أَرْتَبَ', 'هَذَّبَ dan رَتَّبَ', 'تَهَذَّبَ dan تَرَتَّبَ'], 2],
  ["Kata بَدَاءَةٌ (hal. 7) adalah masdar dari بَدَأَ, yang termasuk bina' ...", ["Mahmuz fa'", "Mahmuz 'ain", 'Mahmuz lam', 'Naqish wawi'], 2],
  ['Kata مُؤَخَّرٌ (hal. 7: فعل مؤخر) termasuk shighah ...', ["Isim fa'il", "Isim maf'ul dari أَخَّرَ", 'Isim zaman', 'Masdar mimi'], 1],
  ["Kata مُوصِلٌ (hal. 7: الموصل رحمته) adalah isim fa'il dari fi'il madhi أَوْصَلَ dengan wazan ...", ['فَاعِلٌ', 'مُفَعِّلٌ', 'مُفْعِلٌ', 'مُفْتَعِلٌ'], 2],
  ["Fi'il madhi dari يَنْفَدُ (hal. 9: لا ينفد) beserta harakat 'ain fi'il-nya adalah ...", ['نَفَدَ (fathah)', 'نَفِدَ (kasrah)', 'نَفُدَ (dhammah)', 'أَنْفَدَ (mazid)'], 1],
  ['Kata مَعْمُولٌ (hal. 9: مصدر معمول لمصدر) termasuk shighah ...', ["Isim fa'il", 'Shifah musyabbahah', "Isim maf'ul dari عَمِلَ", 'Isim alat'], 2],
  ["Kata مُؤَكِّدٌ (hal. 9: مصدر مؤكد) adalah isim fa'il dari fi'il madhi ...", ['أَكَدَ', 'أَكَّدَ', 'تَأَكَّدَ', 'اِئْتَكَدَ'], 1],
  ['Kata المُصْطَفَيْنَ (hal. 11) asalnya المُصْتَفَيْنَ. Perubahan huruf ت menjadi ط terjadi karena ...', ['Bertemu huruf wawu', 'Didahului huruf shad (ithbaq) agar mudah diucapkan', "Diakhiri huruf ya'", "Diikuti huruf fa'"], 1],
  ['Akar kata dan shighah dari المُصْطَفَيْنَ adalah ...', ["ص ف و – isim maf'ul", "ص ط ف – isim fa'il", "و ص ف – isim maf'ul", "ص ف ح – isim fa'il"], 0],
  ["Kata خَاتَمٌ (hal. 11: خاتم النبيين) dengan fathah pada ta' berarti ...", ['Yang memulai', 'Penutup/yang terakhir menutup', 'Yang menyerupai', 'Yang menyertai'], 1],
  ['Akar kata tiga huruf (tsulatsi) dari خُلَاصَةٌ (hal. 11) adalah ...', ['خ ل ص', 'خ ص ص', 'ل خ ص', 'خ ل ط'], 0],
  ["Kata الآلُ (hal. 12: وعلى آله) sebelum mengalami i'lal berasal dari akar kata ...", ['أ ل ل', 'أ و ل (atau أ هـ ل)', 'و ل ي', 'أ ي ل'], 1],
  ['Kata صَحْبٌ (hal. 13) adalah isim jamak dari kata ...', ['صُحْبَةٌ', 'صَحَابِيٌّ', 'صَاحِبٌ', 'مُصَاحِبٌ'], 2],
  ["Kata مَوْصُولٌ (hal. 13: اسم موصول) berasal dari وَصَلَ, sehingga termasuk bina' ...", ['Ajwaf wawi', 'Mitsal wawi', 'Naqish wawi', "Mudha'af"], 1],
  ['Kata تَعَبَّدَ (hal. 13) mengikuti wazan تَفَعَّلَ, sehingga masdar-nya adalah ...', ['تَعْبِيدٌ', 'تَعَابُدٌ', 'تَعَبُّدٌ', 'اِسْتِعْبَادٌ'], 2],
  ['Wazan dan bentuk jamak dari kata أُسْلُوبٌ (hal. 14) adalah ...', ['أَفْعَلُ – أَسْلَابٌ', 'أُفْعُولٌ – أَسَالِيبُ', 'فُعْلُولٌ – سَلَابِيبُ', 'مَفْعُولٌ – مَسَالِيبُ'], 1],
  ['Kata مُخْتَصَرٌ (hal. 15) mengikuti wazan مُفْتَعَلٌ dan termasuk shighah ...', ["Isim fa'il", "Isim maf'ul", 'Isim alat', 'Shifah musyabbahah'], 1],
  ['Kata اِخْتِصَارٌ (hal. 5) adalah masdar dari اِخْتَصَرَ yang mengikuti wazan ...', ['اِسْتِفْعَالٌ', 'اِنْفِعَالٌ', 'اِفْتِعَالٌ', 'إِفْعَالٌ'], 2],
  ['Kata اِحْتِرَازاً (hal. 16) adalah masdar dari wazan ...', ['اِفْتَعَلَ – اِفْتِعَالاً', 'اِنْفَعَلَ – اِنْفِعَالاً', 'اِسْتَفْعَلَ – اِسْتِفْعَالاً', 'أَفْعَلَ – إِفْعَالاً'], 0],
  ["Kata مُقَلِّدٌ (hal. 16) adalah isim fa'il dari fi'il madhi ...", ['قَلَدَ', 'أَقْلَدَ', 'قَلَّدَ', 'تَقَلَّدَ'], 2],
  ["Kata مُقْنِعٌ (hal. 17) adalah isim fa'il dari fi'il madhi ...", ['قَنَعَ', 'قَنَّعَ', 'أَقْنَعَ', 'اِقْتَنَعَ'], 2],
  ['Kata المُوَفَّقُ (hal. 18) adalah shighah ...', ["Isim fa'il dari وَفَقَ", "Isim maf'ul dari وَفَّقَ", "Isim maf'ul dari أَوْفَقَ", "Isim fa'il dari تَوَفَّقَ"], 1],
  ['Kata مُطَوَّلٌ (hal. 19: عن كتاب مطول) adalah shighah ...', ["Isim maf'ul dari طَوَّلَ", "Isim fa'il dari طَالَ", 'Isim tafdhil', 'Isim makan'], 0],
  ['Menurut penjelasan penulis (hal. 20), kata مَذْهَبٌ secara bahasa dapat berupa tiga shighah, yaitu ...', ["Isim fa'il, isim maf'ul, dan isim alat", 'Isim makan, isim zaman, dan masdar', 'Shifah musyabbahah, isim tafdhil, dan hal', "Jamak taksir, masdar, dan isim fa'il"], 1],
  ["Kata قِيَاسٌ (hal. 21) adalah masdar dari قَاسَ يَقِيسُ, sehingga termasuk bina' ...", ["Mitsal ya'i", "Ajwaf ya'i", "Naqish ya'i", 'Lafif maqrun'], 1],
  ["Kata مُثَبِّطَةٌ (hal. 22: الأسباب المثبطة) adalah isim fa'il mu'annats dari fi'il madhi ...", ['ثَبَتَ', 'أَثْبَتَ', 'ثَبَّطَ', 'تَثَبَّطَ'], 2],
  ["Kata نَيْلٌ (hal. 22: عن نيل المراد) berasal dari نَالَ يَنَالُ (asalnya نَيِلَ), termasuk bina' ...", ["Ajwaf ya'i", 'Naqish wawi', 'Shahih', "Mudha'af"], 0],
  ["Kata الوَكِيلُ (hal. 24: ونعم الوكيل) termasuk shighah fa'il yang di sini bermakna maf'ul (الموكول إليه), yaitu ...", ['Yang mewakilkan', 'Yang diserahi urusan', 'Yang meminta pertolongan', 'Yang menghukum'], 1]
]);

const pemahaman = q('pemahaman', 'Pelajaran & Pemahaman', [
  ["Nama lengkap pengarang kitab matan Zad al-Mustaqni' fi Ikhtishar al-Muqni' adalah ...", ['Ibnu Qudamah al-Maqdisi', 'Abu an-Naja Musa bin Ahmad bin Musa al-Hajjawi', "Mar'i bin Yusuf al-Karmi", 'Sulaiman bin Abdullah Aba al-Khail'], 1],
  ["Kitab Zad al-Mustaqni' merupakan ringkasan dari kitab ...", ['Al-Mughni', 'Al-Kafi', "Al-Muqni'", "Al-'Umdah"], 2],
  ["Metode penulisan al-Hajjawi dalam Zad al-Mustaqni' adalah ...", ['Mengumpulkan seluruh pendapat mazhab fikih', 'Mencukupkan satu pendapat (qaul wahid) yang rajih dalam mazhab Hanbali', 'Hanya menyebutkan hadis tanpa hukum', 'Membahas perbedaan pendapat ulama kontemporer'], 1],
  ["Guru Syaikh Ibnu Utsaimin yang mendorong beliau menghafal dan mengajari beliau Zad al-Mustaqni' adalah ...", ['Syaikh Abdul Aziz bin Baz', "Syaikh Abdurrahman bin Nashir as-Sa'di", 'Syaikh Muhammad bin Ibrahim', 'Syaikh Sulaiman al-Hafyan'], 1],
  ["Di masjid manakah Syaikh Ibnu Utsaimin mengajarkan kitab Zad al-Mustaqni' kepada para murid?", ['Masjidil Haram, Makkah', 'Masjid Nabawi, Madinah', "Masjid Jami' Kabir, 'Unaizah", 'Masjidil Aqsha'], 2],
  ["Dua ulama yang pertama kali menerbitkan Syarh al-Mumti' dari rekaman kaset dan catatan pelajaran adalah ...", ['Dr. Sulaiman Aba al-Khail dan Dr. Khalid al-Musyaiqih', 'Ibnu Qudamah dan al-Hajjawi', "Umar al-Hafyan dan Syaikh as-Sa'di", 'Yahya ash-Sharshari dan Ibnu Taimiyah'], 0],
  ["Alasan Syaikh Ibnu Utsaimin merevisi (tahdzib & tartib) cetakan pertama Syarh al-Mumti' adalah ...", ['Karena terdapat banyak kesalahan cetak ayat', 'Karena penjelasan lisan (taqrir) tidak sama dengan tulisan (tahrir) dalam pilihan kata dan kerapian', 'Karena murid-murid memintanya diterjemahkan', 'Karena kitab asalnya hilang'], 1],
  ["Siapakah yang mentakhrij hadis-hadis dan mengoreksi cetak coba (tashih tajarib) pada edisi revisi Syarh al-Mumti'?", ['Dr. Khalid al-Musyaiqih', 'Dr. Sulaiman Aba al-Khail', 'Umar bin Sulaiman al-Hafyan', "Syaikh Abdurrahman as-Sa'di"], 2],
  ['Mengawali kitab dengan basmalah merupakan bentuk peneladanan terhadap ...', ['Kitab-kitab filsafat Yunani', "Al-Qur'an dan kebiasaan Nabi ﷺ saat menulis surat", 'Kebiasaan para penyair Jahiliyah', 'Tradisi hakim pengadilan'], 1],
  ['Ketika digabungkan, makna الرَّحْمٰن dan الرَّحِيم menurut Syaikh Ibnu Utsaimin adalah ...', ['Keduanya bermakna sama persis tanpa perbedaan', 'Ar-Rahman menunjukkan sifat rahmat yang luas; Ar-Rahim menunjukkan sampainya rahmat kepada hamba yang dikehendaki', 'Ar-Rahman khusus untuk akhirat; Ar-Rahim khusus untuk dunia', 'Ar-Rahman bermakna pengampun; Ar-Rahim bermakna pemberi rezeki'], 1],
  ["Doa yang dibaca Nabi ﷺ ketika tertimpa kesusahan (adh-dharra') menurut hadis pada halaman 8 adalah ...", ["Alhamdulillahilladzi bini'matihi tatimmush shalihat", "Alhamdulillahi 'ala kulli hal", 'Subhanallahi wa bihamdihi', 'La haula wa la quwwata illa billah'], 1],
  ['Mengapa Allah berhak atas pujian yang la yanfad (tidak pernah habis)?', ['Karena manusia selalu hidup selamanya', 'Karena kesempurnaan Allah tidak pernah habis, sehingga pujian atasnya pun tidak pernah habis', 'Karena pujian diucapkan dengan suara keras', 'Karena malaikat mencatatnya di kitab'], 1],
  ["Definisi shalawat dari Allah menurut Abul 'Aliyah yang dirajihkan Syaikh Ibnu Utsaimin adalah ...", ['Ampunan dari para malaikat', 'Doa dari kaum mukminin', "Pujian Allah kepada orang yang dishalawati di al-mala' al-a'la (sisi para malaikat muqarrabin)", 'Rahmat yang bersifat umum'], 2],
  ['Manfaat penggabungan shalawat dan salam kepada Nabi ﷺ menurut penjelasan kitab adalah ...', ['Dengan salam hilang hal yang ditakuti/kekurangan; dengan shalawat tercapai hal yang diharapkan/kesempurnaan', 'Keduanya hanya untuk memperindah kalimat', 'Salam untuk keluarga, shalawat untuk sahabat', 'Shalawat menghapus dosa, salam menambah harta'], 0],
  ["Berikut ini yang bukan termasuk bukti keutamaan Nabi Muhammad ﷺ atas para rasul ulul 'azmi yang dicontohkan di halaman 11 adalah ...", ['Beliau penutup para nabi', "Beliau menjadi imam para nabi pada malam Mi'raj", "Beliau pemilik syafa'at al-'uzhma", 'Beliau memiliki usia paling panjang di antara para nabi'], 3],
  ['Makna kata الآل apabila disebutkan bersama الأَصْحَاب dan مَنْ تَعَبَّدَ dalam kalimat yang sama adalah ...', ['Seluruh umat manusia', 'Kerabat Nabi ﷺ yang beriman', 'Para malaikat di langit', 'Penduduk kota Makkah saja'], 1],
  ['Dua fondasi utama ibadah dan dua syarat diterimanya ibadah menurut halaman 13 adalah ...', ['Takut dan harap; syaratnya kaya dan sehat', "Cinta (al-hubb) dan pengagungan (at-ta'zhim); syaratnya ikhlas dan mutaba'ah", 'Sabar dan syukur; syaratnya wudhu dan menghadap kiblat', 'Zikir dan doa; syaratnya di masjid dan berjamaah'], 1],
  ['Kapan ungkapan أَمَّا بَعْدُ diucapkan menurut penjelasan yang benar di kitab?', ['Saat ingin mengakhiri pembicaraan', 'Saat memasuki inti topik yang dituju', 'Saat berpindah dari satu gaya bahasa ke gaya bahasa lain', 'Saat memulai salam penutup'], 1],
  ['Definisi al-fiqh secara istilah (isthilahan) adalah ...', ['Sekadar memahami arti kata bahasa Arab', 'Mengetahui seluruh ilmu alam dan sejarah', "Mengetahui hukum-hukum syara' yang bersifat 'amaliyah beserta dalil-dalilnya yang terperinci", 'Menghafal matan kitab tanpa perlu mengetahui dalil'], 2],
  ['Menurut nukilan Syaikhul Islam Ibnu Taimiyah pada halaman 17, bagi orang yang mampu menggali dalil sendiri, hukum taklid diserupakan dengan ...', ['Memakan makanan yang lezat', 'Memakan bangkai (akl al-maitah)', 'Minum air zamzam', 'Menuntut ilmu yang wajib'], 1],
  ['Peringatan Syaikh Ibnu Utsaimin pada halaman 17–18 terkait gelar dan kesaksian adalah ...', ['Boleh menyebut siapa saja sebagai imam besar', 'Tidak boleh bermudah-mudahan menyematkan gelar Imam kepada yang tidak berhak, dan tidak boleh memastikan individu tertentu sebagai syahid kecuali yang ada nasnya', 'Wajib menyematkan gelar syahid pada setiap muslim yang wafat', 'Gelar Imam hanya untuk ahli hadis'], 1],
  ['Kitab karya Ibnu Qudamah yang menyajikan fikih perbandingan (fiqh muqaran) lintas mazhab dengan menyebutkan pendapat Imam Ahmad maupun ulama salaf dan khalaf lainnya adalah ...', ["Al-'Umdah", "Al-Muqni'", 'Al-Kafi', 'Al-Mughni'], 3],
  ['Al-Muwaffaq Abdullah bin Ahmad bin Qudamah al-Maqdisi wafat pada tahun ...', ['520 H', '620 H', '720 H', '820 H'], 1],
  ["Ujian berat (mihnah) yang dihadapi Imam Ahmad bin Hanbal di masa Khalifah al-Ma'mun dan para pengikutnya berkaitan dengan masalah akidah ...", ["Kemakhlukan Al-Qur'an (khalq al-Qur'an)", 'Jumlah rakaat shalat tarawih', 'Penentuan awal Ramadhan', 'Hukum mengusap khuf'], 0],
  ["Yang dimaksud dengan al-madzhab al-isthilahi di kalangan ulama muta'akhkhirin adalah ...", ['Pendapat pribadi sang imam yang tidak diikuti muridnya', 'Pendapat yang disepakati dan dijadikan istilah mazhab oleh para ulama penerusnya', 'Fatwa yang hanya berlaku di satu negeri', 'Pendapat yang tidak memiliki dalil sama sekali'], 1],
  ["Tiga langkah yang dilakukan al-Hajjawi saat menyusun Zad al-Mustaqni' dari al-Muqni' adalah ...", ['Menambah 5 pendapat, menambah syair, dan menghapus bab thaharah', 'Mencukupkan satu pendapat, menghapus masalah yang jarang terjadi, dan menambah masalah penting yang layak dipegang', 'Menerjemahkan ke bahasa Persia, menghapus dalil, dan meringkas bab shalat saja', "Mengubah seluruh pendapat mazhab Ahmad menjadi mazhab Syafi'i"], 1],
  ["Alasan al-Hajjawi meringkas al-Muqni' dan membuang masalah langka adalah karena ...", ['Kertas saat itu sangat mahal', 'Semangat menuntut ilmu (himam) telah melemah dan faktor penghalang semakin banyak', 'Tidak ada guru yang mau mengajarkannya', 'Perintah resmi dari penguasa negeri'], 1],
  ["Penghalang terbesar yang membuat seseorang berpaling dari zikir dan ilmu (QS. al-Ma'idah: 49 & al-Muthaffifin: 14), serta amalan yang dianjurkan ulama saat menghadapi kasus fatwa/hukum adalah ...", ['Kemiskinan; amalan yang dianjurkan adalah tidur', 'Dosa-dosa; amalan yang dianjurkan adalah memperbanyak istighfar', 'Kesibukan berdagang; amalan yang dianjurkan adalah safar', 'Banyak berbicara; amalan yang dianjurkan adalah berpuasa sebulan penuh'], 1],
  ["Perbandingan antara Zad al-Mustaqni' dan Dalil ath-Thalib karya Syaikh Mar'i menurut Syaikh Ibnu Utsaimin (hal. 23) adalah ...", ["Zad lebih padat/komprehensif (ajma'), sedangkan Dalil ath-Thalib lebih rapi susunannya (ahsan tartiban)", 'Dalil ath-Thalib lebih padat, sedangkan Zad lebih panjang', 'Keduanya ditulis oleh pengarang yang sama', 'Zad hanya membahas ibadah, sedangkan Dalil hanya membahas muamalah'], 0],
  ['Menurut riwayat Ibnu Abbas di Shahih al-Bukhari (hal. 24), siapakah yang mengucapkan حَسْبُنَا اللَّهُ وَنِعْمَ الوَكِيلُ ketika dilemparkan ke dalam api?', ["Nabi Musa 'alaihissalam", "Nabi Nuh 'alaihissalam", "Nabi Ibrahim 'alaihissalam", "Nabi Isa 'alaihissalam"], 2]
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

export function refreshDraftQuestions(draft) {
  const currentQuestions = new Map(getQuestionsForSection(draft.sectionId).map((question) => [question.id, question]));
  return { ...draft, questions: draft.questions.map((question) => currentQuestions.get(question.id) ?? question) };
}
