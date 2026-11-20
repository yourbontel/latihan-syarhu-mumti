const make = (id, section, topic, number, prompt, answer, explanation, arabic = '') => ({
  id: `${section}-${String(number).padStart(2, '0')}`,
  section,
  topic,
  title: `${topic} ${number}`,
  prompt,
  arabic,
  options: [answer],
  answer: 0,
  explanation
});

const nahwu = [
  ['Pada kalimat بِسْمِ اللهِ, kata yang diperkirakan menjadi muta\'allaq dengan بِسْمِ berupa apa dan di mana letaknya?', 'Fi\'il yang dibuang dan diletakkan di belakang (mu\'akhkhar), misalnya أقرأُ.', 'بِسْمِ اللهِ'],
  ['Mengapa اللهِ dalam إِلَى صِرَاطِ الْعَزِيزِ الْحَمِيدِ اللهِ di-i\'rab sebagai \"athaf bayan\"?', 'Agar nama Allah tidak menjadi tabi\' bagi sifat sebelumnya; Allah adalah nama pokok yang diikuti nama-nama-Nya.', 'إِلَى صِرَاطِ الْعَزِيزِ الْحَمِيدِ اللهِ'],
  ['Apa jenis jumlah pada الحَمْدُ لِلَّهِ dan kedudukan unsurnya?', 'Jumlah ismiyah: الحَمْدُ adalah mubtada\' dan لِلَّهِ adalah khabar.', 'الحَمْدُ لِلَّهِ'],
  ['Apa dua makna huruf lam pada لِلَّهِ?', 'Al-ikhtishash (pengkhususan) dan al-istihqaq (keberhakan).', 'لِلَّهِ'],
  ['Apa kedudukan حَمْداً dalam حَمْداً لا يَنْفَدُ dan apa \`amil\`-nya?', 'Manshub sebagai masdar/maf\'ul muthlaq penguat; \`amil\`-nya adalah masdar الحَمْدُ.', 'حَمْداً لا يَنْفَدُ'],
  ['Mengapa masdar الحَمْدُ dapat beramal menashabkan حَمْداً?', 'Karena masdar yang memakai alif-lam dapat beramal secara mutlak.', 'الحَمْدُ حَمْداً'],
  ['Apa fungsi لا يَنْفَدُ setelah حَمْداً?', 'Menjadi sifat bagi حَمْداً dan menjelaskan jenis pujian (mubayyin lin-nau\').', 'حَمْداً لا يَنْفَدُ'],
  ['Apa kedudukan i\'rab أَفْضَلَ dalam أَفْضَلَ ما يَنْبَغِي أَنْ يُحْمَدَ?', 'Sifat kedua bagi kata حَمْداً.', 'أَفْضَلَ ما يَنْبَغِي أَنْ يُحْمَدَ'],
  ['Apa jenis ما dalam أَفْضَلَ ما يَنْبَغِي أَنْ يُحْمَدَ?', 'Nakirah maushufah, ditakwil menjadi أَفْضَلُ حَمْدٍ يَنْبَغِي أَنْ يُحْمَدَ.', 'ما يَنْبَغِي'],
  ['Apa status وَصَلَّى اللَّهُ وَسَلَّمَ dari sisi lafaz dan makna?', 'Secara lafaz jumlah khabariyah, tetapi secara makna jumlah insya\'iyah berupa doa.', 'وَصَلَّى اللَّهُ وَسَلَّمَ'],
  ['Apa kedudukan مُحَمَّدٍ dalam عَلَى أَفْضَلِ المُصْطَفَيْنَ مُحَمَّدٍ?', 'Athaf bayan untuk menjelaskan siapa afdhalul mushthafain.', 'مُحَمَّدٍ'],
  ['Apa jenis مَنْ dalam وَمَنْ تَعَبَّدَ dan faedahnya?', 'Isim maushul yang bermakna umum (lil-\'umum).', 'وَمَنْ تَعَبَّدَ'],
  ['Apa kedudukan dan takdir أَمَّا dalam أَمَّا بَعْدُ?', 'Pengganti syarat dan fi\'il syarat; takdirnya مَهْمَا يَكُنْ مِنْ شَيْءٍ بَعْدَ ذَلِكَ.', 'أَمَّا بَعْدُ'],
  ['Bagaimana i\'rab بَعْدُ dan mengapa dibaca dhammah?', 'Zharaf mabni \`ala adh-dhamm pada posisi nashab karena mudhaf ilaih-nya dibuang dan diniatkan.', 'بَعْدُ'],
  ['Apa kata kerja yang menjadi muta\'allaq bagi zharaf بَعْدُ?', 'يَكُنْ yang dibuang bersama syaratnya.', 'أَمَّا بَعْدُ'],
  ['Apa kedudukan مِنْ مُقْنِعِ dalam فَهَذَا مُخْتَصَرٌ فِي الفِقْهِ مِنْ مُقْنِعِ الإِمَامِ?', 'Jar wa majrur sebagai sifat bagi مُخْتَصَرٌ.', 'مِنْ مُقْنِعِ'],
  ['Apa kedudukan الخَلْقَ dalam كَفَى الخَلْقَ بِالكَافِي?', 'Maf\'ul bih dari fi\'il كَفَى.', 'كَفَى الخَلْقَ بِالكَافِي'],
  ['Ke mana kembali dhamir هُ pada مِنْهُ?', 'Kembali kepada kitab المُقْنِعِ.', 'مِنْهُ'],
  ['Mengapa مَسَائِلَ dibaca fathah tanpa tanwin?', 'Karena termasuk mamnu\' minash-sharf, yaitu shighah muntahal jumu\'.', 'مَسَائِلَ'],
  ['Apa hubungan نَادِرَةَ dengan مَسَائِلَ dan mengapa tanpa tanwin?', 'Na\'at bagi مَسَائِلَ dan tidak bertanwin karena diidhafahkan kepada الوُقُوعِ.', 'نَادِرَةَ الوُقُوعِ'],
  ['Apa jenis ما dalam وَزِدْتُ مَا عَلَى مِثْلِهِ يُعْتَمَدُ?', 'Isim maushul bermakna الَّذِي dan berkedudukan sebagai maf\'ul bih bagi زِدْتُ.', 'مَا عَلَى مِثْلِهِ يُعْتَمَدُ'],
  ['Di mana shilah maushul dan muta\'allaq عَلَى مِثْلِهِ?', 'Shilahnya عَلَى مِثْلِهِ يُعْتَمَدُ; jar wa majrur itu muta\'allaq dengan يُعْتَمَدُ.', 'عَلَى مِثْلِهِ يُعْتَمَدُ'],
  ['Apa fungsi إِذْ dalam إِذِ الهِمَمُ قَدْ قَصُرَتْ?', 'Harf ta\'lil yang menunjukkan alasan/sebab.', 'إِذِ الهِمَمُ قَدْ قَصُرَتْ'],
  ['Sebutkan mubtada dan khabar pada إِذِ الهِمَمُ قَدْ قَصُرَتْ.', 'Mubtada\' adalah الهِمَمُ; khabarnya jumlah قَدْ قَصُرَتْ.', 'الهِمَمُ قَدْ قَصُرَتْ'],
  ['Apa kedudukan المُثَبِّطَةُ dalam وَالأَسْبَابُ المُثَبِّطَةُ?', 'Sifat (na\'at) bagi الأَسْبَابُ.', 'الأَسْبَابُ المُثَبِّطَةُ'],
  ['Apa nama dan fungsi لا dalam لا حَوْلَ وَلا قُوَّةَ إِلَّا بِاللَّهِ?', 'La nafiyah lil-jinsi, menafikan jenis secara menyeluruh.', 'لا حَوْلَ وَلا قُوَّةَ'],
  ['Ke mana kembali هو dalam وَهُوَ حَسْبُنَا dan apa kedudukan حَسْبُنَا?', 'هو kembali kepada Allah; حَسْبُنَا adalah khabar dari mubtada هو.', 'وَهُوَ حَسْبُنَا'],
  ['Apa kedudukan الوَكِيلُ dalam وَنِعْمَ الوَكِيلُ?', 'Fa\'il bagi fi\'il madhi jamid نِعْمَ.', 'نِعْمَ الوَكِيلُ'],
  ['Apa unsur yang dibuang dalam وَنِعْمَ الوَكِيلُ?', 'Makhshush bil-madh dibuang, dengan takdir نِعْمَ الوَكِيلُ اللَّهُ.', 'نِعْمَ الوَكِيلُ'],
  ['Apa kedudukan عَبْدُ setelah شَيْخُنَا?', 'Badal atau athaf bayan dari شَيْخُنَا.', 'شَيْخُنَا عَبْدُ الرَّحْمَنِ']
].map((x, i) => make('nahwu', 'nahwu', 'Nahwu', i + 1, x[0], x[1], x[1], x[2]));

const shorof = [
  ['Apa bentuk madhi ma\'lum dan masdar شُغِفَ?', 'Madhi ma\'lum شَغَفَ dan masdarnya شَغَفٌ.', 'شُغِفَ'],
  ['مُقَرَّرٌ/تَقْرِيرٌ berasal dari akar dan wazan apa?', 'Akar ق ر ر; تَقْرِيرٌ mengikuti wazan تَفْعِيلٌ dari قَرَّرَ.', 'تَقْرِيرٌ'],
  ['Apa fi\'il madhi dari تَهْذِيبٌ dan تَرْتِيبٌ?', 'هَذَّبَ dan رَتَّبَ, keduanya wazan فَعَّلَ.', 'تَهْذِيبٌ وَتَرْتِيبٌ'],
  ['بَدَاءَةٌ adalah masdar dari apa dan termasuk bina apa?', 'Dari بَدَأَ dan termasuk mahmuz lam.', 'بَدَاءَةٌ'],
  ['مُحَذَّرٌ/مُؤَخَّرٌ termasuk shighah apa?', 'Isim maf\'ul dari حَذَّرَ/أَخَّرَ (wazan فَعَّلَ).', 'مُؤَخَّرٌ'],
  ['Apa fi\'il madhi dan wazan isim fa\'il مُحِيطٌ/مُوصِلٌ?', 'أَحَاطَ/أَوْصَلَ; untuk مُوصِلٌ wazan isim fa\'il-nya مُفْعِلٌ dari أَفْعَلَ.', 'مُحِيطٌ مُوصِلٌ'],
  ['Apa madhi لا يَنْفَدُ dan harakat \`ain fi\'il-nya?', 'نَفِدَ (kasrah pada madhi) dan يَنْفَدُ (fathah pada mudhari\').', 'لا يَنْفَدُ'],
  ['مَعْمُولٌ termasuk shighah apa dan dari fi\'il apa?', 'Isim maf\'ul dari عَمِلَ, tsulatsi mujarrad.', 'مَعْمُولٌ'],
  ['مُؤَكِّدٌ termasuk shighah apa?', 'Isim fa\'il dari أَكَّدَ (wazan فَعَّلَ).', 'مُؤَكِّدٌ'],
  ['Huruf apa pada المُصْطَفَيْنَ yang diganti menjadi ط dan mengapa?', 'ت diganti ط setelah ص untuk memudahkan pengucapan karena ithbaq.', 'المُصْطَفَيْنَ'],
  ['Apa akar dan shighah المُصْطَفَيْنَ?', 'Akar ص ف و dan shighah isim maf\'ul, yaitu yang dipilih.', 'المُصْطَفَيْنَ'],
  ['Apa wazan dan perbedaan makna خَاتَم dan خَاتِم?', 'Wazan فَاعِل/فَاعَل; خَاتَم berarti penutup/stempel, خَاتِم berarti yang mengakhiri.', 'خَاتَمٌ'],
  ['Apa akar kata خُلَاصَةٌ?', 'Akar خ ل ص.', 'خُلَاصَةٌ'],
  ['Apa akar kata الآل sebelum i\'lal?', 'أ و ل atau أ هـ ل.', 'الآلُ'],
  ['صَحْبٌ adalah isim jamak dari kata apa?', 'Dari صَاحِبٌ.', 'صَحْبٌ'],
  ['مَوْصُولٌ adalah isim maf\'ul dari apa dan bina apa?', 'Dari وَصَلَ dan termasuk bina mitsal wawi.', 'مَوْصُولٌ'],
  ['تَعَبَّدَ mengikuti wazan apa dan apa masdarnya?', 'Wazan تَفَعَّلَ dan masdar تَعَبُّدٌ.', 'تَعَبَّدَ'],
  ['أُسْلُوبٌ mengikuti wazan apa dan apa jamaknya?', 'Wazan أُفْعُولٌ; jamaknya أَسَالِيبُ.', 'أُسْلُوبٌ'],
  ['مُخْتَصَرٌ mengikuti wazan dan shighah apa?', 'Wazan مُفْتَعَلٌ, isim maf\'ul dari اِخْتَصَرَ.', 'مُخْتَصَرٌ'],
  ['اِخْتِصَارٌ adalah masdar dari apa dan wazan apa?', 'Dari اِخْتَصَرَ dan wazan اِفْتِعَالٌ.', 'اِخْتِصَارٌ'],
  ['اِحْتِرَازاً adalah masdar dari wazan apa?', 'Wazan اِفْتِعَالٌ dari اِحْتَرَزَ.', 'اِحْتِرَازاً'],
  ['مُقَلِّدٌ adalah isim fa\'il dari apa?', 'Dari قَلَّدَ (wazan فَعَّلَ).', 'مُقَلِّدٌ'],
  ['مُقْنِعٌ adalah isim fa\'il dari fi\'il apa?', 'Dari أَقْنَعَ (tsulatsi mazid bi harfin, wazan أَفْعَلَ).', 'مُقْنِعٌ'],
  ['المُوَفَّقُ adalah shighah apa?', 'Isim maf\'ul dari وَفَّقَ.', 'المُوَفَّقُ'],
  ['مُطَوَّلٌ adalah shighah apa?', 'Isim maf\'ul dari طَوَّلَ.', 'مُطَوَّلٌ'],
  ['Sebutkan tiga shighah مَذْهَبٌ secara bahasa.', 'Isim makan, isim zaman, dan masdar (masdar mimi).', 'مَذْهَبٌ'],
  ['قِيَاسٌ adalah masdar dari apa dan termasuk bina apa?', 'Dari قَاسَ يَقِيسُ dan termasuk bina ajwaf ya\'i.', 'قِيَاسٌ'],
  ['مُثَبِّطَةٌ adalah isim fa\'il muannats dari apa?', 'Dari ثَبَّطَ (wazan فَعَّلَ).', 'مُثَبِّطَةٌ'],
  ['نَيْلٌ adalah masdar dari apa dan termasuk bina apa?', 'Dari نَالَ يَنَالُ dan termasuk ajwaf ya\'i.', 'نَيْلٌ'],
  ['Apa shighah الوَكِيلُ dan maknanya dalam konteks?', 'Shifah musyabbahah/fa\'il bermakna maf\'ul: Dzat yang diserahi urusan.', 'الوَكِيلُ']
].map((x, i) => make('shorof', 'shorof', 'Shorof', i + 1, x[0], x[1], x[1], x[2]));

const pemahaman = [
  ['Siapakah nama lengkap pengarang Zad al-Mustaqni\'?', 'Abu an-Naja Musa bin Ahmad bin Musa al-Hajjawi.'],
  ['Dari kitab apa Zad al-Mustaqni\' diringkas dan siapa pengarangnya?', 'Dari al-Muqni\' karya al-Muwaffaq Ibnu Qudamah al-Maqdisi.'],
  ['Bagaimana metode al-Hajjawi memilih pendapat fikih?', 'Mencukupkan satu pendapat yang rajih dalam mazhab Ahmad dan hampir tidak keluar dari pendapat masyhur Hanbali muta\'akhkhirin.'],
  ['Siapa guru Ibnu Utsaimin yang mendorong beliau menghafal Zad?', 'Syaikh Abdurrahman bin Nashir as-Sa\'di rahimahullah.'],
  ["Di masjid mana Ibnu Utsaimin mengajarkan Zad?", "Masjid Jami' Kabir di 'Unaizah."],
  ['Siapa dua ulama yang pertama menerbitkan Syarhu al-Mumti\'?', 'Dr. Sulaiman bin Abdullah Aba al-Khail dan Dr. Khalid bin Ali al-Musyaiqih.'],
  ['Mengapa cetakan pertama Syarhu al-Mumti\' perlu direvisi?', 'Syarh lisan berbeda dari tulisan dalam ketepatan kata, kerapian ungkapan, dan cakupan pembahasan.'],
  ['Siapa pembaca naskah revisi, pentakhrij hadis, dan pengoreksi cetak?', 'Dibacakan Khalid al-Musyaiqih; ditakhrij dan dikoreksi Umar bin Sulaiman al-Hafyan.'],
  ['Mengapa basmalah mengikuti dua teladan?', 'Mengikuti Al-Qur\'an dan Nabi ﷺ yang memulai surat-surat dengan basmalah.'],
  ['Apa perbedaan الرحمن dan الرحيم ketika digabungkan?', 'الرحمن menunjukkan luasnya sifat rahmat; الرحيم menunjukkan penyampaian rahmat kepada hamba yang dikehendaki.'],
  ['Apa definisi الحمد dan doa Nabi saat senang dan susah?', 'Menyifati yang dipuji dengan kesempurnaan; saat senang الحمد لله الذي بنعمته تتم الصالحات, saat susah الحمد لله على كل حال.'],
  ['Mengapa Allah berhak mendapat pujian yang tidak habis?', 'Karena sifat-sifat kesempurnaan Allah tidak pernah habis.'],
  ['Apa definisi shalawat Allah menurut Abul Aliyah?', 'Pujian Allah kepada orang yang dishalawati di al-mala\' al-a\'la di hadapan malaikat muqarrabin.'],
  ['Apa perbedaan manfaat shalawat dan salam untuk Nabi?', 'Salam menghilangkan hal yang ditakuti/kekurangan; shalawat menetapkan hal yang diharapkan/kesempurnaan.'],
  ['Siapa lima rasul ulul azmi dan tiga keutamaan Nabi Muhammad?', 'Nuh, Ibrahim, Musa, Isa, Muhammad ﷺ; penutup nabi, imam para nabi saat Mi\'raj, dan pemilik syafa\'at al-\'uzhma.'],
  ['Apa perbedaan makna الآل sendirian dan bersama الأصحاب?', 'Sendirian berarti seluruh pengikut agama; bersama ashhab berarti kerabat beliau yang beriman.'],
  ['Sebutkan dua fondasi dan dua syarat diterimanya ibadah.', 'Fondasi: cinta dan pengagungan. Syarat: ikhlas karena Allah dan mutaba\'ah kepada Nabi ﷺ.'],
  ['Apa kekeliruan memaknai أَمَّا بَعْدُ dan makna benarnya?', 'Bukan sekadar transisi gaya bahasa, tetapi ungkapan saat memasuki inti topik pembicaraan.'],
  ['Jelaskan definisi al-fiqh secara bahasa, syara, dan istilah.', 'Bahasa: pemahaman. Syara: mengetahui hukum Allah. Istilah: mengetahui hukum syariat amaliyah beserta dalil terperinci.'],
  ['Mengapa muqallid bukan faqih dan kapan taklid dibolehkan?', 'Ia tidak mengetahui hukum beserta dalilnya; taklid dibolehkan saat darurat dan tidak mampu menggali dalil.'],
  ['Apa peringatan tentang gelar الإمام dan penyebutan شهيد?', 'Jangan bermudah memberi gelar Imam kepada yang tidak layak dan jangan memastikan individu tertentu syahid kecuali ada nas.'],
  ['Sebutkan empat kitab fikih Ibnu Qudamah dan cirinya.', 'Al-\'Umdah ringkas satu pendapat dengan dalil; al-Muqni\' menengah dua pendapat; al-Kafi dua pendapat dengan dalil dan ta\'lil; al-Mughni fikih perbandingan.'],
  ['Pada tahun berapa al-Muwaffaq Ibnu Qudamah wafat?', 'Tahun 620 H.'],
  ['Sebutkan tiga keistimewaan Imam Ahmad dan ujian akidahnya.', 'Imam Ahlus Sunnah dalam tauhid, fikih, dan hadis; teguh dalam fitnah khalq al-Qur\'an.'],
  ['Apa beda madzhab syakhshi dan madzhab isthilahi?', 'Syakhshi adalah pendapat pribadi imam berdasarkan dalil; isthilahi adalah pendapat yang disepakati ulama mazhab belakangan sebagai mazhabnya.'],
  ['Sebutkan tiga langkah al-Hajjawi menyusun Zad.', 'Memilih satu pendapat, membuang masalah jarang terjadi, dan menambahkan masalah penting untuk dijadikan pegangan.'],
  ['Mengapa al-Hajjawi membuang masalah yang jarang terjadi?', 'Karena himmah melemah dan faktor penghalang semakin banyak.'],
  ['Apa penghalang terbesar penuntut ilmu dan amalan saat menghadapi fatwa?', 'Dosa-dosa; dianjurkan memperbanyak istighfar.'],
  ['Bandingkan Zad al-Mustaqni\' dengan Dalil ath-Thalib.', 'Zad lebih padat dan menyeluruh; Dalil ath-Thalib lebih rapi susunannya.'],
  ['Apa makna لا حول ولا قوة إلا بالله dan siapa yang mengucapkan حسبنا الله ونعم الوكيل?', 'Tidak ada perubahan keadaan dan kekuatan tanpa pertolongan Allah; Nabi Ibrahim mengucapkannya saat dilempar ke dalam api.']
].map((x, i) => make('pemahaman', 'pemahaman', 'Pelajaran & Pemahaman', i + 1, x[0], x[1], x[1], '')); 

const addOptions = (group) => group.forEach((question, index) => {
  const correctOption = question.options[0];
  const distractors = [];
  for (let offset = 1; distractors.length < 3; offset += 1) {
    const candidate = group[(index + offset) % group.length].options[0];
    if (candidate !== correctOption && !distractors.includes(candidate)) distractors.push(candidate);
  }
  const correctIndex = (index * 7 + 1) % 4;
  question.options = [...distractors];
  question.options.splice(correctIndex, 0, correctOption);
  question.answer = correctIndex;
});

[nahwu, shorof, pemahaman].forEach(addOptions);

export const questions = [...nahwu, ...shorof, ...pemahaman];

export const ALL_SECTION_ID = 'halaman-5-24';

export const sections = [
  { id: ALL_SECTION_ID, eyebrow: 'LATIHAN UTAMA', title: 'Latihan halaman 5–24 (Muqoddimah)', description: '90 soal lengkap dari Nahwu, Shorof, dan Pelajaran & Pemahaman.', icon: '90', topics: ['Nahwu', 'Shorof', 'Pelajaran & Pemahaman'] },
  { id: 'nahwu', eyebrow: 'Bagian 01', title: '30 Soal Nahwu', description: 'Latihan i\'rab dan pemahaman struktur bahasa Arab dari halaman 5–24.', icon: 'نحو', topics: ['Nahwu'] },
  { id: 'shorof', eyebrow: 'Bagian 02', title: '30 Soal Shorof', description: 'Latihan akar kata, wazan, bina, dan perubahan bentuk kata.', icon: 'صرف', topics: ['Shorof'] },
  { id: 'pemahaman', eyebrow: 'Bagian 03', title: '30 Soal Pemahaman', description: 'Uji pelajaran, sejarah kitab, dan pemahaman materi Syarhu al-Mumti\'.', icon: 'علم', topics: ['Pelajaran & Pemahaman'] }
];

export const getQuestionsForSection = (sectionId) => sectionId === ALL_SECTION_ID
  ? questions
  : questions.filter((q) => q.section === sectionId);

export const getTopics = (sectionId) => [...new Set(getQuestionsForSection(sectionId).map((q) => q.topic))];

export const getQuestionCount = (sectionId) => getQuestionsForSection(sectionId).length;
