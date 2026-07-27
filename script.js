// ===== DOM =====
const recipientName = document.getElementById('recipientName');
const awardTitle = document.getElementById('awardTitle');
const reason = document.getElementById('reason');
const issuerName = document.getElementById('issuerName');
const issuerTitle = document.getElementById('issuerTitle');
const dateInput = document.getElementById('date');
const orientation = document.getElementById('orientation');
const borderStyle = document.getElementById('borderStyle');
const templateBg = document.getElementById('templateBg');
const showStamp = document.getElementById('showStamp');
const stampType = document.getElementById('stampType');
// const paperSize = document.getElementById('paperSize');
// const marginGroup = document.getElementById('marginGroup');
// const marginRadios = document.querySelectorAll('input[name="printMargin"]');
// const paperSizeLabel = document.getElementById('paperSizeLabel');

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
const stampPreview = document.getElementById('stampPreview');

const printBtn = document.getElementById('printBtn');
const resetBtn = document.getElementById('resetBtn');
const templateSets = document.getElementById('templateSets');

// 用紙サイズの表示名マップ
const paperLabels = {
  'a4-portrait': 'A4 縦',
  'a4-landscape': 'A4 横',
  'a3-portrait': 'A3 縦',
  'a3-landscape': 'A3 横',
  'b5-portrait': 'B5 縦',
  'postcard': 'はがき',
  'square': 'スクエア',
  'fit': '用紙いっぱい'
};

// ===== 日付 =====
function setDefaultDate() {
  const d = new Date();
  dateInput.value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  updateDateDisplay();
}

function updateDateDisplay() {
  if (!dateInput.value) return;
  const [y, m, d] = dateInput.value.split('-');
  const str = `${y}年${parseInt(m)}月${parseInt(d)}日`;
  certDate.textContent = str;
  vertDate.textContent = str;
}

// ===== プレビュー更新 =====
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
  updateTemplateBg();
  updateStamp();
  updatePaperSize();
} 

// ===== 枠 =====
function updateBorderStyle() {
  const borderClasses = Array.from(certificate.classList).filter(c => c.startsWith('border-'));
  certificate.classList.remove(...borderClasses);
  certificate.classList.add('border-' + borderStyle.value);
}

// ===== 縦/横 =====
function updateOrientation() {
  const v = orientation.value === 'vertical';
  layoutHorizontal.style.display = v ? 'none' : 'flex';
  layoutVertical.style.display = v ? 'flex' : 'none';
}

// ===== テンプレート背景 =====
function updateTemplateBg() {
  const tplClasses = Array.from(certificate.classList).filter(c => c.startsWith('tpl-'));
  certificate.classList.remove(...tplClasses);
  const val = templateBg.value;
  if (val && val !== 'none') {
    certificate.classList.add('tpl-' + val);
  }
}

// ===== 印鑑 =====
function updateStamp() {
  const show = showStamp.checked;
  const stamp = stampType.value;
  certStamp.textContent = stamp;
  vertStamp.textContent = stamp;
  stampPreview.textContent = stamp;
  certStamp.classList.toggle('hidden', !show);
  vertStamp.classList.toggle('hidden', !show);
  stampPreview.classList.toggle('hidden', !show);
}

// ===== 用紙サイズ =====
function updatePaperSize() {
  // const paperClasses = Array.from(certificateWrapper.classList).filter(c => c.startsWith('paper-'));
  // certificateWrapper.classList.remove(...paperClasses);
  // certificateWrapper.classList.add('paper-' + paperSize.value);
  // paperSizeLabel.textContent = paperLabels[paperSize.value] || paperSize.value;
  // marginGroup.style.display = paperSize.value === 'fit' ? 'none' : '';
}

// ===== 選択中の余白を取得 =====
function getSelectedMargin() {
  // for (const radio of marginRadios) {
  //   if (radio.checked) return radio.value;
  // }
  return '15mm';
} 

// ===== セットテンプレート =====
templateSets.addEventListener('click', e => {
  const btn = e.target.closest('.tpl-set');
  if (!btn) return;
  awardTitle.value = btn.dataset.award;
  reason.value = btn.dataset.msg;
  if (btn.dataset.issuer) issuerName.value = btn.dataset.issuer;
  if (btn.dataset.issuerTitle) issuerTitle.value = btn.dataset.issuerTitle;
  updatePreview();
});

// ===== イベント =====
recipientName.addEventListener('input', updatePreview);
awardTitle.addEventListener('input', updatePreview);
reason.addEventListener('input', updatePreview);
issuerName.addEventListener('input', updatePreview);
issuerTitle.addEventListener('input', updatePreview);
dateInput.addEventListener('input', updateDateDisplay);
orientation.addEventListener('change', updatePreview);
borderStyle.addEventListener('change', updatePreview);
templateBg.addEventListener('change', updatePreview);
showStamp.addEventListener('change', updateStamp);
stampType.addEventListener('change', updateStamp);
// paperSize.addEventListener('change', updatePaperSize);
// marginRadios.forEach(r => r.addEventListener('change', () => {}));

// ===== 印刷（用紙サイズと余白を動的に設定） =====
printBtn.addEventListener('click', () => {
  const styleId = 'print-dynamic-style';
  let styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  const sizeMap = {
    'a4-portrait': 'A4 portrait',
    'a4-landscape': 'A4 landscape',
    'a3-portrait': 'A3 portrait',
    'a3-landscape': 'A3 landscape',
    'b5-portrait': 'JIS-B5 portrait',
    'postcard': '100x148mm',
    'square': '200x200mm',
    'fit': 'A4 portrait'
  };

  // const size = sizeMap[paperSize.value] || 'A4 portrait';
  const size = 'A4 portrait';
  const margin = getSelectedMargin();

  styleEl.textContent = `
    @media print {
      @page {
        size: ${size};
        margin: ${margin};
      }
      .certificate {
        max-width: 100%;
        padding: 0;
        aspect-ratio: auto;
        height: 100vh;
      }
    }
  `;

  window.print();
  styleEl.textContent = '';
});

// ===== リセット =====
resetBtn.addEventListener('click', () => {
  recipientName.value = '';
  awardTitle.value = '';
  reason.value = '';
  issuerName.value = '';
  issuerTitle.value = '';
  borderStyle.value = 'classic';
  orientation.value = 'horizontal';
  templateBg.value = 'none';
  showStamp.checked = true;
  stampType.value = '㊞';
  // paperSize.value = 'a4-portrait';
  // document.querySelector('input[name="printMargin"][value="15mm"]').checked = true;
  setDefaultDate();
  updatePreview();
});

// ===== 初期化 =====
setDefaultDate();
updatePreview();