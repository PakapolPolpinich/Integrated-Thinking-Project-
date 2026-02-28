// ── SEARCH DATA ──
const searchData = [
  {title:'KMITL · สจล.', sub:'มหาวิทยาลัย', page:'page-kmitl'},
  {title:'คณะวิศวกรรมศาสตร์', sub:'KMITL', page:'page-eng'},
  {title:'Electronic Engineering', sub:'วิศวกรรมอิเล็กทรอนิกส์ · KMITL', page:'page-ee'},
  {title:'Computer Engineering', sub:'คอมพิวเตอร์ · KMITL', page:'page-eng'},
  {title:'Electrical Engineering', sub:'ไฟฟ้า · KMITL', page:'page-eng'},
  {title:'Faculty of Science', sub:'วิทยาศาสตร์ · KMITL', page:'page-kmitl'},
  {title:'School of IT', sub:'เทคโนโลยีสารสนเทศ · KMITL', page:'page-kmitl'},
  {title:'CU · จุฬา', sub:'มหาวิทยาลัย', page:'page-university'},
  {title:'TU · ธรรมศาสตร์', sub:'มหาวิทยาลัย', page:'page-university'},
  {title:'MU · มหิดล', sub:'มหาวิทยาลัย', page:'page-university'},
];

function handleGlobalSearch(val) {
  const drop = document.getElementById('search-dropdown');
  if (!val.trim()) { drop.classList.remove('show'); return; }
  const results = searchData.filter(d =>
    d.title.toLowerCase().includes(val.toLowerCase()) ||
    d.sub.toLowerCase().includes(val.toLowerCase())
  );
  if (results.length === 0) {
    drop.innerHTML = '<div class="search-no-result">ไม่พบผลลัพธ์</div>';
  } else {
    drop.innerHTML = results.map(r =>
      `<div class="search-item" onclick="goTo('${r.page}');document.getElementById('global-search-input').value='';hideSearchDrop();">
        <div class="search-item-title">${r.title}</div>
        <div class="search-item-sub">${r.sub}</div>
      </div>`
    ).join('');
  }
  drop.classList.add('show');
}
function hideSearchDrop() { document.getElementById('search-dropdown').classList.remove('show'); }

// ── LANGUAGE ──
let currentLang = 'th';
function setLang(lang) {
  currentLang = lang;
  document.getElementById('btn-th').classList.toggle('active', lang==='th');
  document.getElementById('btn-en').classList.toggle('active', lang==='en');
  document.querySelectorAll('[data-th]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (!val) return;
    if (el.tagName === 'INPUT') el.placeholder = val;
    else if (el.tagName === 'BUTTON' || el.tagName === 'A') el.innerHTML = val;
    else el.innerHTML = val;
  });
  // Update search placeholder
  const gs = document.getElementById('global-search-input');
  if (gs) gs.placeholder = (lang==='th')
    ? 'ค้นหา มอ / คณะ / สาขา...'
    : 'Search university / faculty / major...';

  const uniSearch = document.getElementById('uni-search');
  if (uniSearch) uniSearch.placeholder = (lang==='th')
    ? 'ค้นหามหาวิทยาลัย...'
    : 'Search university...';
}

// ── CARD FILTER ──
function filterCards(cls, attr, val) {
  document.querySelectorAll('.'+cls).forEach(card => {
    const name = (card.getAttribute(attr)||'').toLowerCase();
    card.classList.toggle('hidden', val.length > 0 && !name.includes(val.toLowerCase()));
  });
}

// ── PROVINCE FINDER ──
const nearbyData = {
  'เชียงใหม่': ['มหาวิทยาลัยเชียงใหม่ (CMU) — วิศวกรรมไฟฟ้า, คอมพิวเตอร์', 'มทร.ล้านนา เชียงใหม่ — วิศวกรรมอิเล็กทรอนิกส์'],
  'ขอนแก่น': ['มหาวิทยาลัยขอนแก่น (KKU) — วิศวกรรมไฟฟ้า, อิเล็กทรอนิกส์', 'มทร.อีสาน ขอนแก่น'],
  'สงขลา': ['มหาวิทยาลัยสงขลานครินทร์ (PSU) — วิศวกรรมไฟฟ้า', 'มทร.ศรีวิชัย สงขลา'],
  'ชลบุรี': ['มหาวิทยาลัยบูรพา (BUU) — วิศวกรรมไฟฟ้า', 'มทร.ตะวันออก ชลบุรี'],
  'นครราชสีมา': ['มหาวิทยาลัยเทคโนโลยีสุรนารี (SUT) — วิศวกรรมอิเล็กทรอนิกส์', 'มทร.อีสาน โคราช'],
  'พิษณุโลก': ['มหาวิทยาลัยนเรศวร (NU) — วิศวกรรมไฟฟ้าและคอมพิวเตอร์'],
};
function findNearbyUni() {
  const val = document.getElementById('province-input').value.trim();
  const res = document.getElementById('province-result');
  if (!val) { res.style.display='none'; return; }
  const found = Object.entries(nearbyData).find(([k]) => val.includes(k));
  res.style.display = 'block';
  if (found) {
    res.innerHTML = `<div style="color:var(--orange);font-weight:700;margin-bottom:8px;">📍 มหาวิทยาลัยใกล้ ${found[0]} ที่เปิดสอนหลักสูตรคล้ายกัน:</div>` +
      found[1].map(u => `<div style="padding:6px 0;border-bottom:1px solid var(--card-border);display:flex;gap:8px;align-items:flex-start;"><span style="color:var(--coral);">✦</span><span style="color:var(--white);">${u}</span></div>`).join('') +
      `<div style="margin-top:10px;color:var(--muted);font-size:0.78rem;">ข้อมูลเบื้องต้น — แนะนำตรวจสอบเว็บไซต์มหาวิทยาลัยโดยตรง</div>`;
  } else {
    res.innerHTML = `<span style="color:var(--muted);">ลองพิมพ์ชื่อจังหวัด เช่น เชียงใหม่, ขอนแก่น, สงขลา, ชลบุรี, นครราชสีมา, พิษณุโลก</span>`;
  }
}

// ── NAVIGATION ──
function goTo(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const t = document.getElementById(id);
  if (t) { t.classList.add('active'); window.scrollTo({top:0,behavior:'smooth'}); }
  // Hide global search on home page
  const gs = document.getElementById('global-search');
  if (gs) gs.style.display = (id === 'page-home') ? 'none' : 'block';
}

// ── TABS ──
function switchTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const c = document.getElementById('tab-' + name);
  if (c) c.classList.add('active');
  if (btn) btn.classList.add('active');
}

// ── CURRICULUM ──

const yearData = {
  1: {
    1: [
      { name_en: 'Calculus I', name_th: 'แคลคูลัส 1', credit: '3', desc_en: 'Limits, continuity, derivatives, and applications.', desc_th: 'ศึกษาเกี่ยวกับลิมิต ความต่อเนื่อง อนุพันธ์ และการประยุกต์' },
      { name_en: 'General Physics I', name_th: 'ฟิสิกส์ทั่วไป 1', credit: '3', desc_en: 'Basic mechanics, motion, and Newton\'s laws.', desc_th: 'กลศาสตร์เบื้องต้น การเคลื่อนที่ของวัตถุ และกฎของนิวตัน' },
      { name_en: 'General Physics Laboratory I', name_th: 'ปฏิบัติการฟิสิกส์ทั่วไป 1', credit: '1', desc_en: 'Experiments related to General Physics I.', desc_th: 'ปฏิบัติการทดลองที่สอดคล้องกับเนื้อหาวิชาฟิสิกส์ทั่วไป 1' },
      { name_en: 'General Chemistry', name_th: 'เคมีทั่วไป', credit: '3', desc_en: 'Atomic structure, chemical bonding, and stoichiometry.', desc_th: 'โครงสร้างอะตอม พันธะเคมี และปริมาณสัมพันธ์' },
      { name_en: 'General Education Program (Life Values)', name_th: 'วิชาศึกษาทั่วไป (กลุ่มคุณค่าแห่งชีวิต)', credit: '3', desc_en: 'General education focusing on life values and ethics.', desc_th: 'วิชาศึกษาทั่วไป หมวดคุณค่าแห่งชีวิต' },
      { name_en: 'Engineering Mechanics', name_th: 'กลศาสตร์วิศวกรรม', credit: '3', desc_en: 'Statics and dynamics principles for engineers.', desc_th: 'หลักการทางกลศาสตร์ สถิตยศาสตร์ และพลศาสตร์สำหรับวิศวกร' },
      { name_en: 'Pre-Activities For Engineers', name_th: 'กิจกรรมเตรียมความพร้อมวิศวกร', credit: '3', desc_en: 'Preparatory activities and skills for engineering students.', desc_th: 'กิจกรรมเตรียมความพร้อมและทักษะสำหรับนักศึกษาวิศวกรรมศาสตร์' },
      { name_en: 'Foundation English', name_th: 'ภาษาอังกฤษพื้นฐาน', credit: '3', desc_en: 'Basic English language skills for communication.', desc_th: 'ทักษะภาษาอังกฤษพื้นฐานเพื่อการสื่อสาร' }
    ],
    2: [
      { name_en: 'Calculus II', name_th: 'แคลคูลัส 2', credit: '3', desc_en: 'Integration techniques, sequences, and series.', desc_th: 'เทคนิคการอินทิเกรต ลำดับและอนุกรม' },
      { name_en: 'General Physics II', name_th: 'ฟิสิกส์ทั่วไป 2', credit: '3', desc_en: 'Electromagnetism, optics, and modern physics.', desc_th: 'แม่เหล็กไฟฟ้า แสง และฟิสิกส์ยุคใหม่' },
      { name_en: 'General Physics Laboratory II', name_th: 'ปฏิบัติการฟิสิกส์ทั่วไป 2', credit: '1', desc_en: 'Experiments related to General Physics II.', desc_th: 'ปฏิบัติการทดลองที่สอดคล้องกับเนื้อหาวิชาฟิสิกส์ทั่วไป 2' },
      { name_en: 'General Chemistry Laboratory', name_th: 'ปฏิบัติการเคมีทั่วไป', credit: '1', desc_en: 'Basic chemistry experiments.', desc_th: 'ปฏิบัติการทดลองเคมีทั่วไปเบื้องต้น' },
      { name_en: 'Computer Programing', name_th: 'การเขียนโปรแกรมคอมพิวเตอร์', credit: '3', desc_en: 'Introduction to computer programming for engineers.', desc_th: 'การเขียนโปรแกรมคอมพิวเตอร์เบื้องต้นสำหรับวิศวกร' },
      { name_en: 'Materials For Electronics Engineering', name_th: 'วัสดุสำหรับวิศวกรรมอิเล็กทรอนิกส์', credit: '3', desc_en: 'Properties of materials used in electronic devices.', desc_th: 'คุณสมบัติของวัสดุที่ใช้ในอุปกรณ์อิเล็กทรอนิกส์' },
      { name_en: 'Charm School', name_th: 'โรงเรียนสร้างเสน่ห์ (การพัฒนาบุคลิกภาพ)', credit: '2', desc_en: 'Personality development and social skills.', desc_th: 'การพัฒนาบุคลิกภาพและทักษะทางสังคม' },
      { name_en: 'English For Communication', name_th: 'ภาษาอังกฤษเพื่อการสื่อสาร', credit: '3', desc_en: 'English skills for effective everyday communication.', desc_th: 'ทักษะภาษาอังกฤษเพื่อการสื่อสารในชีวิตประจำวัน' },
      { name_en: 'Sport And Recreational Activities', name_th: 'กิจกรรมกีฬาและนันทนาการ', credit: '1', desc_en: 'Physical education and recreational sports.', desc_th: 'กิจกรรมพลศึกษาและกีฬาเพื่อสุขภาพ' },
      { name_en: 'Team-Project I', name_th: 'โครงงานกลุ่ม 1', credit: '1', desc_en: 'Basic engineering teamwork and project execution.', desc_th: 'การทำงานเป็นทีมผ่านโครงงานวิศวกรรมเบื้องต้น' }
    ]
  },
  2: {
    1: [
      { name_en: 'Engineering Mathematics III', name_th: 'คณิตศาสตร์วิศวกรรม 3', credit: '3', desc_en: 'Differential equations and linear algebra.', desc_th: 'สมการเชิงอนุพันธ์และพีชคณิตเชิงเส้น' },
      { name_en: 'Electronics Circuits Analysis I', name_th: 'การวิเคราะห์วงจรอิเล็กทรอนิกส์ 1', credit: '3', desc_en: 'Analysis of basic electronic circuits and components.', desc_th: 'การวิเคราะห์วงจรอิเล็กทรอนิกส์และอุปกรณ์พื้นฐาน' },
      { name_en: 'Elcetronics Roadmap', name_th: 'เส้นทางสู่วิศวกรรมอิเล็กทรอนิกส์', credit: '1', desc_en: 'Guidance and career paths in electronics engineering.', desc_th: 'แนวทางการศึกษาและสายอาชีพทางวิศวกรรมอิเล็กทรอนิกส์' },
      { name_en: 'Semiconductor Devices', name_th: 'อุปกรณ์สารกึ่งตัวนำ', credit: '3', desc_en: 'Theory and operation of semiconductor components.', desc_th: 'ทฤษฎีและการทำงานของอุปกรณ์สารกึ่งตัวนำ' },
      { name_en: 'Digital And Logic Design', name_th: 'การออกแบบดิจิทัลและลอจิก', credit: '3', desc_en: 'Digital logic circuits and system design.', desc_th: 'วงจรลอจิกดิจิทัลและการออกแบบระบบ' },
      { name_en: 'Electronics Laboratory I', name_th: 'ปฏิบัติการอิเล็กทรอนิกส์ 1', credit: '1', desc_en: 'Laboratory for basic electronics and digital circuits.', desc_th: 'ปฏิบัติการวงจรอิเล็กทรอนิกส์พื้นฐานและวงจรดิจิทัล' },
      { name_en: 'General Education Program (Social Lifestyle Group)', name_th: 'วิชาศึกษาทั่วไป (กลุ่มวิถีสังคม)', credit: '3', desc_en: 'General education focusing on social sciences.', desc_th: 'วิชาศึกษาทั่วไป หมวดวิถีสังคม' },
      { name_en: 'English For Academic Purposes', name_th: 'ภาษาอังกฤษเชิงวิชาการ', credit: '3', desc_en: 'English reading and writing for academic contexts.', desc_th: 'ภาษาอังกฤษสำหรับการอ่านและการเขียนเชิงวิชาการ' }
    ],
    2: [
      { name_en: 'Engineering Mathematics IV', name_th: 'คณิตศาสตร์วิศวกรรม 4', credit: '3', desc_en: 'Advanced engineering math, complex variables.', desc_th: 'คณิตศาสตร์วิศวกรรมขั้นสูง ตัวแปรเชิงซ้อน' },
      { name_en: 'Electromagnetic Fields', name_th: 'สนามแม่เหล็กไฟฟ้า', credit: '3', desc_en: 'Electromagnetic theory and applications.', desc_th: 'ทฤษฎีสนามแม่เหล็กไฟฟ้าและการประยุกต์' },
      { name_en: 'Electronics Engineering I', name_th: 'วิศวกรรมอิเล็กทรอนิกส์ 1', credit: '3', desc_en: 'Principles and design of electronic systems.', desc_th: 'หลักการและการออกแบบระบบอิเล็กทรอนิกส์' },
      { name_en: 'Electronics Circuits Analysis II', name_th: 'การวิเคราะห์วงจรอิเล็กทรอนิกส์ 2', credit: '3', desc_en: 'Advanced circuit analysis and frequency response.', desc_th: 'การวิเคราะห์วงจรขั้นสูงและการตอบสนองความถี่' },
      { name_en: 'Embedded Systems And Applications', name_th: 'ระบบสมองกลฝังตัวและการประยุกต์', credit: '3', desc_en: 'Microcontrollers and embedded system design.', desc_th: 'ไมโครคอนโทรลเลอร์และการออกแบบระบบสมองกลฝังตัว' },
      { name_en: 'Electronics Laboratory II', name_th: 'ปฏิบัติการอิเล็กทรอนิกส์ 2', credit: '1', desc_en: 'Laboratory for advanced circuits and embedded systems.', desc_th: 'ปฏิบัติการวงจรขั้นสูงและระบบสมองกลฝังตัว' },
      { name_en: 'Electrical Instruments And Measurements', name_th: 'เครื่องมือวัดและการวัดทางไฟฟ้า', credit: '3', desc_en: 'Principles of electrical measurements and instruments.', desc_th: 'หลักการของเครื่องมือวัดและการวัดทางไฟฟ้า' },
      { name_en: 'General Education Program (Language and Communication)', name_th: 'วิชาศึกษาทั่วไป (กลุ่มภาษาและการสื่อสาร)', credit: '3', desc_en: 'General education on communication skills.', desc_th: 'วิชาศึกษาทั่วไป หมวดภาษาและการสื่อสาร' },
      { name_en: 'Team-Project II', name_th: 'โครงงานกลุ่ม 2', credit: '1', desc_en: 'Intermediate engineering teamwork project.', desc_th: 'การทำโครงงานวิศวกรรมเป็นทีมระดับกลาง' }
    ]
  },
  3: {
    1: [
      { name_en: 'Digital Integrated Circuits', name_th: 'วงจรรวมดิจิทัล', credit: '3', desc_en: 'Design and analysis of digital ICs.', desc_th: 'การออกแบบและการวิเคราะห์วงจรรวมดิจิทัล' },
      { name_en: 'Electronics Engineering II', name_th: 'วิศวกรรมอิเล็กทรอนิกส์ 2', credit: '3', desc_en: 'Advanced electronics engineering concepts.', desc_th: 'แนวคิดวิศวกรรมอิเล็กทรอนิกส์ขั้นสูง' },
      { name_en: 'Signal And Systems', name_th: 'สัญญาณและระบบ', credit: '3', desc_en: 'Continuous and discrete-time signals and systems.', desc_th: 'สัญญาณและระบบแบบต่อเนื่องและไม่ต่อเนื่อง' },
      { name_en: 'Statistics And Data Analysis For Engineers', name_th: 'สถิติและการวิเคราะห์ข้อมูลสำหรับวิศวกร', credit: '3', desc_en: 'Statistical methods and data analysis.', desc_th: 'วิธีการทางสถิติและการวิเคราะห์ข้อมูล' },
      { name_en: 'Electronics Laboratory III', name_th: 'ปฏิบัติการอิเล็กทรอนิกส์ 3', credit: '2', desc_en: 'Advanced electronics and signal laboratory.', desc_th: 'ปฏิบัติการอิเล็กทรอนิกส์ขั้นสูงและสัญญาณ' },
      { name_en: 'Electronics Applications I', name_th: 'การประยุกต์ใช้อิเล็กทรอนิกส์ 1', credit: '1', desc_en: 'Practical applications of electronic theories.', desc_th: 'การประยุกต์ใช้งานทฤษฎีอิเล็กทรอนิกส์ภาคปฏิบัติ' },
      { name_en: 'General Education Program (Thinking Skills)', name_th: 'วิชาศึกษาทั่วไป (กลุ่มทักษะการคิด)', credit: '3', desc_en: 'General education focusing on critical thinking.', desc_th: 'วิชาศึกษาทั่วไป หมวดทักษะการคิดวิเคราะห์' }
    ],
    2: [
      { name_en: 'Control Systems', name_th: 'ระบบควบคุม', credit: '3', desc_en: 'Feedback control systems and stability analysis.', desc_th: 'ระบบควบคุมป้อนกลับและการวิเคราะห์เสถียรภาพ' },
      { name_en: 'Principles Of Communication', name_th: 'หลักการสื่อสาร', credit: '3', desc_en: 'Analog and digital communication principles.', desc_th: 'หลักการระบบสื่อสารแบบอนาล็อกและดิจิทัล' },
      { name_en: 'Analog Integrated Circuits', name_th: 'วงจรรวมอนาล็อก', credit: '3', desc_en: 'Design of analog integrated circuits.', desc_th: 'การออกแบบวงจรรวมแบบอนาล็อก' },
      { name_en: 'Digital Signal Processing', name_th: 'การประมวลผลสัญญาณดิจิทัล', credit: '3', desc_en: 'Discrete-time signals, Z-transforms, and filters.', desc_th: 'การประมวลผลสัญญาณดิจิทัลและการกรองความถี่' },
      { name_en: 'Electronics Laboratory IV', name_th: 'ปฏิบัติการอิเล็กทรอนิกส์ 4', credit: '2', desc_en: 'Control systems and communication laboratory.', desc_th: 'ปฏิบัติการระบบควบคุมและระบบสื่อสาร' },
      { name_en: 'Electronics Applications II', name_th: 'การประยุกต์ใช้อิเล็กทรอนิกส์ 2', credit: '3', desc_en: 'Advanced applications in electronics engineering.', desc_th: 'การประยุกต์ใช้งานวิศวกรรมอิเล็กทรอนิกส์ขั้นสูง' },
      { name_en: 'Team-Project III', name_th: 'โครงงานกลุ่ม 3', credit: '1', desc_en: 'Pre-project and teamwork preparation for senior year.', desc_th: 'เตรียมความพร้อมสำหรับปริญญานิพนธ์และการทำงานกลุ่ม' },
      { name_en: 'General Education Program (Management Science)', name_th: 'วิชาศึกษาทั่วไป (กลุ่มวิทยาการจัดการ)', credit: '3', desc_en: 'General education on management and business.', desc_th: 'วิชาศึกษาทั่วไป หมวดวิทยาการจัดการ' }
    ],
    3: [
      { name_en: 'Industrial Training', name_th: 'การฝึกงานทางอุตสาหกรรม', credit: '0', desc_en: 'Summer internship in an engineering company.', desc_th: 'การฝึกประสบการณ์วิชาชีพในสถานประกอบการช่วงฤดูร้อน' }
    ]
  },
  4: {
    // -----------------------------------------
    // แผน 1: โครงงาน/ปฏิบัติการ (Academic Project)
    // -----------------------------------------
    1: {
      1: [
        { name_en: 'Free Elective', name_th: 'วิชาเลือกเสรี', credit: '3', desc_en: 'Elective course of the student\'s choice.', desc_th: 'รายวิชาเลือกเสรีตามความสนใจของนักศึกษา' },
        { name_en: 'Elective In Electronics', name_th: 'วิชาเลือกทางอิเล็กทรอนิกส์ ', credit: '3', desc_en: 'Specialized elective.', desc_th: 'วิชาเลือกเฉพาะทางวิศวกรรมอิเล็กทรอนิกส์' },
        { name_en: 'Elective In Electronics', name_th: 'วิชาเลือกทางอิเล็กทรอนิกส์ ', credit: '3', desc_en: 'Specialized elective (3 credits).', desc_th: 'วิชาเลือกเฉพาะทางวิศวกรรมอิเล็กทรอนิกส์ (3 หน่วยกิต)' },
        { name_en: 'Elective In Electronics', name_th: 'วิชาเลือกทางอิเล็กทรอนิกส์ ', credit: '3', desc_en: 'Specialized elective.', desc_th: 'วิชาเลือกเฉพาะทางวิศวกรรมอิเล็กทรอนิกส์' },
        { name_en: 'Project I', name_th: 'ปริญญานิพนธ์ 1', credit: '3', desc_en: 'Senior engineering project proposal.', desc_th: 'โครงร่างปริญญานิพนธ์และการทดลองเบื้องต้น' }
      ],
      2: [
        { name_en: 'Free Elective', name_th: 'วิชาเลือกเสรี', credit: '3', desc_en: 'Elective course of the student\'s choice.', desc_th: 'รายวิชาเลือกเสรีตามความสนใจของนักศึกษา' },
        { name_en: 'Elective In Electronics', name_th: 'วิชาเลือกทางอิเล็กทรอนิกส์ ', credit: '3', desc_en: 'Specialized elective.', desc_th: 'วิชาเลือกเฉพาะทางวิศวกรรมอิเล็กทรอนิกส์' },
        { name_en: 'General Education Program', name_th: 'วิชาศึกษาทั่วไป', credit: '3', desc_en: 'General education requirements.', desc_th: 'วิชาศึกษาทั่วไป' },
        { name_en: 'Senior Seminar', name_th: 'สัมมนาทางวิศวกรรม', credit: '3', desc_en: 'Presentation and discussion.', desc_th: 'การนำเสนอและอภิปรายหัวข้อทางวิศวกรรมสมัยใหม่' },
        { name_en: 'Project II', name_th: 'ปริญญานิพนธ์ 2', credit: '3', desc_en: 'Final execution and presentation.', desc_th: 'การจัดทำชิ้นงานปริญญานิพนธ์และนำเสนอผลงาน' }
      ]
    },

    // -----------------------------------------
    // แผน 2: สหกิจศึกษา (Cooperative Education)
    // -----------------------------------------
    2: {
      1: [
        // เทอม 1 ของเด็กสหกิจมักจะต้องเรียนอัดแน่นนิดนึง (คุณสามารถแก้รายวิชาตามหลักสูตรจริงได้เลยครับ)
        { name_en: 'Cooperative Education', name_th: 'สหกิจศึกษา', credit: '6', desc_en: 'Full-time internship in an industrial enterprise.', desc_th: 'การปฏิบัติงานจริงในสถานประกอบการเต็มเวลา เป็นเวลาไม่น้อยกว่า 16 สัปดาห์' }
      ],
      2: [
        // เทอม 2 ไปสหกิจศึกษา (ออกไปทำงานสถานประกอบการเต็มเวลา)
        { name_en: 'Free Elective', name_th: 'วิชาเลือกเสรี', credit: '3', desc_en: 'Elective course.', desc_th: 'รายวิชาเลือกเสรีตามความสนใจ' },
        { name_en: 'Free Elective', name_th: 'วิชาเลือกเสรี', credit: '3', desc_en: 'Elective course.', desc_th: 'รายวิชาเลือกเสรีตามความสนใจ' },
        { name_en: 'Elective In Electronics', name_th: 'วิชาเลือกทางอิเล็กทรอนิกส์', credit: '3', desc_en: 'Specialized elective.', desc_th: 'วิชาเลือกเฉพาะทางวิศวกรรมอิเล็กทรอนิกส์ (3 หน่วยกิต)' },
        { name_en: 'Elective In Electronics', name_th: 'วิชาเลือกทางอิเล็กทรอนิกส์', credit: '3', desc_en: 'Specialized elective.', desc_th: 'วิชาเลือกเฉพาะทางวิศวกรรมอิเล็กทรอนิกส์ (3 หน่วยกิต)' },
        { name_en: 'Elective In Electronics', name_th: 'วิชาเลือกทางอิเล็กทรอนิกส์', credit: '3', desc_en: 'Specialized elective.', desc_th: 'วิชาเลือกเฉพาะทางวิศวกรรมอิเล็กทรอนิกส์ (3 หน่วยกิต)' },
        { name_en: 'Elective In Electronics', name_th: 'วิชาเลือกทางอิเล็กทรอนิกส์', credit: '3', desc_en: 'Specialized elective.', desc_th: 'วิชาเลือกเฉพาะทางวิศวกรรมอิเล็กทรอนิกส์ (3 หน่วยกิต)' },
        { name_en: 'General Education Program', name_th: 'วิชาศึกษาทั่วไป', credit: '3', desc_en: 'General education requirements.', desc_th: 'วิชาศึกษาทั่วไป' },
       { name_en: 'Senior Seminar', name_th: 'สัมมนาทางวิศวกรรม', credit: '3', desc_en: 'Presentation and discussion.', desc_th: 'การนำเสนอและอภิปรายหัวข้อทางวิศวกรรมสมัยใหม่' },
      ]
    }
  }
};

// 1. กำหนดค่าเริ่มต้นเป็น ปี 1 เทอม 1
let currentYear = 1;
let currentTerm = 1;

// 2. ฟังก์ชันสลับปี
function switchYear(yr) {
  currentYear = yr;
  currentTerm = 1; // รีเซ็ตกลับมาเทอม 1 ทุกครั้งที่เปลี่ยนปี
  
  document.querySelectorAll('.year-tab').forEach((b, i) => b.classList.toggle('active', i + 1 === yr));
  document.querySelectorAll('.term-tab').forEach((b, i) => b.classList.toggle('active', i === 0));
  
  renderSubjects();
}

// 3. ฟังก์ชันสลับเทอม
function switchTerm(tm) {
  currentTerm = tm;
  document.querySelectorAll('.term-tab').forEach((b, i) => b.classList.toggle('active', i + 1 === tm));
  renderSubjects();
}

let currentPlan = 1; // 1 = โครงงาน/ปฏิบัติการ, 2 = สหกิจ

// ฟังก์ชันสลับแผนการเรียน
function switchPlan(plan) {
    currentPlan = plan;
    
    // อัปเดตปุ่มแผนการเรียนให้เปลี่ยนสี (Active)
    document.querySelectorAll('.plan-tab').forEach((b, i) => b.classList.toggle('active', i + 1 === plan));
    
    // เรียกแสดงผลวิชาใหม่
    renderSubjects();
}

// 4. ฟังก์ชันแสดงวิชา (สำคัญ: ใส่ onclick ไว้ตรงนี้)
function renderSubjects() {
  const contentDiv = document.getElementById('year-content');
  const summerBtn = document.querySelector('.term-tab-summer');
  
  if (summerBtn) {
    summerBtn.style.display = (currentYear === 3) ? 'inline-block' : 'none';
  }

  // 💡 จุดสำคัญ: ตรวจสอบการดึงข้อมูลตามชั้นปีและแผนการเรียน
  let subjects = [];
  
  if (currentYear === 4) {
      // ถ้าเป็นปี 4 ให้ดึงข้อมูลจาก -> ปี 4 -> แผนที่เลือก -> เทอมที่เลือก
      if (yearData[4] && yearData[4][currentPlan] && yearData[4][currentPlan][currentTerm]) {
          subjects = yearData[4][currentPlan][currentTerm];
      }
  } else {
      // ถ้าเป็นปี 1-3 ให้ดึงข้อมูลปกติ ไม่ต้องสนแผนการเรียน
      if (yearData[currentYear] && yearData[currentYear][currentTerm]) {
          subjects = yearData[currentYear][currentTerm];
      }
  }
  
  const btnEn = document.getElementById('btn-en');
  const currentLang = (btnEn && btnEn.classList.contains('active')) ? 'en' : 'th';
  
  contentDiv.innerHTML = subjects.map((sub, index) => {
    const displayName = currentLang === 'en' ? sub.name_en : sub.name_th;
    const displayCredit = currentLang === 'en' ? `${sub.credit} Credits` : `${sub.credit} หน่วยกิต`;

    // 💡 ส่ง currentPlan เข้าไปด้วยเผื่อปี 4 ต้องการใช้แยกข้อมูลในหน้า Modal
    return `<div class="subject-item" onclick="showDetail(${currentYear}, ${currentPlan}, ${currentTerm}, ${index})" style="cursor:pointer; transition: 0.2s;">
      <div class="subject-dot"></div>
      
      <div class="subject-name" style="font-weight:bold;" data-th="${sub.name_th}" data-en="${sub.name_en}">${displayName}</div>
      <div class="subject-credit" style="font-weight:bold;" data-th="${sub.credit} หน่วยกิต" data-en="${sub.credit} Credits">${displayCredit}</div>
      
    </div>`;
  }).join('');
}

// 💡 เปลี่ยนจากรับ 3 ค่า เป็นรับ 4 ค่า (เพิ่ม plan เข้ามา)
function showDetail(year, plan, term, index) {
  
  let subject;
  
  // 💡 จุดที่แก้ไข: เช็คว่าถ้าเป็นปี 4 ต้องดึงข้อมูลแยกตามแผนการเรียน
  if (year === 4) {
      subject = yearData[4][plan][term][index];
  } else {
      // ปี 1-3 ดึงแบบปกติ (ไม่สนแผน)
      subject = yearData[year][term][index];
  }
  
  const titleEl = document.getElementById('modal-title');
  const descEl = document.getElementById('modal-desc');

  // เช็คภาษาจากปุ่ม EN
  const btnEn = document.getElementById('btn-en');
  const currentLang = (btnEn && btnEn.classList.contains('active')) ? 'en' : 'th';

  titleEl.setAttribute('data-th', subject.name_th);
  titleEl.setAttribute('data-en', subject.name_en);
  
  descEl.setAttribute('data-th', subject.desc_th);
  descEl.setAttribute('data-en', subject.desc_en);

  // กำหนดข้อความให้ตรงกับปุ่มภาษาที่ผู้ใช้กดไว้
  if (currentLang === 'en') {
      titleEl.innerText = subject.name_en;
      descEl.innerText = subject.desc_en;
  } else {
      titleEl.innerText = subject.name_th;
      descEl.innerText = subject.desc_th;
  }
  
  const mediaContainer = document.getElementById('modal-media');
  if (subject.media) {
    mediaContainer.innerHTML = subject.media;
    mediaContainer.style.display = 'block';
  } else {
    mediaContainer.style.display = 'none';
  }
  
  document.getElementById('subject-modal').style.display = 'flex';
}
// 🎯 6. สำคัญที่สุด: สั่งทำงานทันทีตอนโหลดหน้าเว็บ 
// เพื่อให้ข้อมูลชุดแรกขึ้นมาพร้อมให้กดได้เลย
renderSubjects();

// ── QUIZ ──
function calcQuiz() {
  const qs = ['q1','q2','q3','q4','q5'];
  let score = 0, answered = 0;
  for (const q of qs) {
    const sel = document.querySelector(`input[name="${q}"]:checked`);
    if (sel) { score += parseInt(sel.value); answered++; }
  }
  if (answered < 5) { alert('กรุณาตอบให้ครบทุกข้อก่อนนะคะ'); return; }
  const result = document.getElementById('quiz-result');
  document.getElementById('quiz-questions').style.display = 'none';
  result.style.display = 'block';
  let html = '';
  if (score >= 13) {
    html = `<div style="font-size:3rem;margin-bottom:16px;">🌅</div>
    <div style="font-family:'DM Serif Display',serif;font-size:1.4rem;background:linear-gradient(135deg,var(--coral),var(--orange));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:12px;">เหมาะมากเลย!</div>
    <p style="color:var(--muted);font-size:0.88rem;line-height:1.7;margin-bottom:18px;">คุณมีคุณสมบัติตรงกับสาขานี้มาก ทั้งความชอบด้านเทคนิค ความอดทน และทิศทางอาชีพ</p>
    <div style="background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.25);border-radius:12px;padding:14px;font-size:0.83rem;color:var(--coral);">💡 แนะนำ: ลองสมัครค่าย E-GEAR ของภาควิชาก่อนตัดสินใจ</div>`;
  } else if (score >= 9) {
    html = `<div style="font-size:3rem;margin-bottom:16px;">✨</div>
    <div style="font-family:'DM Serif Display',serif;font-size:1.4rem;color:var(--orange);margin-bottom:12px;">มีโอกาสเรียนได้</div>
    <p style="color:var(--muted);font-size:0.88rem;line-height:1.7;margin-bottom:18px;">คุณมีพื้นฐานบางด้านที่เหมาะสม ถ้าตั้งใจจริงก็สามารถสำเร็จได้</p>
    <div style="background:rgba(255,159,67,0.08);border:1px solid rgba(255,159,67,0.2);border-radius:12px;padding:14px;font-size:0.83rem;color:var(--orange);">💡 แนะนำ: ลองดูหลักสูตรปี 1-2 ว่าวิชาตรงกับที่ชอบหรือเปล่า</div>`;
  } else {
    html = `<div style="font-size:3rem;margin-bottom:16px;">🔍</div>
    <div style="font-family:'DM Serif Display',serif;font-size:1.4rem;color:var(--muted);margin-bottom:12px;">อาจมีสาขาอื่นที่เหมาะกว่า</div>
    <p style="color:var(--muted);font-size:0.88rem;line-height:1.7;margin-bottom:18px;">ความสนใจของคุณอาจตรงกับสาขาอื่น เช่น Computer Engineering หรือ IT</p>
    <div style="background:rgba(255,211,42,0.06);border:1px solid rgba(255,211,42,0.15);border-radius:12px;padding:14px;font-size:0.83rem;color:var(--yellow);">💡 แนะนำ: ลองกลับไปดูสาขาอื่นๆ ในคณะวิศวกรรมศาสตร์</div>`;
  }
  html += `<button onclick="document.getElementById('quiz-questions').style.display='block';document.getElementById('quiz-result').style.display='none';document.querySelectorAll('input[type=radio]').forEach(r=>r.checked=false);" style="margin-top:18px;background:rgba(255,255,255,0.06);border:1px solid var(--card-border);color:var(--muted);padding:10px 24px;border-radius:100px;cursor:pointer;font-family:'Sarabun',sans-serif;font-size:0.85rem;">↺ ทำแบบทดสอบใหม่</button>`;
  result.innerHTML = html;
}

// ── INIT ──
setLang('th');

