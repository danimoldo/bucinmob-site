/**
 * ═══════════════════════════════════════════════════════════
 *  BUCIN MOB – Configurator Rapid (Form B)
 *  Pentru paginile de produs: uși și ferestre
 *
 *  INSTRUCȚIUNI DE INSTALARE:
 *  ─────────────────────────────────────────────────────────
 *  1. Completați CFG cu datele voastre EmailJS.
 *
 *  2. Pe fiecare pagină de produs din Gomag, adăugați un
 *     bloc HTML personalizat unde doriți formularul:
 *
 *       <div id="bmc-root"
 *            data-product="Ușă Exterior Molid Model 20"
 *            data-dims="1500x2000"
 *            data-type="usa">
 *       </div>
 *
 *     data-type acceptă: "usa" | "fereastra" | "auto"
 *     (auto = detectează din URL)
 *
 *  3. Lipiți acest script într-un bloc <script> după div.
 * ═══════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────────────── */
  var CFG = {
    publicKey:    'YOUR_PUBLIC_KEY',
    serviceId:    'YOUR_SERVICE_ID',
    templateId:   'YOUR_TEMPLATE_ID',
    mountId:      'bmc-root',
  };

  var ROOT = document.getElementById(CFG.mountId);
  if (!ROOT) return;

  /* ── DETECT PRODUCT TYPE ────────────────────────────────── */
  var dataType    = (ROOT.getAttribute('data-type') || 'auto').toLowerCase();
  var productName = ROOT.getAttribute('data-product') || '';
  var productDims = ROOT.getAttribute('data-dims') || '';

  var isWindow = false;
  if (dataType === 'fereastra') {
    isWindow = true;
  } else if (dataType === 'auto' || dataType === 'usa') {
    var path = window.location.pathname.toLowerCase();
    isWindow = path.indexOf('fereastr') !== -1 || path.indexOf('window') !== -1;
  }

  var productType = isWindow ? 'Fereastră' : 'Ușă';

  /* ── FONTS & STYLES ─────────────────────────────────────── */
  if (!document.getElementById('bmc-fonts')) {
    var lnk = document.createElement('link');
    lnk.id   = 'bmc-fonts';
    lnk.rel  = 'stylesheet';
    lnk.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@300;400;500;600&display=swap';
    document.head.appendChild(lnk);
  }

  if (!document.getElementById('bmc-style')) {
    var st = document.createElement('style');
    st.id = 'bmc-style';
    st.textContent = `
.bmc *,.bmc *::before,.bmc *::after{box-sizing:border-box;margin:0;padding:0}
.bmc{
  --oak:#7B5C3A;--oak-d:#5A3E25;--oak-p:#F5EDE0;--grain:#EAD8C0;
  --bark:#2D1F12;--fog:#F9F5F0;--ink:#1C1410;--mu:#8C7A68;
  --bd:#D9C9B5;--ok:#3A7A4A;--er:#9B3030;--r:6px;
  font-family:'Inter',sans-serif;color:var(--ink);
}
.bmc-card{
  background:#fff;border:1px solid var(--bd);border-radius:10px;
  box-shadow:0 2px 20px rgba(45,31,18,.09);overflow:hidden;
  max-width:700px;margin:32px auto 0;
}
/* header */
.bmc-head{
  background:var(--bark);padding:24px 32px 20px;
  position:relative;overflow:hidden;
}
.bmc-head::before{
  content:'';position:absolute;inset:0;
  background:repeating-linear-gradient(105deg,transparent,transparent 20px,
    rgba(255,255,255,.025) 20px,rgba(255,255,255,.025) 21px);
  pointer-events:none;
}
.bmc-head-tag{
  font-size:10px;font-weight:700;letter-spacing:.14em;
  text-transform:uppercase;color:var(--grain);margin-bottom:6px;
}
.bmc-head h3{
  font-family:'Playfair Display',serif;font-size:20px;
  font-weight:600;color:#fff;line-height:1.25;
}
.bmc-head p{font-size:13px;color:var(--grain);margin-top:5px;font-weight:300;line-height:1.5}
/* product pill */
.bmc-pill{
  display:inline-flex;align-items:center;gap:7px;
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);
  border-radius:20px;padding:5px 12px;margin-top:12px;
  font-size:12px;color:rgba(255,255,255,.85);font-weight:500;
}
.bmc-pill svg{opacity:.7;flex-shrink:0}
/* body */
.bmc-body{padding:28px 32px 32px}
/* section labels */
.bmc-section{
  font-size:10px;font-weight:700;letter-spacing:.12em;
  text-transform:uppercase;color:var(--mu);
  border-bottom:1px solid var(--bd);padding-bottom:8px;margin-bottom:18px;
}
.bmc-section:not(:first-child){margin-top:26px}
/* grid */
.bmc-grid{display:grid;gap:14px;margin-bottom:14px}
.bmc-g2{grid-template-columns:1fr 1fr}
.bmc-g3{grid-template-columns:1fr 1fr 1fr}
/* field */
.bmc-f{display:flex;flex-direction:column;gap:5px}
.bmc-f label{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--mu)}
.bmc-f label span{color:var(--oak);margin-left:2px}
.bmc-f input,.bmc-f select,.bmc-f textarea{
  font-family:'Inter',sans-serif;font-size:14px;color:var(--ink);
  background:var(--fog);border:1.5px solid var(--bd);
  border-radius:var(--r);padding:9px 12px;
  transition:border-color .18s,box-shadow .18s;outline:none;width:100%;
}
.bmc-f input:focus,.bmc-f select:focus,.bmc-f textarea:focus{
  border-color:var(--oak);box-shadow:0 0 0 3px rgba(123,92,58,.11);background:#fff;
}
.bmc-f textarea{resize:vertical;min-height:80px}
/* dims row */
.bmc-dims{display:flex;align-items:center;gap:8px}
.bmc-dims input{flex:1}
.bmc-dims span{font-size:18px;color:var(--mu);font-weight:300;padding-bottom:2px;flex-shrink:0}
/* submit */
.bmc-foot{
  display:flex;align-items:center;justify-content:space-between;
  gap:14px;margin-top:24px;padding-top:22px;
  border-top:1px solid var(--bd);flex-wrap:wrap;
}
.bmc-note{font-size:11px;color:var(--mu);line-height:1.55}
.bmc-note strong{color:var(--ink)}
.bmc-btn{
  font-family:'Inter',sans-serif;font-size:14px;font-weight:600;
  color:#fff;background:var(--oak);border:none;border-radius:var(--r);
  padding:12px 26px;cursor:pointer;transition:background .18s,transform .1s;
  display:inline-flex;align-items:center;gap:8px;white-space:nowrap;
}
.bmc-btn:hover{background:var(--oak-d)}
.bmc-btn:active{transform:scale(.98)}
.bmc-btn:disabled{opacity:.5;cursor:not-allowed}
/* status */
.bmc-status{
  display:none;align-items:flex-start;gap:10px;
  margin-top:16px;padding:13px 15px;border-radius:var(--r);
  font-size:13px;font-weight:500;line-height:1.4;
}
.bmc-status.show{display:flex}
.bmc-ok{background:#EAF5EC;border:1px solid #A8D5B2;color:var(--ok)}
.bmc-er{background:#FDEAEA;border:1px solid #E0AAAA;color:var(--er)}
/* spinner */
@keyframes bmcSpin{to{transform:rotate(360deg)}}
/* responsive */
@media(max-width:580px){
  .bmc-head{padding:20px 22px 16px}
  .bmc-body{padding:22px 22px 26px}
  .bmc-g2,.bmc-g3{grid-template-columns:1fr}
  .bmc-foot{flex-direction:column;align-items:stretch}
  .bmc-btn{justify-content:center}
}
    `;
    document.head.appendChild(st);
  }

  /* ── ICONS ──────────────────────────────────────────────── */
  var ICO_SEND = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
  var ICO_PIN  = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  var ICO_OK   = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var ICO_WARN = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
  var ICO_SPIN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="animation:bmcSpin .8s linear infinite"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>';

  /* ── WINDOW-SPECIFIC FIELDS ─────────────────────────────── */
  var windowOpeningField = isWindow ? `
    <div class="bmc-f">
      <label>Tip deschidere <span>*</span></label>
      <select id="bmc-opening">
        <option value="">Selectați…</option>
        <option>Oscilant (tilt &amp; turn)</option>
        <option>Culisant (glisant)</option>
        <option>Fix (neoperabil)</option>
        <option>Oscilo-batant</option>
        <option>Pivotant</option>
      </select>
    </div>` : '';

  /* ── HTML ───────────────────────────────────────────────── */
  var pillLabel = productName
    ? productName + (productDims ? ' · ' + productDims : '')
    : productType + (productDims ? ' · ' + productDims : '');

  ROOT.className = 'bmc';
  ROOT.innerHTML = `
  <div class="bmc-card">

    <div class="bmc-head">
      <div class="bmc-head-tag">Bucin Mob · Configurator rapid</div>
      <h3>Solicită ofertă pentru această ${productType.toLowerCase()}</h3>
      <p>Completați detaliile de mai jos — vă răspundem cu o ofertă în cel mult 24 de ore.</p>
      ${pillLabel ? `<div class="bmc-pill">${ICO_PIN} ${pillLabel}</div>` : ''}
    </div>

    <div class="bmc-body">

      <!-- SECTION 1: PRODUS -->
      <div class="bmc-section">Detalii produs</div>

      <div class="bmc-grid bmc-g2">
        <div class="bmc-f">
          <label>Produs <span>*</span></label>
          <input type="text" id="bmc-product"
            value="${productName}"
            placeholder="${productType} din lemn stratificat" />
        </div>
        <div class="bmc-f">
          <label>Cantitate <span>*</span></label>
          <input type="number" id="bmc-qty" min="1" placeholder="1" value="1" />
        </div>
      </div>

      <div class="bmc-grid bmc-g2">
        <div class="bmc-f">
          <label>Dimensiuni (L × H) <span>*</span></label>
          <div class="bmc-dims">
            <input type="text" id="bmc-w" placeholder="Lățime (mm)"
              value="${productDims ? productDims.split('x')[0] : ''}" />
            <span>×</span>
            <input type="text" id="bmc-h" placeholder="Înălțime (mm)"
              value="${productDims ? productDims.split('x')[1] || '' : ''}" />
          </div>
        </div>
        <div class="bmc-f">
          <label>Esență lemn</label>
          <select id="bmc-wood">
            <option value="">Selectați…</option>
            <option>Molid</option>
            <option>Stejar</option>
            <option>Molid-Stejar (combinat)</option>
          </select>
        </div>
      </div>

      <div class="bmc-grid ${isWindow ? 'bmc-g3' : 'bmc-g2'}">
        <div class="bmc-f">
          <label>Culoare / Finisaj</label>
          <select id="bmc-finish">
            <option value="">Selectați…</option>
            <option>Natural (lac transparent)</option>
            <option>Alb RAL 9016</option>
            <option>Antracit RAL 7016</option>
            <option>Nuc</option>
            <option>Mahon</option>
            <option>Bicolor (exterior/interior)</option>
            <option>Altă culoare RAL</option>
          </select>
        </div>
        <div class="bmc-f">
          <label>Tip geam / Vitraj</label>
          <select id="bmc-glass">
            <option value="">Selectați…</option>
            <option>2 foi – 24mm LowE+Ar (standard)</option>
            <option>3 foi – 34mm LowE+Ar (premium)</option>
            <option>Sablat</option>
            <option>Cu ornamente</option>
            <option>Securizat</option>
            <option>Fără geam</option>
          </select>
        </div>
        ${windowOpeningField}
      </div>

      <div class="bmc-grid">
        <div class="bmc-f">
          <label>Observații / Cerințe speciale</label>
          <textarea id="bmc-notes" placeholder="Feronerie preferată, culoare RAL specifică, termen de livrare, alte detalii…"></textarea>
        </div>
      </div>

      <!-- SECTION 2: DATE CONTACT -->
      <div class="bmc-section">Date de contact</div>

      <div class="bmc-grid bmc-g2">
        <div class="bmc-f">
          <label>Nume <span>*</span></label>
          <input type="text" id="bmc-fname" placeholder="Ion" />
        </div>
        <div class="bmc-f">
          <label>Prenume <span>*</span></label>
          <input type="text" id="bmc-lname" placeholder="Popescu" />
        </div>
      </div>

      <div class="bmc-grid bmc-g2">
        <div class="bmc-f">
          <label>Telefon <span>*</span></label>
          <input type="tel" id="bmc-phone" placeholder="+40 7xx xxx xxx" />
        </div>
        <div class="bmc-f">
          <label>Email <span>*</span></label>
          <input type="email" id="bmc-email" placeholder="contact@exemplu.ro" />
        </div>
      </div>

      <div class="bmc-grid bmc-g3">
        <div class="bmc-f">
          <label>Adresă</label>
          <input type="text" id="bmc-address" placeholder="Str. Exemplu, nr. 1" />
        </div>
        <div class="bmc-f">
          <label>Oraș <span>*</span></label>
          <input type="text" id="bmc-city" placeholder="Cluj-Napoca" />
        </div>
        <div class="bmc-f">
          <label>Județ <span>*</span></label>
          <input type="text" id="bmc-county" placeholder="Cluj" />
        </div>
      </div>

      <!-- FOOTER -->
      <div class="bmc-foot">
        <p class="bmc-note">
          <strong>Răspuns în 24h.</strong><br/>
          Oferta va fi trimisă pe email și telefon.
        </p>
        <button class="bmc-btn" id="bmc-submit">
          ${ICO_SEND} Solicită ofertă
        </button>
      </div>

      <div class="bmc-status" id="bmc-status"></div>

    </div><!-- /body -->
  </div><!-- /card -->
  `;

  /* ── HELPERS ────────────────────────────────────────────── */
  function v(id) { return (document.getElementById(id) || {}).value || ''; }

  function showStatus(type, msg) {
    var el = document.getElementById('bmc-status');
    el.className = 'bmc-status show ' + (type === 'ok' ? 'bmc-ok' : 'bmc-er');
    el.innerHTML = (type === 'ok' ? ICO_OK : ICO_WARN) + '<span>' + msg + '</span>';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ── SUBMIT ─────────────────────────────────────────────── */
  document.getElementById('bmc-submit').addEventListener('click', function () {
    var btn = this;

    // Validation
    var fname  = v('bmc-fname').trim();
    var lname  = v('bmc-lname').trim();
    var phone  = v('bmc-phone').trim();
    var email  = v('bmc-email').trim();
    var city   = v('bmc-city').trim();
    var county = v('bmc-county').trim();
    var product = v('bmc-product').trim();
    var qty    = v('bmc-qty').trim();
    var dimW   = v('bmc-w').trim();
    var dimH   = v('bmc-h').trim();
    var opening = isWindow ? v('bmc-opening').trim() : '';

    if (!fname || !lname)   { showStatus('er', 'Introduceți numele și prenumele.'); return; }
    if (!phone)             { showStatus('er', 'Numărul de telefon este obligatoriu.'); return; }
    if (!email)             { showStatus('er', 'Adresa de email este obligatorie.'); return; }
    if (!city || !county)   { showStatus('er', 'Introduceți orașul și județul.'); return; }
    if (!product)           { showStatus('er', 'Denumirea produsului este obligatorie.'); return; }
    if (!dimW || !dimH)     { showStatus('er', 'Introduceți dimensiunile (lățime și înălțime).'); return; }
    if (isWindow && !opening){ showStatus('er', 'Selectați tipul de deschidere al ferestrei.'); return; }

    btn.disabled = true;
    btn.innerHTML = ICO_SPIN + ' Se trimite…';

    var params = {
      form_type:    'Configurator Rapid – ' + productType,
      product_name: product,
      quantity:     qty || '1',
      dimensions:   dimW + ' × ' + dimH + ' mm',
      wood:         v('bmc-wood')   || '—',
      finish:       v('bmc-finish') || '—',
      glass:        v('bmc-glass')  || '—',
      opening:      opening         || '—',
      notes:        v('bmc-notes')  || '—',
      first_name:   fname,
      last_name:    lname,
      full_name:    fname + ' ' + lname,
      phone:        phone,
      from_email:   email,
      address:      v('bmc-address') || '—',
      city:         city,
      county:       county,
      page_url:     window.location.href,
    };

    emailjs.send(CFG.serviceId, CFG.templateId, params).then(
      function () {
        showStatus('ok', 'Cererea a fost trimisă cu succes! Vă vom contacta în cel mult 24 de ore cu oferta personalizată.');
        btn.innerHTML = '✓ Trimis';
      },
      function () {
        showStatus('er', 'Eroare la trimitere. Verificați conexiunea sau contactați-ne telefonic.');
        btn.disabled = false;
        btn.innerHTML = ICO_SEND + ' Solicită ofertă';
      }
    );
  });

  /* ── LOAD EMAILJS ───────────────────────────────────────── */
  if (typeof emailjs === 'undefined') {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    s.onload = function () { emailjs.init(CFG.publicKey); };
    document.head.appendChild(s);
  } else {
    emailjs.init(CFG.publicKey);
  }

})();
