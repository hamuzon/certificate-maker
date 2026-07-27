const recipientName = document.getElementById('recipientName');
const awardTitle = document.getElementById('awardTitle');
const reason = document.getElementById('reason');
const issuerName = document.getElementById('issuerName');
const issuerTitle = document.getElementById('issuerTitle');
const dateInput = document.getElementById('date');
const dateNumeralStyle = document.getElementById('dateNumeralStyle');
const orientation = document.getElementById('orientation');
const paperOrientation = document.getElementById('paperOrientation');
const borderStyle = document.getElementById('borderStyle');
const templateBg = document.getElementById('templateBg');
const showStamp = document.getElementById('showStamp');
const stampType = document.getElementById('stampType');
const paperSizeLabel = document.getElementById('paperSizeLabel');

const certRecipient = document.getElementById('certRecipient');
const certAwardTitle = document.getElementById('certAwardTitle');
const certReason = document.getElementById('certReason');
const certIssuerName = document.getElementById('certIssuerName');
const certIssuerTitle = document.getElementById('certIssuerTitle');
const certDate = document.getElementById('certDate');
const certStamp = document.getElementById('certStamp');

const vertRecipient = document.getElementById('vertRecipient');
const vertAwardTitle = document.getElementById('vertAwardTitle');
const vertReason = document.getElementById('vertReason');
const vertIssuerName = document.getElementById('vertIssuerName');
const vertIssuerTitle = document.getElementById('vertIssuerTitle');
const vertDate = document.getElementById('vertDate');
const vertStamp = document.getElementById('vertStamp');

const certificate = document.getElementById('certificate');
const certificateWrapper = document.getElementById('certificateWrapper');
const layoutHorizontal = document.getElementById('layoutHorizontal');
const layoutVertical = document.getElementById('layoutVertical');

const saveImageBtn = document.getElementById('saveImageBtn');
const printBtn = document.getElementById('printBtn');
const resetBtn = document.getElementById('resetBtn');
const templateSets = document.getElementById('templateSets');

const sampleNames = [
  '鈴木 一郎', '佐藤 花子', '高橋 健太', '田中 美咲', '渡辺 陽子',
  '山田 太郎', '中村 さくら', '小林 直樹', '加藤 あゆみ', '吉田 拓也',
  '松本 美紀', '井上 大輔', '木村 夏美', '林 誠一', '清水 栞'
];

const STORAGE_KEY = 'certificate-maker-data';

function saveToStorage() {
  const data = {
    recipientName: recipientName.value, awardTitle: awardTitle.value, reason: reason.value,
    issuerName: issuerName.value, issuerTitle: issuerTitle.value, date: dateInput.value,
    dateNumeralStyle: dateNumeralStyle.value, orientation: orientation.value,
    paperOrientation: paperOrientation.value, borderStyle: borderStyle.value,
    templateBg: templateBg.value, showStamp: showStamp.checked, stampType: stampType.value
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
}

function loadFromStorage() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
}

function applyStoredData(data) {
  if (!data) return false;
  recipientName.value = data.recipientName || '';
  awardTitle.value = data.awardTitle || '優秀社員賞';
  reason.value = data.reason || '';
  issuerName.value = data.issuerName || '';
  issuerTitle.value = data.issuerTitle || '';
  dateInput.value = data.date || '';
  if (data.dateNumeralStyle) dateNumeralStyle.value = data.dateNumeralStyle;
  if (data.orientation) orientation.value = data.orientation;
  if (data.paperOrientation) paperOrientation.value = data.paperOrientation;
  if (data.borderStyle) borderStyle.value = data.borderStyle;
  if (data.templateBg) templateBg.value = data.templateBg;
  showStamp.checked = data.showStamp !== undefined ? data.showStamp : true;
  if (data.stampType) stampType.value = data.stampType;
  return true;
}

function saveAndUpdate() { saveToStorage(); updatePreview(); }

function toKanjiNum(numStr) {
  const kanji = '〇一二三四五六七八九';
  return numStr.replace(/[0-9]/g, (s) => kanji[parseInt(s)]);
}

function yearToRoman(year) {
  const num = parseInt(year);
  if (num < 1 || num > 3999) return year;
  const romanMap = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
  let r = '', n = num;
  for (const [v,s] of romanMap) { while (n >= v) { r += s; n -= v; } }
  return r;
}

function toRomanNum(n) {
  const romanMap = [[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
  let r = '', num = n;
  for (const [v,s] of romanMap) { while (num >= v) { r += s; num -= v; } }
  return r;
}

function updateDateDisplay() {
  if (!dateInput.value) return;
  const [year, month, day] = dateInput.value.split('-');
  const m = parseInt(month, 10), d = parseInt(day, 10);
  const style = dateNumeralStyle.value;
  certDate.textContent = `${year} / ${month} / ${day}`;
  let vds;
  switch (style) {
    case 'kanji': vds = `${toKanjiNum(year)}年${toKanjiNum(String(m))}月${toKanjiNum(String(d))}日`; break;
    case 'roman': vds = `${yearToRoman(year)}年${toRomanNum(m)}月${toRomanNum(d)}日`; break;
    default: vds = `${year}年${m}月${d}日`;
  }
  vertDate.textContent = vds;
}

function updatePreview() {
  const name = recipientName.value || '（お名前）';
  const title = awardTitle.value || '（賞の名前）';
  const msg = reason.value || '（メッセージ）';
  const issuer = issuerName.value || '（発行者）';
  const issuerT = issuerTitle.value || '（肩書き）';
  certRecipient.textContent = name;
  certAwardTitle.textContent = title;
  certReason.textContent = msg;
  certIssuerName.textContent = issuer;
  certIssuerTitle.textContent = issuerT;
  vertRecipient.textContent = name;
  vertAwardTitle.textContent = title;
  vertReason.textContent = msg;
  vertIssuerName.textContent = issuer;
  vertIssuerTitle.textContent = issuerT;
  updateDateDisplay();
  updateBorderStyle();
  updateOrientation();
  updatePaperOrientation();
  updateTemplateBg();
  updateStamp();
}

function updateBorderStyle() {
  const bc = Array.from(certificate.classList).filter(c => c.startsWith('border-'));
  certificate.classList.remove(...bc);
  certificate.classList.add('border-' + borderStyle.value);
}

function updateOrientation() {
  const v = orientation.value === 'vertical';
  layoutHorizontal.style.display = v ? 'none' : 'flex';
  layoutVertical.style.display = v ? 'flex' : 'none';
}

function updatePaperOrientation() {
  const pc = Array.from(certificate.classList).filter(c => c.startsWith('paper-'));
  certificate.classList.remove(...pc);
  const isLandscape = paperOrientation.value === 'landscape';
  certificate.classList.add(isLandscape ? 'paper-landscape' : 'paper-portrait');
  paperSizeLabel.textContent = isLandscape ? 'A4 横' : 'A4 縦';
}

function updateTemplateBg() {
  const tc = Array.from(certificate.classList).filter(c => c.startsWith('tpl-'));
  certificate.classList.remove(...tc);
  const val = templateBg.value;
  if (val && val !== 'none') certificate.classList.add('tpl-' + val);
}

function updateStamp() {
  const show = showStamp.checked;
  const stamp = stampType.value;
  certStamp.textContent = stamp;
  vertStamp.textContent = stamp;
  certStamp.classList.toggle('hidden', !show);
  vertStamp.classList.toggle('hidden', !show);
}

templateSets.addEventListener('click', e => {
  const btn = e.target.closest('.tpl-set');
  if (!btn) return;
  awardTitle.value = btn.dataset.award;
  reason.value = btn.dataset.msg;
  if (btn.dataset.issuer) issuerName.value = btn.dataset.issuer;
  if (btn.dataset.issuerTitle) issuerTitle.value = btn.dataset.issuerTitle;
  saveAndUpdate();
});

recipientName.addEventListener('input', saveAndUpdate);
awardTitle.addEventListener('input', saveAndUpdate);
reason.addEventListener('input', saveAndUpdate);
issuerName.addEventListener('input', saveAndUpdate);
issuerTitle.addEventListener('input', saveAndUpdate);
dateInput.addEventListener('input', () => { updateDateDisplay(); saveToStorage(); });
dateNumeralStyle.addEventListener('change', saveAndUpdate);
orientation.addEventListener('change', saveAndUpdate);
paperOrientation.addEventListener('change', saveAndUpdate);
borderStyle.addEventListener('change', saveAndUpdate);
templateBg.addEventListener('change', saveAndUpdate);
showStamp.addEventListener('change', () => { updateStamp(); saveToStorage(); });
stampType.addEventListener('change', () => { updateStamp(); saveToStorage(); });

printBtn.addEventListener('click', () => {
  const styleId = 'print-dynamic-style';
  let styleEl = document.getElementById(styleId);
  if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = styleId; document.head.appendChild(styleEl); }
  const isLandscape = paperOrientation.value === 'landscape';
  const size = isLandscape ? 'A4 landscape' : 'A4 portrait';
  styleEl.textContent = `@media print{@page{margin:0;size:${size}}html,body{margin:0!important;padding:0!important;width:100%!important;height:100%!important;overflow:hidden!important}body *{visibility:hidden!important}.preview-section,.preview-section *{visibility:visible!important}.preview-section{position:absolute!important;left:0!important;top:0!important;width:100%!important;height:100%!important;margin:0!important;padding:0!important;box-shadow:none!important;background:none!important;border:none!important;display:flex!important;align-items:center!important;justify-content:center!important;page-break-after:avoid!important;page-break-inside:avoid!important;break-inside:avoid!important}.certificate-wrapper{width:100%!important;height:100%!important;padding:0!important;margin:0!important;background:none!important;display:flex!important;align-items:center!important;justify-content:center!important}.certificate{width:100vw!important;height:100vh!important;max-width:100vw!important;max-height:100vh!important;aspect-ratio:auto!important;padding:15mm!important;margin:0!important;box-sizing:border-box!important;overflow:hidden!important;display:flex!important;align-items:center!important;justify-content:center!important}.cert-border{width:100%!important;height:100%!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important}.cert-inner{width:100%!important;height:100%!important;box-sizing:border-box!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important}.cert-bg,.cert-border,.cert-inner{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}`;
  setTimeout(() => { window.print(); setTimeout(() => { styleEl.textContent = ''; }, 200); }, 50);
});

saveImageBtn.addEventListener('click', () => {
  const original = document.getElementById('certificate');
  const bgEl = document.getElementById('certBg');
  const bgClasses = Array.from(bgEl.classList).filter(c => c.startsWith('tpl-'));
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;height:1123px;background:#fff;display:flex;align-items:center;justify-content:center;padding:0;';
  document.body.appendChild(container);
  const clone = original.cloneNode(true);
  clone.style.cssText = 'width:100%;height:100%;max-width:100%;max-height:100%;aspect-ratio:auto;padding:15mm;margin:0;box-sizing:border-box;overflow:hidden;display:flex;align-items:center;justify-content:center;position:relative;';
  const borderClasses = Array.from(original.classList).filter(c => c.startsWith('border-'));
  borderClasses.forEach(c => clone.classList.add(c));
  bgClasses.forEach(c => clone.classList.add(c));
  const cloneBg = clone.querySelector('#certBg');
  bgClasses.forEach(c => cloneBg.classList.add(c));
  container.appendChild(clone);
  void clone.offsetHeight;
  html2canvas(clone, { scale: 3, useCORS: true, backgroundColor: '#ffffff', logging: false, allowTaint: false, width: 794, height: 1123 })
    .then(canvas => {
      document.body.removeChild(container);
      const link = document.createElement('a');
      const now = new Date();
      const pad = (num) => String(num).padStart(2, '0');
      const Y = now.getFullYear(), M = pad(now.getMonth()+1), D = pad(now.getDate());
      const HH = pad(now.getHours()), mm = pad(now.getMinutes()), ss = pad(now.getSeconds());
      const name = recipientName.value.trim() || '名称未設定';
      link.download = `${name}-certificate-maker_${Y}_${M}_${D}_${HH}_${mm}_${ss}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(() => { if (container.parentNode) document.body.removeChild(container); });
});

resetBtn.addEventListener('click', () => {
  recipientName.value = '';
  awardTitle.value = '優秀社員賞';
  reason.value = '年間を通じて顕著な業績を挙げ 会社の発展に多大な貢献をされました よってその功績を称え ここに表彰します';
  issuerName.value = '株式会社サンプル';
  issuerTitle.value = '代表取締役社長';
  borderStyle.value = 'classic';
  orientation.value = 'horizontal';
  paperOrientation.value = 'portrait';
  templateBg.value = 'none';
  showStamp.checked = true;
  stampType.value = '㊞';
  dateNumeralStyle.value = 'kanji';
  const d = new Date();
  dateInput.value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  saveToStorage();
  updatePreview();
});

const savedData = loadFromStorage();
if (savedData) {
  applyStoredData(savedData);
} else {
  const randomIndex = Math.floor(Math.random() * sampleNames.length);
  recipientName.value = sampleNames[randomIndex];
}
if (!dateInput.value) {
  const d = new Date();
  dateInput.value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
updatePreview();