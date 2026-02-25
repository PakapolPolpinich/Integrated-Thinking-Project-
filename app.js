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
  1:[['Mathematics I','3'],['Physics for Engineers','3'],['Engineering Drawing','3'],['Introduction to Programming','3'],['English for Engineers I','3'],['Basic Circuit Theory','3']],
  2:[['Electronics I','3'],['Digital Logic Design','3'],['Signals and Systems','3'],['Microprocessor Systems','3'],['Electromagnetic Theory','3'],['Programming for Engineers','3']],
  3:[['VLSI Design','3'],['Embedded Systems','3'],['DSP','3'],['Control Systems','3'],['Communication Systems','3'],['Senior Elective I','3']],
  4:[['Senior Project I','3'],['Senior Project II','3'],['Cooperative Education','6'],['Senior Elective II','3'],['Engineering Ethics','2'],['Professional English','3']]
};
function switchYear(yr) {
  document.querySelectorAll('.year-tab').forEach((b,i) => b.classList.toggle('active', i+1===yr));
  const c = document.getElementById('year-content');
  c.innerHTML = yearData[yr].map(([n,cr]) =>
    `<div class="subject-item"><div class="subject-dot"></div><div class="subject-name">${n}</div><div class="subject-credit">${cr} หน่วยกิต</div></div>`
  ).join('');
}

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

