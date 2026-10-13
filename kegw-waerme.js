/* =====================================================================
   Wärme & Kühle · Landing Page + Rechner + PDF-Angebot
   Version 1.2 · Stand 13.10.2026 · Scope #kw
   ---------------------------------------------------------------------
   EINSTELLUNGEN
   Alles in diesem Block darf geändert werden. Werte in [eckigen Klammern]
   sind Platzhalter: Solange sie in Klammern stehen, erscheinen sie NICHT
   im PDF. Einfach Klammern samt Inhalt durch echte Angaben ersetzen.
   Alternativ in Webflow vor dem Script setzen:
   <script>window.KEGW_CONFIG={firma:{strasse:'…'}}<\/script>
   ===================================================================== */
var KEGW_DEFAULTS = {
  firma: {
    name: 'ansvar2030',
    kurz: 'ansvar2030',
    strasse: '[Straße Hausnummer]',
    plz: '[PLZ]',
    ort: '[Ort]',
    telefon: '[Telefon]',
    email: '[E-Mail]',
    web: '[www.ihre-domain.de]',
    register: '[Handelsregister Amtsgericht …, HRB …]',
    steuer: '[USt-IdNr. oder Steuernummer]',
    vorstand: '[Vorstand: Vorname Name, Vorname Name]',
    bank: '[Bank]',
    iban: '[IBAN]',
    bic: '[BIC]',
    ansprechpartner: '[Ansprechpartner]'
  },
  angebot: { praefixWP: 'A2030-WP', praefixKL: 'A2030-KL', gueltigTage: 14 },
  /* Aufschlag netto, fix je Anlage, unsichtbar auf die Positionen verteilt */
  aufschlag: { wp: 3000, klima: 2000 },
  ust: 0.19,
  /* Energiepreise brutto. Stand Oktober 2026, im Rechner änderbar */
  energie: {
    gas: 12.5,        // ct/kWh  (BDEW, Haushalte August 2026: 12,45 ct)
    oel: 1.64,        // €/l     (Anfang Oktober 2026, 3.000 l)
    lpg: 0.72,        // €/l     Flüssiggas
    wp: 22,           // ct/kWh  Wärmepumpentarif (Markt 20–26 ct)
    haushalt: 37,     // ct/kWh  Haushaltsstrom (BDEW 2026)
    fixGas: 400,      // €/a     Grundpreis, Schornsteinfeger, Wartung
    fixOel: 300,      // €/a
    fixLpg: 420,      // €/a     inkl. Tankmiete
    fixWp: 250,       // €/a     Zählergrundpreis, Wartung
    steigFossil: 4,   // % p.a.  inkl. CO2-Preis-Pfad
    steigStrom: 1.5   // % p.a.
  },
  /* Kontakt für Contracting und Rückfragen */
  kontakt: { mail: '', betreffContracting: 'Anfrage Contracting Wärme / Kühle' },
  /* PDF: Kopf mit "The mission is no emission", Fußzeile mit ansvar2030-Logo, optionaler Text darüber,
     Adresse der Schriftdatei (leer = automatisch neben kegw-waerme.js) */
  pdf: { logos: true, logoLabel: '', fontsUrl: '' },
  /* Lead-Übermittlung beim PDF-Download (nur mit Einwilligung)
     modus: 'aus' | 'webflow' (Formular mit Name unten auf der Seite) | 'webhook' */
  lead: { modus: 'webflow', webflowForm: 'Angebot Waerme Kuehle', webhook: '' }
};

(function () {
"use strict";
var CSS = "#kw{--ink:#14120F;--pa:#fff;--fd:#F5F2EB;--ln:#E4DFD5;--mu:#8B8579;--t1:#332F28;--t2:#413C34;--nt:#6F695D;--pv:#F2B233;--fl:#FFB03A;--fw:#F2A413;--wi:#3FA8BE;--he:#2B4A6B;--co:#7CC4D3;--ok:#5A7247;--cut:#D9541C;--mo:'JetBrains Mono',ui-monospace,monospace;--px:clamp(18px,3.6vw,44px);--ea:cubic-bezier(.2,.8,.2,1);font-family:Satoshi,system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--ink);font-weight:500;line-height:1.5;-webkit-font-smoothing:antialiased;text-align:left;box-sizing:border-box;width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);padding:clamp(10px,2vw,28px);display:flex;flex-direction:column;gap:clamp(12px,2vw,24px);overflow-x:clip;background:#FBF8F2}\n#kw *,#kw ::before,#kw ::after{box-sizing:border-box;min-width:0}\n#kw :where(h1,h2,h3,h4,p,div,span,label,button,input,select,textarea,b,s,i,em,small,strong,section,a,ul,li,details,summary,fieldset,legend,figure,dl,dt,dd,table,td,th,tr){margin:0;padding:0;border:0;background:0 0;font:inherit;color:inherit;letter-spacing:inherit;line-height:inherit;text-decoration:none;box-shadow:none;border-radius:0;list-style:none;text-transform:none}\n#kw button,#kw summary{cursor:pointer;-webkit-appearance:none;appearance:none}\n#kw a{color:inherit;text-decoration:underline;text-decoration-color:var(--ln);text-underline-offset:3px;text-decoration-thickness:1.5px}#kw a:hover{text-decoration-color:var(--cut)}\n#kw :focus-visible{outline:2px solid var(--wi)!important;outline-offset:3px}\n#kw b{font-family:var(--mo);font-weight:700;letter-spacing:-.04em;font-variant-numeric:tabular-nums}\n#kw b s,#kw .u{font-size:.45em;color:var(--mu);margin-left:.25em;letter-spacing:0;text-decoration:none}\n#kw svg{display:block;overflow:visible}#kw svg text{font-family:var(--mo)}\n#kw .mod{width:min(100%,1680px);margin:0 auto;background:var(--pa);border:1px solid var(--ln);border-radius:6px;position:relative;overflow:hidden}\n#kw .mod::before,#kw .mod::after{content:'';position:absolute;width:16px;height:16px;border:0 solid var(--mu);opacity:.5;pointer-events:none;z-index:6}\n#kw .mod::before{top:10px;left:10px;border-width:1px 0 0 1px}#kw .mod::after{bottom:10px;right:10px;border-width:0 1px 1px 0}\n#kw .mod.clip{overflow:clip}\n#kw .pad{padding:clamp(26px,3.8vw,48px) var(--px)}\n#kw .rule{border-top:1px solid var(--ln)}\n#kw :is(.eb,.st,.tag,.sig,.btn,.seg button,.chip){font-family:var(--mo);font-weight:700;text-transform:uppercase}\n#kw .eb{font-size:clamp(9.5px,.95vw,11px);letter-spacing:.2em;color:var(--mu)}\n#kw .st{font-size:11px;letter-spacing:.14em;color:var(--cut)}\n#kw .tag{display:inline-flex;align-items:center;gap:9px;font-size:10px;letter-spacing:.2em;padding:7px 13px;border-radius:3px;background:rgba(242,178,51,.18);color:#8A5A0A}\n#kw .tag i{width:6px;height:6px;border-radius:50%;background:var(--fl);animation:kwL 2s infinite}\n#kw .chip{display:inline-flex;align-items:center;gap:7px;font-size:9.5px;letter-spacing:.12em;padding:6px 10px;border-radius:3px;background:var(--fd);color:var(--t2)}\n#kw .chip.ok{background:rgba(90,114,71,.12);color:var(--ok)}#kw .chip.cut{background:rgba(217,84,28,.1);color:var(--cut)}#kw .chip.co{background:rgba(124,196,211,.18);color:#1F6878}\n#kw .sig{display:flex;justify-content:space-between;gap:8px 14px;flex-wrap:wrap;padding:13px var(--px);border-top:1px solid var(--ln);font-size:10px;font-weight:500;letter-spacing:.14em;color:#756F62}\n#kw h1.t{font-size:clamp(34px,4.5vw,72px);font-weight:900;letter-spacing:-.05em;line-height:.95;text-wrap:balance}\n#kw .t em{font-style:normal;color:var(--cut)}#kw .t em.ok{color:var(--ok)}\n#kw h1.t span{display:block;font-size:max(16px,.34em);letter-spacing:-.03em;line-height:1.15;margin-top:.6em;color:var(--nt);font-weight:700}\n#kw h2.t{font-size:clamp(25px,3.4vw,42px);font-weight:900;letter-spacing:-.04em;line-height:1.04;margin:12px 0 12px;max-width:24ch;text-wrap:balance}\n#kw h3{font-size:clamp(17px,1.6vw,20px);font-weight:900;letter-spacing:-.03em;line-height:1.15}\n#kw .lead{font-size:clamp(15px,1.35vw,18px);line-height:1.62;color:var(--t1);max-width:64ch}\n#kw .sm{font-size:clamp(13.5px,1.1vw,15px);line-height:1.62;color:var(--t2);max-width:68ch}\n#kw .nt{font:500 11.5px/1.7 var(--mo);color:var(--nt)}\n#kw .btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;font-size:11px;letter-spacing:.14em;padding:14px 18px;background:var(--fl);color:var(--ink);border-radius:3px;min-height:46px;transition:background .15s,color .15s,transform .15s;text-decoration:none!important;text-align:center}\n#kw .btn:hover{background:var(--ink);color:#fff}#kw .btn:active{transform:translateY(1px)}\n#kw .btn.g{background:#fff;box-shadow:inset 0 0 0 1px var(--ink)}#kw .btn.g:hover{background:var(--ink);color:#fff}\n#kw .btn.ok{background:var(--ok);color:#fff}#kw .btn.ok:hover{background:var(--ink)}\n#kw .btn[disabled]{opacity:.55;cursor:progress}\n#kw .rw{display:flex;flex-wrap:wrap;gap:8px;align-items:center}\n#kw .seg{display:flex;gap:6px;flex-wrap:wrap}\n#kw .seg button{font-size:10px;letter-spacing:.08em;padding:.95em 1.1em;border:1px solid var(--ln);border-radius:3px;color:var(--mu);background:#fff;transition:.15s;min-height:40px}\n#kw .seg button:hover{color:var(--ink);border-color:var(--ink)}\n#kw .seg .on,#kw .seg .on:hover{background:var(--ink);color:#fff;border-color:var(--ink)}\n#kw input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:2px;background:var(--ln);cursor:pointer;margin:16px 0 6px}\n#kw input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:var(--ink);border:5px solid #fff;box-shadow:0 0 0 1px var(--ink),0 0 0 6px rgba(255,176,58,.45);cursor:grab}\n#kw input[type=range]::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--ink);border:5px solid #fff;box-shadow:0 0 0 1px var(--ink);cursor:grab}\n#kw .in,#kw select.in,#kw textarea.in{width:100%;background:var(--fd);border:1px solid transparent;border-radius:3px;padding:12px 13px;font:700 14px/1.3 var(--mo);color:var(--ink);min-height:46px;transition:border-color .15s,background .15s}\n#kw .in.txt{font:500 15px/1.3 Satoshi,system-ui,sans-serif}\n#kw .in:focus{border-color:var(--ink);background:#fff;outline:0}\n#kw select.in{-webkit-appearance:none;appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--mu) 50%),linear-gradient(135deg,var(--mu) 50%,transparent 50%);background-position:calc(100% - 18px) 50%,calc(100% - 13px) 50%;background-size:5px 5px;background-repeat:no-repeat;padding-right:34px}\n#kw .in.bad{border-color:var(--cut)}\n#kw .tgl{display:inline-flex;align-items:center;gap:.6em;font:700 10.5px/1.2 var(--mo);letter-spacing:.06em;text-transform:uppercase;color:var(--mu);text-align:left;min-height:34px}\n#kw .tgl i{flex:none;width:2.3em;height:1.3em;border-radius:1em;background:#D6CFC1;position:relative;transition:background .25s}\n#kw .tgl i::after{content:'';position:absolute;top:.17em;left:.17em;width:.96em;height:.96em;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .25s}\n#kw .tgl.on{color:var(--ink)}#kw .tgl.on i{background:var(--c,var(--ok))}#kw .tgl.on i::after{transform:translateX(1em)}\n#kw .stp{justify-self:start;display:inline-flex;align-items:stretch;border:1px solid var(--ln);border-radius:3px;overflow:hidden;background:#fff}\n#kw .stp button{width:42px;font:700 16px var(--mo);color:var(--ink);transition:background .15s}#kw .stp button:hover{background:var(--fd)}\n#kw .stp b{min-width:54px;display:grid;place-items:center;font-size:15px;border-inline:1px solid var(--ln);padding:0 6px}\n/* KPI */\n#kw .ins{display:grid;gap:1px;background:var(--ln);border-top:1px solid var(--ln);grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr))}\n#kw .ins>div{background:#fff;padding:clamp(18px,2.4vw,28px) var(--px);display:grid;gap:8px;align-content:start}\n#kw .ins b{font-size:clamp(28px,3.6vw,46px);letter-spacing:-.06em;line-height:1;color:var(--c,var(--ink))}\n#kw .ins>div>span{font-size:13.5px;line-height:1.5;color:var(--t2)}\n/* HERO */\n#kw .hero{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);min-height:min(88svh,860px)}\n#kw .hero .copy{padding:clamp(28px,4.4vw,64px) var(--px);display:flex;flex-direction:column;justify-content:center;gap:clamp(16px,2vw,24px);position:relative;z-index:2}\n#kw .hero .vis{position:relative;background:#FEF2DA;transition:background 1s ease;border-left:1px solid var(--ln);overflow:hidden;min-height:420px}\n#kw .hero .vis svg{position:absolute;inset:0;width:100%;height:100%}\n#kw .hero .ctl{position:absolute;left:16px;right:16px;bottom:16px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;z-index:3;pointer-events:none}\n#kw .hero .ctl>*{pointer-events:auto}\n#kw .seas{display:inline-flex;background:rgba(255,255,255,.9);border:1px solid var(--ln);border-radius:999px;padding:4px;gap:2px;backdrop-filter:blur(6px)}\n#kw .seas button{font:700 10.5px/1 var(--mo);letter-spacing:.1em;text-transform:uppercase;padding:10px 14px;border-radius:999px;color:var(--mu);transition:.2s}\n#kw .seas button.on{background:var(--ink);color:#fff}\n#kw .clock{display:inline-flex;align-items:center;gap:10px;background:var(--ink);color:#fff;border-radius:999px;padding:8px 14px 8px 10px;font:700 10.5px/1.2 var(--mo);letter-spacing:.06em;text-transform:uppercase}\n#kw .clock b{font-size:16px;color:var(--fl);letter-spacing:-.02em}\n#kw .clock i{width:8px;height:8px;border-radius:50%;background:var(--fl);animation:kwL 1.4s infinite}\n#kw .hl3{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--ln);border:1px solid var(--ln);border-radius:4px;overflow:hidden}\n#kw .hl3>div{background:#fff;padding:14px 16px;display:grid;gap:4px}\n#kw .hl3 b{font-size:clamp(22px,2.3vw,32px);line-height:1;color:var(--c,var(--ink))}\n#kw .hl3 span{font-size:12px;line-height:1.35;color:var(--t2)}\n@media(max-width:960px){#kw .hero{grid-template-columns:1fr;min-height:0}#kw .hero .vis{border-left:0;border-top:1px solid var(--ln);aspect-ratio:1080/860;min-height:0}}\n@media(max-width:520px){#kw .hl3{grid-template-columns:1fr}#kw .hero .vis{aspect-ratio:1080/860}}\n/* Szene: Jahreszeit und Schritte */\n#kw .sc .wi,#kw .sc .su{transition:opacity 1s ease}\n#kw .sc.w .su,#kw .sc.s .wi{opacity:0}\n#kw .sc [data-s]{transition:opacity .8s ease,transform 1s var(--ea)}\n#kw .fl{stroke-linecap:round;stroke-dasharray:1 22;animation:kwF 1.4s linear infinite}\n#kw .fl.slow{animation-duration:3s}\n#kw .fl.rev{animation-direction:reverse}\n@keyframes kwF{to{stroke-dashoffset:-23}}\n#kw .rot,#kw .spin,#kw .pulse{transform-box:fill-box;transform-origin:center}\n#kw .rot{animation:kwR 16s linear infinite}#kw .spin{animation:kwR .8s linear infinite}@keyframes kwR{to{transform:rotate(360deg)}}\n#kw .pulse{animation:kwP 3s ease-in-out infinite alternate}@keyframes kwP{to{transform:scale(1.1)}}\n#kw .led{animation:kwL 1.6s ease-in-out infinite}@keyframes kwL{50%{opacity:.25}}\n#kw .wave{animation:kwW 2.6s ease-out infinite}@keyframes kwW{from{transform:translateY(0);opacity:.95}to{transform:translateY(26px);opacity:0}}\n#kw .rise{animation:kwU 2.6s ease-out infinite}@keyframes kwU{from{transform:translateY(0);opacity:.95}to{transform:translateY(-24px);opacity:0}}\n#kw .flame{transform-box:fill-box;transform-origin:bottom;animation:kwFl .5s ease-in-out infinite alternate}@keyframes kwFl{to{transform:scaleY(.82) scaleX(1.06)}}\n#kw .snow{animation:kwS 9s linear infinite}@keyframes kwS{from{transform:translateY(-40px)}to{transform:translateY(760px)}}\n#kw .coin{animation:kwC 2.2s var(--ea) infinite}@keyframes kwC{0%{transform:translateY(-30px);opacity:0}30%{opacity:1}100%{transform:translateY(0);opacity:1}}\n/* SCROLLY */\n#kw .scr{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);border-top:1px solid var(--ln)}\n#kw .scr .steps{padding:0 var(--px)}\n#kw .scr .step{min-height:78svh;display:flex;flex-direction:column;justify-content:center;gap:14px;padding:40px 0;opacity:.28;transition:opacity .5s ease}\n#kw .scr .step.on{opacity:1}\n#kw .scr .step .n{font:700 11px var(--mo);letter-spacing:.14em;color:var(--cut);text-transform:uppercase}\n#kw .scr .step .big{font-size:clamp(44px,5.2vw,74px);line-height:.9;letter-spacing:-.06em;color:var(--c,var(--ink))}\n#kw .scr .stick{align-self:start;position:sticky;top:0;height:100svh;max-height:920px;border-left:1px solid var(--ln);background:#FEF2DA;transition:background 1s ease;overflow:hidden}\n#kw .scr .stick svg{position:absolute;inset:0;width:100%;height:100%}\n#kw .scr .prog{position:absolute;top:18px;left:18px;display:flex;gap:6px;z-index:3}\n#kw .scr .prog i{width:26px;height:4px;border-radius:2px;background:rgba(20,18,15,.15);transition:background .4s}#kw .scr .prog i.on{background:var(--ink)}\n@media(max-width:960px){#kw .scr{grid-template-columns:1fr}#kw .scr .stick{align-self:start;position:sticky;top:0;height:52svh;max-height:none;border-left:0;border-bottom:1px solid var(--ln);order:-1;z-index:2}#kw .scr .step{min-height:64svh;background:linear-gradient(#fff 0 0) padding-box}}\n/* Vergleich und Bon */\n#kw .two{display:grid;gap:1px;background:var(--ln);border-top:1px solid var(--ln)}\n@media(min-width:900px){#kw .two{grid-template-columns:1fr 1fr}}\n#kw .two>div{background:#fff;padding:clamp(22px,3vw,40px) var(--px);display:grid;gap:14px;align-content:start}\n#kw .bon{position:relative;display:grid;gap:7px;background:var(--fd);padding:18px 20px 14px;margin-bottom:12px;font:500 12.5px/1.4 var(--mo);box-shadow:0 22px 30px -26px rgba(20,18,15,.55)}\n#kw .bon::after{content:'';position:absolute;left:0;right:0;top:100%;height:9px;background:conic-gradient(from 135deg at top,var(--fd) 90deg,transparent 0) top/14px 100%}\n#kw .bon .bh{text-align:center;font-weight:700;letter-spacing:.16em}\n#kw .bl{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:baseline}\n#kw .bl>:last-child{text-align:right;white-space:nowrap}\n#kw .bl small{display:block;color:var(--mu);font-size:.88em;line-height:1.35}\n#kw .bl.t{background:var(--ok);color:#fff;padding:.6em .7em;margin:.25em -.7em 0;border-radius:3px}#kw .bl.t b{font-size:1.25em}#kw .bl.t small{color:rgba(255,255,255,.78)}\n#kw .bl.r{background:var(--cut);color:#fff;padding:.6em .7em;margin:.25em -.7em 0;border-radius:3px}#kw .bl.r b{font-size:1.25em}#kw .bl.r small{color:rgba(255,255,255,.8)}\n#kw .bl.m b{color:var(--ok)}\n#kw .bdv{border-top:1px dashed #B9B2A4;margin:2px 0}\n#kw .bc{height:16px;margin-top:6px;opacity:.75;background:repeating-linear-gradient(90deg,var(--ink) 0 2px,transparent 2px 4px,var(--ink) 4px 5px,transparent 5px 8px,var(--ink) 8px 11px,transparent 11px 13px)}\n#kw .say{font-size:clamp(21px,2.4vw,32px);font-weight:900;letter-spacing:-.035em;line-height:1.15;padding:22px 24px;background:var(--fd);border-radius:3px;text-wrap:balance}#kw .say em{font-style:normal;color:var(--cut)}#kw .say em.ok{color:var(--ok)}\n/* Chart */\n#kw .ch{position:relative;background:var(--fd);border:1px solid var(--ln);border-radius:3px;overflow-x:auto}\n#kw .ch svg{width:100%;min-width:680px;height:auto}\n#kw .tt{position:absolute;left:0;top:0;pointer-events:none;background:var(--ink);color:#fff;font:500 11.5px/1.55 var(--mo);padding:9px 11px;border-radius:3px;white-space:nowrap;transform:translate(-50%,-115%);opacity:0;transition:opacity .12s;z-index:5}\n#kw .tt b{color:#F2EA7A}\n#kw .hv{cursor:crosshair}\n/* RECHNER */\n#kw .pick{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--ln);border-top:1px solid var(--ln)}\n#kw .pick button{background:#fff;text-align:left;padding:clamp(18px,2.6vw,30px) var(--px);display:grid;grid-template-columns:auto 1fr;gap:6px 18px;align-items:center;transition:background .2s;position:relative}\n#kw .pick button svg{grid-row:span 3;width:clamp(54px,6vw,82px);height:auto}\n#kw .pick button strong{font-size:clamp(19px,2vw,26px);font-weight:900;letter-spacing:-.035em;line-height:1.1}\n#kw .pick button span{font-size:13px;color:var(--t2);line-height:1.4}\n#kw .pick button em{font:700 10px/1 var(--mo);font-style:normal;letter-spacing:.12em;text-transform:uppercase;color:var(--ok)}\n#kw .pick button::after{content:'';position:absolute;left:0;right:0;bottom:0;height:4px;background:var(--ink);transform:scaleX(0);transform-origin:left;transition:transform .45s var(--ea)}\n#kw .pick button.on{background:var(--fd)}#kw .pick button.on::after{transform:none}\n#kw .pick button:not(.on):hover{background:#FCFAF6}\n@media(max-width:640px){#kw .pick{grid-template-columns:1fr}}\n#kw .calc{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(330px,.85fr);border-top:1px solid var(--ln)}\n@media(max-width:1020px){#kw .calc{grid-template-columns:1fr}}\n#kw .form{border-right:1px solid var(--ln)}\n#kw fieldset{padding:clamp(22px,2.8vw,34px) var(--px);border-top:1px solid var(--ln)!important;display:grid;gap:20px}\n#kw fieldset:first-child{border-top:0!important}\n#kw legend{float:left;width:100%;display:flex;align-items:baseline;gap:12px;font-size:clamp(18px,1.8vw,22px);font-weight:900;letter-spacing:-.03em;margin-bottom:2px}\n#kw legend i{font:700 11px var(--mo);font-style:normal;letter-spacing:.12em;color:var(--cut)}\n#kw .fg{display:grid;gap:18px 22px;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))}\n#kw .f{display:grid;gap:8px;align-content:start}\n#kw .f>label,#kw .f>.lb{display:flex;justify-content:space-between;align-items:baseline;gap:10px;font-size:13.5px;font-weight:700;color:var(--t1)}\n#kw .f>label b,#kw .f>.lb b{font-size:15px;color:var(--ink)}\n#kw .f .hint{font-size:12px;line-height:1.45;color:var(--nt)}\n#kw .f.wide{grid-column:1/-1}\n#kw .note{display:block;position:relative;padding:12px 14px 12px 44px!important;font-size:13px;line-height:1.5;color:var(--t2);border-radius:3px;background:var(--fd)}\n#kw .note::before{content:'i';position:absolute;left:14px;top:12px;display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--ink);color:#fff;font:700 11px var(--mo)}\n#kw .note.w{background:rgba(217,84,28,.08)}#kw .note.w::before{content:'!';background:var(--cut)}\n#kw .note.g{background:rgba(90,114,71,.1)}#kw .note.g::before{content:'✓';background:var(--ok)}\n#kw .opts{display:grid;gap:8px}\n#kw .opt{display:grid;grid-template-columns:22px 1fr auto;gap:12px;align-items:start;text-align:left;padding:14px;border:1px solid var(--ln);border-radius:4px;background:#fff;transition:border-color .15s,background .15s}\n#kw .opt::before{content:'';width:18px;height:18px;border-radius:50%;border:1.5px solid var(--mu);margin-top:2px;transition:.15s}\n#kw .opt.on{border-color:var(--ink);background:var(--fd)}#kw .opt.on::before{border:6px solid var(--ink)}\n#kw .opt strong{display:block;font-size:14.5px;font-weight:900;letter-spacing:-.01em;line-height:1.25}\n#kw .opt small{display:block;font-size:12.5px;line-height:1.45;color:var(--t2);margin-top:3px}\n#kw .opt b{font-size:13px;white-space:nowrap}\n#kw .opt[disabled]{opacity:.45;cursor:not-allowed}\n#kw .rooms{display:grid;gap:8px}\n#kw .room{display:grid;grid-template-columns:minmax(120px,1fr) minmax(150px,1.2fr) auto auto 36px;gap:10px;align-items:center;padding:12px;border:1px solid var(--ln);border-radius:4px;background:#fff}\n#kw .room .ar{display:grid;gap:2px}#kw .room .ar span{font:700 10px var(--mo);letter-spacing:.08em;color:var(--mu);text-transform:uppercase;display:flex;justify-content:space-between}#kw .room .ar span b{font-size:12px;color:var(--ink);letter-spacing:0}\n#kw .room input[type=range]{margin:10px 0 4px}\n#kw .room .seg button{padding:.8em .75em;min-height:36px}\n#kw .room .x{width:36px;height:36px;border-radius:3px;color:var(--mu);font:700 16px var(--mo)}#kw .room .x:hover{background:rgba(217,84,28,.1);color:var(--cut)}\n#kw .room .kw{grid-column:1/-1;display:flex;gap:8px;flex-wrap:wrap;align-items:center;font:700 10px var(--mo);letter-spacing:.06em;color:var(--mu);text-transform:uppercase}\n@media(max-width:720px){#kw .room{grid-template-columns:1fr 36px}#kw .room>.ar,#kw .room>.seg,#kw .room>.tgl{grid-column:1/-1}#kw .room>select{grid-column:1}#kw .room .x{grid-column:2;grid-row:1}}\n/* Ergebnis */\n#kw .res{position:relative;background:#FCFAF6}\n#kw .res .in2{position:sticky;top:12px;padding:clamp(22px,2.8vw,34px) var(--px);display:grid;gap:16px}\n#kw .res .hd{display:grid;gap:6px}\n#kw .res .big{font-size:clamp(40px,4.6vw,62px);line-height:.92;color:var(--c,var(--ink));transition:color .3s}\n#kw .res .sub{font-size:13px;color:var(--t2)}\n#kw .fz{display:grid;gap:8px;padding:14px 16px;border:1px solid var(--ln);border-radius:4px;background:#fff}\n#kw .fz .bar{display:flex;height:30px;border-radius:3px;overflow:hidden;background:var(--fd)}\n#kw .fz .bar i{display:flex;align-items:center;padding:0 8px;font:700 10px/1 var(--mo);font-style:normal;white-space:nowrap;overflow:hidden;color:#fff;transition:flex-basis .5s var(--ea)}\n#kw .fz .bar .gr{background:var(--ok)}#kw .fz .bar .kg{background:#7E9A62}#kw .fz .bar .ek{background:#A3B88C;color:var(--ink)}#kw .fz .bar .hz{background:#E6EDDD repeating-linear-gradient(135deg,rgba(90,114,71,.3) 0 4px,transparent 4px 10px);color:var(--ok)}\n#kw .fz .leg{display:flex;flex-wrap:wrap;gap:6px 14px;font:700 10px/1.3 var(--mo);letter-spacing:.04em;color:var(--t2);text-transform:uppercase}\n#kw .fz .leg i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px;vertical-align:-1px;background:var(--c)}\n#kw .k3{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--ln);border:1px solid var(--ln);border-radius:4px;overflow:hidden}\n#kw .k3>div{background:#fff;padding:12px 12px;display:grid;gap:4px}\n#kw .k3 b{font-size:clamp(17px,1.6vw,22px);line-height:1;color:var(--c,var(--ink))}\n#kw .k3 span{font:700 9px/1.35 var(--mo);letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}\n@media(max-width:420px){#kw .k3{grid-template-columns:1fr 1fr}}\n#kw .cta{display:grid;gap:8px}\n#kw .mbar{display:none}\n@media(max-width:1020px){#kw .res .in2{position:static}#kw .mbar{display:flex;position:fixed;left:10px;right:10px;bottom:10px;z-index:50;background:var(--ink);color:#fff;border-radius:6px;padding:10px 10px 10px 16px;align-items:center;justify-content:space-between;gap:10px;box-shadow:0 16px 40px -10px rgba(20,18,15,.6);transform:translateY(140%);transition:transform .4s var(--ea)}#kw .mbar.on{transform:none}#kw .mbar span{font:700 9.5px/1.3 var(--mo);letter-spacing:.1em;text-transform:uppercase;color:#B9B2A3}#kw .mbar b{display:block;font-size:20px;color:#fff}#kw .mbar .btn{min-height:40px;padding:10px 14px}}\n/* Ablauf, Methodik, FAQ */\n#kw .flow4{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--ln);border-top:1px solid var(--ln);counter-reset:s}\n#kw .flow4>div{background:#fff;padding:clamp(20px,2.6vw,30px) var(--px);display:grid;gap:10px;align-content:start;position:relative}\n#kw .flow4>div::before{counter-increment:s;content:'0' counter(s);font:700 12px var(--mo);color:var(--cut);letter-spacing:.04em}\n#kw .flow4 p{font-size:13.5px;line-height:1.55;color:var(--t2)}\n#kw .flow4 .chip{justify-self:start}\n@media(max-width:960px){#kw .flow4{grid-template-columns:1fr 1fr}}@media(max-width:560px){#kw .flow4{grid-template-columns:1fr}}\n#kw .meth{display:grid;gap:1px;background:var(--ln);border-top:1px solid var(--ln);grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))}\n#kw .meth>div{background:var(--fd);padding:clamp(18px,2.4vw,28px) var(--px);font-size:13px;line-height:1.62;color:var(--t2)}\n#kw .meth strong{display:block;font-size:clamp(16px,1.6vw,19px);font-weight:900;letter-spacing:-.03em;line-height:1.2;color:var(--ink);margin-bottom:8px}\n#kw .meth code{font:700 11.5px var(--mo);color:var(--ink);background:#fff;padding:1px 5px;border-radius:2px}\n#kw .meth li{position:relative;padding-left:14px;margin-top:4px}#kw .meth li::before{content:'·';position:absolute;left:2px;color:var(--cut);font-weight:900}\n#kw .faq{border-top:1px solid var(--ln)}\n#kw .faq details{border-bottom:1px solid var(--ln);padding:0 var(--px)}\n#kw .faq summary{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:20px 0;font-size:clamp(15.5px,1.4vw,18px);font-weight:900;letter-spacing:-.02em;list-style:none}\n#kw .faq summary::-webkit-details-marker{display:none}\n#kw .faq summary::after{content:'+';font:700 20px var(--mo);color:var(--cut);transition:transform .25s}\n#kw .faq details[open] summary::after{transform:rotate(45deg)}\n#kw .faq details p{padding:0 0 22px;font-size:14.5px;line-height:1.65;color:var(--t2);max-width:78ch}\n#kw .dk{background:var(--ink);border-color:var(--ink);color:#F5F2EB}\n#kw .dk .sm,#kw .dk .lead{color:rgba(245,242,235,.75)}#kw .dk .st{color:var(--fl)}#kw .dk .sig{border-color:rgba(245,242,235,.14);color:rgba(245,242,235,.55)}\n#kw .dk .btn.g{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.5)}#kw .dk .btn.g:hover{background:#fff;color:var(--ink)}\n#kw .dk .btn:hover{background:#fff;color:var(--ink)}\n#kw .end{display:grid;grid-template-columns:1.2fr .8fr;gap:24px;align-items:end}\n@media(max-width:860px){#kw .end{grid-template-columns:1fr}}\n/* Modal */\n#kw .md{position:fixed;inset:0;z-index:99999;background:rgba(20,18,15,.58);display:none;align-items:center;justify-content:center;padding:14px;backdrop-filter:blur(3px)}\n#kw .md.on{display:flex}\n#kw .mdb{width:min(760px,100%);max-height:calc(100svh - 28px);overflow:auto;background:#fff;border-radius:6px;position:relative;box-shadow:0 30px 80px -20px rgba(20,18,15,.6)}\n#kw .mdb .pad{display:grid;gap:18px}\n#kw .mdb .x{position:absolute;top:12px;right:12px;width:40px;height:40px;border-radius:3px;font:700 20px var(--mo);color:var(--mu)}#kw .mdb .x:hover{background:var(--fd);color:var(--ink)}\n#kw .frm{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}\n#kw .frm .f{grid-column:span 3}#kw .frm .f.s2{grid-column:span 2}#kw .frm .f.s4{grid-column:span 4}#kw .frm .f.s6{grid-column:1/-1}\n#kw .frm .f>label{font-size:11px;font-family:var(--mo);letter-spacing:.1em;text-transform:uppercase;color:var(--mu)}\n@media(max-width:600px){#kw .frm{grid-template-columns:1fr}#kw .frm .f,#kw .frm .f.s2,#kw .frm .f.s4{grid-column:1/-1}}\n#kw .chk{display:grid;grid-template-columns:22px 1fr;gap:10px;align-items:start;font-size:13px;line-height:1.5;color:var(--t2);text-align:left}\n#kw .chk i{width:20px;height:20px;border:1.5px solid var(--mu);border-radius:3px;display:grid;place-items:center;font:700 12px var(--mo);font-style:normal;color:#fff;transition:.15s}\n#kw .chk.on i{background:var(--ok);border-color:var(--ok)}#kw .chk.on i::after{content:'✓'}\n#kw .reveal{opacity:0;transform:translateY(22px);transition:opacity .9s ease,transform 1.1s var(--ea)}#kw .reveal.rv-on{opacity:1;transform:none}\n#kw .sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n@media(prefers-reduced-motion:reduce){#kw *{animation:none!important;transition:none!important}#kw .reveal{opacity:1;transform:none}}\n#kw .hero .vis.wint,#kw .scr .stick.wint{background:#E2E8D9}\n";
/* =====================================================================
   RECHENKERN · rein rechnend, ohne DOM
   Kalibriert auf zwei reale Belege (Stand 2026):
   WP:   Angebot Luft-Wasser-WP 7 kW Monoblock (22.451,30 € netto)
         + Inbetriebnahme 448,50 + Zählerschrank 2.500 + Abdeckung 375,25
   Klima: Schlussrechnung Triosplit 7,9 kW + 3 Innengeräte (8.404 € netto)
   ===================================================================== */
var CALC = (function () {
  var r2 = function (n) { return Math.round(n * 100) / 100; };

  /* ---------- Förderung KfW 458 · Stand Richtlinie ab 21.07.2026 ---------- */
  var FOE = {
    stufen: [ // Antragsdatum ab · Klimageschwindigkeitsbonus · förderfähige Kosten 1. WE
      { ab: '2026-07-21', bis: '2027-01-31', label: 'bis 31.01.2027', kgb: 16, cap: 28000 },
      { ab: '2027-02-01', bis: '2027-07-31', label: '01.02.–31.07.2027', kgb: 12, cap: 27250 },
      { ab: '2027-08-01', bis: '2028-01-31', label: '01.08.2027–31.01.2028', kgb: 8, cap: 26500 },
      { ab: '2028-02-01', bis: '2028-07-31', label: '01.02.–31.07.2028', kgb: 4, cap: 25750 },
      { ab: '2028-08-01', bis: '2029-01-31', label: '01.08.2028–31.01.2029', kgb: 0, cap: 25000 },
      { ab: '2029-02-01', bis: '2029-07-31', label: '01.02.–31.07.2029', kgb: 0, cap: 24250 },
      { ab: '2029-08-01', bis: '2030-01-31', label: '01.08.2029–31.01.2030', kgb: 0, cap: 23500 },
      { ab: '2030-02-01', bis: '2030-07-31', label: '01.02.–31.07.2030', kgb: 0, cap: 22750 },
      { ab: '2030-08-01', bis: '2099-12-31', label: 'ab 01.08.2030', kgb: 0, cap: 22000 }
    ],
    capWE2bis6: 15000, capWEab7: 8000, grund: 30
  };
  function stufeFuer(iso) {
    for (var i = 0; i < FOE.stufen.length; i++) if (iso <= FOE.stufen[i].bis) return i;
    return FOE.stufen.length - 1;
  }
  /* zve: 1=bis 30T, 2=bis 40T, 3=bis 50T, 4=bis 60T, 5=darüber */
  function einkommensbonus(zve, kind) {
    var g = kind ? [40, 40, 30, 10, 0] : [40, 30, 10, 0, 0];
    return g[zve - 1] || 0;
  }
  function foerderung(o) {
    // o: brutto, we, selbst, alt ('gas','oel','lpg'), kesselAlter, funktion, zve, kind, stufe
    var st = FOE.stufen[o.stufe], we = Math.max(1, o.we | 0);
    var cap = st.cap + Math.min(Math.max(we - 1, 0), 5) * FOE.capWE2bis6 + Math.max(we - 6, 0) * FOE.capWEab7;
    var basis = Math.min(o.brutto, cap);
    var kgbOk = o.selbst && o.funktion && (o.alt === 'oel' || o.kesselAlter >= 20);
    var kgb = kgbOk ? st.kgb : 0;
    var eb = o.selbst ? einkommensbonus(o.zve, o.kind) : 0;
    var deckel = eb >= 40 ? 80 : 70;
    // Boni nur für die selbst genutzte Wohneinheit: Anteil der Kosten, max. Höchstbetrag 1. WE
    var boniBasis = we > 1 ? Math.min(o.brutto / we, st.cap) : basis;
    var grundBetrag = basis * FOE.grund / 100;
    var boniBetrag = boniBasis * (kgb + eb) / 100;
    var max = basis * deckel / 100;
    var summe = Math.min(grundBetrag + boniBetrag, max);
    var satzEff = basis ? summe / basis * 100 : 0;
    return {
      stufe: st, cap: cap, basis: basis, grund: FOE.grund, kgb: kgb, kgbMoeglich: st.kgb, kgbOk: kgbOk,
      eb: eb, deckel: deckel, satzRoh: FOE.grund + kgb + eb, satz: satzEff, zuschuss: r2(summe),
      gedeckelt: grundBetrag + boniBetrag > max + .01, ueberCap: o.brutto > cap
    };
  }

  /* ---------- Wärmepumpe ---------- */
  var WP_GR = [5, 7, 10, 12, 16];
  var WP_T = { // je Größe; 7 kW = Beleg
    paket:   { 5: 9350, 7: 10544.05, 10: 12150, 12: 13400, 16: 15900 },
    komp:    { 5: 800, 7: 800, 10: 850, 12: 900, 16: 1000 },
    rohr:    { 5: 3200, 7: 3400, 10: 3650, 12: 3850, 16: 4300 },
    stunden: { 5: 34, 7: 38, 10: 41, 12: 44, 16: 48 }
  };
  var WP_P = {
    wlan: 90.75, wasser: 320, wasserGross: 420, hkVentil: 90, fbhAbgleich: 650,
    stdSatz: 65 + 47.5, elektro: 1050, elektroGross: 1300, planung: 986.5, planungWE: 150,
    inbetrieb: 448.5, zaehler: 2500, abdeckung: 375.25, speicher300: 650,
    entsorg: { gas: 85, lpg: 260, oel: 1450 },
    hkTausch: 780, gasheizungNeu: 12000, fundament: 1265.5, bodenkonsole: 520, wandkonsole: 450,
    gartenbauVon: 800, gartenbauBis: 1600, gartenbauFoerder: 1200
  };
  var SPEZ = { // Heizwärme kWh/m²a unsaniert, Heizlast W/m² unsaniert
    1: { q: 170, w: 105 }, 2: { q: 130, w: 80 }, 3: { q: 90, w: 58 }, 4: { q: 55, w: 38 }
  };
  var SAN = { 1: 1, 2: 0.8, 3: 0.62 };

  function wp(i) {
    /* i: flaeche, baujahr(1-4), san(1-3), we, personen, heiz('hk','fbh','mix'), hk,
          alt('gas','oel','lpg'), verbrauch (kWh bzw. l), kennt(bool), kesselJahr, funktion,
          aufstellung('extern','partner','konsole','wand'), hkTausch, selbst, zve, kind, stufe,
          preise(energie), aufschlag, ust, jahr */
    var e = i.preise, ww = i.personen * 650, eta = (i.jahr - i.kesselJahr) >= 20 ? 0.82 : 0.9;
    var kwhProL = i.alt === 'oel' ? 10 : i.alt === 'lpg' ? 6.6 : 1;
    var fl = i.flaeche, sp = SPEZ[i.baujahr], sf = SAN[i.san];
    var qhFlaeche = fl * sp.q * sf, lastFlaeche = fl * sp.w * sf / 1000;
    var verbrauch, qh, last;
    if (i.kennt && i.verbrauch > 0) {
      verbrauch = i.verbrauch;
      var nutz = verbrauch * kwhProL * eta;
      qh = Math.max(nutz - ww, nutz * 0.5);
      last = qh / 2000;
    } else {
      qh = qhFlaeche; last = lastFlaeche;
      verbrauch = (qh + ww) / eta / kwhProL;
    }
    var heizlast = last + 0.2 * i.personen;
    var plaus = lastFlaeche ? (last - lastFlaeche) / lastFlaeche : 0;
    var gr = 16; for (var k = 0; k < WP_GR.length; k++) if (heizlast <= WP_GR[k] * 1.05) { gr = WP_GR[k]; break; }
    var zuGross = heizlast > 16 * 1.05;
    var we = Math.max(1, i.we | 0), sp300 = i.personen > 4 || we > 1;
    var hk = i.heiz === 'fbh' ? 0 : i.hk;
    var abgl = (i.heiz !== 'hk' ? WP_P.fbhAbgleich : 0) + hk * WP_P.hkVentil;
    var std = WP_T.stunden[gr] + (we - 1) * 4;

    var base = [
      { k: 'wp', n: 'Luft-Wasser-Wärmepumpe ' + gr + ' kW, Monoblock', m: 1, e: 'Stk',
        d: 'Außeneinheit mit Inverter-Verdichter, modulierend, natürliches Kältemittel (R290) · Inneneinheit/Hydraulikstation mit Regelung · Trinkwasserspeicher ' + (sp300 ? 300 : 200) + ' l · Pufferspeicher 100 l · witterungsgeführter Systemregler mit App-Anbindung · Fabrikat nach Wahl im zweiten Schritt',
        v: WP_T.paket[gr] + WP_P.wlan + (sp300 ? WP_P.speicher300 : 0) },
      { k: 'hyd', n: 'Hydraulische Einbindung', m: 1, e: 'psch',
        d: 'Ausdehnungsgefäß, Schlamm- und Luftabscheider, Füllkombination, Armaturen · Verrohrung der Hydraulik in Kupfer · Anbindung Außeneinheit',
        v: WP_T.komp[gr] + WP_T.rohr[gr] },
      { k: 'plan', n: 'Planung, Heizlast und hydraulischer Abgleich', m: 1, e: 'psch',
        d: 'Bestandsaufnahme · Heizlastberechnung nach DIN EN 12831 · hydraulischer Abgleich' + (hk ? ' mit ' + hk + ' voreinstellbaren Heizkörperventilen' : '') + (i.heiz !== 'hk' ? ' inkl. Fußbodenheizkreise' : '') + ' · Heizungswasseraufbereitung nach VDI 2035 · Dokumentation',
        v: WP_P.planung + (we - 1) * WP_P.planungWE + abgl + (i.heiz !== 'hk' || we > 2 ? WP_P.wasserGross : WP_P.wasser) },
      { k: 'el', n: 'Elektroinstallation inkl. Zählerschrank', m: 1, e: 'psch',
        d: 'Neuer Zählerschrank nach VDE-AR-N 4100 und TAB · Anschluss der Wärmepumpe mit Schalt- und Sicherheitseinrichtungen · Anmeldung beim Netzbetreiber',
        v: (gr >= 16 ? WP_P.elektroGross : WP_P.elektro) + WP_P.zaehler },
      { k: 'mont', n: 'Montage und Rückbau der Altanlage', m: 1, e: 'psch',
        d: std + ' h Fachmonteur und ' + std + ' h Helfer · Demontage und Entsorgung der ' + ({ gas: 'Gasheizung', oel: 'Ölheizung inkl. Tankreinigung, Tankrückbau und Entsorgung', lpg: 'Flüssiggasheizung inkl. Trennung des Tankanschlusses' })[i.alt],
        v: std * WP_P.stdSatz + WP_P.entsorg[i.alt] },
      { k: 'ibn', n: 'Inbetriebnahme und Förderservice', m: 1, e: 'psch',
        d: 'Inbetriebnahme und Einweisung · Bauabnahme und Übergabeordner · Wetterschutz-Abdeckung der Anschlüsse · Begleitung des KfW-Antrags',
        v: WP_P.inbetrieb + WP_P.abdeckung }
    ];
    var extra = [];
    if (i.hkTausch > 0) extra.push({ k: 'hkt', n: 'Austausch Heizkörper (Niedertemperatur)', m: i.hkTausch, e: 'Stk', d: 'Großflächige Heizkörper für niedrige Vorlauftemperaturen, inkl. Montage und Anschluss', v: i.hkTausch * WP_P.hkTausch });
    if (i.aufstellung === 'partner') extra.push({ k: 'fund', n: 'Streifenfundament für die Außeneinheit', m: 1, e: 'psch', d: 'Frostfrei gegründet, mit Kondensatableitung und Kiesbett, durch Partnerbetrieb', v: WP_P.fundament });
    if (i.aufstellung === 'konsole') extra.push({ k: 'fund', n: 'Bodenkonsole / Fertigfundament', m: 1, e: 'Stk', d: 'Kunststoff-Fertigfundament mit Schwingungsdämpfern auf verdichtetem Kiesbett', v: WP_P.bodenkonsole });
    if (i.aufstellung === 'wand' && gr <= 7) extra.push({ k: 'fund', n: 'Wandkonsole für die Außeneinheit', m: 1, e: 'Stk', d: 'Schwerlastkonsole mit Schwingungsdämpfern · abhängig von Fabrikat, Wandaufbau und Schallschutz', v: WP_P.wandkonsole });

    var r = verteile(base, extra, i.aufschlag, i.ust);
    var fundExtern = i.aufstellung === 'extern' || (i.aufstellung === 'wand' && gr > 7);
    r.foe = foerderung({ brutto: r.brutto + (fundExtern ? WP_P.gartenbauFoerder : 0), we: we, selbst: i.selbst,
      alt: i.alt, kesselAlter: i.jahr - i.kesselJahr, funktion: i.funktion, zve: i.zve, kind: i.kind, stufe: i.stufe });
    r.eigen = r2(r.brutto - r.foe.zuschuss);

    /* Betrieb */
    var jaz = i.heiz === 'fbh' ? 4.0 : i.heiz === 'mix' ? 3.7 : ({ 1: 3.1, 2: 3.4, 3: 3.6 })[i.san];
    if (i.heiz !== 'fbh' && i.hkTausch > 0 && hk) jaz = Math.min(jaz + 0.4 * Math.min(1, i.hkTausch / hk) , 3.9);
    var stromWP = qh / jaz + ww / 2.8;
    var preisAlt = i.alt === 'gas' ? verbrauch * e.gas / 100 : i.alt === 'oel' ? verbrauch * e.oel : verbrauch * e.lpg;
    var fixAlt = i.alt === 'gas' ? e.fixGas : i.alt === 'oel' ? e.fixOel : e.fixLpg;
    var kostenAlt = preisAlt + fixAlt, kostenNeu = stromWP * e.wp / 100 + e.fixWp;
    var spar = kostenAlt - kostenNeu, s20 = 0;
    for (var y = 0; y < 20; y++) s20 += kostenAlt * Math.pow(1 + e.steigFossil / 100, y) - kostenNeu * Math.pow(1 + e.steigStrom / 100, y);
    var co2 = (i.alt === 'oel' ? verbrauch * 2.66 : i.alt === 'lpg' ? verbrauch * 1.64 : verbrauch * 0.201) - stromWP * 0.38;

    r.tech = { groesse: gr, heizlast: heizlast, lastFlaeche: lastFlaeche + 0.2 * i.personen, plaus: plaus, zuGross: zuGross,
      qh: qh, ww: ww, verbrauch: verbrauch, einheit: i.alt === 'gas' ? 'kWh' : 'l', eta: eta, jaz: jaz, stromWP: stromWP,
      speicher: sp300 ? 300 : 200, hk: hk, stunden: std, fundExtern: fundExtern, wandAbgelehnt: i.aufstellung === 'wand' && gr > 7 };
    r.betrieb = { alt: kostenAlt, neu: kostenNeu, spar: spar, spar20: s20, amort: spar > 0 ? r.eigen / spar : null, amortGas: spar > 0 ? Math.max(0, r.eigen - WP_P.gasheizungNeu) / spar : null, co2: Math.max(0, co2 / 1000) };
    r.optional = fundExtern ? [{ n: 'Fundament durch Garten- und Landschaftsbau', von: WP_P.gartenbauVon, bis: WP_P.gartenbauBis }] : [];
    return r;
  }

  /* Aufschlag proportional auf Basispositionen verteilen */
  function verteile(base, extra, aufschlag, ust) {
    var sb = base.reduce(function (s, p) { return s + p.v; }, 0), kf = (sb + aufschlag) / sb;
    var pos = base.map(function (p) { return pf(p, kf); }).concat(extra.map(function (p) { return pf(p, 1); }));
    var netto = r2(pos.reduce(function (s, p) { return s + p.gp; }, 0)), st = r2(netto * ust);
    return { pos: pos, netto: netto, ust: st, brutto: r2(netto + st), kosten: sb + extra.reduce(function (s, p) { return s + p.v; }, 0) };
  }
  function pf(p, kf) { var gp = r2(p.v * kf); return { k: p.k, n: p.n, d: p.d, m: p.m, e: p.e, gp: gp, ep: r2(gp / p.m) }; }

  /* ---------- Klimaanlage (Multisplit) ---------- */
  var IG = [ // Innengeräte: bis Fläche (wirksam) · kW · Preis
    { bis: 15, kw: 2.0, p: 430 }, { bis: 21, kw: 2.5, p: 470 }, { bis: 29, kw: 3.5, p: 590 },
    { bis: 42, kw: 5.0, p: 850 }, { bis: 999, kw: 7.0, p: 1050 }
  ];
  var AG = [ // Multisplit-Außengeräte: Anschlüsse, Nennleistung kW, Preis (Summe Innengeräte bis 130 %)
    { p: 2, kw: 4.1, e: 1150 }, { p: 2, kw: 5.3, e: 1250 }, { p: 2, kw: 6.8, e: 1480 },
    { p: 3, kw: 5.4, e: 1450 }, { p: 3, kw: 7.9, e: 1649 },
    { p: 4, kw: 8.5, e: 2050 }, { p: 4, kw: 10.0, e: 2350 },
    { p: 5, kw: 10.5, e: 2550 }, { p: 5, kw: 12.5, e: 2950 }
  ];
  var KL = { instBasisMulti: 1100, instBasisMono: 900, instIG: 416, leitung: 71, lBasis: 8, lEtage: 3, pumpe: 189,
    monoKlein: 650, monoGross: 950, seer: 6.1, kuehl: 30, kuehlSonne: 45, bodenVon: 250, bodenBis: 500 };

  function igFuer(r) {
    var a = r.flaeche * (r.sonne ? 1.25 : 1) * (r.etage === 2 ? 1.15 : 1);
    for (var k = 0; k < IG.length; k++) if (a <= IG[k].bis) return IG[k];
    return IG[IG.length - 1];
  }
  function aussen(g) { // günstigstes passendes Außengerät für eine Gruppe
    var sum = g.reduce(function (s, r) { return s + r.ig.kw; }, 0);
    if (g.length === 1) { var gr = g[0].ig.kw >= 5; return { ports: 1, kw: g[0].ig.kw, summe: sum, preis: gr ? KL.monoGross : KL.monoKlein, inst: KL.instBasisMono + KL.instIG }; }
    var best = null;
    AG.forEach(function (m) { if (m.p >= g.length && m.kw * 1.3 >= sum && (!best || m.e < best.e)) best = m; });
    return best ? { ports: g.length, kw: best.kw, summe: sum, preis: best.e, inst: KL.instBasisMulti + KL.instIG * g.length } : null;
  }
  function gruppen(rs) { // optimale Aufteilung auf 1 bis 3 Außengeräte nach Kosten
    var bestK = Infinity, bestG = null;
    for (var n = 1; n <= Math.min(3, rs.length); n++) {
      var tot = Math.pow(n, rs.length);
      for (var c = 0; c < tot; c++) {
        var gs = []; for (var q = 0; q < n; q++) gs.push([]);
        var x = c; rs.forEach(function (r) { gs[x % n].push(r); x = Math.floor(x / n); });
        if (gs.some(function (g) { return !g.length; })) continue;
        var kost = 0, ok = true, ag = gs.map(function (g) { var a = aussen(g); if (!a) ok = false; else kost += a.preis + a.inst; return a; });
        if (ok && kost < bestK - .01) { bestK = kost; bestG = { gs: gs, ag: ag }; }
      }
      if (bestG && n >= 1 && bestG.gs.length === n) break;
    }
    if (!bestG) bestG = { gs: rs.map(function (r) { return [r]; }), ag: rs.map(function (r) { return aussen([r]); }) };
    return bestG;
  }
  function klima(i) {
    /* i: raeume [{name,flaeche,etage(0-2),sonne}], pumpe(bool), aufstellung('wand','boden'), preise, aufschlag, ust */
    var rs = i.raeume.map(function (r) { return { name: r.name, flaeche: r.flaeche, etage: r.etage, sonne: r.sonne, ig: igFuer(r) }; });
    var G = gruppen(rs), geraet = 0, inst = 0, ags = G.ag;
    rs.forEach(function (r) { geraet += r.ig.p; });
    ags.forEach(function (a) { geraet += a.preis; inst += a.inst; });
    var meter = Math.ceil(rs.reduce(function (s, r) { return s + KL.lBasis + KL.lEtage * r.etage; }, 0));
    var pumpen = i.pumpe ? rs.length : 0;
    var igText = rs.map(function (r) { return r.name + ' ' + fmtKw(r.ig.kw); }).join(' · ');
    var agText = ags.map(function (a) { return a.ports > 1 ? 'Multisplit-Außengerät ' + fmtKw(a.kw) + ' für ' + a.ports + ' Innengeräte' : 'Split-Außengerät ' + fmtKw(a.kw); }).join(' + ');
    var base = [
      { k: 'sys', n: (rs.length > 1 ? 'Multisplit-Klimasystem, ' : 'Split-Klimasystem, ') + rs.length + (rs.length > 1 ? ' Räume' : ' Raum'), m: 1, e: 'Stk',
        d: agText + ' · Wand-Innengeräte: ' + igText + ' · Kühlen und Heizen, Inverter, Fernbedienung und App · Fabrikat nach Wahl im zweiten Schritt', v: geraet },
      { k: 'mont', n: 'Montage und Inbetriebnahme', m: 1, e: 'psch',
        d: 'Kernbohrungen · Montage Innengeräte · ' + (i.aufstellung === 'wand' ? 'Wandkonsole mit Schwingungsdämpfern' : 'Bodenkonsole mit Schwingungsdämpfern') + ' · Elektroanschluss · Vakuumieren, Dichtheitsprüfung, Inbetriebnahme und Einweisung',
        v: inst },
      { k: 'ltg', n: 'Kältemittelleitung im Bündel', m: meter, e: 'm', d: 'Kupferleitung gedämmt, mit Steuer- und Kondensatleitung, in Kabelkanal', v: meter * KL.leitung }
    ];
    if (pumpen) base.push({ k: 'pump', n: 'Kondensatpumpe', m: pumpen, e: 'Stk', d: 'Je Innengerät, leise, für Ableitung ohne Gefälle', v: pumpen * KL.pumpe });
    var r = verteile(base, [], i.aufschlag, i.ust);
    var kuehl = rs.reduce(function (s, x) { return s + x.flaeche * (x.sonne || x.etage === 2 ? KL.kuehlSonne : KL.kuehl); }, 0);
    var strom = kuehl / KL.seer;
    r.tech = { raeume: rs, ags: ags, meter: meter, pumpen: pumpen, kwSumme: rs.reduce(function (s, x) { return s + x.ig.kw; }, 0),
      kuehlWaerme: kuehl, strom: strom, flaeche: rs.reduce(function (s, x) { return s + x.flaeche; }, 0) };
    r.betrieb = { kuehlKosten: strom * i.preise.haushalt / 100 };
    r.eigen = r.brutto;
    r.optional = i.aufstellung === 'boden' ? [{ n: 'Fundamentplatte durch Garten- und Landschaftsbau', von: KL.bodenVon, bis: KL.bodenBis }] : [];
    return r;
  }
  function fmtKw(k) { return String(k.toFixed(1)).replace('.', ',') + ' kW'; }

  return { FOE: FOE, stufeFuer: stufeFuer, foerderung: foerderung, einkommensbonus: einkommensbonus, wp: wp, klima: klima, WP_P: WP_P, KL: KL, IG: IG };
})();

/* =====================================================================
   BILDWELT · Haus im Schnitt, aus Bausteinen gebaut (Briefing Abschnitt 7)
   Sichtbarkeit: data-v="0 1 2" = Schritte, in denen ein Element zu sehen ist
   (0 = Hero). Jahreszeit über Klassen .wi (Winter) und .su (Sommer).
   ===================================================================== */
var SCENE = (function () {
  var K = '#14120F', f = function (n) { return Math.round(n * 10) / 10; };
  var sd = 11; function rnd() { sd = (sd * 9301 + 49297) % 233280; return sd / 233280; }

  function turb(x, hy, by, s, dur, st) {
    var Lb = 108 * s, w = f(2.4 * s), bl = 'M0 0Q' + f(6.5 * s) + ' ' + f(-54 * s) + ' ' + f(3.5 * s) + ' ' + f(-102.6 * s) + 'Q0 ' + f(-Lb) + ' ' + f(-3.5 * s) + ' ' + f(-102.6 * s) + 'Q' + f(-6.5 * s) + ' ' + f(-54 * s) + ' 0 0Z';
    var o = '<path d="M' + f(x - 7 * s) + ' ' + by + 'L' + f(x - 2.8 * s) + ' ' + hy + 'h' + f(5.6 * s) + 'L' + f(x + 7 * s) + ' ' + by + 'Z" fill="#f6f8fa" stroke="' + st + '" stroke-width="' + w + '"/>';
    o += '<g transform="translate(' + x + ' ' + hy + ')"><g class="rot" style="animation-duration:' + dur + 's;animation-delay:-' + f(rnd() * dur) + 's"><circle r="' + f(Lb + 8) + '" fill="transparent"/>';
    [0, 120, 240].forEach(function (r) { o += '<path transform="rotate(' + r + ')" d="' + bl + '" fill="#f6f8fa" stroke="' + st + '" stroke-width="' + w + '"/>'; });
    return o + '<circle r="' + f(6 * s) + '" fill="' + st + '"/></g></g>';
  }
  function cloud(x, y, s, o) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="#F8EACD" opacity="' + o + '"><circle cx="22" cy="14" r="22"/><circle cx="66" cy="0" r="30"/><circle cx="114" cy="-8" r="36"/><circle cx="162" cy="6" r="28"/><circle cx="204" cy="16" r="20"/><rect y="10" width="206" height="12" rx="6"/></g>';
  }
  function fan(cx, cy, s, dur, c) {
    return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ')"><g class="spin" style="animation-duration:' + dur + 's"><path d="M0 0C4-12 12-14 12-4ZM0 0C12 4 14 12 4 12ZM0 0C-4 12-12 14-12 4ZM0 0C-12-4-14-12-4-12Z" fill="' + (c || '#2B4A6B') + '"/></g></g>';
  }
  function per(x, y, s, sh, pa, sk, ha) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cy="4" rx="46" ry="9" fill="' + K + '" opacity=".08"/><rect x="-23" y="-78" width="19" height="80" rx="9" fill="' + pa + '"/><rect x="4" y="-78" width="19" height="80" rx="9" fill="' + pa + '"/><rect x="-50" y="-146" width="17" height="74" rx="8.5" fill="' + sh + '"/><rect x="33" y="-146" width="17" height="74" rx="8.5" fill="' + sh + '"/><path d="M-34 -150q34-16 68 0l9 74q-43 12-86 0z" fill="' + sh + '"/><circle cx="-41.5" cy="-74" r="8.5" fill="' + sk + '"/><circle cx="41.5" cy="-74" r="8.5" fill="' + sk + '"/><circle cy="-178" r="27" fill="' + sk + '"/><path d="M-27 -182a27 27 0 0154 0q-9-20-27-20t-27 20z" fill="' + ha + '"/></g>';
  }
  function flow(d, w, c, cls) {
    return '<path d="' + d + '" stroke="#fff" stroke-width="' + (w + 6) + '" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/><path d="' + d + '" stroke="#BCB19C" stroke-width="' + w + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path class="fl ' + (cls || '') + '" d="' + d + '" stroke="' + c + '" stroke-width="' + f(w * .55) + '" fill="none"/>';
  }
  function lab(cx, y, t, px, py, key, col) {
    var w = Math.round(t.length * 10.4 + 34), sy = py < y ? y : y + 40;
    var o = '';
    if (px != null) o += '<path d="M' + cx + ' ' + sy + 'L' + px + ' ' + py + '" stroke="#8B8579" stroke-width="1.6" fill="none"/><circle cx="' + px + '" cy="' + py + '" r="4.5" fill="#8B8579"/>';
    return o + '<rect x="' + f(cx - w / 2) + '" y="' + y + '" width="' + w + '" height="40" rx="5" fill="' + (col || '#fff') + '" stroke="' + (col ? col : '#E0DACE') + '"/><text' + (key ? ' data-k="' + key + '"' : '') + ' x="' + cx + '" y="' + (y + 26) + '" text-anchor="middle" font-size="18" font-weight="700" fill="' + (col ? '#fff' : K) + '" style="font-family:Satoshi,system-ui,sans-serif">' + t + '</text>';
  }
  function g(v, inner, cls) { return '<g data-v="' + v + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + inner + '</g>'; }

  /* Wärmepumpen-Außeneinheit */
  function wpUnit(x, y) {
    return '<path d="M' + (x - 8) + ' ' + (y + 112) + 'h196l-12 9H' + (x - 20) + 'Z" fill="#241F18" opacity=".12"/>' +
      '<rect x="' + (x - 6) + '" y="' + (y + 98) + '" width="192" height="16" fill="#CFC7B5" stroke="' + K + '" stroke-width="2.5"/>' +
      '<rect x="' + x + '" y="' + y + '" width="180" height="98" rx="4" fill="#FBFAF7" stroke="' + K + '" stroke-width="3"/>' +
      '<path d="M' + (x + 180) + ' ' + y + 'l16 -10v94l-16 14Z" fill="#EDE7DB" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/><path d="M' + x + ' ' + y + 'l16 -10h180l-16 10Z" fill="#F2EFE8" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="' + (x + 62) + '" cy="' + (y + 49) + '" r="36" fill="#fff" stroke="' + K + '" stroke-width="2.5"/>' + fan(x + 62, y + 49, 2.4, .7) +
      '<path d="M' + (x + 116) + ' ' + (y + 18) + 'h48M' + (x + 116) + ' ' + (y + 30) + 'h48M' + (x + 116) + ' ' + (y + 42) + 'h48M' + (x + 116) + ' ' + (y + 54) + 'h48" stroke="#CFC7B5" stroke-width="3"/>' +
      '<circle class="led" cx="' + (x + 158) + '" cy="' + (y + 80) + '" r="4" fill="#9BE36B"/>';
  }
  function klimaIG(x, y, w) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="30" rx="8" fill="#fff" stroke="' + K + '" stroke-width="2.5"/><path d="M' + (x + 10) + ' ' + (y + 22) + 'h' + (w - 20) + '" stroke="#7CC4D3" stroke-width="3" stroke-linecap="round"/><circle class="led" cx="' + (x + w - 12) + '" cy="' + (y + 11) + '" r="3" fill="#3FA8BE"/>';
  }
  function coolWaves(x, y, w, cls) {
    var o = '';
    for (var k = 0; k < 3; k++) o += '<path class="' + (cls || 'wave') + '" style="animation-delay:-' + (k * .85) + 's" d="M' + (x + 8) + ' ' + (y + 40 + k * 4) + 'q' + (w / 8) + ' -8 ' + (w / 4) + ' 0t' + (w / 4) + ' 0t' + (w / 4) + ' 0" stroke="#7CC4D3" stroke-width="3.2" fill="none" stroke-linecap="round"/>';
    return o;
  }
  function heatWaves(x, y, c) {
    var o = '';
    for (var k = 0; k < 3; k++) o += '<path class="rise" style="animation-delay:-' + (k * .8) + 's" d="M' + (x + 8 + k * 22) + ' ' + y + 'q-8 -10 0 -20t0 -20" stroke="' + (c || '#F2A413') + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
    return o;
  }
  function radiator(x, y) {
    var o = '<rect x="' + x + '" y="' + y + '" width="74" height="34" rx="3" fill="#F5F2EB" stroke="' + K + '" stroke-width="2.2"/>';
    for (var k = 1; k < 7; k++) o += '<path d="M' + (x + k * 10.5) + ' ' + (y + 5) + 'v24" stroke="#CFC7B5" stroke-width="2"/>';
    return o;
  }
  function windowBack(x, y, w, h) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#FFF8EA" stroke="' + K + '" stroke-width="2.5"/><path d="M' + (x + w / 2) + ' ' + y + 'v' + h + 'M' + x + ' ' + (y + h * .45) + 'h' + w + '" stroke="' + K + '" stroke-width="2"/><rect class="wi" x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (w - 4) + '" height="' + (h - 4) + '" fill="#7CC4D3" opacity=".18"/>';
  }

  /* Gesamtszene: viewBox 0 0 1600 1000 */
  function build(p) {
    p = p || {}; sd = 11;
    var id = p.id || 'kw', o = '';
    o += '<defs><linearGradient id="' + id + '-sky" x2="0" y2="1"><stop offset="0" stop-color="#FFF1D6"/><stop offset="1" stop-color="#FBF8F2"/></linearGradient>' +
      '<linearGradient id="' + id + '-gr" x2="0" y2="1"><stop offset="0" stop-color="#E8E6D7"/><stop offset="1" stop-color="#EFE9DA"/></linearGradient>' +
      '<pattern id="' + id + '-erd" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="#E3DAC6"/><rect width="3" height="14" fill="#D6CCBA"/></pattern>' +
      '<pattern id="' + id + '-sav" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(135)"><rect width="10" height="10" fill="#E6EDDD"/><rect width="4" height="10" fill="#5A7247" opacity=".3"/></pattern></defs>';
    o += '<rect width="1600" height="1000" fill="url(#' + id + '-sky)"/>';
    o += '<rect class="wi" width="1600" height="770" fill="#7CC4D3" opacity=".22"/>';
    /* Sonne */
    o += '<g class="su"><g transform="translate(1196 252)"><circle class="pulse" r="150" fill="#FFB03A" opacity=".1"/><circle class="pulse" r="96" fill="#FFB03A" opacity=".14" style="animation-delay:-1.5s"/><circle r="56" fill="#FFB03A" opacity=".92"/></g></g>';
    o += '<g class="wi"><g transform="translate(430 300)"><circle r="90" fill="#FFB03A" opacity=".08"/><circle r="40" fill="#FFB03A" opacity=".55"/></g></g>';
    o += cloud(60, 180, .8, .5) + cloud(860, 120, .7, .45) + cloud(1120, 330, .5, .4);
    /* Hintergrund: Windräder mit Luftperspektive */
    o += g('0 1 2 3 4', turb(392, 560, 770, .5, 21, '#a9abac') + turb(458, 612, 770, .34, 25, '#b3b5b6') + turb(1296, 520, 770, .6, 18, '#9a9c9d') + turb(1362, 600, 770, .4, 26, '#b3b5b6'));
    var tr = '<g fill="#bec8c0">'; for (var x = -20; x <= 1620; x += 24) tr += '<ellipse cx="' + x + '" cy="770" rx="18" ry="' + f(3 + rnd() * 18) + '"/>'; o += tr + '</g>';
    o += '<rect y="770" width="1600" height="230" fill="url(#' + id + '-gr)"/><rect y="800" width="1600" height="200" fill="url(#' + id + '-erd)" opacity=".55"/>';
    /* Schnee im Winter */
    var sn = '<g class="wi" fill="#fff" opacity=".9">'; for (var k = 0; k < 46; k++) sn += '<circle class="snow" style="animation-delay:-' + f(rnd() * 9) + 's;animation-duration:' + f(7 + rnd() * 6) + 's" cx="' + f(rnd() * 1600) + '" cy="' + f(rnd() * 40) + '" r="' + f(1.6 + rnd() * 2.6) + '"/>'; o += sn + '</g>';

    /* Leitungen im Erdreich: Gasnetz (Schritt 1) */
    o += g('1', '<path d="M0 860H560" stroke="#44484C" stroke-width="8" fill="none"/><path class="fl slow" d="M0 860H560" stroke="#D9541C" stroke-width="5" fill="none"/>' + lab(440, 880, 'Gas aus dem Netz', null, null) );

    /* Haus im Schnitt */
    var X0 = 520, X1 = 1120, YK = 900, YG = 770, Y1 = 610, Y2 = 450;
    o += '<path d="M' + (X0 - 14) + ' ' + (YG + 6) + 'h' + (X1 - X0 + 60) + 'l-14 10H' + (X0 - 28) + 'Z" fill="#241F18" opacity=".1"/>';
    o += '<rect x="' + X0 + '" y="' + YG + '" width="' + (X1 - X0) + '" height="' + (YK - YG) + '" fill="#F2EFE8"/>';
    o += '<rect x="' + X0 + '" y="' + Y2 + '" width="' + (X1 - X0) + '" height="' + (YG - Y2) + '" fill="#FBFAF7"/>';
    // Dach
    o += '<path d="M' + (X0 - 34) + ' ' + (Y2 + 8) + 'L820 238L' + (X1 + 34) + ' ' + (Y2 + 8) + 'Z" fill="' + K + '"/><path d="M' + (X0 + 22) + ' ' + Y2 + 'L820 268L' + (X1 - 22) + ' ' + Y2 + 'Z" fill="#F2EFE8"/>';
    // PV auf dem Dach (Bildwelt-Regel: Dach-PV #3E6A92 mit Rasterlinien)
    o += '<path d="M880 274L1030 362L1022 376L872 288Z" fill="#3E6A92" stroke="#9FBBD1" stroke-width="1"/>';
    for (var q = 1; q < 6; q++) o += '<path d="M' + f(880 + 25 * q) + ' ' + f(274 + 14.7 * q) + 'l-8 14" stroke="#9FBBD1" stroke-width="1"/>';
    // Fenster Rückwand
    o += windowBack(580, Y1 + 30, 110, 74) + windowBack(930, Y1 + 30, 110, 74) + windowBack(580, Y2 + 28, 110, 74) + windowBack(930, Y2 + 28, 110, 74) + windowBack(780, 330, 80, 56);
    // Decken und Wände
    o += '<path d="M' + X0 + ' ' + Y1 + 'H' + X1 + 'M' + X0 + ' ' + YG + 'H' + X1 + 'M' + X0 + ' ' + Y2 + 'H' + X1 + '" stroke="' + K + '" stroke-width="12"/>';
    o += '<path d="M' + X0 + ' ' + (Y2 - 6) + 'V' + YK + 'M' + X1 + ' ' + (Y2 - 6) + 'V' + YK + 'M' + X0 + ' ' + YK + 'H' + X1 + '" stroke="' + K + '" stroke-width="16"/>';
    o += '<path d="M820 ' + (Y1 + 6) + 'V' + (YG - 50) + 'M820 ' + (Y2 + 6) + 'V' + (Y1 - 50) + '" stroke="' + K + '" stroke-width="8"/>';
    // Möbel
    o += '<path d="M600 760v-30q0-10 10-10h120q10 0 10 10v30" fill="#C97B4A" opacity=".85"/><rect x="590" y="742" width="160" height="18" rx="6" fill="#B06A3E"/>';
    o += '<rect x="900" y="716" width="120" height="8" fill="#8B7B68"/><path d="M910 724v36M1010 724v36" stroke="#8B7B68" stroke-width="5"/>';
    o += '<rect x="570" y="566" width="170" height="30" rx="5" fill="#F5F2EB" stroke="' + K + '" stroke-width="2.2"/><rect x="570" y="548" width="38" height="20" rx="6" fill="#fff" stroke="' + K + '" stroke-width="2"/>';
    o += '<rect x="900" y="560" width="100" height="8" fill="#8B7B68"/><path d="M906 568v32M994 568v32" stroke="#8B7B68" stroke-width="5"/><rect x="920" y="536" width="34" height="24" rx="2" fill="#2B4A6B"/>';
    o += per(680, 758, .32, '#5A7247', '#3D4A5A', '#E8C3A0', '#3B2C22') + per(1050, 758, .3, '#C97B4A', '#2F3A48', '#F0D2B4', '#7A4A26') + per(1060, 598, .22, '#3FA8BE', '#4A5668', '#EFD0AF', '#2A2420');
    // Heizkörper
    var R = [[598, Y1 + 116], [948, Y1 + 116], [598, Y2 + 114], [948, Y2 + 114]];
    o += R.map(function (r) { return radiator(r[0], r[1]); }).join('');

    /* Schritt 1: Gaskessel */
    o += g('1', '<rect x="560" y="790" width="90" height="100" rx="4" fill="#FBFAF7" stroke="' + K + '" stroke-width="3"/><rect x="578" y="832" width="54" height="40" rx="3" fill="#1B1814"/><path class="flame" d="M605 868c-14 0-16-14-6-24 2 8 6 8 6 2 0-8 6-12 6-18 10 10 12 22 8 30-2 6-8 10-14 10z" fill="#D9541C"/><path class="flame" style="animation-delay:-.2s" d="M605 868c-6 0-8-6-3-12 1 4 3 4 3 1 0-4 3-6 3-9 5 5 6 11 4 15-1 3-4 5-7 5z" fill="#FFB03A"/><path d="M640 790V700" stroke="#8B8579" stroke-width="10"/>' +
      flow('M650 820H700V' + (Y1 + 132) + 'H598M700 ' + (Y1 + 132) + 'V' + (Y2 + 130) + 'H598M700 ' + (Y1 + 132) + 'H948M700 ' + (Y2 + 130) + 'H948', 7, '#D9541C') +
      heatWaves(608, R[0][1] - 6, '#D9541C') + heatWaves(958, R[1][1] - 6, '#D9541C') + heatWaves(608, R[2][1] - 6, '#D9541C') + heatWaves(958, R[3][1] - 6, '#D9541C') +
      lab(1170, 330, 'Heute: 2.900 € im Jahr für Gas', null, null, 'kostenAlt', '#D9541C') + lab(430, 640, 'Gaskessel', 605, 800));
    /* Ab Schritt 2: Wärmepumpe, Speicher, Zählerschrank */
    var wpx = 1210, wpy = 650;
    o += g('0 2 3 4', wpUnit(wpx, wpy) +
      '<rect x="600" y="784" width="66" height="106" rx="30" fill="#FBFAF7" stroke="' + K + '" stroke-width="3"/><path d="M600 812h66M600 862h66" stroke="#CFC7B5" stroke-width="2.4"/><rect x="684" y="800" width="72" height="90" rx="4" fill="#FBFAF7" stroke="' + K + '" stroke-width="3"/><rect x="696" y="812" width="48" height="22" rx="2" fill="#1B1814"/><circle class="led" cx="732" cy="823" r="3.5" fill="#9BE36B"/>' +
      '<rect x="1000" y="790" width="80" height="96" rx="3" fill="#FBFAF7" stroke="' + K + '" stroke-width="3"/><path d="M1012 808h56M1012 822h56M1012 836h56" stroke="#CFC7B5" stroke-width="3"/><path d="M1040 846l-10 18h9l-4 16 14-22h-9l5-12z" fill="#FFB03A" stroke="' + K + '" stroke-width="1.4"/>' +
      flow('M' + wpx + ' ' + (wpy + 70) + 'H1140V846H756', 8, '#F2A413') +
      flow('M720 800V' + (Y1 + 132) + 'H598M720 ' + (Y1 + 132) + 'V' + (Y2 + 130) + 'H598M720 ' + (Y1 + 132) + 'H948M720 ' + (Y2 + 130) + 'H948', 7, '#F2A413') +
      '<g class="wi">' + heatWaves(608, R[0][1] - 6) + heatWaves(958, R[1][1] - 6) + heatWaves(608, R[2][1] - 6) + heatWaves(958, R[3][1] - 6) +
      [0, 1, 2].map(function (k) { return '<path class="rise" style="animation-delay:-' + (k * .9) + 's" d="M' + (wpx + 230) + ' ' + (wpy + 40 + k * 18) + 'q-20 -6 -40 0" stroke="#7CC4D3" stroke-width="3" fill="none" stroke-linecap="round"/>'; }).join('') + '</g>');
    /* Ab Schritt 3: Klimaanlage im Obergeschoss und Dach */
    var kx = 404, ky = 488;
    o += g('0 3 4', '<rect x="' + kx + '" y="' + ky + '" width="96" height="66" rx="3" fill="#FBFAF7" stroke="' + K + '" stroke-width="2.6"/><circle cx="' + (kx + 36) + '" cy="' + (ky + 33) + '" r="22" fill="#fff" stroke="' + K + '" stroke-width="2"/>' + fan(kx + 36, ky + 33, 1.4, .9, '#3FA8BE') + '<path d="M' + (kx + 68) + ' ' + (ky + 14) + 'h18M' + (kx + 68) + ' ' + (ky + 24) + 'h18M' + (kx + 68) + ' ' + (ky + 34) + 'h18" stroke="#CFC7B5" stroke-width="2.4"/><path d="M' + kx + ' ' + (ky + 66) + 'h96v8h-96z" fill="#8B8579"/>' +
      flow('M500 508H548V' + (Y2 + 20) + 'H600M548 ' + (Y2 + 20) + 'H950M760 ' + (Y2 + 20) + 'V345H850', 5, '#3FA8BE', 'rev') +
      klimaIG(950, Y2 + 12, 90) + klimaIG(600, Y2 + 12, 90) + klimaIG(850, 330, 74) +
      '<g class="su">' + coolWaves(950, Y2 + 12, 90) + coolWaves(600, Y2 + 12, 90) + coolWaves(850, 330, 74) + '</g>' +
      '<g class="wi">' + coolWaves(950, Y2 + 12, 90, 'wave').replace(/#7CC4D3/g, '#FFB03A') + coolWaves(600, Y2 + 12, 90).replace(/#7CC4D3/g, '#FFB03A') + '</g>');
    /* Schritt 4: Geld bleibt im Ort */
    var co = '';
    for (var c = 0; c < 6; c++) co += '<g class="coin" style="animation-delay:-' + f(c * .37) + 's"><ellipse cx="' + (398 + (c % 3) * 28) + '" cy="' + (734 - Math.floor(c / 3) * 14) + '" rx="22" ry="8" fill="#FFB03A" stroke="' + K + '" stroke-width="2"/></g>';
    o += g('4', '<rect x="360" y="660" width="130" height="110" rx="4" fill="url(#' + id + '-sav)" stroke="#5A7247" stroke-width="2"/>' + co + lab(425, 604, 'Bleibt im Ort', null, null, null, '#5A7247'));

    /* Thermometer-Labels */
    o += '<g class="wi">' + lab(1300, 560, '−6 °C draußen', null, null) + lab(820, 196, '21 °C drinnen', null, null) + '</g>';
    o += '<g class="su">' + lab(1300, 560, '32 °C draußen', null, null) + lab(820, 196, '24 °C drinnen', null, null) + '</g>';
    o += g('0 2 3 4', lab(1300, 812, 'Wärmepumpe', 1300, 760)) + g('0 3 4', lab(452, 412, 'Klimaanlage', 452, 488));
    return o;
  }

  /* Sichtbarkeit setzen */
  function set(svg, step, winter) {
    if (!svg) return;
    svg.classList.toggle('w', !!winter); svg.classList.toggle('s', !winter); if (svg.parentNode) svg.parentNode.classList.toggle('wint', !!winter);
    svg.querySelectorAll('[data-v]').forEach(function (el) {
      var on = el.getAttribute('data-v').split(' ').indexOf(String(step)) > -1;
      el.style.opacity = on ? 1 : 0; el.style.visibility = on ? 'visible' : 'hidden';
    });
  }
  function icon(type) {
    if (type === 'wp') return '<svg viewBox="0 0 90 70" aria-hidden="true"><rect x="4" y="12" width="76" height="50" rx="4" fill="#FBFAF7" stroke="' + K + '" stroke-width="3"/><circle cx="30" cy="37" r="17" fill="#fff" stroke="' + K + '" stroke-width="2.4"/>' + fan(30, 37, 1.1, 1) + '<path d="M54 24h18M54 32h18M54 40h18M54 48h18" stroke="#CFC7B5" stroke-width="3"/><path d="M4 62h76" stroke="' + K + '" stroke-width="3"/><path d="M78 6q4-4 8 0" stroke="#F2A413" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
    return '<svg viewBox="0 0 90 70" aria-hidden="true"><rect x="6" y="10" width="78" height="28" rx="8" fill="#fff" stroke="' + K + '" stroke-width="3"/><path d="M16 30h58" stroke="#7CC4D3" stroke-width="3.4" stroke-linecap="round"/><circle cx="72" cy="19" r="3" fill="#3FA8BE"/>' + coolWaves(10, 6, 70).replace(/class="wave"/g, 'class="wave"') + '</svg>';
  }
  function fit(svg) {
    var b = svg.parentNode.getBoundingClientRect(); if (!b.height) return;
    svg.setAttribute('preserveAspectRatio', b.width / b.height > VB[2] / VB[3] ? 'xMidYMax slice' : 'xMidYMax meet');
  }
  var VB = [340, 140, 1080, 830];
  return { build: build, set: set, icon: icon, turb: turb, fit: fit, vb: VB.join(' ') };
})();

/* =====================================================================
   OBERFLÄCHE · Landing Page, Rechner, Ergebnis, Modal
   ===================================================================== */
var UI = (function () {
  var C, R, S, RES = {}, $ = function (id) { return document.getElementById('kw-' + id); };
  var nf = function (d) { return new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }); };
  var F0 = nf(0), F1 = nf(1), F2 = nf(2);
  var eur = function (v) { return F0.format(Math.round(v)) + ' €'; };
  var eur10 = function (v) { return F0.format(Math.round(v / 10) * 10) + ' €'; };
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HEUTE = new Date(), ISO = HEUTE.getFullYear() + '-' + String(HEUTE.getMonth() + 1).padStart(2, '0') + '-' + String(HEUTE.getDate()).padStart(2, '0');
  var STAND = '13.10.2026';
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };

  /* ---------- Zustand ---------- */
  function defaults() {
    return {
      typ: 'wp',
      wp: { flaeche: 140, baujahr: 2, san: 2, we: 1, personen: 3, heiz: 'hk', hk: 10, alt: 'gas', verbrauch: 20000, kennt: true,
        kesselJahr: 2004, funktion: true, aufstellung: 'extern', hkTausch: 0, selbst: true, zve: 5, kind: false, stufe: CALC.stufeFuer(ISO) },
      kl: { raeume: [{ name: 'Wohnzimmer', flaeche: 32, etage: 0, sonne: false }, { name: 'Schlafzimmer', flaeche: 14, etage: 1, sonne: false }, { name: 'Kinderzimmer', flaeche: 12, etage: 1, sonne: false }],
        pumpe: true, aufstellung: 'wand' },
      e: JSON.parse(JSON.stringify(C.energie))
    };
  }
  function load() {
    var d = defaults();
    try { var s = JSON.parse(localStorage.getItem('kegw-waerme-v1') || 'null'); if (s && s.wp && s.kl) { d.typ = s.typ; Object.assign(d.wp, s.wp); d.kl = s.kl; Object.assign(d.e, s.e || {}); d.wp.stufe = Math.max(d.wp.stufe, CALC.stufeFuer(ISO)); } } catch (e) {}
    return d;
  }
  function save() { try { localStorage.setItem('kegw-waerme-v1', JSON.stringify(S)); } catch (e) {} }
  function getP(path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, S); }
  function setP(path, v) { var ks = path.split('.'), o = S; for (var i = 0; i < ks.length - 1; i++) o = o[ks[i]]; o[ks[ks.length - 1]] = v; }
  var num = function (v) { return /^-?\d+(\.\d+)?$/.test(String(v)) ? +v : v; };

  /* ---------- Rechnen ---------- */
  function compute() {
    var w = S.wp;
    RES.wp = CALC.wp(Object.assign({}, w, { preise: S.e, aufschlag: C.aufschlag.wp, ust: C.ust, jahr: HEUTE.getFullYear() }));
    RES.kl = CALC.klima({ raeume: S.kl.raeume, pumpe: S.kl.pumpe, aufstellung: S.kl.aufstellung, preise: S.e, aufschlag: C.aufschlag.klima, ust: C.ust });
    return RES;
  }

  /* ---------- Bausteine ---------- */
  function seg(k, opts) {
    var v = getP(k);
    return '<div class="seg" data-k="' + k + '" role="group">' + opts.map(function (o) { return '<button type="button" data-v="' + o[0] + '" class="' + (String(o[0]) === String(v) ? 'on' : '') + '" aria-pressed="' + (String(o[0]) === String(v)) + '">' + o[1] + '</button>'; }).join('') + '</div>';
  }
  function tgl(k, t, c) { var v = !!getP(k); return '<button type="button" class="tgl' + (v ? ' on' : '') + '" data-tg="' + k + '" aria-pressed="' + v + '"' + (c ? ' style="--c:' + c + '"' : '') + '><i></i>' + t + '</button>'; }
  function stp(k, min, max, unit) { return '<div class="stp" data-k="' + k + '" data-min="' + min + '" data-max="' + max + '"><button type="button" data-d="-1" aria-label="weniger">−</button><b data-o="' + k + '">' + getP(k) + (unit || '') + '</b><button type="button" data-d="1" aria-label="mehr">+</button></div>'; }
  function rng(k, min, max, step, lbl, fmt) {
    return '<div class="f"><label for="kw-' + k.replace(/\./g, '-') + '">' + lbl + ' <b data-o="' + k + '">' + fmt(getP(k)) + '</b></label><input type="range" id="kw-' + k.replace(/\./g, '-') + '" data-k="' + k + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + getP(k) + '" aria-label="' + lbl + '"></div>';
  }
  function opt(k, v, t, d, p, dis) { var on = getP(k) === v; return '<button type="button" class="opt' + (on ? ' on' : '') + '" data-ov="' + v + '"' + (dis ? ' disabled' : '') + ' aria-pressed="' + on + '"><span><strong>' + t + '</strong><small>' + d + '</small></span><b>' + (p || '') + '</b></button>'; }
  var FMT = {
    m2: function (v) { return F0.format(v) + ' m²'; },
    m2s: function (v) { return v + ' m²'; }
  };
  function sat(n) { return F0.format(n) + ' %'; }

  /* ---------- Seitenaufbau ---------- */
  function page() {
    var st = CALC.FOE.stufen[CALC.stufeFuer(ISO)];
    var tage = Math.max(0, Math.ceil((new Date(st.bis + 'T23:59:59') - HEUTE) / 864e5));
    var maxZ = CALC.foerderung({ brutto: 1e6, we: 1, selbst: true, alt: 'oel', kesselAlter: 30, funktion: true, zve: 1, kind: false, stufe: CALC.stufeFuer(ISO) }).zuschuss;
    var h = '';
    /* HERO */
    h += '<section class="mod hero" aria-label="Einstieg"><div class="copy"><div class="tag"><i></i>Wärme &amp; Kühle von nebenan · ' + esc(C.firma.kurz) + '</div>' +
      '<h1 class="t">Gas raus. Wärme rein. Bis&nbsp;zu <em class="ok">80&nbsp;%</em> gefördert.<span>Wärmepumpe oder Klimaanlage: Ihr Festpreis-Angebot in drei Minuten. Herstellerneutral gerechnet und als PDF zum Mitnehmen.</span></h1>' +
      '<div class="hl3"><div style="--c:var(--ok)"><b>' + F0.format(maxZ) + '<s>€</s></b><span>Zuschuss sind für ein Einfamilienhaus möglich</span></div><div style="--c:var(--cut)"><b>' + (st.kgb || 0) + '<s>%</s></b><span>Klimabonus ' + (st.kgb ? 'bei Antrag ' + st.label : 'ist ausgelaufen') + '</span></div><div><b>3<s>Min.</s></b><span>bis zu Ihrem persönlichen PDF-Angebot</span></div></div>' +
      '<div class="rw"><a class="btn" href="#kw-rechner" data-go="rechner">Angebot berechnen ↓</a><a class="btn g" href="#kw-story" data-go="story">So funktioniert es</a></div>' +
      '<p class="nt">Förderung nach KfW-Programm 458, Stand ' + STAND + ' · Beispielrechnung, kein verbindliches Angebot vor Vor-Ort-Prüfung</p></div>' +
      '<div class="vis"><svg class="sc w" id="kw-hero-sc" viewBox="340 140 1080 830" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Haus im Schnitt mit Wärmepumpe im Garten, Heizkörpern, Klimageräten im Obergeschoss und Photovoltaik auf dem Dach. Im Winter heizt die Wärmepumpe, im Sommer kühlt die Klimaanlage."></svg>' +
      '<div class="ctl"><div class="seas" role="group" aria-label="Jahreszeit"><button type="button" data-seas="1" class="on">❄ Winter</button><button type="button" data-seas="0">☀ Sommer</button></div>' +
      (st.kgb ? '<div class="clock" title="Danach sinkt der Klimageschwindigkeitsbonus"><i></i><span>Noch</span><b>' + tage + '</b><span>Tage ' + st.kgb + ' % Bonus</span></div>' : '') + '</div></div></section>';

    /* SCROLLY */
    h += '<section class="mod clip" id="kw-story" aria-label="So funktioniert es"><div class="pad"><div class="st">Ein Haus · vier Schritte</div><h2 class="t">Aus Gas wird Wärme <em>von nebenan</em>.</h2><p class="lead">Scrollen Sie durch Ihr Haus. Die Zahlen kommen aus Ihrem Rechner unten und ändern sich mit Ihren Angaben.</p></div>' +
      '<div class="scr"><div class="steps">' +
      '<div class="step" data-step="1" style="--c:var(--cut)"><span class="n">01 · Heute</span><b class="big"><span data-o="r.alt">0</span><s>€/Jahr</s></b><h3>So viel kostet Ihre Wärme heute.</h3><p class="sm">Der Kessel verbrennt Gas, das Geld fließt aus dem Ort ab. Dazu kommt der CO₂-Preis, der weiter steigt: Ab 2028 gilt der europäische Emissionshandel auch für Gebäude.</p></div>' +
      '<div class="step" data-step="2" style="--c:var(--fw)"><span class="n">02 · Die Wärmepumpe</span><b class="big"><span data-o="r.jaz">3,4</span><s>× Wärme</s></b><h3>Aus 1 kWh Strom werden mehrere kWh Wärme.</h3><p class="sm">Die Außeneinheit holt Wärme aus der Luft, auch bei Frost. In vielen Häusern bleiben die Heizkörper: Heizlastberechnung und hydraulischer Abgleich machen sie fit für niedrige Vorlauftemperaturen.</p></div>' +
      '<div class="step" data-step="3" style="--c:var(--wi)"><span class="n">03 · Der Sommer</span><b class="big">6<s>× Kälte</s></b><h3>Kühle Räume mit einem Außengerät.</h3><p class="sm">Eine Multisplit-Klimaanlage versorgt bis zu fünf Räume über ein Außengerät. Sie kühlt im Sommer und heizt in der Übergangszeit, leise und per App steuerbar.</p></div>' +
      '<div class="step" data-step="4" style="--c:var(--ok)"><span class="n">04 · Das Geld bleibt</span><b class="big"><span data-o="r.spar">0</span><s>€/Jahr</s></b><h3>Weniger Heizkosten, bis zu 80 % Zuschuss.</h3><p class="sm">Der Staat übernimmt über die KfW einen großen Teil der Investition. Planung, Förderantrag und Einbau kommen aus einer Hand, mit Partnern aus der Region. So bleibt die Wertschöpfung vor Ort.</p><div class="rw"><a class="btn" href="#kw-rechner" data-go="rechner">Jetzt rechnen ↓</a></div></div>' +
      '</div><div class="stick"><div class="prog"><i class="on"></i><i></i><i></i><i></i></div><svg class="sc w" id="kw-story-sc" viewBox="340 140 1080 830" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Das Haus verwandelt sich Schritt für Schritt: vom Gaskessel zur Wärmepumpe, dann kommt im Sommer die Klimaanlage dazu."></svg></div></div></section>';

    /* FÖRDERUNG */
    h += '<section class="mod reveal" aria-label="Förderung"><div class="pad"><div class="st">Förderung · KfW-Zuschuss 458</div><h2 class="t">Heute <em class="ok" data-o="f.now">0 €</em> Zuschuss. Ab Februar <em data-o="f.next">0 €</em>.</h2><p class="lead">Seit dem 21.07.2026 gilt eine neue Förderrichtlinie. Der Klimageschwindigkeitsbonus und die förderfähigen Kosten sinken jedes halbe Jahr. Entscheidend ist das Datum Ihres Antrags.</p></div>' +
      '<div class="pad rule" style="padding-top:22px"><div class="ch" id="kw-fch"><svg id="kw-fchs" viewBox="0 0 1200 420" role="img" aria-label="Maximaler Zuschuss für ein Einfamilienhaus je Antragszeitraum von 2026 bis 2030"></svg><div class="tt" id="kw-ftt"></div></div><p class="nt" style="margin-top:12px">Grün: selbst genutztes Haus, alte fossile Heizung, ohne Einkommensbonus · Kontur: mit höchstem Einkommensbonus · Werte auf die förderfähigen Höchstkosten der 1. Wohneinheit</p></div>' +
      '<div class="ins"><div style="--c:var(--ok)"><b>30<s>%</s></b><span>Grundförderung für alle Eigentümer, ohne Bedingungen an Einkommen oder Altheizung</span></div><div style="--c:var(--cut)"><b>' + st.kgb + '<s>%</s></b><span>Klimageschwindigkeitsbonus für Selbstnutzer: Öl jeden Alters, Gas ab 20 Jahren Laufzeit</span></div><div style="--c:var(--ok)"><b>40<s>%</s></b><span>Einkommensbonus bis 30.000 € zu versteuerndem Haushaltseinkommen, mit Kind bis 40.000 €</span></div><div><b>' + F0.format(st.cap) + '<s>€</s></b><span>förderfähige Kosten für die erste Wohneinheit, jede weitere bis 15.000 €</span></div></div>' +
      '<div class="sig"><span>Quelle: <a href="https://www.kfw.de/458" target="_blank" rel="noopener">KfW · Heizungsförderung 458</a> · <a href="https://www.kfw.de/heizung" target="_blank" rel="noopener">kfw.de/heizung</a></span><span>Stand ' + STAND + '</span></div></section>';

    /* RECHNER */
    h += '<section class="mod" id="kw-rechner" aria-label="Angebotsrechner"><div class="pad"><div class="st">Angebotsrechner</div><h2 class="t">Ihr Festpreis in drei Minuten.</h2><p class="lead">Wählen Sie, was Ihr Haus können soll. Wir rechnen herstellerneutral mit Preisen aus realen Projekten. Das Fabrikat wählen Sie im zweiten Schritt beim Vor-Ort-Termin.</p></div>' +
      '<div class="pick" role="tablist"><button type="button" role="tab" data-typ="wp">' + SCENE.icon('wp') + '<em>Heizen und Warmwasser</em><strong>Wärmepumpe</strong><span>Ersetzt Ihre Gas- oder Ölheizung · bis zu 80 % gefördert</span></button><button type="button" role="tab" data-typ="kl">' + SCENE.icon('kl') + '<em>Kühlen und Heizen</em><strong>Klimaanlage</strong><span>Ein Außengerät für bis zu fünf Räume · <span data-o="kl.ab"></span></span></button></div>' +
      '<div class="calc"><div class="form" id="kw-form"></div><aside class="res" aria-live="polite"><div class="in2" id="kw-res"></div></aside></div></section>';

    /* VERGLEICH */
    h += '<section class="mod reveal" id="kw-vgl" aria-label="Vergleich"><div class="pad"><div class="st">Der Vergleich · Ihr Haus</div><h2 class="t">In 20 Jahren bleiben Ihnen <em class="ok" data-o="v.s20">0 €</em>.</h2><p class="lead" data-o="v.lead"></p></div><div class="two"><div><span class="eb">Rechnung · heute</span><div class="bon" id="kw-bon-a"></div></div><div><span class="eb">Rechnung · mit Wärmepumpe</span><div class="bon" id="kw-bon-b"></div><p class="say" data-o="v.say"></p></div></div></section>';

    /* ABLAUF */
    h += '<section class="mod reveal" aria-label="Ablauf"><div class="pad"><div class="st">Ablauf</div><h2 class="t">Vom PDF bis zur warmen Wohnung in vier Schritten.</h2></div><div class="flow4">' +
      '<div><h3>Angebot online</h3><p>Sie rechnen hier und laden Ihr persönliches Angebot als PDF. Kostenlos und ohne Verpflichtung.</p><span class="chip">heute · 3 Minuten</span></div>' +
      '<div><h3>Vor-Ort-Check und Fabrikat</h3><p>Wir prüfen Heizlast nach DIN EN 12831, Aufstellort, Schall und Zählerschrank. Danach wählen Sie das Fabrikat. Erst dann wird der Preis verbindlich.</p><span class="chip">ca. 1 Woche</span></div>' +
      '<div><h3>Förderantrag</h3><p>Der KfW-Antrag muss vor Beginn der Arbeiten gestellt werden. Dafür schließen wir einen Vertrag mit auflösender Bedingung: Ohne Zusage keine Pflicht. Wir begleiten den Antrag.</p><span class="chip ok">Antrag vor Auftrag</span></div>' +
      '<div><h3>Einbau und Inbetriebnahme</h3><p>Montage meist in drei bis fünf Tagen. Danach Einweisung, Übergabeordner und Verwendungsnachweis für die Auszahlung des Zuschusses.</p><span class="chip">3 bis 5 Tage</span></div></div></section>';

    /* FAQ */
    h += '<section class="mod reveal" aria-label="Häufige Fragen"><div class="pad"><div class="st">Fragen</div><h2 class="t">Was Sie vor der Entscheidung wissen sollten.</h2></div><div class="faq">' +
      faq('Warum steht kein Hersteller im Angebot?', 'Wir rechnen bewusst herstellerneutral: mit Leistung, Ausstattung und Preisniveau von Markengeräten mit natürlichem Kältemittel. Welches Fabrikat am besten zu Ihrem Haus, Aufstellort und Schallschutz passt, klären wir beim Vor-Ort-Termin. Weicht der Preis des gewählten Geräts ab, sehen Sie das vor der Unterschrift.') +
      faq('Was ist im Preis enthalten?', 'Bei der Wärmepumpe: Gerät mit Speichern und Regelung, hydraulische Einbindung, Heizlastberechnung, hydraulischer Abgleich, Elektroanschluss mit neuem Zählerschrank nach VDE-AR-N 4100, Montage, Rückbau und Entsorgung der Altanlage, Inbetriebnahme, Wetterschutz-Abdeckung und Begleitung des KfW-Antrags. Bei der Klimaanlage: Außen- und Innengeräte, Kältemittelleitung nach Metern, Kondensatpumpen, Kernbohrungen, Konsole, Elektroanschluss und Inbetriebnahme.') +
      faq('Warum ist das Fundament nicht dabei?', 'Die Außeneinheit braucht einen festen, frostfreien Stand. Das Fundament können Sie selbst oder von einem Garten- und Landschaftsbauer herstellen lassen, oft günstiger und zusammen mit anderen Arbeiten im Garten. Alternativ übernimmt das unser Partnerbetrieb, wählbar im Rechner. Kleine Geräte können auch an die Hauswand.') +
      faq('Wie verbindlich ist das Angebot?', 'Es ist eine sorgfältige Kalkulation auf Basis Ihrer Angaben, aber noch kein Vertrag. Verbindlich wird der Preis nach der Vor-Ort-Prüfung. Die Förderung ist eine Schätzung nach der KfW-Richtlinie in der Fassung ab 21.07.2026. Die Zusage erteilt allein die KfW.') +
      faq('Wird die Klimaanlage gefördert?', 'Als Ergänzung zur bestehenden Heizung nicht. Förderfähig wäre eine Luft-Luft-Wärmepumpe nur, wenn sie die Hauptheizung ersetzt und mindestens 65 % der Heizlast deckt. Das prüfen wir gern im Einzelfall.') +
      faq('Kann ich statt Kauf eine Monatsrate zahlen?', 'Ja. Neben dem Kauf bieten wir Contracting an: Wir finanzieren die Anlage, Sie zahlen eine feste Monatsrate. Sprechen Sie uns an, wir rechnen das für Ihr Haus.') +
      '</div></section>';

    /* METHODIK */
    h += '<section class="mod reveal" aria-label="Methodik und Quellen"><div class="pad"><div class="st">Methodik · ehrlich bis zur Fußnote</div><h2 class="t">So rechnet der Rechner.</h2></div><div class="meth">' +
      '<div><strong>Preise</strong>Kalibriert auf reale Projekte 2026: ein Angebot für eine 7-kW-Luft-Wasser-Wärmepumpe mit Speichern und eine Schlussrechnung für eine Multisplit-Klimaanlage mit drei Innengeräten. Andere Größen leiten wir je Position ab: Gerät, Hydraulik und Montagestunden nach Leistung, Leitungen nach Metern, Abgleich je Heizkörper. Alle Preise inklusive Planung und Förderservice.<ul><li>Montage: Fachmonteur und Helfer je Stunde</li><li>Kältemittelleitung: je Meter, nach Etage</li><li>Fundament: nicht enthalten, Richtwert separat</li></ul></div>' +
      '<div><strong>Heizlast und Größe</strong>Aus Ihrem Verbrauch: <code>Verbrauch × Nutzungsgrad − Warmwasser</code> geteilt durch 2.000 Vollbenutzungsstunden, plus 0,2 kW je Person für Warmwasser. Ohne Verbrauch aus Fläche, Baujahr und Sanierungsstand. Gewählt wird die nächste Gerätegröße: 5, 7, 10, 12 oder 16 kW. Die verbindliche Auslegung erfolgt nach DIN EN 12831 vor Ort.<ul><li>Jahresarbeitszahl 3,1 bis 4,0 je Heizfläche</li><li>Klima: Raumgröße, Sonne, Dachgeschoss</li></ul></div>' +
      '<div><strong>Förderung</strong>Nach KfW 458, Richtlinie ab 21.07.2026: 30 % Grundförderung, Klimageschwindigkeitsbonus 16 % bis 31.01.2027, danach halbjährlich 4 Punkte weniger, Einkommensbonus 40/30/10 % mit Familienzuschlag. Höchstens 70 %, bei 40 % Einkommensbonus 80 % der förderfähigen Kosten. Förderfähig sind die Bruttokosten bis zum Höchstbetrag.<ul><li><a href="https://www.kfw.de/458" target="_blank" rel="noopener">KfW · Zuschuss 458</a></li><li><a href="https://www.kfw.de/358" target="_blank" rel="noopener">KfW · Ergänzungskredit 358/359</a></li><li><a href="https://www.kfw.de/beg" target="_blank" rel="noopener">KfW · Bundesförderung für effiziente Gebäude</a></li></ul></div></div>' +
      '<div class="sig"><span>Energiepreise: Gas ' + F1.format(C.energie.gas) + ' ct/kWh · Öl ' + F2.format(C.energie.oel) + ' €/l · Wärmepumpentarif ' + F0.format(C.energie.wp) + ' ct/kWh · im Rechner änderbar</span><span>Beispielrechnung, kein Angebot · Stand ' + STAND + '</span></div></section>';

    /* ENDE */
    h += '<section class="mod dk reveal" aria-label="Kontakt"><div class="pad end"><div><div class="st">Lasst uns Wärme lokal machen</div><h2 class="t" style="max-width:20ch">Ihr Angebot ist drei Minuten entfernt.</h2><p class="lead">Rechnen, PDF laden, Termin vereinbaren. Wir melden uns nur, wenn Sie es möchten.</p></div><div class="rw" style="justify-content:flex-end"><a class="btn" href="#kw-rechner" data-go="rechner">Angebot berechnen</a><a class="btn g" data-act="contracting" href="#">Contracting anfragen</a></div></div><div class="sig"><span>' + esc(C.firma.name) + '</span><span>Herstellerneutral · Förderservice inklusive</span></div></section>';

    /* Mobilleiste + Modal */
    h += '<div class="mbar" id="kw-mbar"><div><span data-o="m.lbl">Ihr Eigenanteil</span><b data-o="m.val">0 €</b></div><button type="button" class="btn" data-act="pdf">↓ PDF</button></div>';
    h += modal();
    return h;
  }
  function faq(q, a) { return '<details><summary>' + q + '</summary><p>' + a + '</p></details>'; }

  function modal() {
    var lead = C.lead && C.lead.modus !== 'aus';
    return '<div class="md" id="kw-md" role="dialog" aria-modal="true" aria-labelledby="kw-md-h"><div class="mdb"><button type="button" class="x" data-act="close" aria-label="Schließen">×</button><div class="pad">' +
      '<div><div class="st" id="kw-md-st">PDF-Angebot</div><h2 class="t" id="kw-md-h" style="margin-bottom:6px">Für wen ist das Angebot?</h2><p class="sm">Ihre Angaben erscheinen nur im PDF. Es wird direkt in Ihrem Browser erzeugt.</p></div>' +
      '<div class="frm">' +
      fi('anrede', 'Anrede', 's2', '<select class="in txt" id="kw-k-anrede"><option>Frau</option><option>Herr</option><option>Familie</option><option value="">keine</option></select>') +
      fi('vorname', 'Vorname', 's2') + fi('name', 'Nachname *', 's2') +
      fi('strasse', 'Straße und Hausnummer *', 's4') + fi('plz', 'PLZ *', 's2', null, 'inputmode="numeric" maxlength="5"') +
      fi('ort', 'Ort *', 's6') +
      fi('email', 'E-Mail', '', null, 'type="email" autocomplete="email"') + fi('tel', 'Telefon', '', null, 'type="tel" autocomplete="tel"') +
      fi('objekt', 'Objektadresse, falls abweichend', 's6') +
      '</div>' +
      (lead ? '<button type="button" class="chk" data-act="consent" id="kw-consent" aria-pressed="false"><i></i><span>Ja, ' + esc(C.firma.kurz) + ' darf meine Angaben und dieses Angebot erhalten und mich dazu kontaktieren. Ohne Haken bleibt alles nur bei Ihnen. Widerruf jederzeit möglich.</span></button>' : '') +
      '<div class="rw" style="justify-content:space-between"><span class="nt">* Pflichtfeld für das Anschreiben</span><div class="rw"><button type="button" class="btn g" data-act="close">Abbrechen</button><button type="button" class="btn ok" id="kw-mk">↓ Angebot als PDF</button></div></div>' +
      '</div></div></div>';
  }
  function fi(k, l, cls, inner, attr) {
    return '<div class="f ' + (cls || '') + '"><label for="kw-k-' + k + '">' + l + '</label>' + (inner || '<input class="in txt" id="kw-k-' + k + '" autocomplete="on" ' + (attr || '') + '>') + '</div>';
  }

  /* ---------- Formular ---------- */
  function form() {
    var w = S.wp, r = RES.wp, t = r.tech, h = '';
    if (S.typ === 'wp') {
      h += '<fieldset><legend><i>01</i>Ihr Haus</legend><div class="fg">' +
        rng('wp.flaeche', 60, 400, 5, 'Wohnfläche', FMT.m2) +
        '<div class="f"><span class="lb">Personen im Haushalt</span>' + stp('wp.personen', 1, 8) + '<span class="hint">Für Warmwasser und Speichergröße</span></div>' +
        '<div class="f wide"><span class="lb">Baujahr des Hauses</span>' + seg('wp.baujahr', [[1, 'bis 1977'], [2, '1978–1994'], [3, '1995–2009'], [4, 'ab 2010']]) + '</div>' +
        '<div class="f wide"><span class="lb">Sanierungsstand</span>' + seg('wp.san', [[1, 'unsaniert'], [2, 'teilsaniert'], [3, 'saniert']]) + '<span class="hint">Teilsaniert: Fenster, Dach oder Fassade erneuert. Saniert: zwei oder mehr davon.</span></div>' +
        '<div class="f wide"><span class="lb">Heizflächen</span>' + seg('wp.heiz', [['hk', 'Heizkörper'], ['fbh', 'Fußbodenheizung'], ['mix', 'beides']]) + '</div>' +
        (w.heiz !== 'fbh' ? '<div class="f"><span class="lb">Anzahl Heizkörper</span>' + stp('wp.hk', 1, 40) + '</div>' : '') +
        '<div class="f"><span class="lb">Wohneinheiten</span>' + stp('wp.we', 1, 12) + '<span class="hint">1 = Einfamilienhaus</span></div>' +
        '</div></fieldset>';
      h += '<fieldset><legend><i>02</i>Ihre Heizung heute</legend><div class="fg">' +
        '<div class="f wide"><span class="lb">Energieträger</span>' + seg('wp.alt', [['gas', 'Erdgas'], ['oel', 'Heizöl'], ['lpg', 'Flüssiggas']]) + '</div>' +
        '<div class="f"><label for="kw-wp-verbrauch">Verbrauch pro Jahr <b>' + (w.alt === 'gas' ? 'kWh' : 'Liter') + '</b></label><input class="in" id="kw-wp-verbrauch" data-k="wp.verbrauch" inputmode="numeric" value="' + (w.kennt ? F0.format(w.verbrauch) : '') + '" placeholder="' + (w.kennt ? '' : 'geschätzt ' + F0.format(t.verbrauch)) + '"' + (w.kennt ? '' : ' disabled') + ' aria-label="Jahresverbrauch">' + tgl('wp.kennt', 'Verbrauch bekannt') + '<span class="hint">' + (w.alt === 'gas' ? 'Steht auf der Gasrechnung. Bei m³: mal 10.' : 'Durchschnitt der letzten Jahre.') + '</span></div>' +
        '<div class="f"><label for="kw-wp-kesselJahr">Baujahr der Heizung <b data-o="wp.kesselJahr">' + w.kesselJahr + '</b></label><input type="range" id="kw-wp-kesselJahr" data-k="wp.kesselJahr" min="1975" max="' + HEUTE.getFullYear() + '" step="1" value="' + w.kesselJahr + '">' + tgl('wp.funktion', 'Heizung funktioniert noch') + '</div>' +
        '</div>' + heizNote(t) + '</fieldset>';
      var gk = t.groesse <= 7;
      var P = CALC.WP_P;
      h += '<fieldset><legend><i>03</i>Aufstellung und Extras</legend><div class="opts" data-k="wp.aufstellung">' +
        opt('wp.aufstellung', 'extern', 'Fundament selbst vergeben', 'Garten- und Landschaftsbau oder Eigenleistung. Wir liefern die Maßskizze mit. Richtwert ' + eur(P.gartenbauVon) + ' bis ' + eur(P.gartenbauBis) + '.', 'separat') +
        opt('wp.aufstellung', 'partner', 'Streifenfundament vom Partnerbetrieb', 'Frostfrei gegründet, mit Kondensatableitung und Kiesbett.', '+' + eur(P.fundament * (1 + C.ust))) +
        opt('wp.aufstellung', 'konsole', 'Bodenkonsole / Fertigfundament', 'Auf verdichtetem Kiesbett, schnell gesetzt, für ebene Flächen.', '+' + eur(P.bodenkonsole * (1 + C.ust))) +
        opt('wp.aufstellung', 'wand', 'Wandkonsole', gk ? 'Nur für kleine Geräte, abhängig von Fabrikat, Wand und Schallschutz.' : 'Bei ' + t.groesse + ' kW nicht möglich: Das Gerät ist zu schwer.', gk ? '+' + eur(P.wandkonsole * (1 + C.ust)) : '–', !gk) +
        '</div>' +
        (w.heiz !== 'fbh' ? '<div class="fg"><div class="f"><span class="lb">Heizkörper austauschen</span>' + stp('wp.hkTausch', 0, w.hk) + '<span class="hint">Großflächige Heizkörper senken die Vorlauftemperatur und den Strombedarf. ' + eur(P.hkTausch * (1 + C.ust)) + ' je Stück, förderfähig.</span></div></div>' + (w.san === 1 && w.hkTausch === 0 ? '<div class="note">In unsanierten Häusern lohnt oft der Tausch von zwei bis vier kleinen Heizkörpern. Das klären wir vor Ort.</div>' : '') : '') +
        '</fieldset>';
      h += '<fieldset><legend><i>04</i>Ihre Förderung</legend><div class="fg">' +
        '<div class="f wide">' + tgl('wp.selbst', 'Ich wohne selbst im Haus, es ist mein Hauptwohnsitz') + '</div>' +
        (w.selbst ? '<div class="f wide"><span class="lb">Zu versteuerndes Haushaltseinkommen pro Jahr</span>' + seg('wp.zve', [[1, 'bis 30.000 €'], [2, 'bis 40.000 €'], [3, 'bis 50.000 €'], [4, 'bis 60.000 €'], [5, 'darüber']]) + '<span class="hint">Durchschnitt aus dem zweit- und drittletzten Steuerbescheid. Nicht das Brutto: das zu versteuernde Einkommen steht im Bescheid.</span></div>' +
        '<div class="f wide">' + tgl('wp.kind', 'Mindestens ein Kind unter 18 im Haushalt') + '</div>' : '') +
        '<div class="f wide"><label for="kw-wp-stufe">Geplanter Antrag bei der KfW</label><select class="in txt" id="kw-wp-stufe" data-k="wp.stufe">' + CALC.FOE.stufen.map(function (s, i) { return i < CALC.stufeFuer(ISO) ? '' : '<option value="' + i + '"' + (i === w.stufe ? ' selected' : '') + '>' + s.label + ' · Klimabonus ' + s.kgb + ' % · max. ' + F0.format(s.cap) + ' €</option>'; }).join('') + '</select></div>' +
        '</div>' + foeNote(r.foe) + '</fieldset>';
      h += '<fieldset><details><summary class="eb" style="display:flex;justify-content:space-between;align-items:center;padding:4px 0">Energiepreise und Annahmen anpassen <span>+</span></summary><div class="fg" style="margin-top:18px">' +
        ein('e.gas', 'Erdgas', 'ct/kWh') + ein('e.oel', 'Heizöl', '€/l') + ein('e.lpg', 'Flüssiggas', '€/l') + ein('e.wp', 'Wärmepumpentarif', 'ct/kWh') +
        ein('e.fixGas', 'Fixkosten Gas', '€/Jahr') + ein('e.fixOel', 'Fixkosten Öl', '€/Jahr') + ein('e.fixWp', 'Fixkosten Wärmepumpe', '€/Jahr') +
        ein('e.steigFossil', 'Preisanstieg Gas/Öl', '% p.a.') + ein('e.steigStrom', 'Preisanstieg Strom', '% p.a.') +
        '</div><p class="nt" style="margin-top:12px">Fixkosten: Grundpreis, Schornsteinfeger, Wartung. Der Preisanstieg fossil enthält den steigenden CO₂-Preis. <button type="button" data-act="reset" style="text-decoration:underline">Studienwerte zurücksetzen</button></p></details></fieldset>';
    } else {
      var k = RES.kl, kt = k.tech;
      h += '<fieldset><legend><i>01</i>Welche Räume sollen kühl werden?</legend><div class="rooms">' + S.kl.raeume.map(function (rm, i) {
        var ig = kt.raeume[i].ig;
        return '<div class="room"><select class="in txt" data-k="kl.raeume.' + i + '.name" aria-label="Raum">' + ['Wohnzimmer', 'Schlafzimmer', 'Kinderzimmer', 'Arbeitszimmer', 'Küche', 'Gästezimmer', 'Dachstudio', 'Esszimmer'].map(function (n) { return '<option' + (n === rm.name ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select>' +
          '<div class="ar"><span>Fläche <b data-o="kl.raeume.' + i + '.flaeche">' + rm.flaeche + ' m²</b></span><input type="range" data-k="kl.raeume.' + i + '.flaeche" min="8" max="60" step="1" value="' + rm.flaeche + '" aria-label="Fläche ' + esc(rm.name) + '"></div>' +
          seg('kl.raeume.' + i + '.etage', [[0, 'EG'], [1, 'OG'], [2, 'DG']]) + tgl('kl.raeume.' + i + '.sonne', 'viel Sonne', '#F2A413') +
          '<button type="button" class="x" data-act="rm" data-i="' + i + '" aria-label="Raum entfernen"' + (S.kl.raeume.length < 2 ? ' disabled style="opacity:.3"' : '') + '>×</button>' +
          '<div class="kw"><span class="chip co">Innengerät ' + F1.format(ig.kw) + ' kW</span><span>' + (rm.etage === 2 ? 'Dachgeschoss: mehr Wärmelast · ' : '') + (8 + 3 * rm.etage) + ' m Leitung</span></div></div>';
      }).join('') + '</div>' + (S.kl.raeume.length < 8 ? '<div class="rw"><button type="button" class="btn g" data-act="add">+ Raum hinzufügen</button></div>' : '') +
        '<div class="note">' + kt.ags.length + ' Außengerät' + (kt.ags.length > 1 ? 'e' : '') + ': ' + kt.ags.map(function (a) { return (a.ports > 1 ? a.ports + ' Anschlüsse, ' : '') + F1.format(a.kw) + ' kW'; }).join(' + ') + ' · Innengeräte zusammen ' + F1.format(kt.kwSumme) + ' kW · ' + kt.meter + ' m Kältemittelleitung</div></fieldset>';
      h += '<fieldset><legend><i>02</i>Außengerät und Kondensat</legend><div class="opts" data-k="kl.aufstellung">' +
        opt('kl.aufstellung', 'wand', 'An der Hauswand', 'Schwerlastkonsole mit Schwingungsdämpfern, im Preis enthalten.', 'inkl.') +
        opt('kl.aufstellung', 'boden', 'Auf dem Boden', 'Bodenkonsole inklusive. Die Fundamentplatte vergeben Sie selbst, Richtwert ' + eur(CALC.KL.bodenVon) + ' bis ' + eur(CALC.KL.bodenBis) + '.', 'inkl.') +
        '</div><div class="fg"><div class="f wide"><span class="lb">Kondensatableitung</span>' + seg('kl.pumpe', [['true', 'Pumpe je Gerät'], ['false', 'Gefälle nach außen']]) + '<span class="hint">Ohne Gefälle zur Außenwand braucht jedes Innengerät eine leise Kondensatpumpe.</span></div>' +
        ein('e.haushalt', 'Ihr Strompreis', 'ct/kWh') + '</div>' +
        '<div class="note">Förderung: Als Ergänzung zur bestehenden Heizung ist eine Klimaanlage nicht förderfähig. Ersetzt eine Luft-Luft-Wärmepumpe die Hauptheizung und deckt mindestens 65 % der Heizlast, kann die KfW 458 greifen. Das prüfen wir gern einzeln.</div></fieldset>';
    }
    $('form').innerHTML = h;
  }
  function ein(k, l, u) { return '<div class="f"><label for="kw-' + k.replace('.', '-') + '">' + l + ' <b>' + u + '</b></label><input class="in" id="kw-' + k.replace('.', '-') + '" data-k="' + k + '" inputmode="decimal" value="' + String(getP(k)).replace('.', ',') + '"></div>'; }
  function heizNote(t) {
    var s = '<div class="note' + (t.zuGross ? ' w' : ' g') + '">Heizlast etwa <b>' + F1.format(t.heizlast) + ' kW</b> → Wärmepumpe <b>' + t.groesse + ' kW</b> mit ' + t.speicher + ' l Warmwasserspeicher. Jahresarbeitszahl rund ' + F1.format(t.jaz) + '.' + (t.zuGross ? ' Über 16 kW planen wir eine Kaskade individuell.' : '') + '</div>';
    if (S.wp.kennt && Math.abs(t.plaus) > .35) s += '<div class="note w">Ihr Verbrauch passt ' + (t.plaus > 0 ? 'eher zu einem größeren' : 'eher zu einem kleineren') + ' Haus als angegeben (Schätzung aus Fläche: ' + F1.format(t.lastFlaeche) + ' kW). Wir rechnen mit dem Verbrauch. Bitte prüfen Sie die Angaben.</div>';
    return s;
  }
  function foeNote(fo) {
    var w = S.wp, s = '';
    s += '<div class="note g">Grundförderung 30 %' + (fo.kgb ? ' + Klimabonus ' + fo.kgb + ' %' : '') + (fo.eb ? ' + Einkommensbonus ' + fo.eb + ' %' : '') + (fo.gedeckelt ? ' = ' + fo.satzRoh + ' %, gedeckelt auf ' + fo.deckel + ' %' : ' = ' + F0.format(fo.satz) + ' %') + ' von ' + eur(fo.basis) + ' förderfähigen Kosten: <b>' + eur(fo.zuschuss) + '</b>.</div>';
    if (w.selbst && !fo.kgbOk && fo.kgbMoeglich) s += '<div class="note w">Kein Klimabonus: ' + (!w.funktion ? 'Die Altheizung muss noch funktionieren.' : 'Gas- und Flüssiggasheizungen müssen bei Antrag mindestens 20 Jahre in Betrieb sein (Typenschild).') + '</div>';
    if (!w.selbst) s += '<div class="note">Vermietet oder nicht selbst genutzt: Es gilt die Grundförderung von 30 %. Die Boni gibt es nur für die selbst genutzte Wohneinheit.</div>';
    if (fo.ueberCap) s += '<div class="note">Ihre Kosten liegen über dem Höchstbetrag von ' + eur(fo.cap) + '. Gefördert wird bis zu diesem Betrag. Für den Rest bietet die KfW den Ergänzungskredit 358/359.</div>';
    return s;
  }

  /* ---------- Ergebnis ---------- */
  function result() {
    var wp = S.typ === 'wp', r = wp ? RES.wp : RES.kl, h = '', fo = r.foe;
    var titel = wp ? 'Wärmepumpe ' + r.tech.groesse + ' kW' : (r.tech.raeume.length > 1 ? 'Multisplit · ' + r.tech.raeume.length + ' Räume' : 'Split · 1 Raum');
    h += '<div class="hd"><span class="eb">Ihr Angebot · ' + titel + '</span><b class="big" style="--c:var(--' + (wp ? 'ok' : 'ink') + ')"><span data-o="res.big">' + eur(wp ? r.eigen : r.brutto) + '</span></b><span class="sub">' + (wp ? 'Eigenanteil nach geschätzt <b>' + eur(fo.zuschuss) + '</b> KfW-Zuschuss · Kaufpreis ' + eur(r.brutto) + ' brutto' : 'Kaufpreis brutto inkl. Montage · ' + eur(r.netto) + ' netto') + '</span></div>';
    if (wp) {
      var B = r.brutto, gr = Math.min(fo.zuschuss, fo.basis * fo.grund / 100), kg = Math.min(fo.zuschuss - gr, fo.basis * fo.kgb / 100), ek = Math.max(0, fo.zuschuss - gr - kg), rest = B - fo.zuschuss;
      var pc = function (v) { return Math.max(0, v / B * 100) + '%'; };
      h += '<div class="fz"><div class="bar" aria-hidden="true"><i class="gr" style="flex-basis:' + pc(gr) + '">' + (gr / B > .12 ? 'Grund' : '') + '</i><i class="kg" style="flex-basis:' + pc(kg) + '">' + (kg / B > .1 ? 'Klima' : '') + '</i><i class="ek" style="flex-basis:' + pc(ek) + '">' + (ek / B > .1 ? 'Einkommen' : '') + '</i><i style="flex-basis:' + pc(rest) + ';background:var(--ink)">Eigenanteil</i></div>' +
        '<div class="leg"><span><i style="--c:var(--ok)"></i>Grund ' + eur(gr) + '</span>' + (kg ? '<span><i style="--c:#7E9A62"></i>Klimabonus ' + eur(kg) + '</span>' : '') + (ek ? '<span><i style="--c:#A3B88C"></i>Einkommen ' + eur(ek) + '</span>' : '') + '<span><i style="--c:var(--ink)"></i>Sie ' + eur(rest) + '</span></div></div>';
    }
    h += '<div class="bon"><div class="bh">ANGEBOT · ' + (wp ? 'WÄRMEPUMPE' : 'KLIMAANLAGE') + '</div><div class="bdv"></div>' +
      r.pos.map(function (p) { return '<div class="bl"><span>' + esc(p.n) + (p.m > 1 || p.e === 'm' ? '<small>' + F0.format(p.m) + ' ' + p.e + '</small>' : '') + '</span><b>' + eur(p.gp * (1 + C.ust)) + '</b></div>'; }).join('') +
      '<div class="bdv"></div><div class="bl"><span>Summe netto</span><b>' + eur(r.netto) + '</b></div><div class="bl"><span>Umsatzsteuer 19 %</span><b>' + eur(r.ust) + '</b></div>' +
      (wp ? '<div class="bl"><span><strong>Kaufpreis brutto</strong></span><b>' + eur(r.brutto) + '</b></div><div class="bl m"><span>KfW-Zuschuss, geschätzt<small>' + F0.format(fo.satz) + ' % von ' + eur(fo.basis) + '</small></span><b>−' + eur(fo.zuschuss) + '</b></div><div class="bl t"><span>Ihr Eigenanteil<small>Antrag ' + fo.stufe.label + '</small></span><b>' + eur(r.eigen) + '</b></div>'
        : '<div class="bl t"><span>Kaufpreis brutto<small>inkl. Montage und Inbetriebnahme</small></span><b>' + eur(r.brutto) + '</b></div>') +
      '<div class="bc"></div></div>';
    if (wp) {
      var b = r.betrieb;
      h += '<div class="k3"><div style="--c:var(--cut)"><b>' + eur10(b.alt) + '</b><span>Heizkosten heute pro Jahr</span></div><div style="--c:var(--ok)"><b>' + eur10(b.neu) + '</b><span>mit Wärmepumpe pro Jahr</span></div><div style="--c:var(--ok)"><b>' + (b.amortGas != null ? F1.format(b.amortGas) + ' J.' : '–') + '</b><span>Amortisation gegenüber neuer Gasheizung</span></div></div>';
    } else {
      h += '<div class="k3"><div><b>' + F1.format(r.tech.kwSumme) + ' kW</b><span>Kühlleistung Innengeräte</span></div><div><b>' + F0.format(r.tech.flaeche) + ' m²</b><span>gekühlte Fläche</span></div><div style="--c:var(--wi)"><b>' + eur10(r.betrieb.kuehlKosten) + '</b><span>Stromkosten Kühlen pro Jahr</span></div></div>';
    }
    var chips = '';
    r.optional.forEach(function (o) { chips += '<span class="chip">Nicht enthalten: ' + o.n.replace(' durch Garten- und Landschaftsbau', '') + ', Richtwert ' + eur(o.von) + '–' + eur(o.bis) + '</span>'; });
    if (wp && r.tech.wandAbgelehnt) chips += '<span class="chip cut">Wandkonsole bei ' + r.tech.groesse + ' kW nicht möglich</span>';
    chips += '<span class="chip ok">Herstellerneutral · Fabrikat im 2. Schritt</span>';
    h += '<div class="rw">' + chips + '</div>';
    h += '<div class="cta"><button type="button" class="btn ok" data-act="pdf">↓ Persönliches Angebot als PDF</button><a class="btn g" href="#" data-act="contracting">Lieber Monatsrate? Contracting anfragen</a></div>' +
      '<p class="nt">Indikatives Angebot auf Basis Ihrer Angaben · verbindlich nach Vor-Ort-Prüfung · Förderung ohne Gewähr, Zusage durch die KfW · Stand ' + STAND + '</p>';
    $('res').innerHTML = h;
  }

  /* ---------- Landing-Werte ---------- */
  function landing() {
    var r = RES.wp, b = r.betrieb, t = r.tech;
    setO('r.alt', F0.format(Math.round(b.alt / 10) * 10)); setO('r.jaz', F1.format(t.jaz)); setO('r.spar', F0.format(Math.max(0, Math.round(b.spar / 10) * 10)));
    setO('kl.ab', 'Ihr Projekt ab ' + eur10(RES.kl.brutto));
    var nm = ({ gas: 'Gas', oel: 'Öl', lpg: 'Flüssiggas' })[S.wp.alt];
    ['hero-sc', 'story-sc'].forEach(function (id) { var t2 = $(id) && $(id).querySelector('[data-k="kostenAlt"]'); if (t2) fitLab(t2, 'Heute: ' + eur10(b.alt) + ' im Jahr für ' + nm); });
    // Vergleich
    var e = S.e, alt = S.wp.alt, v = t.verbrauch;
    var pA = alt === 'gas' ? v * e.gas / 100 : alt === 'oel' ? v * e.oel : v * e.lpg, fA = alt === 'gas' ? e.fixGas : alt === 'oel' ? e.fixOel : e.fixLpg;
    $('bon-a').innerHTML = '<div class="bh">HEIZKOSTEN · ' + nm.toUpperCase() + '</div><div class="bdv"></div><div class="bl"><span>' + nm + '<small>' + F0.format(v) + ' ' + t.einheit + ' × ' + (alt === 'gas' ? F1.format(e.gas) + ' ct' : F2.format(alt === 'oel' ? e.oel : e.lpg) + ' €') + '</small></span><b>' + eur(pA) + '</b></div><div class="bl"><span>Grundpreis, Schornsteinfeger, Wartung</span><b>' + eur(fA) + '</b></div><div class="bdv"></div><div class="bl r"><span>Pro Jahr<small>steigt mit dem CO₂-Preis</small></span><b>' + eur(b.alt) + '</b></div><div class="bc"></div>';
    $('bon-b').innerHTML = '<div class="bh">HEIZKOSTEN · WÄRMEPUMPE</div><div class="bdv"></div><div class="bl"><span>Wärmepumpenstrom<small>' + F0.format(t.stromWP) + ' kWh × ' + F1.format(e.wp) + ' ct · JAZ ' + F1.format(t.jaz) + '</small></span><b>' + eur(t.stromWP * e.wp / 100) + '</b></div><div class="bl"><span>Zählergrundpreis, Wartung</span><b>' + eur(e.fixWp) + '</b></div><div class="bdv"></div><div class="bl t"><span>Pro Jahr<small>' + eur(b.spar) + ' weniger als heute</small></span><b>' + eur(b.neu) + '</b></div><div class="bc"></div>';
    setO('v.s20', eur10(Math.max(0, b.spar20)));
    setO('v.lead', 'Rechenfall für Ihr Haus mit ' + F0.format(S.wp.flaeche) + ' m² und ' + F0.format(v) + ' ' + t.einheit + ' ' + nm + ' im Jahr. Preisanstieg ' + F1.format(e.steigFossil) + ' % für ' + nm + ' und ' + F1.format(e.steigStrom) + ' % für Strom pro Jahr. Ändern Sie die Werte im Rechner.');
    setO('v.say', 'Der Zuschuss von <em class="ok">' + eur10(r.foe.zuschuss) + '</em> und die Ersparnis tragen den Großteil der Investition. Und rund ' + F1.format(b.co2) + ' t CO₂ weniger pro Jahr.', 1);
    // Förderchart Headline
    var st = CALC.stufeFuer(ISO), typ = { brutto: 1e6, we: 1, selbst: true, alt: 'gas', kesselAlter: 25, funktion: true, zve: 5, kind: false };
    setO('f.now', eur(CALC.foerderung(Object.assign({}, typ, { stufe: st })).zuschuss));
    setO('f.next', eur(CALC.foerderung(Object.assign({}, typ, { stufe: Math.min(st + 1, CALC.FOE.stufen.length - 1) })).zuschuss));
    // Mobilleiste
    var wp = S.typ === 'wp';
    setO('m.lbl', wp ? 'Ihr Eigenanteil' : 'Kaufpreis brutto'); setO('m.val', eur(wp ? r.eigen : RES.kl.brutto));
  }
  function setO(k, v, html) { R.querySelectorAll('[data-o="' + k + '"]').forEach(function (el) { if (html) el.innerHTML = v; else el.textContent = v; }); }
  function fitLab(t, txt) {
    t.textContent = txt; var rc = t.previousElementSibling; if (!rc || rc.tagName.toLowerCase() !== 'rect') return;
    var w; try { w = t.getComputedTextLength() + 34; } catch (e) { w = txt.length * 10.4 + 34; }
    if (!w || w < 40) w = txt.length * 10.4 + 34;
    var cx = +t.getAttribute('x'); rc.setAttribute('x', cx - w / 2); rc.setAttribute('width', w);
  }

  /* ---------- Förderchart ---------- */
  function fchart() {
    var st0 = CALC.stufeFuer(ISO), L = CALC.FOE.stufen.slice(st0), W = 1200, H = 420, lm = 70, tp = 50, bm = 70;
    var A = L.map(function (s, i) { return CALC.foerderung({ brutto: 1e6, we: 1, selbst: true, alt: 'gas', kesselAlter: 25, funktion: true, zve: 5, kind: false, stufe: st0 + i }).zuschuss; });
    var Bv = L.map(function (s, i) { return CALC.foerderung({ brutto: 1e6, we: 1, selbst: true, alt: 'gas', kesselAlter: 25, funktion: true, zve: 1, kind: false, stufe: st0 + i }).zuschuss; });
    var ym = 25000, yy = function (v) { return tp + (H - tp - bm) * (1 - v / ym); }, bw = (W - lm - 20) / L.length, s = '';
    for (var v = 0; v <= ym; v += 5000) s += '<line x1="' + lm + '" x2="' + (W - 20) + '" y1="' + yy(v) + '" y2="' + yy(v) + '" stroke="#E4DFD5"/><text x="' + (lm - 10) + '" y="' + (yy(v) + 4) + '" font-size="12" text-anchor="end" fill="#8B8579">' + F0.format(v / 1000) + ' T€</text>';
    L.forEach(function (st, i) {
      var x = lm + i * bw + bw * .16, w = bw * .68;
      s += '<rect x="' + x + '" y="' + yy(Bv[i]) + '" width="' + w + '" height="' + (yy(0) - yy(Bv[i])) + '" fill="none" stroke="#5A7247" stroke-width="2" stroke-dasharray="5 4" rx="2"/>';
      s += '<text x="' + (x + w / 2) + '" y="' + (yy(Bv[i]) - 8) + '" font-size="11" text-anchor="middle" fill="#5A7247">bis ' + F1.format(Bv[i] / 1000) + ' T€</text>';
      s += '<rect x="' + (x + 6) + '" y="' + yy(A[i]) + '" width="' + (w - 12) + '" height="' + (yy(0) - yy(A[i])) + '" fill="' + (i ? '#5A7247' : '#5A7247') + '" opacity="' + (i ? .55 + .45 * (1 - i / L.length) : 1) + '" rx="2"/>';
      s += '<text x="' + (x + w / 2) + '" y="' + (yy(A[i]) - 10) + '" font-size="' + (i ? 12 : 14) + '" font-weight="700" text-anchor="middle" fill="' + (i ? '#413C34' : '#5A7247') + '">' + F1.format(A[i] / 1000) + ' T€</text>';
      var lb = st.label.replace('bis ', 'bis ').split('–');
      s += '<text x="' + (x + w / 2) + '" y="' + (H - 44) + '" font-size="11" text-anchor="middle" fill="' + (i ? '#8B8579' : '#14120F') + '" font-weight="' + (i ? 500 : 700) + '">' + esc(lb[0]) + '</text>' + (lb[1] ? '<text x="' + (x + w / 2) + '" y="' + (H - 28) + '" font-size="11" text-anchor="middle" fill="#8B8579">–' + esc(lb[1]) + '</text>' : '');
      s += '<text x="' + (x + w / 2) + '" y="' + (H - 8) + '" font-size="11" text-anchor="middle" font-weight="700" fill="' + (st.kgb ? '#D9541C' : '#B9B2A4') + '">' + (st.kgb ? '+' + st.kgb + ' %' : 'kein Bonus') + '</text>';
      s += '<rect class="hv" data-i="' + i + '" x="' + (lm + i * bw) + '" y="' + tp + '" width="' + bw + '" height="' + (H - tp) + '" fill="transparent"/>';
    });
    s += '<text x="' + (lm + bw * .5) + '" y="26" font-size="12" font-weight="700" text-anchor="middle" fill="#14120F">HEUTE</text><path d="M' + (lm + bw) + ' 16V' + yy(0) + '" stroke="#14120F" stroke-dasharray="4 4"/>';
    $('fchs').innerHTML = s;
    var tt = $('ftt'), ch = $('fch');
    $('fchs').querySelectorAll('.hv').forEach(function (r) {
      r.onpointerenter = r.onpointermove = function (ev) {
        var i = +r.getAttribute('data-i'), st = L[i], c = ch.getBoundingClientRect(), b = r.getBoundingClientRect();
        tt.innerHTML = '<b>Antrag ' + esc(st.label) + '</b><br>Klimabonus ' + st.kgb + ' % · max. Kosten ' + eur(st.cap) + '<br>Zuschuss ohne Einkommensbonus <b>' + eur(A[i]) + '</b><br>mit 40 % Einkommensbonus <b>' + eur(Bv[i]) + '</b>';
        tt.style.left = Math.min(c.width - 150, Math.max(150, b.left + b.width / 2 - c.left)) + ch.scrollLeft + 'px'; tt.style.top = Math.max(110, ev.clientY - c.top) + 'px'; tt.style.opacity = 1;
      };
      r.onpointerleave = function () { tt.style.opacity = 0; };
    });
  }

  /* ---------- Ablauf ---------- */
  function update(full) {
    compute(); if (full) form(); else refreshForm(); result(); landing(); save();
  }
  function refreshForm() {
    // Werte, die sich beim Ziehen ändern, ohne das Formular neu zu bauen
    R.querySelectorAll('#kw-form [data-o]').forEach(function (el) {
      var k = el.getAttribute('data-o'), v = getP(k);
      if (/flaeche$/.test(k)) el.textContent = /^kl/.test(k) ? v + ' m²' : FMT.m2(v); else el.textContent = v;
    });
    var nt = R.querySelector('#kw-form fieldset:nth-of-type(2) .note');
    if (S.typ === 'wp' && nt) { var holder = nt.parentNode; holder.querySelectorAll('.note').forEach(function (n) { n.remove(); }); holder.insertAdjacentHTML('beforeend', heizNote(RES.wp.tech)); }
    var fs4 = R.querySelector('#kw-form fieldset:nth-of-type(4)');
    if (S.typ === 'wp' && fs4) { fs4.querySelectorAll(':scope > .note').forEach(function (n) { n.remove(); }); fs4.insertAdjacentHTML('beforeend', foeNote(RES.wp.foe)); }
    if (S.typ === 'kl') R.querySelectorAll('#kw-form .room').forEach(function (el, i) { var c = el.querySelector('.chip'); if (c) c.textContent = 'Innengerät ' + F1.format(RES.kl.tech.raeume[i].ig.kw) + ' kW'; });
    if (S.typ === 'kl') { var n = R.querySelector('#kw-form fieldset .note'), kt = RES.kl.tech; if (n) n.textContent = kt.ags.length + ' Außengerät' + (kt.ags.length > 1 ? 'e' : '') + ': ' + kt.ags.map(function (a) { return (a.ports > 1 ? a.ports + ' Anschlüsse, ' : '') + F1.format(a.kw) + ' kW'; }).join(' + ') + ' · Innengeräte zusammen ' + F1.format(kt.kwSumme) + ' kW · ' + kt.meter + ' m Kältemittelleitung'; }
  }
  function pick() { R.querySelectorAll('[data-typ]').forEach(function (b) { var on = b.getAttribute('data-typ') === S.typ; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); }); }

  function events() {
    R.addEventListener('click', function (e) {
      var b = e.target.closest('button, a'); if (!b || !R.contains(b)) return;
      var sg = b.parentNode && b.parentNode.closest && b.closest('.seg[data-k]');
      if (b.hasAttribute('data-typ')) { S.typ = b.getAttribute('data-typ'); pick(); update(true); return; }
      if (sg && b.hasAttribute('data-v')) { var v = b.getAttribute('data-v'); setP(sg.getAttribute('data-k'), v === 'true' ? true : v === 'false' ? false : num(v)); fixups(); update(true); return; }
      if (b.hasAttribute('data-tg')) { var k = b.getAttribute('data-tg'); setP(k, !getP(k)); fixups(); update(true); return; }
      if (b.hasAttribute('data-ov')) { var o = b.closest('.opts'); setP(o.getAttribute('data-k'), b.getAttribute('data-ov')); update(true); return; }
      if (b.hasAttribute('data-d')) { var sp = b.closest('.stp'), k2 = sp.getAttribute('data-k'), nv = Math.min(+sp.getAttribute('data-max'), Math.max(+sp.getAttribute('data-min'), getP(k2) + +b.getAttribute('data-d'))); setP(k2, nv); fixups(); update(true); return; }
      if (b.hasAttribute('data-seas')) { auto = false; season(+b.getAttribute('data-seas')); return; }
      if (b.hasAttribute('data-go')) { e.preventDefault(); var t = $(b.getAttribute('data-go')); t && t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }); return; }
      var a = b.getAttribute('data-act');
      if (a === 'add' && S.kl.raeume.length < 8) { S.kl.raeume.push({ name: ['Arbeitszimmer', 'Gästezimmer', 'Dachstudio', 'Küche', 'Esszimmer'][S.kl.raeume.length % 5], flaeche: 16, etage: 1, sonne: false }); update(true); }
      if (a === 'rm' && S.kl.raeume.length > 1) { S.kl.raeume.splice(+b.getAttribute('data-i'), 1); update(true); }
      if (a === 'reset') { S.e = JSON.parse(JSON.stringify(C.energie)); update(true); }
      if (a === 'pdf') openModal();
      if (a === 'close') closeModal();
      if (a === 'consent') { var on = !b.classList.contains('on'); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }
      if (a === 'contracting') { e.preventDefault(); contracting(); }
    });
    R.addEventListener('input', function (e) {
      var el = e.target, k = el.getAttribute('data-k'); if (!k) return;
      if (el.type === 'range') { setP(k, +el.value); update(false); return; }
      if (el.tagName === 'SELECT') return;
      var raw = el.value.replace(/\./g, '').replace(',', '.'), n = parseFloat(raw);
      if (/^e\./.test(k)) raw = el.value.replace(',', '.'), n = parseFloat(raw);
      if (isFinite(n) && n >= 0) { setP(k, n); el.classList.remove('bad'); update(false); } else el.classList.add('bad');
    });
    R.addEventListener('change', function (e) {
      var el = e.target, k = el.getAttribute('data-k'); if (!k) return;
      if (el.tagName === 'SELECT') { setP(k, num(el.value)); update(true); }
      else if (el.type !== 'range' && k === 'wp.verbrauch') update(true);
    });
    $('mk').onclick = makePdf;
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
    $('md').addEventListener('click', function (e) { if (e.target === $('md')) closeModal(); });
  }
  function fixups() { var w = S.wp; if (w.hkTausch > w.hk) w.hkTausch = w.hk; if (w.aufstellung === 'wand' && CALC.wp(Object.assign({}, w, { preise: S.e, aufschlag: 0, ust: 0, jahr: HEUTE.getFullYear() })).tech.groesse > 7) w.aufstellung = 'extern'; }

  /* ---------- Szene, Scrollytelling, Einblenden ---------- */
  var auto = true, seasonNow = 1;
  function season(w) { seasonNow = w; SCENE.set($('hero-sc'), 0, w); R.querySelectorAll('[data-seas]').forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-seas') === w); }); }
  function scenes() {
    $('hero-sc').innerHTML = SCENE.build({ id: 'kwh' }); season(1);
    $('story-sc').innerHTML = SCENE.build({ id: 'kws' }); SCENE.set($('story-sc'), 1, 1);
    var fitAll = function () { SCENE.fit($('hero-sc')); SCENE.fit($('story-sc')); }; fitAll(); addEventListener('resize', fitAll);
    if (!RM) setInterval(function () { if (auto && !document.hidden) season(seasonNow ? 0 : 1); }, 7000);
    var steps = R.querySelectorAll('.step'), prog = R.querySelectorAll('.prog i');
    var go = function (n) {
      steps.forEach(function (s) { s.classList.toggle('on', +s.getAttribute('data-step') === n); });
      prog.forEach(function (p, i) { p.classList.toggle('on', i < n); });
      SCENE.set($('story-sc'), n, n <= 2);
    };
    go(1);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) go(+e.target.getAttribute('data-step')); }); }, { rootMargin: '-45% 0px -45% 0px' });
      steps.forEach(function (s) { io.observe(s); });
      var rv = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('rv-on'); rv.unobserve(e.target); } }); }, { threshold: .08 });
      R.querySelectorAll('.reveal').forEach(function (s) { rv.observe(s); });
      var mb = new IntersectionObserver(function (es) { es.forEach(function (e) { $('mbar').classList.toggle('on', e.isIntersecting); }); }, { threshold: 0 });
      mb.observe($('rechner'));
    } else { steps.forEach(function (s) { s.classList.add('on'); }); R.querySelectorAll('.reveal').forEach(function (s) { s.classList.add('rv-on'); }); }
  }

  /* ---------- Modal, PDF, Lead ---------- */
  function openModal() { $('md').classList.add('on'); $('md-st').textContent = 'PDF-Angebot · ' + (S.typ === 'wp' ? 'Wärmepumpe' : 'Klimaanlage'); setTimeout(function () { var x = $('k-name'); x && x.focus(); }, 50); }
  function closeModal() { $('md').classList.remove('on'); }
  function kunde() {
    var g = function (k) { var el = $('k-' + k); return el ? el.value.trim() : ''; };
    return { anrede: g('anrede'), vorname: g('vorname'), name: g('name'), strasse: g('strasse'), plz: g('plz'), ort: g('ort'), email: g('email'), tel: g('tel'), objekt: g('objekt') };
  }
  function makePdf() {
    var k = kunde(), bad = false;
    ['name', 'strasse', 'plz', 'ort'].forEach(function (f) { var el = $('k-' + f), ok = !!k[f] && (f !== 'plz' || /^\d{5}$/.test(k[f])); el.classList.toggle('bad', !ok); if (!ok) bad = true; });
    if (bad) { var first = R.querySelector('.frm .bad'); first && first.focus(); return; }
    var btn = $('mk'), t0 = btn.textContent; btn.disabled = true; btn.textContent = '… PDF wird erstellt';
    var wp = S.typ === 'wp', d = new Date(), nr = (wp ? C.angebot.praefixWP : C.angebot.praefixKL) + '-' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + String(Math.floor(1000 + Math.random() * 9000));
    PDF.make({ C: C, S: S, r: wp ? RES.wp : RES.kl, typ: S.typ, kunde: k, nr: nr, datum: d, stand: STAND }).then(function (meta) {
      var c = $('consent'); if (c && c.classList.contains('on')) lead(k, nr, meta);
      btn.disabled = false; btn.textContent = t0; closeModal();
    }).catch(function (er) { btn.disabled = false; btn.textContent = t0; alert('Das PDF konnte nicht erstellt werden: ' + (er && er.message || er)); });
  }
  function lead(k, nr, meta) {
    var wp = S.typ === 'wp', r = wp ? RES.wp : RES.kl;
    var data = { angebot: nr, produkt: wp ? 'Wärmepumpe ' + r.tech.groesse + ' kW' : 'Klimaanlage ' + r.tech.raeume.length + ' Räume', brutto: Math.round(r.brutto), zuschuss: wp ? Math.round(r.foe.zuschuss) : 0, eigenanteil: Math.round(r.eigen),
      anrede: k.anrede, vorname: k.vorname, name: k.name, strasse: k.strasse, plz: k.plz, ort: k.ort, email: k.email, telefon: k.tel, objekt: k.objekt, details: meta && meta.summary || '' };
    try {
      if (C.lead.modus === 'webhook' && C.lead.webhook) { fetch(C.lead.webhook, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(data) }); return; }
      if (C.lead.modus === 'webflow') {
        var fm = document.querySelector('form[data-name="' + C.lead.webflowForm + '"]') || document.querySelector('form[name="' + C.lead.webflowForm + '"]');
        if (!fm) { console.warn('[KEGW] Webflow-Formular "' + C.lead.webflowForm + '" nicht gefunden. Lead nicht übertragen.'); return; }
        fm.querySelectorAll('[data-kegw]').forEach(function (x) { x.remove(); });
        Object.keys(data).forEach(function (key) { var i = document.createElement('input'); i.type = 'hidden'; i.name = key; i.setAttribute('data-name', key); i.value = data[key]; i.setAttribute('data-kegw', '1'); fm.appendChild(i); });
        if (fm.requestSubmit) fm.requestSubmit(); else fm.submit();
      }
    } catch (e) { console.warn('[KEGW] Lead-Übertragung fehlgeschlagen', e); }
  }
  function contracting() {
    var wp = S.typ === 'wp', r = wp ? RES.wp : RES.kl, sub = encodeURIComponent(C.kontakt.betreffContracting);
    var body = encodeURIComponent('Guten Tag,\n\nich interessiere mich für Contracting statt Kauf.\n\nAnlage: ' + (wp ? 'Wärmepumpe ' + r.tech.groesse + ' kW' : 'Klimaanlage, ' + r.tech.raeume.length + ' Räume') + '\nKaufpreis laut Rechner: ' + eur(r.brutto) + ' brutto\n\nBitte melden Sie sich bei mir.\n\nName:\nTelefon:\n');
    var m = C.kontakt.mail || (/^\[/.test(C.firma.email) ? '' : C.firma.email);
    location.href = 'mailto:' + m + '?subject=' + sub + '&body=' + body;
  }

  function mount(root, cfg) {
    R = root; C = cfg; S = load(); R.id = 'kw'; R.setAttribute('lang', 'de');
    R.innerHTML = page(); pick(); compute(); form(); result(); landing(); scenes(); fchart(); events();
    if (RM) R.querySelectorAll('.reveal').forEach(function (s) { s.classList.add('rv-on'); });
  }
  return { mount: mount, _state: function () { return S; }, _res: function () { return RES; } };
})();

/* Logos als Vektordaten: ansvar2030 (Wortmarke) und "The mission is no emission" (Warming Stripes + Schriftzug) */
var LOGOS = {"ansvar":{"w":79.211,"h":11.383,"p":[{"c":"#ff0035","d":"M9.601,8.304 C9.599,8.773,9.61,9.242,9.636,9.711 C9.661,10.179,9.699,10.647,9.751,11.114 L6.911,11.114 C6.864,10.939,6.828,10.762,6.803,10.583 C6.778,10.404,6.764,10.224,6.761,10.044 C6.371,10.654,5.601,11.364,3.701,11.364 C2.746,11.467,1.792,11.154,1.084,10.506 C0.376,9.857,-0.019,8.934,0.001,7.974 C0.001,5.504,2.001,4.344,5.151,4.344 L6.701,4.344 L6.701,3.694 C6.701,2.924,6.431,2.164,5.021,2.164 C3.771,2.164,3.471,2.694,3.351,3.464 L0.501,3.464 C0.651,1.564,1.841,0.014,5.151,0.014 C8.041,0.034,9.601,1.164,9.601,3.764 L9.601,8.304 Z M6.701,6.174 L5.491,6.174 C3.661,6.174,2.991,6.734,2.991,7.784 C2.974,8.201,3.145,8.605,3.456,8.883 C3.768,9.161,4.188,9.287,4.601,9.224 C6.471,9.224,6.701,7.884,6.701,6.464 L6.701,6.174 Z"},{"c":"#ff0035","d":"M11.311,3.004 L11.311,0.264 L14.201,0.264 C14.236,0.492,14.264,0.721,14.286,0.952 C14.307,1.182,14.322,1.412,14.331,1.644 C14.644,1.1,15.106,0.658,15.662,0.369 C16.219,0.08,16.846,-0.043,17.471,0.014 C19.651,0.014,21.051,1.494,21.051,4.224 L21.051,11.114 L18.051,11.114 L18.051,4.554 C18.051,3.324,17.651,2.444,16.311,2.444 C14.971,2.444,14.311,3.154,14.311,5.084 L14.311,11.084 L11.311,11.084 L11.311,3.004 Z"},{"c":"#ff0035","d":"M24.701,7.844 C24.821,8.269,25.087,8.639,25.453,8.888 C25.819,9.137,26.261,9.248,26.701,9.204 C27.811,9.204,28.211,8.814,28.211,8.144 C28.211,7.474,27.751,7.144,26.211,6.794 C22.671,5.914,22.101,4.794,22.101,3.304 C22.101,1.814,23.261,0.014,26.521,0.014 C29.781,0.014,30.941,1.814,31.031,3.274 L28.181,3.274 C28.071,2.884,27.801,2.124,26.401,2.124 C25.401,2.124,25.081,2.564,25.081,3.044 C25.081,3.524,25.411,3.844,27.171,4.264 C30.801,5.104,31.321,6.334,31.321,7.934 C31.321,9.734,29.941,11.364,26.651,11.364 C23.361,11.364,22.001,9.774,21.751,7.844 L24.701,7.844 Z"},{"c":"#ff0035","d":"M34.171,0.264 C35.171,3.954,36.061,7.154,36.271,8.454 L36.271,8.454 C36.601,6.674,37.651,3.404,38.601,0.264 L41.601,0.264 L37.751,11.114 L34.601,11.114 L30.921,0.264 L34.171,0.264 Z"},{"c":"#ff0035","d":"M50.681,8.304 C50.679,8.773,50.69,9.242,50.716,9.711 C50.741,10.179,50.779,10.647,50.831,11.114 L47.961,11.114 C47.914,10.939,47.878,10.762,47.853,10.583 C47.828,10.404,47.814,10.224,47.811,10.044 C47.411,10.654,46.681,11.364,44.751,11.364 C43.796,11.467,42.842,11.154,42.134,10.506 C41.426,9.857,41.031,8.934,41.051,7.974 C41.051,5.504,43.051,4.344,46.201,4.344 L47.751,4.344 L47.751,3.694 C47.751,2.924,47.481,2.164,46.071,2.164 C44.821,2.164,44.521,2.694,44.401,3.484 L41.601,3.484 C41.691,1.564,42.891,0.014,46.201,0.014 C49.091,0.014,50.681,1.164,50.681,3.764 L50.681,8.304 Z M47.751,6.174 L46.531,6.174 C44.711,6.174,44.041,6.734,44.041,7.784 C44.026,8.191,44.191,8.585,44.49,8.862 C44.79,9.138,45.196,9.27,45.601,9.224 C47.511,9.224,47.741,7.884,47.741,6.464 L47.751,6.174 Z"},{"c":"#ff0035","d":"M52.341,3.214 L52.341,0.264 L55.341,0.264 C55.341,0.514,55.431,1.584,55.431,2.164 C55.706,1.498,56.181,0.934,56.79,0.549 C57.398,0.164,58.112,-0.023,58.831,0.014 L58.831,2.884 C56.651,2.814,55.361,3.404,55.361,6.384 L55.361,11.114 L52.361,11.114 L52.341,3.214 Z"},{"c":"#000000","d":"M61.711,5.914 L61.711,5.834 C61.732,5.291,61.895,4.762,62.182,4.301 C62.47,3.84,62.873,3.462,63.351,3.204 C64.131,2.634,64.351,2.434,64.351,1.944 C64.351,1.454,64.111,1.194,63.651,1.194 C63.191,1.194,62.911,1.534,62.831,2.014 L61.681,2.014 C61.7,1.526,61.912,1.066,62.271,0.735 C62.629,0.404,63.105,0.229,63.592,0.248 C63.622,0.249,63.651,0.251,63.681,0.254 C64.166,0.181,64.66,0.325,65.03,0.649 C65.4,0.972,65.609,1.442,65.601,1.934 C65.601,2.754,65.251,3.134,64.231,3.854 C64.01,3.976,63.807,4.128,63.628,4.305 C63.449,4.483,63.295,4.684,63.171,4.904 L65.811,4.904 L65.651,5.904 L61.711,5.914 Z"},{"c":"#000000","d":"M70.271,3.104 C70.271,4.634,69.791,6.014,68.141,6.014 C66.491,6.014,66.011,4.674,66.011,3.134 C66.011,1.594,66.601,0.254,68.161,0.254 C69.721,0.254,70.271,1.524,70.271,3.104 Z M67.271,3.104 C67.271,4.104,67.391,5.044,68.181,5.044 C68.971,5.044,69.041,4.184,69.041,3.104 C69.041,2.024,68.911,1.214,68.181,1.214 C67.451,1.214,67.251,1.924,67.251,3.114 L67.271,3.104 Z"},{"c":"#000000","d":"M70.601,1.784 C70.648,1.327,70.874,0.908,71.23,0.619 C71.586,0.329,72.043,0.193,72.499,0.24 C72.533,0.243,72.567,0.248,72.601,0.254 C73.881,0.254,74.451,0.984,74.451,1.764 C74.464,2.001,74.405,2.237,74.282,2.44 C74.159,2.644,73.977,2.805,73.761,2.904 L73.761,2.904 C74.029,3.005,74.257,3.193,74.409,3.436 C74.561,3.68,74.628,3.968,74.601,4.254 C74.601,5.064,74.121,6.014,72.531,6.014 C72.06,6.071,71.585,5.938,71.211,5.646 C70.837,5.353,70.595,4.924,70.538,4.453 C70.535,4.43,70.533,4.407,70.531,4.384 L71.701,4.384 C71.735,4.594,71.849,4.783,72.017,4.913 C72.186,5.043,72.399,5.104,72.611,5.084 C72.839,5.105,73.066,5.024,73.229,4.862 C73.391,4.699,73.473,4.472,73.451,4.244 C73.451,3.724,73.181,3.414,72.541,3.414 L72.031,3.414 L72.031,2.464 L72.481,2.464 C73.031,2.464,73.251,2.284,73.251,1.814 C73.251,1.344,73.031,1.174,72.551,1.174 C72.375,1.149,72.196,1.195,72.054,1.301 C71.912,1.408,71.818,1.567,71.793,1.743 L71.791,1.764 L70.601,1.784 Z"},{"c":"#000000","d":"M79.211,3.104 C79.211,4.634,78.731,6.014,77.071,6.014 C75.411,6.014,74.951,4.674,74.951,3.134 C74.951,1.594,75.501,0.254,77.101,0.254 C78.701,0.254,79.211,1.524,79.211,3.104 Z M76.211,3.104 C76.211,4.104,76.331,5.044,77.111,5.044 C77.891,5.044,77.981,4.184,77.981,3.104 C77.981,2.024,77.841,1.214,77.121,1.214 C76.401,1.214,76.191,1.924,76.191,3.114 L76.211,3.104 Z"},{"c":"#545454","d":"M61.681,7.714 L79.211,7.714 L79.211,11.284 L61.681,11.284 L61.681,7.714 Z"}]},"mission":{"w":1918.217,"h":205.457,"p":[{"c":"#1d1d1b","d":"M622.038,136.435 L630.077,79.268 L612.39,79.268 L613.73,69.889 L659.286,69.889 L657.946,79.268 L640.528,79.268 L632.578,136.435 L622.038,136.435 L622.038,136.435 Z"},{"c":"#1d1d1b","d":"M657.945,136.435 L667.234,69.889 L677.685,69.889 L673.577,99.187 L704.393,99.187 L708.502,69.889 L719.043,69.889 L709.753,136.435 L699.213,136.435 L703.142,108.566 L672.326,108.566 L668.395,136.435 L657.945,136.435 L657.945,136.435 Z"},{"c":"#1d1d1b","d":"M723.598,136.435 L732.887,69.889 L776.655,69.889 L775.405,79.268 L742.087,79.268 L739.407,98.384 L770.939,98.384 L769.598,107.763 L738.067,107.763 L735.388,127.056 L768.706,127.056 L767.366,136.435 L723.598,136.435 L723.598,136.435 Z"},{"c":"#1d1d1b","d":"M802.911,136.435 L812.2,69.889 L822.026,69.889 L842.034,105.172 L835.871,104.904 L866.42,69.889 L876.514,69.889 L867.223,136.435 L856.683,136.435 L864.186,82.573 L867.581,83.734 L838.193,117.678 L837.122,117.678 L817.024,81.859 L820.865,82.573 L813.361,136.435 L802.911,136.435 L802.911,136.435 Z"},{"c":"#1d1d1b","d":"M881.069,136.435 L890.358,69.889 L900.809,69.889 L891.519,136.435 L881.069,136.435 L881.069,136.435 Z"},{"c":"#1d1d1b","d":"M930.464,137.507 C926.116,137.507,922.171,136.733,918.629,135.185 C915.085,133.637,912.108,131.478,909.696,128.709 C907.284,125.94,905.661,122.71,904.828,119.017 L913.939,115.712 C915.069,119.702,917.11,122.784,920.057,124.957 C923.006,127.132,926.503,128.218,930.554,128.218 C933.233,128.218,935.524,127.771,937.431,126.878 C939.336,125.985,940.81,124.779,941.852,123.26 C942.893,121.742,943.416,120.031,943.416,118.124 C943.416,116.1,942.805,114.403,941.585,113.033 C940.363,111.663,938.503,110.592,936.002,109.817 L924.301,106.065 C919.774,104.577,916.365,102.374,914.073,99.455 C911.78,96.538,910.634,93.055,910.634,89.004 C910.634,85.253,911.616,81.859,913.582,78.822 C915.547,75.784,918.256,73.359,921.71,71.542 C925.163,69.726,929.094,68.817,933.501,68.817 C937.55,68.817,941.196,69.532,944.443,70.961 C947.688,72.39,950.383,74.355,952.527,76.856 C954.671,79.357,956.129,82.216,956.903,85.431 L947.882,88.737 C946.929,85.402,945.172,82.783,942.612,80.876 C940.051,78.971,936.954,78.017,933.322,78.017 C930.88,78.017,928.736,78.451,926.89,79.313 C925.045,80.177,923.615,81.353,922.603,82.841 C921.59,84.33,921.085,86.087,921.085,88.111 C921.085,90.137,921.695,91.878,922.916,93.337 C924.136,94.797,926.056,95.972,928.678,96.865 L939.485,100.438 C944.309,101.987,947.927,104.189,950.339,107.048 C952.75,109.906,953.956,113.361,953.956,117.409 C953.956,121.042,952.942,124.392,950.919,127.458 C948.893,130.526,946.125,132.967,942.612,134.783 C939.098,136.598,935.049,137.507,930.464,137.507 L930.464,137.507 Z"},{"c":"#1d1d1b","d":"M988.434,137.507 C984.087,137.507,980.141,136.733,976.599,135.185 C973.056,133.637,970.079,131.478,967.667,128.709 C965.255,125.94,963.632,122.71,962.799,119.017 L971.91,115.712 C973.04,119.702,975.081,122.784,978.028,124.957 C980.976,127.132,984.473,128.218,988.524,128.218 C991.204,128.218,993.495,127.771,995.402,126.878 C997.306,125.985,998.781,124.779,999.823,123.26 C1000.864,121.742,1001.387,120.031,1001.387,118.124 C1001.387,116.1,1000.775,114.403,999.556,113.033 C998.334,111.663,996.473,110.592,993.973,109.817 L982.271,106.065 C977.745,104.577,974.336,102.374,972.044,99.455 C969.751,96.538,968.604,93.055,968.604,89.004 C968.604,85.253,969.587,81.859,971.553,78.822 C973.517,75.784,976.226,73.359,979.681,71.542 C983.134,69.726,987.064,68.817,991.472,68.817 C995.52,68.817,999.167,69.532,1002.414,70.961 C1005.659,72.39,1008.353,74.355,1010.498,76.856 C1012.641,79.357,1014.099,82.216,1014.874,85.431 L1005.852,88.737 C1004.899,85.402,1003.142,82.783,1000.583,80.876 C998.021,78.971,994.925,78.017,991.293,78.017 C988.85,78.017,986.707,78.451,984.861,79.313 C983.015,80.177,981.586,81.353,980.574,82.841 C979.56,84.33,979.056,86.087,979.056,88.111 C979.056,90.137,979.666,91.878,980.887,93.337 C982.106,94.797,984.027,95.972,986.648,96.865 L997.456,100.438 C1002.28,101.987,1005.897,104.189,1008.309,107.048 C1010.721,109.906,1011.927,113.361,1011.927,117.409 C1011.927,121.042,1010.913,124.392,1008.89,127.458 C1006.864,130.526,1004.096,132.967,1000.583,134.783 C997.068,136.598,993.019,137.507,988.434,137.507 L988.434,137.507 Z"},{"c":"#1d1d1b","d":"M1021.305,136.435 L1030.594,69.889 L1041.045,69.889 L1031.755,136.435 L1021.305,136.435 L1021.305,136.435 Z"},{"c":"#1d1d1b","d":"M1080.614,137.507 C1076.028,137.507,1071.771,136.717,1067.841,135.14 C1063.911,133.563,1060.485,131.344,1057.568,128.486 C1054.65,125.627,1052.373,122.233,1050.735,118.303 C1049.097,114.372,1048.279,110.085,1048.279,105.44 C1048.279,100.319,1049.201,95.54,1051.048,91.103 C1052.893,86.668,1055.47,82.783,1058.774,79.447 C1062.079,76.113,1065.934,73.507,1070.342,71.631 C1074.748,69.755,1079.542,68.817,1084.723,68.817 C1089.368,68.817,1093.655,69.607,1097.586,71.184 C1101.515,72.763,1104.939,74.981,1107.858,77.839 C1110.775,80.697,1113.039,84.077,1114.646,87.977 C1116.255,91.878,1117.058,96.15,1117.058,100.795 C1117.058,105.917,1116.135,110.696,1114.289,115.132 C1112.442,119.569,1109.852,123.47,1106.518,126.833 C1103.182,130.198,1099.312,132.818,1094.906,134.694 C1090.498,136.569,1085.735,137.507,1080.614,137.507 L1080.614,137.507 Z M1080.703,127.86 C1084.335,127.86,1087.729,127.161,1090.887,125.761 C1094.042,124.363,1096.796,122.427,1099.149,119.955 C1101.501,117.485,1103.332,114.626,1104.642,111.38 C1105.951,108.135,1106.607,104.636,1106.607,100.885 C1106.607,96.538,1105.683,92.682,1103.839,89.317 C1101.992,85.953,1099.431,83.288,1096.156,81.323 C1092.881,79.357,1089.069,78.375,1084.723,78.375 C1081.03,78.375,1077.622,79.076,1074.495,80.474 C1071.369,81.874,1068.63,83.81,1066.277,86.28 C1063.925,88.752,1062.094,91.61,1060.784,94.855 C1059.473,98.101,1058.819,101.599,1058.819,105.351 C1058.819,109.638,1059.742,113.479,1061.588,116.873 C1063.433,120.268,1065.994,122.948,1069.27,124.912 C1072.544,126.878,1076.356,127.86,1080.703,127.86 L1080.703,127.86 Z"},{"c":"#1d1d1b","d":"M1124.382,136.435 L1133.671,69.889 L1142.067,69.889 L1171.634,121.429 L1168.06,122.054 L1175.386,69.889 L1185.926,69.889 L1176.636,136.435 L1168.15,136.435 L1138.941,84.538 L1142.157,83.824 L1134.832,136.435 L1124.382,136.435 L1124.382,136.435 Z"},{"c":"#1d1d1b","d":"M1211.111,136.435 L1220.4,69.889 L1230.851,69.889 L1221.561,136.435 L1211.111,136.435 L1211.111,136.435 Z"},{"c":"#1d1d1b","d":"M1260.506,137.507 C1256.158,137.507,1252.213,136.733,1248.671,135.185 C1245.127,133.637,1242.15,131.478,1239.738,128.709 C1237.326,125.94,1235.703,122.71,1234.87,119.017 L1243.981,115.712 C1245.111,119.702,1247.152,122.784,1250.099,124.957 C1253.048,127.132,1256.545,128.218,1260.596,128.218 C1263.275,128.218,1265.566,127.771,1267.473,126.878 C1269.378,125.985,1270.852,124.779,1271.894,123.26 C1272.935,121.742,1273.458,120.031,1273.458,118.124 C1273.458,116.1,1272.847,114.403,1271.627,113.033 C1270.405,111.663,1268.545,110.592,1266.044,109.817 L1254.343,106.065 C1249.816,104.577,1246.407,102.374,1244.115,99.455 C1241.822,96.538,1240.676,93.055,1240.676,89.004 C1240.676,85.253,1241.658,81.859,1243.624,78.822 C1245.589,75.784,1248.298,73.359,1251.752,71.542 C1255.205,69.726,1259.136,68.817,1263.543,68.817 C1267.592,68.817,1271.238,69.532,1274.485,70.961 C1277.73,72.39,1280.425,74.355,1282.569,76.856 C1284.713,79.357,1286.171,82.216,1286.945,85.431 L1277.924,88.737 C1276.971,85.402,1275.214,82.783,1272.654,80.876 C1270.093,78.971,1266.996,78.017,1263.364,78.017 C1260.922,78.017,1258.778,78.451,1256.932,79.313 C1255.087,80.177,1253.657,81.353,1252.645,82.841 C1251.632,84.33,1251.127,86.087,1251.127,88.111 C1251.127,90.137,1251.737,91.878,1252.958,93.337 C1254.178,94.797,1256.098,95.972,1258.72,96.865 L1269.527,100.438 C1274.351,101.987,1277.969,104.189,1280.381,107.048 C1282.792,109.906,1283.998,113.361,1283.998,117.409 C1283.998,121.042,1282.984,124.392,1280.961,127.458 C1278.935,130.526,1276.167,132.967,1272.654,134.783 C1269.14,136.598,1265.091,137.507,1260.506,137.507 L1260.506,137.507 Z"},{"c":"#1d1d1b","d":"M1315.007,136.435 L1324.296,69.889 L1332.692,69.889 L1362.259,121.429 L1358.685,122.054 L1366.011,69.889 L1376.551,69.889 L1367.261,136.435 L1358.775,136.435 L1329.566,84.538 L1332.782,83.824 L1325.457,136.435 L1315.007,136.435 L1315.007,136.435 Z"},{"c":"#1d1d1b","d":"M1416.12,137.507 C1411.534,137.507,1407.277,136.717,1403.347,135.14 C1399.417,133.563,1395.991,131.344,1393.074,128.486 C1390.156,125.627,1387.879,122.233,1386.241,118.303 C1384.602,114.372,1383.785,110.085,1383.785,105.44 C1383.785,100.319,1384.707,95.54,1386.554,91.103 C1388.399,86.668,1390.975,82.783,1394.28,79.447 C1397.585,76.113,1401.44,73.507,1405.848,71.631 C1410.254,69.755,1415.048,68.817,1420.228,68.817 C1424.874,68.817,1429.161,69.607,1433.092,71.184 C1437.021,72.763,1440.445,74.981,1443.364,77.839 C1446.281,80.697,1448.545,84.077,1450.152,87.977 C1451.761,91.878,1452.564,96.15,1452.564,100.795 C1452.564,105.917,1451.64,110.696,1449.795,115.132 C1447.948,119.569,1445.358,123.47,1442.024,126.833 C1438.688,130.198,1434.818,132.818,1430.412,134.694 C1426.004,136.569,1421.241,137.507,1416.12,137.507 L1416.12,137.507 Z M1416.209,127.86 C1419.841,127.86,1423.235,127.161,1426.392,125.761 C1429.548,124.363,1432.302,122.427,1434.655,119.955 C1437.007,117.485,1438.838,114.626,1440.148,111.38 C1441.457,108.135,1442.113,104.636,1442.113,100.885 C1442.113,96.538,1441.189,92.682,1439.345,89.317 C1437.498,85.953,1434.936,83.288,1431.662,81.323 C1428.387,79.357,1424.575,78.375,1420.228,78.375 C1416.536,78.375,1413.128,79.076,1410.001,80.474 C1406.875,81.874,1404.136,83.81,1401.783,86.28 C1399.431,88.752,1397.599,91.61,1396.29,94.855 C1394.979,98.101,1394.325,101.599,1394.325,105.351 C1394.325,109.638,1395.248,113.479,1397.094,116.873 C1398.939,120.268,1401.5,122.948,1404.776,124.912 C1408.05,126.878,1411.862,127.86,1416.209,127.86 L1416.209,127.86 Z"},{"c":"#1d1d1b","d":"M1481.518,136.435 L1490.807,69.889 L1534.576,69.889 L1533.326,79.268 L1500.008,79.268 L1497.328,98.384 L1528.86,98.384 L1527.519,107.763 L1495.988,107.763 L1493.308,127.056 L1526.627,127.056 L1525.287,136.435 L1481.518,136.435 L1481.518,136.435 Z"},{"c":"#1d1d1b","d":"M1535.202,136.435 L1544.491,69.889 L1554.317,69.889 L1574.325,105.172 L1568.162,104.904 L1598.711,69.889 L1608.805,69.889 L1599.514,136.435 L1588.974,136.435 L1596.477,82.573 L1599.872,83.734 L1570.484,117.678 L1569.413,117.678 L1549.315,81.859 L1553.156,82.573 L1545.652,136.435 L1535.202,136.435 L1535.202,136.435 Z"},{"c":"#1d1d1b","d":"M1613.36,136.435 L1622.649,69.889 L1633.1,69.889 L1623.81,136.435 L1613.36,136.435 L1613.36,136.435 Z"},{"c":"#1d1d1b","d":"M1662.755,137.507 C1658.407,137.507,1654.462,136.733,1650.92,135.185 C1647.376,133.637,1644.399,131.478,1641.987,128.709 C1639.575,125.94,1637.952,122.71,1637.119,119.017 L1646.23,115.712 C1647.36,119.702,1649.401,122.784,1652.348,124.957 C1655.297,127.132,1658.794,128.218,1662.845,128.218 C1665.524,128.218,1667.815,127.771,1669.723,126.878 C1671.627,125.985,1673.101,124.779,1674.143,123.26 C1675.184,121.742,1675.707,120.031,1675.707,118.124 C1675.707,116.1,1675.096,114.403,1673.876,113.033 C1672.654,111.663,1670.794,110.592,1668.293,109.817 L1656.592,106.065 C1652.065,104.577,1648.656,102.374,1646.364,99.455 C1644.071,96.538,1642.925,93.055,1642.925,89.004 C1642.925,85.253,1643.907,81.859,1645.873,78.822 C1647.838,75.784,1650.547,73.359,1654.001,71.542 C1657.454,69.726,1661.385,68.817,1665.792,68.817 C1669.841,68.817,1673.487,69.532,1676.734,70.961 C1679.979,72.39,1682.674,74.355,1684.818,76.856 C1686.962,79.357,1688.42,82.216,1689.194,85.431 L1680.173,88.737 C1679.22,85.402,1677.463,82.783,1674.903,80.876 C1672.342,78.971,1669.245,78.017,1665.613,78.017 C1663.171,78.017,1661.027,78.451,1659.182,79.313 C1657.336,80.177,1655.906,81.353,1654.894,82.841 C1653.881,84.33,1653.376,86.087,1653.376,88.111 C1653.376,90.137,1653.986,91.878,1655.207,93.337 C1656.427,94.797,1658.348,95.972,1660.969,96.865 L1671.776,100.438 C1676.6,101.987,1680.218,104.189,1682.63,107.048 C1685.041,109.906,1686.247,113.361,1686.247,117.409 C1686.247,121.042,1685.233,124.392,1683.21,127.458 C1681.184,130.526,1678.416,132.967,1674.903,134.783 C1671.389,136.598,1667.34,137.507,1662.755,137.507 L1662.755,137.507 Z"},{"c":"#1d1d1b","d":"M1720.724,137.507 C1716.377,137.507,1712.431,136.733,1708.889,135.185 C1705.346,133.637,1702.369,131.478,1699.957,128.709 C1697.545,125.94,1695.922,122.71,1695.089,119.017 L1704.2,115.712 C1705.33,119.702,1707.371,122.784,1710.318,124.957 C1713.266,127.132,1716.764,128.218,1720.814,128.218 C1723.494,128.218,1725.785,127.771,1727.692,126.878 C1729.597,125.985,1731.071,124.779,1732.113,123.26 C1733.154,121.742,1733.677,120.031,1733.677,118.124 C1733.677,116.1,1733.065,114.403,1731.846,113.033 C1730.624,111.663,1728.764,110.592,1726.263,109.817 L1714.561,106.065 C1710.035,104.577,1706.626,102.374,1704.334,99.455 C1702.041,96.538,1700.894,93.055,1700.894,89.004 C1700.894,85.253,1701.877,81.859,1703.843,78.822 C1705.807,75.784,1708.516,73.359,1711.971,71.542 C1715.424,69.726,1719.354,68.817,1723.762,68.817 C1727.81,68.817,1731.457,69.532,1734.704,70.961 C1737.949,72.39,1740.643,74.355,1742.788,76.856 C1744.931,79.357,1746.389,82.216,1747.164,85.431 L1738.142,88.737 C1737.189,85.402,1735.432,82.783,1732.873,80.876 C1730.311,78.971,1727.215,78.017,1723.583,78.017 C1721.14,78.017,1718.997,78.451,1717.151,79.313 C1715.306,80.177,1713.876,81.353,1712.864,82.841 C1711.85,84.33,1711.346,86.087,1711.346,88.111 C1711.346,90.137,1711.956,91.878,1713.177,93.337 C1714.396,94.797,1716.317,95.972,1718.938,96.865 L1729.746,100.438 C1734.57,101.987,1738.187,104.189,1740.599,107.048 C1743.011,109.906,1744.217,113.361,1744.217,117.409 C1744.217,121.042,1743.203,124.392,1741.18,127.458 C1739.154,130.526,1736.386,132.967,1732.873,134.783 C1729.358,136.598,1725.309,137.507,1720.724,137.507 L1720.724,137.507 Z"},{"c":"#1d1d1b","d":"M1753.595,136.435 L1762.884,69.889 L1773.335,69.889 L1764.045,136.435 L1753.595,136.435 L1753.595,136.435 Z"},{"c":"#1d1d1b","d":"M1812.905,137.507 C1808.319,137.507,1804.062,136.717,1800.132,135.14 C1796.202,133.563,1792.776,131.344,1789.859,128.486 C1786.941,125.627,1784.664,122.233,1783.026,118.303 C1781.388,114.372,1780.57,110.085,1780.57,105.44 C1780.57,100.319,1781.492,95.54,1783.339,91.103 C1785.184,86.668,1787.761,82.783,1791.065,79.447 C1794.37,76.113,1798.225,73.507,1802.633,71.631 C1807.039,69.755,1811.833,68.817,1817.014,68.817 C1821.659,68.817,1825.946,69.607,1829.877,71.184 C1833.806,72.763,1837.23,74.981,1840.149,77.839 C1843.066,80.697,1845.33,84.077,1846.937,87.977 C1848.546,91.878,1849.349,96.15,1849.349,100.795 C1849.349,105.917,1848.426,110.696,1846.58,115.132 C1844.733,119.569,1842.143,123.47,1838.809,126.833 C1835.473,130.198,1831.603,132.818,1827.197,134.694 C1822.789,136.569,1818.026,137.507,1812.905,137.507 L1812.905,137.507 Z M1812.994,127.86 C1816.626,127.86,1820.02,127.161,1823.178,125.761 C1826.333,124.363,1829.087,122.427,1831.44,119.955 C1833.792,117.485,1835.623,114.626,1836.933,111.38 C1838.242,108.135,1838.898,104.636,1838.898,100.885 C1838.898,96.538,1837.974,92.682,1836.13,89.317 C1834.283,85.953,1831.722,83.288,1828.447,81.323 C1825.172,79.357,1821.36,78.375,1817.014,78.375 C1813.321,78.375,1809.913,79.076,1806.786,80.474 C1803.66,81.874,1800.921,83.81,1798.568,86.28 C1796.216,88.752,1794.385,91.61,1793.075,94.855 C1791.764,98.101,1791.11,101.599,1791.11,105.351 C1791.11,109.638,1792.033,113.479,1793.879,116.873 C1795.724,120.268,1798.285,122.948,1801.561,124.912 C1804.835,126.878,1808.647,127.86,1812.994,127.86 L1812.994,127.86 Z"},{"c":"#1d1d1b","d":"M1856.673,136.435 L1865.962,69.889 L1874.358,69.889 L1903.925,121.429 L1900.351,122.054 L1907.677,69.889 L1918.217,69.889 L1908.927,136.435 L1900.441,136.435 L1871.232,84.538 L1874.448,83.824 L1867.123,136.435 L1856.673,136.435 L1856.673,136.435 Z"}],"s":[[0.0,3.142,"08519c"],[3.142,15.676,"4292c6"],[18.818,3.142,"2171b5"],[21.961,3.142,"08519c"],[25.103,3.142,"2171b5"],[28.245,3.142,"4292c6"],[31.388,3.142,"2171b5"],[34.53,3.142,"08519c"],[37.673,3.142,"08306b"],[40.815,3.142,"2171b5"],[43.958,3.106,"08519c"],[47.064,12.57,"2171b5"],[59.633,3.142,"4292c6"],[62.776,6.285,"2171b5"],[69.061,6.285,"4292c6"],[75.345,9.391,"2171b5"],[84.736,3.142,"9ecae1"],[87.879,3.142,"c6dbef"],[91.021,6.285,"4292c6"],[97.306,3.142,"6baed6"],[100.448,3.142,"4292c6"],[103.591,3.142,"2171b5"],[106.733,6.248,"08519c"],[112.982,3.142,"2171b5"],[116.124,3.142,"08519c"],[119.267,3.142,"2171b5"],[122.409,3.142,"4292c6"],[125.551,3.142,"08519c"],[128.694,3.142,"2171b5"],[131.836,12.533,"08519c"],[144.37,6.285,"4292c6"],[150.654,3.142,"08519c"],[153.797,3.142,"2171b5"],[156.939,6.285,"4292c6"],[163.224,3.142,"08519c"],[166.367,6.248,"08306b"],[172.615,3.142,"2171b5"],[175.757,3.142,"4292c6"],[178.9,6.285,"08519c"],[185.185,3.142,"08306b"],[188.327,3.142,"08519c"],[191.47,3.142,"08306b"],[194.612,6.248,"08519c"],[200.86,3.142,"4292c6"],[204.003,3.142,"6baed6"],[207.145,3.142,"2171b5"],[210.288,3.142,"08306b"],[213.43,3.142,"08519c"],[216.573,3.142,"2171b5"],[219.715,6.285,"4292c6"],[226.0,3.142,"2171b5"],[229.142,9.391,"4292c6"],[238.533,3.142,"9ecae1"],[241.676,3.142,"4292c6"],[244.818,3.142,"6baed6"],[247.96,3.142,"2171b5"],[251.103,3.142,"6baed6"],[254.245,3.142,"9ecae1"],[257.388,3.142,"6baed6"],[260.53,3.106,"2171b5"],[263.636,9.427,"6baed6"],[273.063,6.285,"c6dbef"],[279.348,3.142,"9ecae1"],[282.491,12.533,"c6dbef"],[295.024,3.142,"deebf7"],[298.166,3.142,"c6dbef"],[301.309,6.285,"9ecae1"],[307.594,6.285,"6baed6"],[313.879,3.142,"4292c6"],[317.021,3.142,"9ecae1"],[320.163,6.248,"c6dbef"],[326.412,3.142,"9ecae1"],[329.554,3.142,"6baed6"],[332.697,3.142,"4292c6"],[335.839,3.142,"9ecae1"],[338.982,3.142,"c6dbef"],[342.124,6.285,"9ecae1"],[348.409,3.142,"c6dbef"],[351.551,6.248,"9ecae1"],[357.8,3.142,"4292c6"],[360.942,6.285,"6baed6"],[367.227,3.142,"9ecae1"],[370.369,3.142,"6baed6"],[373.512,6.285,"9ecae1"],[379.797,3.142,"6baed6"],[382.939,3.106,"9ecae1"],[386.045,3.142,"c6dbef"],[389.188,3.142,"6baed6"],[392.33,3.142,"9ecae1"],[395.472,3.142,"6baed6"],[398.615,3.142,"deebf7"],[401.757,3.142,"c6dbef"],[404.9,3.142,"deebf7"],[408.042,6.248,"fee0d2"],[414.291,3.142,"c6dbef"],[417.433,3.142,"fee0d2"],[420.575,6.285,"c6dbef"],[426.86,3.142,"deebf7"],[430.003,3.142,"fee0d2"],[433.145,3.142,"fcbba1"],[436.288,3.142,"deebf7"],[439.43,6.248,"fcbba1"],[445.678,6.285,"deebf7"],[451.963,3.142,"fee0d2"],[455.106,3.142,"fcbba1"],[458.248,3.142,"fee0d2"],[461.391,3.142,"fc9272"],[464.533,3.142,"fb6a4a"],[467.675,6.285,"fcbba1"],[473.96,9.391,"fb6a4a"],[483.351,3.142,"fc9272"],[486.494,3.142,"ef3b2c"],[489.636,3.142,"fb6a4a"],[492.778,3.142,"ef3b2c"],[495.921,3.142,"fc9272"],[499.063,6.285,"ef3b2c"],[505.348,6.248,"fb6a4a"],[511.597,6.285,"ef3b2c"],[517.881,3.142,"a50f15"],[521.024,3.142,"67000d"],[524.166,3.142,"a50f15"],[527.309,3.142,"cb181d"],[530.451,6.285,"67000d"],[536.736,3.106,"cb181d"],[539.842,3.142,"a50f15"],[542.984,9.427,"440007"]],"sy":0,"sh":205.457}};

/* =====================================================================
   PDF-ANGEBOT · Markendesign
   Schrift: Satoshi (Bold Überschriften, Medium Kennzahlen/Tabellen,
   Light Fließtext, Italic Anmerkungen) · Logos als Vektor · A4 hoch
   Farben: Master-Briefing v1 (ink, field, line, ok, cut, flare)
   ===================================================================== */
var PDF = (function () {
  var JS = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', ldJs, ldF;
  function script(src) {
    return new Promise(function (ok, no) {
      var s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = ok; s.onerror = function () { no(new Error('Laden fehlgeschlagen: ' + src)); }; document.head.appendChild(s);
    });
  }
  function lib() {
    if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
    return ldJs || (ldJs = script(JS).then(function () { if (!window.jspdf) throw new Error('jsPDF nicht verfügbar'); return window.jspdf.jsPDF; }, function (e) { ldJs = null; throw new Error('Die PDF-Bibliothek konnte nicht geladen werden. Bitte Internetverbindung prüfen.'); }));
  }
  function fonts(url) {
    if (window.KEGW_PDF_FONTS) return Promise.resolve(window.KEGW_PDF_FONTS);
    if (!url) return Promise.resolve(null);
    return ldF || (ldF = script(url).then(function () { return window.KEGW_PDF_FONTS || null; }, function () { console.warn('[KEGW] Satoshi für PDF nicht geladen, Ersatzschrift aktiv.'); return null; }));
  }

  /* Farben */
  var K = {
    ink: [20, 18, 15], t1: [51, 47, 40], t2: [65, 60, 52], note: [111, 105, 93], mu: [139, 133, 121], mark: [197, 192, 182],
    ln: [228, 223, 213], fd: [245, 242, 235], bg: [251, 248, 242], wh: [255, 255, 255],
    ok: [90, 114, 71], ok2: [126, 154, 98], ok3: [163, 184, 140], okb: [230, 237, 221],
    cut: [217, 84, 28], fl: [255, 176, 58], flb: [255, 241, 214], flt: [138, 90, 10], wi: [63, 168, 190]
  };
  var nf = function (d) { return new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }); };
  var F0 = nf(0), F1 = nf(1), F2 = nf(2);
  var e2 = function (v) { return F2.format(v) + ' €'; }, e0 = function (v) { return F0.format(Math.round(v)) + ' €'; };
  var ph = function (v) { return !v || /^\[.*\]$/.test(String(v).trim()); };
  var dstr = function (d) { return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear(); };

  function make(o) {
    var C = o.C, P = C.pdf || {};
    return Promise.all([lib(), fonts(P.fontsUrl)]).then(function (res) { return render(res[0], res[1], o); });
  }

  function render(jsPDF, FONTS, o) {
    var C = o.C, r = o.r, wp = o.typ === 'wp', k = o.kunde, fi = C.firma, P = C.pdf || {};
    var d = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    var W = 210, H = 297, L = 18, R = 192, CW = R - L, FT = 276; // FT = Oberkante Fußzeile
    var SAT = !!FONTS;
    if (SAT) ['bold', 'medium', 'light', 'italic'].forEach(function (s) { d.addFileToVFS('Satoshi-' + s + '.ttf', FONTS[s]); d.addFont('Satoshi-' + s + '.ttf', 'Satoshi', s); });
    var HV = { bold: 'bold', medium: 'bold', light: 'normal', italic: 'italic' };
    var clean = SAT ? function (s) { return String(s == null ? '' : s).replace(/[  ]/g, ' '); }
      : function (s) { return String(s == null ? '' : s).replace(/−/g, '-').replace(/→/g, '->').replace(/₂/g, '2').replace(/m²/g, 'qm').replace(/[  ]/g, ' ').replace(/[^\x00-\xFF€–—‚„“”‘’•…]/g, ''); };

    /* --- Grundfunktionen --- */
    var col = function (c) { d.setTextColor(c[0], c[1], c[2]); }, fill = function (c) { d.setFillColor(c[0], c[1], c[2]); }, draw = function (c) { d.setDrawColor(c[0], c[1], c[2]); };
    function font(st, sz, c) { d.setFont(SAT ? 'Satoshi' : 'helvetica', SAT ? st : HV[st]); d.setFontSize(sz); col(c || K.ink); }
    function tw(s, st, sz, cs) { font(st, sz); s = clean(s); return d.getTextWidth(s) + (cs || 0) * Math.max(0, s.length - 1); }
    function T(s, x, y, st, sz, c, al, cs) {
      s = clean(s); font(st, sz, c); var w = d.getTextWidth(s) + (cs || 0) * Math.max(0, s.length - 1);
      var xx = al === 'right' ? x - w : al === 'center' ? x - w / 2 : x;
      d.text(s, xx, y, cs ? { charSpace: cs } : {}); return w;
    }
    function eb(s, x, y, c, al, sz) { return T(String(s).toUpperCase(), x, y, 'medium', sz || 6.6, c || K.mu, al, .42); }
    function lines(s, w, st, sz) { font(st, sz); return d.splitTextToSize(clean(s), w); }
    function para(s, x, y, w, st, sz, c, lh) { var ls = lines(s, w, st, sz); font(st, sz, c); lh = lh || sz * .43; ls.forEach(function (l, i) { d.text(l, x, y + i * lh); }); return ls.length * lh; }
    function rect(x, y, w, h, c, rr) { fill(c); if (rr) d.roundedRect(x, y, w, h, rr, rr, 'F'); else d.rect(x, y, w, h, 'F'); }
    function hl(x1, y1, x2, c, lw) { draw(c || K.ln); d.setLineWidth(lw || .25); d.line(x1, y1, x2, y1); }
    function vl(x, y1, y2, c, lw) { draw(c || K.ln); d.setLineWidth(lw || .25); d.line(x, y1, x, y2); }
    function marks(x, y, w, h) { draw(K.mark); d.setLineWidth(.25); var m = 3.2, i = 2.4; d.line(x + i, y + i, x + i + m, y + i); d.line(x + i, y + i, x + i, y + i + m); d.line(x + w - i, y + h - i, x + w - i - m, y + h - i); d.line(x + w - i, y + h - i, x + w - i, y + h - i - m); }
    function mod(x, y, w, h, c) { rect(x, y, w, h, c || K.wh, 1.3); draw(K.ln); d.setLineWidth(.25); d.roundedRect(x, y, w, h, 1.3, 1.3, 'S'); marks(x, y, w, h); }
    function hatch(x, y, w, h, c, step) {
      draw(c); d.setLineWidth(.45); step = step || 1.6;
      for (var kk = -h; kk < w; kk += step) { var t0 = Math.max(0, -kk), t1 = Math.min(h, w - kk); if (t1 > t0) d.line(x + kk + t0, y + h - t0, x + kk + t1, y + h - t1); }
    }
    function logo(name, x, y, h) {
      if (typeof LOGOS === 'undefined' || !LOGOS[name] || !d.moveTo) return 0;
      var Lg = LOGOS[name], s = h / Lg.h;
      (Lg.s || []).forEach(function (st) { var hx0 = parseInt(st[2], 16); d.setFillColor(hx0 >> 16, hx0 >> 8 & 255, hx0 & 255); d.rect(x + st[0] * s, y + Lg.sy * s, st[1] * s + .02, Lg.sh * s, 'F'); });
      Lg.p.forEach(function (p) {
        var hx = parseInt(p.c.slice(1), 16); d.setFillColor(hx >> 16, hx >> 8 & 255, hx & 255);
        p.d.split(' ').forEach(function (tk) {
          var t = tk[0], v = tk.slice(1).split(',').map(Number);
          if (t === 'M') d.moveTo(x + v[0] * s, y + v[1] * s);
          else if (t === 'L') d.lineTo(x + v[0] * s, y + v[1] * s);
          else if (t === 'C') d.curveTo(x + v[0] * s, y + v[1] * s, x + v[2] * s, y + v[3] * s, x + v[4] * s, y + v[5] * s);
          else if (t === 'Z') d.close();
        });
        d.fillEvenOdd();
      });
      return Lg.w * s;
    }
    function check(x, yy) { draw(K.ok); d.setLineWidth(.55); d.line(x, yy, x + 1.1, yy + 1.2); d.line(x + 1.1, yy + 1.2, x + 3, yy - 1.3); }
    function bar(x, y, w, h, segs) { // Segmente [Wert, Farbe, Text, Textfarbe]
      var tot = segs.reduce(function (a, s) { return a + s[0]; }, 0), xx = x;
      rect(x, y, w, h, K.fd, 1);
      segs.forEach(function (s, i) {
        var sw = w * s[0] / tot; if (sw <= 0) return;
        fill(s[1]); d.rect(xx, y, sw, h, 'F');
        if (s[2] && sw > tw(s[2], 'medium', 6.4, .3) + 4) eb(s[2], xx + 2, y + h / 2 + 1.1, s[3] || K.wh, null, 6.4);
        xx += sw;
      });
    }

    /* --- Daten --- */
    var gueltig = new Date(o.datum.getTime() + C.angebot.gueltigTage * 864e5);
    var T1 = r.tech, B = r.betrieb, fo = r.foe, w = o.S.wp, E = o.S.e;
    var produkt = wp ? 'Luft-Wasser-Wärmepumpe ' + T1.groesse + ' kW' : (T1.raeume.length > 1 ? 'Multisplit-Klimaanlage' : 'Split-Klimaanlage');
    var nm = ({ gas: 'Gas', oel: 'Öl', lpg: 'Flüssiggas' })[w.alt];
    d.setProperties({ title: clean('Angebot ' + o.nr + ' · ' + produkt), subject: clean('Angebot ' + produkt), author: clean(fi.name), creator: clean(fi.name + ' Angebotsrechner') });

    var page = 1, y = 0;
    function pageBg() { rect(0, 0, W, H, K.bg); }
    function head() {
      logo('mission', L, 10.6, 4.2);
      eb('Angebot ' + o.nr, R, 14, K.mu, 'right');
      hl(L, 17.5, R); y = 27;
    }
    function newPage() { d.addPage(); page++; pageBg(); head(); }
    function need(h) { if (y + h > FT - 4) newPage(); }
    function chapter(n, label, title, accent) {
      need(26);
      eb((n ? n + ' · ' : '') + label, L, y, K.cut); y += 7.5;
      var parts = accent ? title.split(accent) : [title], x = L;
      if (accent && parts.length === 2) { x += T(parts[0], x, y, 'bold', 16); x += T(accent, x, y, 'bold', 16, K.ok); T(parts[1], x, y, 'bold', 16); }
      else T(title, L, y, 'bold', 16);
      y += 7;
    }

    /* =========================== SEITE 1 =========================== */
    pageBg();
    var my = 12, mh = 84; mod(L, my, CW, mh);
    // Tag
    var tag = 'Angebot · ' + (wp ? 'Wärmepumpe' : 'Klimaanlage'), tagw = tw(tag.toUpperCase(), 'medium', 6.4, .42) + 9;
    rect(L + 8, my + 7, tagw, 6, K.flb, .8); fill(K.fl); d.circle(L + 11.2, my + 10, .9, 'F'); eb(tag, L + 13.6, my + 11.2, K.flt, null, 6.4);
    // Wortmarke
    logo('mission', L + 8, my + 18.5, 8.6);
    T('Wärme und Kühle für Ihr Haus · ' + fi.name, L + 8, my + 33, 'light', 8.6, K.note);
    // Meta
    var meta = [['Angebot', o.nr], ['Datum', dstr(o.datum)], ['Gültig bis', dstr(gueltig)]];
    if (!ph(fi.ansprechpartner)) meta.push(['Ansprechpartner', fi.ansprechpartner]);
    meta.forEach(function (m, i) { var yy = my + 10 + i * 6; eb(m[0], R - 74, yy, K.mu, null, 6.2); T(m[1], R - 8, yy, 'medium', 8.6, K.ink, 'right'); if (i < meta.length - 1) hl(R - 74, yy + 2, R - 8, K.ln, .2); });
    hl(L, my + 40, R);
    // Anschrift
    var abs = [fi.name, ph(fi.strasse) ? '' : fi.strasse, ph(fi.ort) ? '' : ((ph(fi.plz) ? '' : fi.plz + ' ') + fi.ort)].filter(Boolean).join(' · ');
    T(abs, L + 8, my + 48, 'medium', 6.2, K.mu); hl(L + 8, my + 49.6, L + 92, K.ln, .2);
    var nameZ = ((k.anrede === 'Familie' ? 'Familie ' : k.anrede ? k.anrede + ' ' : '') + (k.vorname ? k.vorname + ' ' : '') + k.name).trim();
    T(nameZ, L + 8, my + 57, 'medium', 10.5); T(k.strasse, L + 8, my + 62.5, 'light', 10.5); T(k.plz + ' ' + k.ort, L + 8, my + 68, 'light', 10.5);
    // Objektfeld
    var ox = R - 70, oy = my + 45; rect(ox, oy, 62, 33, K.fd, 1);
    eb('Objekt', ox + 5, oy + 6.5, K.mu, null, 6.2);
    para(k.objekt || (k.strasse + ', ' + k.plz + ' ' + k.ort), ox + 5, oy + 11.5, 52, 'medium', 8.6, K.ink, 3.9);
    eb('Leistung', ox + 5, oy + 22.5, K.mu, null, 6.2);
    T(wp ? 'Heizung und Warmwasser' : 'Kühlen und Heizen im Raum', ox + 5, oy + 27.5, 'light', 8.6, K.t1);

    // Ergebnis-Headline
    y = my + mh + 14;
    eb('Ihr Ergebnis', L, y, K.cut); y += 9.5;
    var big = wp ? e0(r.eigen) : e0(r.brutto);
    if (wp) { T('Ihre Wärmepumpe ' + T1.groesse + ' kW:', L, y, 'bold', 23); y += 9.5; var bx = L + T(big, L, y, 'bold', 23, K.ok); T(' Eigenanteil.', bx, y, 'bold', 23); }
    else { T('Ihre Klimaanlage für ' + T1.raeume.length + (T1.raeume.length > 1 ? ' Räume:' : ' Raum:'), L, y, 'bold', 23); y += 9.5; var bx2 = L + T(big, L, y, 'bold', 23, K.ok); T(' komplett.', bx2, y, 'bold', 23); }
    y += 7;
    y += para(wp ? 'Kaufpreis ' + e0(r.brutto) + ' brutto inklusive Montage, Zählerschrank und Inbetriebnahme. Davon übernimmt die KfW nach heutigem Stand ' + e0(fo.zuschuss) + '.'
      : (T1.ags.length > 1 ? T1.ags.length + ' Außengeräte' : '1 Außengerät') + ' und ' + T1.raeume.length + ' Innengerät' + (T1.raeume.length > 1 ? 'e' : '') + ' mit zusammen ' + F1.format(T1.kwSumme) + ' kW. Inklusive Montage, ' + T1.meter + ' m Kältemittelleitung und Inbetriebnahme.', L, y, 150, 'light', 10.5, K.note, 4.7) + 5;

    // Kennzahlen
    var kp = wp ? [[e0(r.brutto), 'Kaufpreis brutto', 'inkl. 19 % USt.'], [e0(fo.zuschuss), 'KfW-Zuschuss', F0.format(fo.satz) + ' %, geschätzt', K.ok], [e0(r.eigen), 'Ihr Eigenanteil', 'nach Zuschuss', null, 1], [e0(B.spar), 'weniger Heizkosten', 'im ersten Jahr', K.ok]]
      : [[e0(r.brutto), 'Kaufpreis brutto', 'inkl. Montage', null, 1], [F1.format(T1.kwSumme) + ' kW', 'Kühlleistung', 'Innengeräte zusammen'], [F0.format(T1.flaeche) + ' m²', 'gekühlte Fläche', T1.raeume.length + (T1.raeume.length > 1 ? ' Räume' : ' Raum')], [e0(r.betrieb.kuehlKosten), 'Strom fürs Kühlen', 'pro Jahr, geschätzt', K.wi]];
    var kh = 25, cw4 = CW / 4; mod(L, y, CW, kh);
    kp.forEach(function (c, i) {
      var x = L + i * cw4;
      if (c[4]) { fill(K.ok); if (i === 0) d.roundedRect(x, y, cw4, kh, 1.3, 1.3, 'F'); else d.rect(x, y, cw4, kh, 'F'); }
      else if (i) vl(x, y, y + kh);
      var tc = c[4] ? K.wh : (c[3] || K.ink), sc = c[4] ? [230, 237, 221] : K.t2;
      T(c[0], x + 5, y + 10.5, 'medium', 15.5, tc);
      T(c[1], x + 5, y + 16.5, 'bold', 8.2, c[4] ? K.wh : K.ink); T(c[2], x + 5, y + 20.5, 'light', 7.6, sc);
    });
    y += kh + 7;
    if (wp) {
      var gr = Math.min(fo.zuschuss, fo.basis * fo.grund / 100), kg = Math.min(fo.zuschuss - gr, fo.basis * fo.kgb / 100), ek = Math.max(0, fo.zuschuss - gr - kg), rest = r.brutto - fo.zuschuss;
      eb('So verteilt sich der Kaufpreis', L, y, K.mu); y += 3;
      bar(L, y, CW, 6.5, [[gr, K.ok, 'Grundförderung'], [kg, K.ok2, 'Klimabonus'], [ek, K.ok3, 'Einkommen', K.ink], [rest, K.ink, 'Ihr Anteil']]); y += 10.5;
      var lx = L;[[K.ok, 'Grundförderung ' + e0(gr)], kg ? [K.ok2, 'Klimabonus ' + e0(kg)] : null, ek ? [K.ok3, 'Einkommensbonus ' + e0(ek)] : null, [K.ink, 'Ihr Eigenanteil ' + e0(rest)]].filter(Boolean).forEach(function (s) { rect(lx, y - 2.2, 2.4, 2.4, s[0], .4); lx += 4 + T(s[1], lx + 3.6, y, 'medium', 7.4, K.t2) + 5; });
      y += 9;
    }
    // Anschreiben
    var an = k.anrede === 'Frau' ? 'Sehr geehrte Frau ' + k.name + ',' : k.anrede === 'Herr' ? 'Sehr geehrter Herr ' + k.name + ',' : k.anrede === 'Familie' ? 'Sehr geehrte Familie ' + k.name + ',' : 'Guten Tag ' + ((k.vorname ? k.vorname + ' ' : '') + k.name) + ',';
    T(an, L, y, 'medium', 10); y += 6;
    y += para(wp ? 'vielen Dank für Ihr Interesse. Für Ihr Haus mit ' + F0.format(w.flaeche) + ' m² empfehlen wir eine Luft-Wasser-Wärmepumpe mit ' + T1.groesse + ' kW für Heizung und Warmwasser. Die Kalkulation ist herstellerneutral: Das Fabrikat wählen Sie im zweiten Schritt beim Vor-Ort-Termin, danach bestätigen wir den Festpreis.'
      : 'vielen Dank für Ihr Interesse. Für Ihre ' + T1.raeume.length + (T1.raeume.length > 1 ? ' Räume' : ' Raum') + ' empfehlen wir eine ' + (T1.raeume.length > 1 ? 'Multisplit-Klimaanlage' : 'Split-Klimaanlage') + ', die im Sommer kühlt und in der Übergangszeit heizt. Die Kalkulation ist herstellerneutral: Das Fabrikat wählen Sie im zweiten Schritt beim Vor-Ort-Termin, danach bestätigen wir den Festpreis.', L, y, CW, 'light', 9.6, K.t1, 4.4) + 6;
    // Im Preis enthalten
    var inkl = wp ? ['Wärmepumpe mit Speichern und Regelung', 'Heizlastberechnung nach DIN EN 12831', 'Hydraulischer Abgleich', 'Neuer Zählerschrank nach VDE-AR-N 4100', 'Montage, Rückbau und Entsorgung Altanlage', 'Inbetriebnahme und KfW-Antragsbegleitung']
      : ['Außen- und Innengeräte', 'Kältemittelleitung nach Metern', 'Kondensatableitung', 'Kernbohrungen und Konsole', 'Elektroanschluss', 'Inbetriebnahme und Einweisung'];
    var ih = 13 + Math.ceil(inkl.length / 2) * 6.2; need(ih + 2); rect(L, y, CW, ih, K.fd, 1.3);
    eb('Im Preis enthalten', L + 7, y + 7, K.mu);
    inkl.forEach(function (s, i) { var x = L + 7 + (i % 2) * (CW / 2), yy = y + 13.5 + Math.floor(i / 2) * 6.2; check(x, yy - 1.4); T(s, x + 5.5, yy, 'light', 9, K.t1); });
    y += ih + 4;

    /* =========================== SEITE 2 · POSITIONEN =========================== */
    newPage();
    chapter('01', 'Leistungen und Preise', 'Alle Positionen, herstellerneutral kalkuliert.');
    y += para('Positionspreise netto. Die Preise enthalten Planung, Projektsteuerung und Förderservice.', L, y, CW, 'light', 9, K.note, 4) + 4;
    var cx = { pos: L + 6, bz: L + 15, bzW: 92, me: L + 122, ep: L + 145, gp: R - 6 };
    var rows = r.pos.map(function (p) { var ds = lines(p.d, cx.bzW, 'light', 7.6); return { p: p, ds: ds, h: 6.2 + ds.length * 3.3 + 3.4 }; });
    function tableChunk(list) {
      var th = 9 + list.reduce(function (a, rw) { return a + rw.h; }, 0) + 2;
      mod(L, y, CW, th); var yy = y + 7;
      eb('Pos', cx.pos, yy, K.mu, null, 6.2); eb('Leistung', cx.bz, yy, K.mu, null, 6.2); eb('Menge', cx.me, yy, K.mu, 'right', 6.2); eb('EP netto', cx.ep, yy, K.mu, 'right', 6.2); eb('GP netto', cx.gp, yy, K.mu, 'right', 6.2);
      hl(L + 6, yy + 2.4, R - 6, K.ink, .4); yy += 8.4;
      list.forEach(function (rw, i) {
        var p = rw.p;
        T(String(r.pos.indexOf(p) + 1).padStart(2, '0'), cx.pos, yy, 'medium', 8.6, K.ok);
        T(p.n, cx.bz, yy, 'bold', 9.4);
        T(F2.format(p.m).replace(',00', '') + ' ' + p.e, cx.me, yy, 'medium', 8.4, K.t2, 'right');
        T(e2(p.ep), cx.ep, yy, 'medium', 8.4, K.t2, 'right'); T(e2(p.gp), cx.gp, yy, 'medium', 9.4, K.ink, 'right');
        font('light', 7.6, K.note); rw.ds.forEach(function (l, j) { d.text(l, cx.bz, yy + 4.6 + j * 3.3); });
        yy += rw.h; if (i < list.length - 1) hl(cx.bz, yy - 4.4, R - 6, K.ln, .2);
      });
      y += th + 5;
    }
    var chunk = [], used = 0;
    rows.forEach(function (rw) { if (y + 11 + used + rw.h > FT - 6 && chunk.length) { tableChunk(chunk); newPage(); chunk = []; used = 0; } chunk.push(rw); used += rw.h; });
    if (chunk.length) tableChunk(chunk);
    // Summen
    var sh = wp ? 50 : 30; need(sh + 4);
    mod(L, y, CW, sh); var sx = L + CW / 2 + 4, sr = R - 6, sy = y + 8;
    para('Alle Preise in Euro. Netto zuzüglich ' + F0.format(C.ust * 100) + ' % Umsatzsteuer. Weicht das gewählte Fabrikat im Preis ab, weisen wir das vor Vertragsschluss aus.', L + 6, y + 8, CW / 2 - 14, 'italic', 7.8, K.note, 3.6);
    T('Summe netto', sx, sy, 'light', 9, K.t1); T(e2(r.netto), sr, sy, 'medium', 9, K.ink, 'right'); sy += 5.6;
    T('Umsatzsteuer ' + F0.format(C.ust * 100) + ' %', sx, sy, 'light', 9, K.t1); T(e2(r.ust), sr, sy, 'medium', 9, K.ink, 'right'); sy += 3; hl(sx, sy, sr, K.ink, .4); sy += 6;
    T('Gesamtpreis brutto', sx, sy, 'bold', 11); T(e2(r.brutto), sr, sy, 'bold', 11, K.ink, 'right');
    if (wp) {
      sy += 7; T('KfW-Zuschuss, geschätzt', sx, sy, 'light', 9, K.ok); T('− ' + e2(fo.zuschuss), sr, sy, 'medium', 9, K.ok, 'right'); sy += 4;
      rect(sx - 3, sy, sr - sx + 6, 10, K.ok, .8); T('Ihr Eigenanteil', sx, sy + 6.6, 'bold', 10.5, K.wh); T(e2(r.eigen), sr - 1, sy + 6.6, 'bold', 11.5, K.wh, 'right');
    }
    y += sh + 6;
    if (r.optional && r.optional.length) {
      var oh = 13 + (r.optional.length - 1) * 5; need(oh + 4);
      rect(L, y, CW, oh, K.flb, 1.3); eb('Nicht enthalten · separat vergeben', L + 6, y + 6, K.flt);
      r.optional.forEach(function (p, i) { T(p.n + ': Richtwert ' + e0(p.von) + ' bis ' + e0(p.bis) + ' brutto' + (wp ? ', Maßskizze in der Anlage' : ''), L + 6, y + 10.8 + i * 5, 'light', 9, K.ink); });
      y += oh + 6;
    }

    /* =========================== FÖRDERUNG + WIRTSCHAFTLICHKEIT (WP) =========================== */
    if (wp) {
      newPage();
      chapter('02', 'Förderung · KfW-Zuschuss 458', e0(fo.zuschuss) + ' Zuschuss von der KfW.', e0(fo.zuschuss));
      y += para('Schätzung nach der Förderrichtlinie ab 21.07.2026 für einen Antrag im Zeitraum ' + fo.stufe.label + '. Förderfähig sind die Bruttokosten bis zum Höchstbetrag von ' + e0(fo.cap) + (w.we > 1 ? ' für ' + w.we + ' Wohneinheiten.' : ' für die erste Wohneinheit.'), L, y, CW, 'light', 9, K.note, 4) + 4;
      var fr = [
        ['30 %', 'Grundförderung', 'Für alle Eigentümer beim Einbau einer Wärmepumpe.', true],
        [fo.kgbMoeglich + ' %', 'Klimageschwindigkeitsbonus', w.selbst ? (fo.kgbOk ? 'Selbst genutzt, funktionstüchtige ' + ({ gas: 'Gasheizung ab 20 Jahren', oel: 'Ölheizung', lpg: 'Flüssiggasheizung ab 20 Jahren' })[w.alt] + '.' : (w.funktion ? 'Gas- und Flüssiggasheizungen müssen mindestens 20 Jahre in Betrieb sein.' : 'Die Altheizung muss noch funktionieren.')) : 'Nur für selbst genutzte Wohneinheiten.', fo.kgb > 0],
        [(fo.eb || einkommenMax(w)) + ' %', 'Einkommensbonus', w.selbst ? 'Zu versteuerndes Haushaltseinkommen ' + ['bis 30.000 €', 'bis 40.000 €', 'bis 50.000 €', 'bis 60.000 €', 'über 60.000 €'][w.zve - 1] + (w.kind ? ', mit Familienzuschlag.' : '.') : 'Nur für selbst genutzte Wohneinheiten.', fo.eb > 0]
      ];
      var fh = 10 + fr.length * 13 + 16; need(fh + 4); mod(L, y, CW, fh); var fy = y + 10;
      fr.forEach(function (f, i) {
        T(f[0], L + 8, fy + 2, 'medium', 15, f[3] ? K.ok : K.mark);
        T(f[1], L + 34, fy - 1, 'bold', 9.6, f[3] ? K.ink : K.mu); para(f[2], L + 34, fy + 3.6, 112, 'light', 8.2, f[3] ? K.t2 : K.mu, 3.6);
        var chip = f[3] ? 'erfüllt' : 'entfällt', cwid = tw(chip.toUpperCase(), 'medium', 6, .42) + 6;
        rect(R - 8 - cwid, fy - 3.4, cwid, 5, f[3] ? K.okb : K.fd, .6); eb(chip, R - 8 - cwid / 2, fy - .1, f[3] ? K.ok : K.mu, 'center', 6);
        fy += 13; hl(L + 8, fy - 5, R - 8, K.ln, .2);
      });
      T('= ' + F0.format(fo.satz) + ' % von ' + e0(fo.basis), L + 8, fy + 2, 'bold', 11); T(e0(fo.zuschuss), R - 8, fy + 2, 'bold', 13, K.ok, 'right');
      T(fo.gedeckelt ? 'Rechnerisch ' + fo.satzRoh + ' %, gedeckelt auf ' + fo.deckel + ' %.' : 'Höchstsatz für Ihren Fall: ' + fo.deckel + ' %.', L + 8, fy + 7, 'italic', 7.8, K.note);
      y += fh + 6;
      // Hinweis Antrag
      var ah = 24; need(ah + 4); rect(L, y, CW, ah, K.fd, 1.3);
      T('Antrag vor Auftrag.', L + 7, y + 8, 'bold', 11);
      para('Der KfW-Antrag muss gestellt sein, bevor die Arbeiten beginnen. Dafür schließen wir einen Vertrag mit auflösender oder aufschiebender Bedingung der Förderzusage. Ohne Zusage entsteht Ihnen keine Pflicht. Antrag im Portal „Meine KfW“: kfw.de/458 · Ergänzungskredit: kfw.de/358', L + 7, y + 13, CW - 14, 'light', 8.4, K.t1, 3.8);
      y += ah + 9;

      need(140);
      chapter('03', 'Wirtschaftlichkeit', 'In 20 Jahren bleiben Ihnen ' + e0(B.spar20) + '.', e0(B.spar20));
      y += para('Heizkosten pro Jahr mit Ihrer ' + nm + 'heizung im Vergleich zur Wärmepumpe. Die schraffierte Fläche ist Ihre Ersparnis. Annahmen: Preisanstieg ' + F1.format(E.steigFossil) + ' % für ' + nm + ' und ' + F1.format(E.steigStrom) + ' % für Strom pro Jahr.', L, y, CW, 'light', 9, K.note, 4) + 3;
      // Chart
      var chH = 70; need(chH + 4 + 28); mod(L, y, CW, chH);
      var y0 = new Date(o.datum).getFullYear() + 1, yrs = [], vmax = 0;
      for (var i = 0; i < 20; i += 2) { var a = B.alt * Math.pow(1 + E.steigFossil / 100, i), b = B.neu * Math.pow(1 + E.steigStrom / 100, i); yrs.push([y0 + i, a, b]); vmax = Math.max(vmax, a); }
      var top = Math.ceil(vmax / 1000) * 1000, gx = L + 20, gw = CW - 28, gy = y + 9, gh = chH - 27, sc = function (v) { return gy + gh - gh * v / top; };
      for (var v = 0; v <= top; v += Math.max(500, top / 4)) { hl(gx, sc(v), gx + gw, K.ln, .2); T(F0.format(v) + ' €', gx - 2.5, sc(v) + 1, 'medium', 6.2, K.mu, 'right'); }
      var bw = gw / yrs.length;
      yrs.forEach(function (yr, i) {
        var x = gx + i * bw + bw * .17, ww = bw * .66;
        rect(x, sc(yr[2]), ww, gy + gh - sc(yr[2]), K.ok);
        rect(x, sc(yr[1]), ww, sc(yr[2]) - sc(yr[1]), K.okb); hatch(x, sc(yr[1]), ww, sc(yr[2]) - sc(yr[1]), [150, 170, 130], 1.5);
        hl(x, sc(yr[1]), x + ww, K.cut, .8);
        T(F0.format(Math.round(yr[1] / 10) * 10), x + ww / 2, sc(yr[1]) - 1.6, 'medium', 6.2, K.cut, 'center');
        T(String(yr[0]), x + ww / 2, gy + gh + 4.6, 'medium', 6.4, i ? K.mu : K.ink, 'center');
      });
      var lgy = y + chH - 4.5, lgx = L + 20;
      [[K.cut, 'Heizkosten ' + nm, 'line'], [K.ok, 'Wärmepumpe'], [K.okb, 'Ihre Ersparnis', 'hatch']].forEach(function (s) {
        if (s[2] === 'line') hl(lgx, lgy - 1, lgx + 4, s[0], .8); else { rect(lgx, lgy - 2.4, 4, 2.8, s[0]); if (s[2]) hatch(lgx, lgy - 2.4, 4, 2.8, [150, 170, 130], 1.2); }
        lgx += 6 + T(s[1], lgx + 5.6, lgy, 'medium', 6.8, K.t2) + 6;
      });
      y += chH + 5;
      // Kennzahlen Betrieb
      var bk = [[e0(B.alt), 'Heizkosten heute', 'pro Jahr, ' + nm, K.cut], [e0(B.neu), 'mit Wärmepumpe', 'pro Jahr', K.ok], [B.amortGas != null ? F1.format(B.amortGas) + ' Jahre' : '–', 'Amortisation', 'ggü. neuer Gasheizung', K.ink], [F1.format(B.co2) + ' t', 'weniger CO₂', 'pro Jahr', K.ok]];
      need(26); mod(L, y, CW, 22);
      bk.forEach(function (c, i) { var x = L + i * cw4; if (i) vl(x, y, y + 22); T(c[0], x + 5, y + 9.5, 'medium', 13.5, c[3]); T(c[1], x + 5, y + 14.8, 'bold', 8, K.ink); T(c[2], x + 5, y + 18.6, 'light', 7.4, K.t2); });
      y += 28;
    }

    /* =========================== TECHNIK =========================== */
    if (wp) {
      chapter('04', 'Technische Auslegung', 'Vorläufige Auslegung Ihrer Anlage.');
      var it = [['Wohnfläche', F0.format(w.flaeche) + ' m²'], ['Personen / Wohneinheiten', w.personen + ' / ' + w.we], ['Heizlast, überschlägig', F1.format(T1.heizlast) + ' kW'], ['Gerätegröße', T1.groesse + ' kW'],
        ['Warmwasserspeicher', T1.speicher + ' l'], ['Heizflächen', ({ hk: T1.hk + ' Heizkörper', fbh: 'Fußbodenheizung', mix: 'FBH + ' + T1.hk + ' Heizkörper' })[w.heiz]],
        ['Jahresarbeitszahl, erwartet', F1.format(T1.jaz)], ['Strombedarf Wärmepumpe', F0.format(T1.stromWP) + ' kWh/a'],
        ['Verbrauch heute', F0.format(T1.verbrauch) + ' ' + T1.einheit + ' ' + nm], ['Aufstellung', ({ extern: 'Fundament separat', partner: 'Streifenfundament', konsole: 'Bodenkonsole', wand: 'Wandkonsole' })[w.aufstellung]]];
      kvGrid(it);
      y += para('Die Heizlast ist überschlägig aus Ihren Angaben ermittelt. Verbindlich legen wir die Anlage nach einer raumweisen Heizlastberechnung nach DIN EN 12831 aus.', L, y, CW, 'italic', 7.8, K.note, 3.6) + 6;
    } else {
      newPage();
      chapter('02', 'Auslegung', F1.format(T1.kwSumme) + ' kW Kühlleistung für ' + F0.format(T1.flaeche) + ' m².', F1.format(T1.kwSumme) + ' kW');
      y += para('Die Geräteleistung ist aus Raumgröße, Etage und Sonneneinstrahlung abgeleitet. Leitungslängen sind kalkuliert und werden nach tatsächlichem Aufwand abgerechnet.', L, y, CW, 'light', 9, K.note, 4) + 4;
      var rh = 14 + T1.raeume.length * 7; need(rh + 4); mod(L, y, CW, rh);
      var ry = y + 7, c5 = [L + 8, L + 78, L + 100, L + 136, R - 8];
      eb('Raum', c5[0], ry, K.mu, null, 6.2); eb('Fläche', c5[1], ry, K.mu, 'right', 6.2); eb('Etage', c5[2], ry, K.mu, 'right', 6.2); eb('Innengerät', c5[3], ry, K.mu, 'right', 6.2); eb('Leitung', c5[4], ry, K.mu, 'right', 6.2);
      hl(L + 8, ry + 2.4, R - 8, K.ink, .4); ry += 8.4;
      T1.raeume.forEach(function (rm, i) {
        T(rm.name, c5[0], ry, 'bold', 9.2); if (rm.sonne) T('viel Sonne', c5[0] + tw(rm.name, 'bold', 9.2) + 3, ry, 'italic', 7.6, K.note);
        T(rm.flaeche + ' m²', c5[1], ry, 'medium', 8.8, K.t2, 'right'); T(['EG', 'OG', 'DG'][rm.etage], c5[2], ry, 'medium', 8.8, K.t2, 'right');
        T(F1.format(rm.ig.kw) + ' kW', c5[3], ry, 'medium', 9.2, K.wi, 'right'); T((8 + 3 * rm.etage) + ' m', c5[4], ry, 'medium', 8.8, K.t2, 'right');
        if (i < T1.raeume.length - 1) hl(L + 8, ry + 2.6, R - 8, K.ln, .2); ry += 7;
      });
      y += rh + 6;
      kvGrid([['Außengeräte', T1.ags.map(function (a) { return F1.format(a.kw) + ' kW' + (a.ports > 1 ? ' · ' + a.ports + ' Anschlüsse' : ''); }).join(' + ')], ['Innengeräte zusammen', F1.format(T1.kwSumme) + ' kW'], ['Kältemittelleitung', T1.meter + ' m'], ['Kondensatpumpen', String(T1.pumpen)], ['Strombedarf Kühlen', F0.format(T1.strom) + ' kWh/a'], ['Stromkosten Kühlen', e0(r.betrieb.kuehlKosten) + ' pro Jahr']]);
      y += 2;
    }
    function kvGrid(items) {
      var rowsN = Math.ceil(items.length / 2), gh2 = 8 + rowsN * 7.2; need(gh2 + 4); mod(L, y, CW, gh2); vl(L + CW / 2, y + 4, y + gh2 - 4);
      items.forEach(function (it2, i) { var cx2 = L + (i % 2) * (CW / 2) + 7, cr = cx2 + CW / 2 - 14, yy = y + 9 + Math.floor(i / 2) * 7.2; T(it2[0], cx2, yy, 'light', 8.8, K.t1); T(it2[1], cr, yy, 'medium', 8.8, K.ink, 'right'); if (Math.floor(i / 2) < rowsN - 1) hl(cx2, yy + 2.6, cr, K.ln, .2); });
      y += gh2 + 5;
    }

    /* =========================== FUNDAMENT =========================== */
    if (r.optional && r.optional.length) {
      if (wp) {
        need(96);
        chapter('', 'Anlage · Fundament', 'Maßskizze für den Garten- und Landschaftsbau.');
        var sh2 = 62; mod(L, y, CW, sh2);
        var dx = L + 8, dy = y + 9;
        eb('Draufsicht', dx, dy, K.mu, null, 6.2);
        rect(dx, dy + 6, 70, 8, K.fd); draw(K.ink); d.setLineWidth(.45); d.rect(dx, dy + 6, 70, 8); rect(dx, dy + 26, 70, 8, K.fd); d.rect(dx, dy + 26, 70, 8);
        d.setLineDashPattern([1.1, .9], 0); draw(K.mu); d.setLineWidth(.3); d.rect(dx + 4, dy + 9, 62, 22); d.setLineDashPattern([], 0);
        T('Außeneinheit', dx + 35, dy + 21, 'italic', 7.4, K.mu, 'center');
        T('2 Streifen, je ca. 120 × 30 cm', dx, dy + 41, 'bold', 8.4); T('Abstand nach Herstellerplan, ca. 50–60 cm', dx, dy + 45.5, 'light', 7.8, K.t2);
        var sx3 = L + 94; eb('Schnitt', sx3, dy, K.mu, null, 6.2);
        T('Oberkante ca. 10–15 cm über Gelände', sx3, dy + 5.5, 'light', 7.4, K.t2);
        rect(sx3, dy + 16, 74, 30, [233, 226, 210]); hatch(sx3, dy + 16, 74, 30, [214, 204, 186], 2.2); hl(sx3, dy + 16, sx3 + 74, K.ink, .5);
        rect(sx3 + 24, dy + 16, 26, 26, [214, 210, 202]); T('Kiesbett', sx3 + 37, dy + 28, 'medium', 7, K.t2, 'center'); T('Kondensat versickert', sx3 + 37, dy + 32, 'light', 6.6, K.t2, 'center');
        fill(K.wh); draw(K.ink); d.setLineWidth(.45); d.rect(sx3 + 12, dy + 9, 12, 33, 'FD'); d.rect(sx3 + 50, dy + 9, 12, 33, 'FD');
        vl(sx3 + 68, dy + 9, dy + 42, K.ink, .3); T('ca. 80 cm', sx3 + 70, dy + 25, 'bold', 7.4); T('frostfrei', sx3 + 70, dy + 29, 'light', 7, K.t2);
        y += sh2 + 5;
        y += para('Frostfrei gründen, Oberkante waagerecht. Kein Kontakt zur Hauswand wegen Körperschall, Abstand zur Wand ca. 30 cm. Kondensat über Kiesbett oder Sickerschacht ableiten, Leerrohr DN 100 zum Hauseintritt legen. Die verbindlichen Maße erhalten Sie mit dem gewählten Fabrikat.', L, y, CW, 'light', 8.8, K.t1, 4) + 6;
      } else {
        need(30); rect(L, y, CW, 20, K.fd, 1.3); T('Bodenaufstellung', L + 7, y + 7.5, 'bold', 10);
        para('Eine kleine Betonplatte oder Gehwegplatten auf verdichtetem Kies, ca. 100 × 50 cm, waagerecht und mit Abstand zur Hauswand. Die Bodenkonsole mit Schwingungsdämpfern ist enthalten.', L + 7, y + 12.5, CW - 14, 'light', 8.4, K.t1, 3.8);
        y += 26;
      }
    }

    /* =========================== ABLAUF, HINWEISE, ANNAHME =========================== */
    need(70);
    chapter('', 'So geht es weiter', 'Vier Schritte bis zur ' + (wp ? 'warmen Wohnung.' : 'kühlen Wohnung.'));
    var st4 = [['Vor-Ort-Termin', 'Wir prüfen Heizlast, Aufstellort, Schall, Leitungswege und Zählerschrank.'], ['Fabrikat und Festpreis', 'Sie wählen das Gerät, wir bestätigen den verbindlichen Preis.'], wp ? ['Förderantrag', 'Vertrag mit Förderbedingung, dann stellen Sie mit uns den KfW-Antrag.'] : ['Termin', 'Wir planen die Montage, meist an einem bis zwei Tagen.'], ['Einbau und Übergabe', 'Montage, Inbetriebnahme, Einweisung' + (wp ? ' und Unterlagen für die Auszahlung.' : '.')]];
    var s4h = 34; mod(L, y, CW, s4h);
    st4.forEach(function (s, i) { var x = L + i * cw4 + 5; if (i) vl(L + i * cw4, y, y + s4h); T('0' + (i + 1), x, y + 8, 'medium', 8.4, K.cut); T(s[0], x, y + 14, 'bold', 9); para(s[1], x, y + 19, cw4 - 9, 'light', 7.8, K.t2, 3.5); });
    y += s4h + 7;
    var hin = ['Dieses Angebot beruht auf Ihren Online-Angaben und gilt ' + C.angebot.gueltigTage + ' Tage bis ' + dstr(gueltig) + '. Verbindlich wird der Preis nach Vor-Ort-Prüfung und Wahl des Fabrikats.',
      'Ausgeschrieben sind Markengeräte' + (wp ? ' mit natürlichem Kältemittel' : '') + '. Mehr- oder Minderaufwand, etwa längere Leitungswege, rechnen wir nach tatsächlichem Aufwand ab.',
      wp ? 'Die Förderung ist eine Schätzung ohne Gewähr. Über Höhe und Zusage entscheidet allein die KfW nach den bei Antragstellung geltenden Bedingungen.' : 'Als Ergänzung zur bestehenden Heizung ist eine Klimaanlage nicht förderfähig.'];
    var hl2 = hin.map(function (s) { return lines(s, CW - 6, 'light', 8.2); }), hh = hl2.reduce(function (a, l) { return a + l.length * 3.7 + 2; }, 0) + 8;
    need(hh + 44); eb('Hinweise', L, y, K.mu); y += 5.5;
    hl2.forEach(function (ls) { rect(L, y - 2.2, 1.4, 1.4, K.cut); font('light', 8.2, K.t2); ls.forEach(function (l, j) { d.text(l, L + 5, y + j * 3.7); }); y += ls.length * 3.7 + 2; });
    y += 6;
    // Gruß und Annahme
    T('Mit freundlichen Grüßen', L, y, 'light', 9.6, K.t1); T(fi.name, L, y + 5.5, 'bold', 9.6); if (!ph(fi.ansprechpartner)) T(fi.ansprechpartner, L, y + 10.5, 'light', 9, K.t2);
    var ax = L + CW / 2 + 4; eb('Angebot angenommen', ax, y, K.mu); hl(ax, y + 16, R, K.ink, .3); T('Ort, Datum', ax, y + 20, 'light', 7.4, K.mu); T('Unterschrift', R, y + 20, 'light', 7.4, K.mu, 'right');
    y += 26;

    /* =========================== FUSSZEILEN =========================== */
    var n = d.getNumberOfPages();
    for (var pg = 1; pg <= n; pg++) {
      d.setPage(pg); hl(L, FT, R, K.ln, .3);
      var a1 = [ph(fi.strasse) ? '' : fi.strasse, ph(fi.ort) ? '' : (ph(fi.plz) ? '' : fi.plz + ' ') + fi.ort, ph(fi.telefon) ? '' : 'Tel. ' + fi.telefon, ph(fi.email) ? '' : fi.email, ph(fi.web) ? '' : fi.web].filter(Boolean).join(' · ');
      var a2 = [ph(fi.register) ? '' : fi.register, ph(fi.steuer) ? '' : fi.steuer, ph(fi.vorstand) ? '' : fi.vorstand].filter(Boolean).join(' · ');
      var a3 = [ph(fi.bank) ? '' : fi.bank, ph(fi.iban) ? '' : 'IBAN ' + fi.iban, ph(fi.bic) ? '' : 'BIC ' + fi.bic].filter(Boolean).join(' · ');
      T(fi.name, L, FT + 5, 'bold', 6.8, K.t2);
      [a1, a2, a3].filter(Boolean).forEach(function (s, i) { T(s, L, FT + 8.6 + i * 3.2, 'medium', 6, K.mu); });
      eb('Seite ' + pg + ' / ' + n, L, H - 8, K.mu, null, 6);
      eb('Angebot ' + o.nr + ' · ' + dstr(o.datum), L + 26, H - 8, K.mu, null, 6);
      if (P.logos !== false && typeof LOGOS !== 'undefined') {
        var anH = 4, anW = LOGOS.ansvar.w / LOGOS.ansvar.h * anH;
        logo('ansvar', R - anW, FT + 4.8, anH);
        if (P.logoLabel) eb(P.logoLabel, R - anW, FT + 3.2, K.mu, null, 5.6);
      }
    }
    var fn = clean('Angebot_' + o.nr + '_' + (k.name || 'Kunde')).replace(/[^A-Za-z0-9_.-]+/g, '_') + '.pdf';
    d.save(fn);
    return { file: fn, summary: produkt + ' · ' + e0(r.brutto) + ' brutto' + (wp ? ' · Zuschuss ' + e0(fo.zuschuss) + ' · Eigenanteil ' + e0(r.eigen) : '') + ' · ' + r.pos.map(function (p) { return p.n + ' ' + e0(p.gp); }).join(' | '), doc: d, satoshi: SAT };
  }
  function einkommenMax(w) { return 0; }
  return { make: make, lib: lib };
})();

/* =====================================================================
   START · sucht <div id="kegw-waerme"></div> und baut die Seite hinein
   ===================================================================== */
function merge(a, b) { if (!b) return a; Object.keys(b).forEach(function (k) { if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object') merge(a[k], b[k]); else a[k] = b[k]; }); return a; }
var BASE = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');
function boot() {
  var el = document.getElementById('kegw-waerme') || document.querySelector('[data-kegw-waerme]');
  if (!el || el.getAttribute('data-ready')) return;
  el.setAttribute('data-ready', '1');
  if (!document.getElementById('kw-fonts')) {
    var l1 = document.createElement('link'); l1.id = 'kw-fonts'; l1.rel = 'stylesheet'; l1.href = 'https://api.fontshare.com/v2/css?f[]=satoshi@500,700,900&display=swap'; document.head.appendChild(l1);
    var l2 = document.createElement('link'); l2.rel = 'stylesheet'; l2.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap'; document.head.appendChild(l2);
  }
  if (!document.getElementById('kw-css')) { var st = document.createElement('style'); st.id = 'kw-css'; st.textContent = CSS; document.head.appendChild(st); }
  var cfg = merge(JSON.parse(JSON.stringify(KEGW_DEFAULTS)), window.KEGW_CONFIG || {});
  if (!cfg.pdf.fontsUrl && BASE) cfg.pdf.fontsUrl = BASE + 'kegw-pdf-fonts.js';
  var box = document.createElement('div'); el.appendChild(box);
  try { UI.mount(box, cfg); } catch (e) { console.error('[KEGW]', e); box.innerHTML = '<p style="padding:24px;font-family:sans-serif">Der Rechner konnte nicht geladen werden. Bitte Seite neu laden.</p>'; }
  window.KEGW = { version: '1.2.0', state: UI._state, result: UI._res };
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

})();
