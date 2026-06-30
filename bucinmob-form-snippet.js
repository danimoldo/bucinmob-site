/**
 * ═══════════════════════════════════════════════════════════
 *  BUCIN MOB – Formular Unificat de Contact
 *  Versiunea: snippet injectabil pentru Gomag
 *
 *  INSTRUCȚIUNI DE INSTALARE:
 *  ─────────────────────────────────────────────────────────
 *  1. Mergeți în panoul Gomag → Setări → Cod personalizat
 *     (sau secțiunea unde puteți adăuga cod în <head> sau
 *     înainte de </body>)
 *
 *  2. Înlocuiți cele 5 valori de configurare de mai jos
 *     cu datele contului vostru EmailJS.
 *
 *  3. Adăugați un element HTML pe pagina Gomag unde doriți
 *     să apară formularul:
 *        <div id="bucinmob-form"></div>
 *     (prin editorul de pagini sau bloc HTML personalizat)
 *
 *  4. Lipiți ÎNTREG codul de mai jos într-un bloc
 *     <script>...</script> după acel div.
 * ═══════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ── CONFIGURARE ── Înlocuiți valorile de mai jos ───────── */
  var CFG = {
    publicKey:       '0KjeAH6SJMXm8A7rC',        // emailjs.com → Account → API Keys
    quoteService:    'service_cqmggbs',        // Email Services
    quoteTemplate:   'template_k12n477', // Email Templates
    contactService:  'service_cqmggbs',        // (poate fi același service)
    contactTemplate: 'template_k12n477',
    mountId:         'bucinmob-form',          // id-ul div-ului de pe pagina Gomag
  };
  /* ───────────────────────────────────────────────────────── */

  var TARGET = document.getElementById(CFG.mountId);
  if (!TARGET) return; // nu face nimic dacă div-ul lipsește

  /* ── LOAD EMAILJS ─────────────────────────────────────── */
  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src; s.onload = cb; document.head.appendChild(s);
  }

  /* ── LOAD GOOGLE FONTS (Playfair + Inter) ─────────────── */
  var lnk = document.createElement('link');
  lnk.rel  = 'stylesheet';
  lnk.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@300;400;500;600&display=swap';
  document.head.appendChild(lnk);

  /* ── CSS (scoped with .bm- prefix to avoid Gomag conflicts) */
  var CSS = `
  .bm-wrap *,.bm-wrap *::before,.bm-wrap *::after{box-sizing:border-box;margin:0;padding:0}
  .bm-wrap{--oak:#7B5C3A;--oak-dark:#5A3E25;--oak-pale:#F5EDE0;--grain:#EAD8C0;--bark:#2D1F12;
    --fog:#F9F5F0;--ink:#1C1410;--muted:#8C7A68;--border:#D9C9B5;--success:#3A7A4A;
    --error:#9B3030;--r:6px;--sh:0 2px 16px rgba(45,31,18,.10);
    font-family:'Inter',sans-serif;color:var(--ink)}
  .bm-card{background:#fff;border:1px solid var(--border);border-radius:12px;
    box-shadow:var(--sh);overflow:hidden;max-width:780px;margin:0 auto}
  .bm-header{background:var(--bark);padding:36px 40px 28px;position:relative;overflow:hidden}
  .bm-header::before{content:'';position:absolute;inset:0;
    background:repeating-linear-gradient(100deg,transparent,transparent 18px,rgba(255,255,255,.03) 18px,rgba(255,255,255,.03) 19px);
    pointer-events:none}
  .bm-eyebrow{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;
    color:var(--grain);margin-bottom:8px}
  .bm-header h2{font-family:'Playfair Display',serif;font-size:clamp(22px,4vw,30px);
    font-weight:600;color:#fff;line-height:1.2}
  .bm-header p{margin-top:8px;font-size:14px;color:var(--grain);font-weight:300;
    max-width:480px;line-height:1.6}
  .bm-tabs{display:flex;border-bottom:1px solid var(--border);background:var(--fog)}
  .bm-tab{flex:1;padding:16px 20px;font-size:13px;font-weight:500;color:var(--muted);
    cursor:pointer;border:none;background:none;border-bottom:3px solid transparent;
    transition:color .2s,border-color .2s,background .2s;display:flex;align-items:center;
    justify-content:center;gap:8px;font-family:'Inter',sans-serif}
  .bm-tab:hover{color:var(--oak);background:var(--oak-pale)}
  .bm-tab.bm-active{color:var(--oak-dark);border-bottom-color:var(--oak);background:#fff;font-weight:600}
  .bm-panel{display:none;padding:36px 40px 40px}
  .bm-panel.bm-active{display:block}
  .bm-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
  .bm-row.bm-full{grid-template-columns:1fr}
  .bm-field{display:flex;flex-direction:column;gap:6px}
  .bm-field label{font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--muted)}
  .bm-req{color:var(--oak);margin-left:2px}
  .bm-field input,.bm-field textarea,.bm-field select{
    font-family:'Inter',sans-serif;font-size:14px;color:var(--ink);background:var(--fog);
    border:1.5px solid var(--border);border-radius:var(--r);padding:10px 14px;
    transition:border-color .2s,box-shadow .2s;outline:none;width:100%}
  .bm-field input:focus,.bm-field textarea:focus,.bm-field select:focus{
    border-color:var(--oak);box-shadow:0 0 0 3px rgba(123,92,58,.12);background:#fff}
  .bm-field textarea{resize:vertical;min-height:100px}
  .bm-items-label{font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;
    color:var(--muted);margin:20px 0 12px}
  .bm-item{display:grid;grid-template-columns:2fr 1fr 1.2fr auto;gap:10px;
    align-items:end;margin-bottom:10px;animation:bmSlide .2s ease}
  @keyframes bmSlide{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
  .bm-rm{background:none;border:1.5px solid var(--border);border-radius:var(--r);
    color:var(--muted);cursor:pointer;padding:9px 10px;transition:all .15s;
    display:flex;align-items:center;justify-content:center;align-self:end}
  .bm-rm:hover{border-color:var(--error);color:var(--error)}
  .bm-add{display:inline-flex;align-items:center;gap:6px;margin-top:4px;
    font-size:13px;font-weight:500;color:var(--oak);background:var(--oak-pale);
    border:1.5px dashed var(--oak);border-radius:var(--r);padding:9px 16px;
    cursor:pointer;transition:all .15s;font-family:'Inter',sans-serif}
  .bm-add:hover{background:var(--grain);border-style:solid}
  .bm-divider{border:none;border-top:1px solid var(--border);margin:24px 0}
  .bm-submit{display:flex;align-items:center;justify-content:space-between;
    gap:16px;margin-top:28px;flex-wrap:wrap}
  .bm-note{font-size:12px;color:var(--muted);line-height:1.5}
  .bm-note strong{color:var(--ink)}
  .bm-btn{font-family:'Inter',sans-serif;font-size:14px;font-weight:600;color:#fff;
    background:var(--oak);border:none;border-radius:var(--r);padding:13px 28px;
    cursor:pointer;transition:background .2s,transform .1s;display:inline-flex;
    align-items:center;gap:8px;white-space:nowrap}
  .bm-btn:hover{background:var(--oak-dark)}
  .bm-btn:active{transform:scale(.98)}
  .bm-btn:disabled{opacity:.55;cursor:not-allowed}
  .bm-status{margin-top:20px;padding:14px 16px;border-radius:var(--r);
    font-size:13px;font-weight:500;display:none;align-items:flex-start;gap:10px}
  .bm-status.bm-show{display:flex}
  .bm-status.bm-ok{background:#EAF5EC;border:1px solid #A8D5B2;color:var(--success)}
  .bm-status.bm-err{background:#FDEAEA;border:1px solid #E0AAAA;color:var(--error)}
  @keyframes bmSpin{to{transform:rotate(360deg)}}
  @media(max-width:600px){
    .bm-header{padding:28px 24px 22px}
    .bm-panel{padding:28px 24px 32px}
    .bm-row{grid-template-columns:1fr}
    .bm-item{grid-template-columns:1fr auto;grid-template-rows:auto auto}
    .bm-submit{flex-direction:column;align-items:stretch}
    .bm-btn{justify-content:center}
  }
  `;
  var styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ── HTML ─────────────────────────────────────────────── */
  var ICON_SEND = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
  var ICON_CLIP = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>';
  var ICON_MAIL = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';

  TARGET.className = 'bm-wrap';
  TARGET.innerHTML = `
  <div class="bm-card">
    <div class="bm-header">
      <div class="bm-eyebrow">Bucin Mob · Mobilă din lemn masiv</div>
      <h2>Contactați-ne</h2>
      <p>Solicitați o ofertă personalizată sau trimiteți-ne un mesaj — echipa noastră vă răspunde în cel mult 24 de ore.</p>
    </div>
    <div class="bm-tabs" id="bm-tabs">
      <button class="bm-tab bm-active" data-panel="bm-quote">${ICON_CLIP} Cerere de ofertă</button>
      <button class="bm-tab" data-panel="bm-contact">${ICON_MAIL} Mesaj general</button>
    </div>

    <!-- QUOTE -->
    <div class="bm-panel bm-active" id="bm-quote">
      <div class="bm-row">
        <div class="bm-field"><label>Nume complet <span class="bm-req">*</span></label><input type="text" id="bm-qname" placeholder="Ion Popescu" /></div>
        <div class="bm-field"><label>Email <span class="bm-req">*</span></label><input type="email" id="bm-qemail" placeholder="contact@exemplu.ro" /></div>
      </div>
      <div class="bm-row">
        <div class="bm-field"><label>Telefon</label><input type="tel" id="bm-qphone" placeholder="+40 7xx xxx xxx" /></div>
        <div class="bm-field"><label>Companie / Firmă</label><input type="text" id="bm-qcompany" placeholder="Opțional" /></div>
      </div>
      <div class="bm-items-label">Produse solicitate <span class="bm-req" style="font-size:10px">* cel puțin unul</span></div>
      <div id="bm-items"></div>
      <button type="button" class="bm-add" id="bm-addbtn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Adaugă produs
      </button>
      <hr class="bm-divider"/>
      <div class="bm-row bm-full">
        <div class="bm-field"><label>Observații / Cerințe speciale</label><textarea id="bm-qnotes" placeholder="Dimensiuni speciale, finisaje dorite, termen de livrare, etc."></textarea></div>
      </div>
      <div class="bm-submit">
        <p class="bm-note"><strong>Răspuns în 24h.</strong><br/>Oferta va fi trimisă la adresa de email introdusă.</p>
        <button class="bm-btn" id="bm-qbtn">${ICON_SEND} Trimite cererea</button>
      </div>
      <div class="bm-status" id="bm-qstatus"></div>
    </div>

    <!-- CONTACT -->
    <div class="bm-panel" id="bm-contact">
      <div class="bm-row">
        <div class="bm-field"><label>Nume complet <span class="bm-req">*</span></label><input type="text" id="bm-cname" placeholder="Ion Popescu" /></div>
        <div class="bm-field"><label>Email <span class="bm-req">*</span></label><input type="email" id="bm-cemail" placeholder="contact@exemplu.ro" /></div>
      </div>
      <div class="bm-row">
        <div class="bm-field"><label>Telefon</label><input type="tel" id="bm-cphone" placeholder="+40 7xx xxx xxx" /></div>
        <div class="bm-field"><label>Subiect <span class="bm-req">*</span></label>
          <select id="bm-csubject">
            <option value="">Alegeți un subiect…</option>
            <option>Informații despre produse</option>
            <option>Status comandă</option>
            <option>Livrare și transport</option>
            <option>Garanție și retur</option>
            <option>Parteneriat / B2B</option>
            <option>Altele</option>
          </select>
        </div>
      </div>
      <div class="bm-row bm-full">
        <div class="bm-field"><label>Mesaj <span class="bm-req">*</span></label><textarea id="bm-cmessage" placeholder="Scrieți mesajul dvs. aici…" style="min-height:130px"></textarea></div>
      </div>
      <div class="bm-submit">
        <p class="bm-note"><strong>Datele dvs. sunt în siguranță.</strong><br/>Nu stocăm informații personale fără consimțământ.</p>
        <button class="bm-btn" id="bm-cbtn">${ICON_SEND} Trimite mesajul</button>
      </div>
      <div class="bm-status" id="bm-cstatus"></div>
    </div>
  </div>`;

  /* ── TABS LOGIC ─────────────────────────────────────────── */
  document.getElementById('bm-tabs').addEventListener('click', function(e) {
    var btn = e.target.closest('.bm-tab');
    if (!btn) return;
    document.querySelectorAll('.bm-tab').forEach(function(t){ t.classList.remove('bm-active'); });
    document.querySelectorAll('.bm-panel').forEach(function(p){ p.classList.remove('bm-active'); });
    btn.classList.add('bm-active');
    document.getElementById(btn.dataset.panel).classList.add('bm-active');
  });

  /* ── ITEMS LOGIC ────────────────────────────────────────── */
  var itemIdx = 0;
  var ICON_X = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  function addItem() {
    itemIdx++;
    var id  = itemIdx;
    var div = document.createElement('div');
    div.className = 'bm-item';
    div.id = 'bm-item-' + id;
    div.innerHTML =
      '<div class="bm-field"><label>Denumire produs</label>' +
        '<input type="text" id="bm-iname-'+id+'" placeholder="ex. Ușă exterior stejar, model 21" /></div>' +
      '<div class="bm-field"><label>Cantitate</label>' +
        '<input type="number" min="1" id="bm-iqty-'+id+'" placeholder="1" /></div>' +
      '<div class="bm-field"><label>Dimensiuni / Detalii</label>' +
        '<input type="text" id="bm-idim-'+id+'" placeholder="ex. 1000×2100 mm" /></div>' +
      '<button type="button" class="bm-rm" data-remove="'+id+'" title="Șterge">'+ICON_X+'</button>';
    document.getElementById('bm-items').appendChild(div);
  }

  document.getElementById('bm-addbtn').addEventListener('click', addItem);
  document.getElementById('bm-items').addEventListener('click', function(e) {
    var btn = e.target.closest('[data-remove]');
    if (!btn) return;
    var el = document.getElementById('bm-item-' + btn.dataset.remove);
    if (el) el.remove();
  });

  addItem(); // start with one row

  /* ── HELPERS ────────────────────────────────────────────── */
  function v(id){ return (document.getElementById(id)||{}).value||''; }

  function collectItems() {
    var rows = document.querySelectorAll('#bm-items .bm-item');
    var lines = [];
    rows.forEach(function(row, i){
      var id  = row.id.replace('bm-item-','');
      var nm  = v('bm-iname-'+id).trim();
      var qty = v('bm-iqty-'+id).trim() || '1';
      var dim = v('bm-idim-'+id).trim();
      if (nm) lines.push((i+1)+'. '+nm+'  |  Cant: '+qty+(dim ? '  |  '+dim : ''));
    });
    return lines.join('\n');
  }

  function ICON_CHECK(){ return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>'; }
  function ICON_WARN(){  return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'; }

  function showStatus(id, type, msg){
    var el = document.getElementById(id);
    el.className = 'bm-status bm-show ' + (type==='ok'?'bm-ok':'bm-err');
    el.innerHTML = (type==='ok'?ICON_CHECK():ICON_WARN()) + '<span>'+msg+'</span>';
    el.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  var SPIN_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="animation:bmSpin .8s linear infinite"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>';

  /* ── SUBMIT ─────────────────────────────────────────────── */
  function doSend(serviceId, templateId, params, btnEl, statusId, successMsg, originalHTML) {
    btnEl.disabled = true;
    btnEl.innerHTML = SPIN_SVG + ' Se trimite…';
    emailjs.send(serviceId, templateId, params).then(
      function(){ showStatus(statusId,'ok', successMsg); btnEl.innerHTML = '✓ Trimis cu succes'; },
      function(){ showStatus(statusId,'err','Eroare la trimitere. Verificați conexiunea sau contactați-ne telefonic.'); btnEl.disabled=false; btnEl.innerHTML=originalHTML; }
    );
  }

  document.getElementById('bm-qbtn').addEventListener('click', function(){
    var name  = v('bm-qname').trim();
    var email = v('bm-qemail').trim();
    var items = collectItems();
    if (!name||!email){ showStatus('bm-qstatus','err','Completați numele și adresa de email.'); return; }
    if (!items)        { showStatus('bm-qstatus','err','Adăugați cel puțin un produs în cerere.'); return; }
    doSend(CFG.quoteService, CFG.quoteTemplate, {
      from_name: name, from_email: email,
      phone:     v('bm-qphone')||'—', company: v('bm-qcompany')||'—',
      items_list: items, notes: v('bm-qnotes')||'—', form_type:'Cerere de ofertă'
    }, this, 'bm-qstatus',
      'Cererea a fost trimisă! Vă vom contacta în cel mult 24 de ore.',
      ICON_SEND + ' Trimite cererea');
  });

  document.getElementById('bm-cbtn').addEventListener('click', function(){
    var name    = v('bm-cname').trim();
    var email   = v('bm-cemail').trim();
    var subject = v('bm-csubject').trim();
    var message = v('bm-cmessage').trim();
    if (!name||!email){ showStatus('bm-cstatus','err','Completați numele și adresa de email.'); return; }
    if (!subject)      { showStatus('bm-cstatus','err','Alegeți un subiect.'); return; }
    if (!message)      { showStatus('bm-cstatus','err','Introduceți un mesaj.'); return; }
    doSend(CFG.contactService, CFG.contactTemplate, {
      from_name: name, from_email: email,
      phone: v('bm-cphone')||'—', subject: subject, message: message, form_type:'Mesaj general'
    }, this, 'bm-cstatus',
      'Mesajul a fost trimis! Vă vom răspunde cât mai curând.',
      ICON_SEND + ' Trimite mesajul');
  });

  /* ── LOAD EMAILJS THEN INIT ─────────────────────────────── */
  loadScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js', function(){
    emailjs.init(CFG.publicKey);
  });

  // re-declare ICON_SEND as var for use in doSend calls above
  var ICON_SEND = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

})();
