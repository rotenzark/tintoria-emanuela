/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'tintoria-emanuela',    // usato per localStorage lang
    whatsapp: {
      number: '',                     // '39xxxxxxxxxx' — vuoto = niente wiring
      message: 'Ciao! Vorrei informazioni.',
      ids: ['ctaPrenota', 'heroWhatsapp', 'doveWhatsapp', 'barWhatsapp'],
    },
    /* orari: per giorno (0=domenica) un array di finestre [inizio, fine]
       in minuti-stringa 'HH:MM'. Fine oltre '24:00' = scavalca mezzanotte
       (es. ['18:00','24:30'] = apre alle 18, chiude alle 00:30 del giorno
       dopo). Giorno chiuso = []. */
    /* Scheda Google, tabella aperta a schermo il 24/9/2026 (PagineGialle e Virgilio uguali): lun–ven 8:30–12:30 e 14:30–19:30, sab 9–13, domenica chiuso. */
    hours: {
      0: [],
      1: [['08:30', '12:30'], ['14:30', '19:30']],
      2: [['08:30', '12:30'], ['14:30', '19:30']],
      3: [['08:30', '12:30'], ['14:30', '19:30']],
      4: [['08:30', '12:30'], ['14:30', '19:30']],
      5: [['08:30', '12:30'], ['14:30', '19:30']],
      6: [['09:00', '13:00']],
    },
    hoursStatusId: 'orarioStato',     // elemento testo stato
    hoursTableSelector: '[data-day]', // righe/li con data-day da evidenziare
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 2400,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 960,
    /* dizionario EN: SOLO overlay — l'HTML è la versione italiana.
       Forma storica a due lingue, resta valida e invariata. */
    EN: {
      "intro.f": "viale Fulvio Testi 81 · Milan",
      "intro.skip": "skip",
      "nav.home": "Tintoria Emanuela, back to top",
      "nav.apri": "Open the menu",
      "marchio.s": "viale Fulvio Testi 81, Milan · Niguarda",
      "nav.capi": "Garments",
      "nav.torna": "How it comes back",
      "nav.camicie": "Shirts",
      "nav.piumini": "Down jackets",
      "nav.recensioni": "Reviews",
      "nav.orari": "Hours and where",
      "nav.domande": "Questions",
      "cta.chiama": "Call",
      "cta.chiama2": "Call +39 02 8975 4204",
      "tg.1": "collection ticket",
      "tg.2": "viale Fulvio Testi 81 · Milan",
      "h.k": "Dry cleaner · washing and pressing · garments, household linen, ozone sanitising",
      "h.t": "On a hanger or folded?",
      "h.p": "It is the question you hear at the counter when you bring in a shirt. On our price list the same shirt has three lines: <b>on a hanger</b>, <b>folded</b>, <b>hand-pressed</b> if it is the travel one. The rest is all there: garments get washed and pressed, and come back the way you want them.",
      "h.cta1": "Call +39 02 8975 4204",
      "h.cta2": "Garments",
      "h.badge": "4.8 on Google with 26 reviews · «competent» and «kind» are the words customers write most often",
      "h.zoom": "Enlarge the photo of the wedding dress",
      "h.alt": "A white wedding dress on a hanger in the shop, in front of the bead curtain and the Tintoria Emanuela poster",
      "h.cap": "a wedding dress on its hanger, in the shop (photo by the dry cleaner)",
      "c.k": "garments",
      "c.h": "The lines on the price list.",
      "c.p": "As they are written on the sheet at the counter, group by group. The prices are there, on the list in the shop.",
      "c1.h": "Clothing",
      "c1.1": "Trousers",
      "c1.2": "Jacket",
      "c1.3": "Skirt",
      "c1.4": "Blouse",
      "c1.5": "Dress",
      "c1.6": "Shirt",
      "c1.6b": "on a hanger",
      "c1.7": "Shirt",
      "c1.7b": "folded",
      "c1.8": "Travel shirt",
      "c1.8b": "hand-pressed",
      "c1.9": "T-shirt",
      "c1.10": "Sweatshirt",
      "c1.11": "Light jumper",
      "c1.12": "Tie",
      "c2.h": "Coats and jackets",
      "c2.1": "Coat",
      "c2.2": "Goose-down jacket",
      "c2.3": "Synthetic padded jacket",
      "c2.4": "Fabric jacket",
      "c2.5": "Spring jacket",
      "c2.6": "Raincoat",
      "c3.h": "Bed linen and curtains",
      "c3.1": "Synthetic duvet, single and double",
      "c3.2": "Goose-down duvet",
      "c3.3": "Household linen",
      "c3.4": "Curtains",
      "c4.h": "And then",
      "c4.1": "Wedding dresses",
      "c4.2": "Ozone sanitising of garments and linen",
      "c4.3": "Business subscriptions",
      "c.nota": "For garments you do not find here, bring them in and we look at them together at the counter.",
      "r.k": "how it comes back",
      "r.h": "Washed, pressed, in cellophane.",
      "r.p1": "When you leave your garments we give you the ticket: it says how many pieces there are and when they come back. They come back on a hanger or folded, as you asked, and in cellophane.",
      "r.cit": "«Clothes delivered in cellophane»",
      "r.cit2": "from a Google review by a long-time customer",
      "r.p2": "There is one counter and sometimes you wait your turn: even the people who give us five stars write it.",
      "r.n1": "reviews out of 10 mention competence and impeccable work",
      "r.n2": "mention kindness",
      "r.n3": "mention delivery times kept",
      "r.nota": "counted on the 10 Google reviews with a text, September 2026",
      "p1.k": "drop off",
      "p1.p": "Bring the garments to the counter. Tell us how you want them back: on a hanger or folded.",
      "p2.k": "ticket",
      "p2.p": "We give you the slip with the number of pieces and the date. Keep it: you need it to collect.",
      "p3.k": "collect",
      "p3.p": "On the day written on it, washed, pressed and in cellophane. Ticket in hand.",
      "r.zoom": "Enlarge the photo of the poster",
      "r.alt": "The poster in the shop with the purple clothes pegs: Tintoria Emanuela, do you need help with your garments?",
      "r.cap": "the poster in the shop, with the pegs (photo by the dry cleaner)",
      "s.k": "shirts",
      "s.h": "Three ways to come back.",
      "s.p": "The same shirt, washed and pressed, comes back in three ways. You tell us when you leave it.",
      "s1.k": "01 · on the hanger",
      "s1.h": "On a hanger",
      "s1.p": "Ready to wear, in cellophane. For the wardrobe and for the next day.",
      "s2.k": "02 · flat",
      "s2.h": "Folded",
      "s2.p": "Folded and closed, for the suitcase or the drawer. It takes little room and does not crease.",
      "s3.k": "03 · travel",
      "s3.h": "Hand-pressed",
      "s3.p": "The travel shirt, pressed by hand: for those who leave and take it out of the suitcase.",
      "s.nota": "Some customers bring us their work shirts every week, together with suits and coats. On the poster in the shop there are the <b>business subscriptions</b>: ask at the counter what they include.",
      "u.k": "down jackets and duvets",
      "u.h": "The cold season passes through here.",
      "u.p1": "Goose-down and synthetic padded jackets, single and double duvets, coats, fabric jackets and raincoats: the lines on the price list that fill autumn and spring, when wardrobes change over.",
      "u.p2": "A stain on the jacket? Tell us when you leave it: someone found theirs clean and stain-free, and wrote it.",
      "v.k": "reviews",
      "v.h": "What people write.",
      "v.p": "Five Google reviews, as they were written.",
      "v.voto": "out of 5 · 26 Google reviews",
      "v1.c": "Massimo G. · 3 years ago · 5 stars",
      "v2.c": "giovanni n. · 5 years ago · 5 stars",
      "v3.c": "Giovanni G. · a year ago · 5 stars",
      "v4.c": "Enrico S. · a year ago · 5 stars",
      "v5.c": "Beatrice M. · 3 months ago · 5 stars",
      "o.k": "hours and where",
      "o.h": "Morning and afternoon, Saturday mornings only.",
      "o.p": "Monday to Friday 8:30–12:30 and 14:30–19:30. Saturday from 9 to 13. Closed on Sunday. In August we close for a few weeks: the notice goes out on Facebook.",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "o.nota": "For holidays, better to call first.",
      "k.ind": "address",
      "k.tel": "phone",
      "o.strada": "Get directions",
      "o.zoom": "Enlarge the photo of the sign",
      "o.alt": "The Tintoria Emanuela sign and the shop window on viale Fulvio Testi, seen from the street",
      "o.cap2": "the sign on viale Fulvio Testi (Google Street View)",
      "o.mappa": "Map: Tintoria Emanuela, Viale Fulvio Testi 81, Milan",
      "d.k": "questions",
      "d.h": "The questions we get asked.",
      "qa.1": "On a hanger or folded: what changes?",
      "ra.1": "On a hanger it comes back ready to wear; folded it comes back flat, for the suitcase or the drawer. You tell us when you leave it, and we write it on the ticket.",
      "qa.2": "How long does it take?",
      "ra.2": "It depends on the garment and on the season: we tell you when you drop it off, and the date is written on the ticket.",
      "qa.3": "Do you clean down jackets?",
      "ra.3": "Yes: goose-down and synthetic jackets, single and double duvets, coats and raincoats.",
      "qa.4": "And a wedding dress?",
      "ra.4": "Yes: bring it to the shop and we look at it together, before and after.",
      "qa.5": "What is ozone sanitising?",
      "ra.5": "A sanitising treatment for garments and household linen, in addition to washing: ask at the counter when it is worth it.",
      "qa.6": "Do you offer subscriptions?",
      "ra.6": "Yes, the business subscriptions: ask at the counter what they include.",
      "qa.7": "Are you open on Saturday afternoon?",
      "ra.7": "No: on Saturday from 9 to 13. Monday to Friday 8:30–12:30 and 14:30–19:30. Closed on Sunday.",
      "piede.s": "washing and pressing · garments, household linen, ozone sanitising · Mon–Fri 8:30–12:30 and 14:30–19:30, Sat 9–13",
      "piede.b": "Demo site by <a href=\"https://bespokestud.io\" target=\"_blank\" rel=\"noopener\">Bespoke Studio</a> · texts, hours and price-list lines from the Google listing, the business's Facebook page and the public Google reviews (September 2026); photographs from the business's Facebook page and from Google Street View.",
      "b.chiama": "Call",
      "b.capi": "Garments",
      "b.orari": "Hours",
      "b.mappa": "Map",
      "lb.chiudi": "Close",
    },
    /* MULTILINGUA (V4) — per i siti con più di due lingue, al posto di EN:
         LANGS: { en: {chiave:'...'}, ar: {chiave:'...'} }
       L'italiano resta SEMPRE la lingua del DOM e non ha dizionario.
       Se si valorizza EN e non LANGS, il comportamento è identico a prima. */
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],   // lingue che ribaltano dir=rtl
    /* etichette dello stato orari per lingua non-IT; l'IT è nel codice.
       Chiave mancante = fallback all'inglese, poi all'italiano. */
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */
  /* ═══ FIRMA · Tintoria Emanuela — «Appesa o piegata?»: la gruccia ═══
     Ogni [data-gruccia] è un blocco (gruccia SVG + titolo) che pende dal gancio (transform-origin 50% 0).
     Stato finale nel CSS = appeso, fermo, visibile: senza JS e in reduced-motion è tutto già appeso.
     Con GSAP: il JS lo stacca (ruotato, più in alto, invisibile: data-stato=staccata) e lo appende con
     un'oscillazione che si smorza (dondola → appesa). L'intro parte subito, l'hero dopo l'intro
     (bespokeHeroEntrance), i titoli di sezione quando entrano in vista. */
  var grucceVive = hasGsap && hasST && !reducedMotion;
  var appendi = function (el, subito) {
    if (subito || !hasGsap) { if (hasGsap) gsap.set(el, { clearProps: 'opacity,transform' }); el.setAttribute('data-stato', 'appesa'); return; }
    if (el.getAttribute('data-stato') !== 'staccata') return;
    el.setAttribute('data-stato', 'dondola');
    var tl = gsap.timeline({ onComplete: function () { gsap.set(el, { clearProps: 'opacity,transform' }); el.setAttribute('data-stato', 'appesa'); } });
    tl.to(el, { opacity: 1, y: 0, duration: .5, ease: 'power2.out' }, 0)
      .to(el, { rotation: 0, duration: 1.7, ease: 'elastic.out(1, 0.32)' }, 0.1);
  };
  var stacca = function (el) {
    gsap.set(el, { opacity: 0, y: -26, rotation: -13, transformOrigin: '50% 0' });
    el.setAttribute('data-stato', 'staccata');
  };
  var grucce = Array.prototype.slice.call(document.querySelectorAll('[data-gruccia]'));
  if (grucceVive) {
    grucce.forEach(stacca);
    var introG = document.getElementById('introAppeso');
    if (introG) {
      setTimeout(function () { appendi(introG); }, 150);
      setTimeout(function () { var f = document.getElementById('introFine'); if (f) f.classList.add('is-on'); }, 1400);
    }
    grucce.filter(function (g) { return !g.hasAttribute('data-gruccia-manuale'); }).forEach(function (g) {
      ScrollTrigger.create({ trigger: g, start: 'top 85%', once: true, onEnter: function () { appendi(g); } });
    });
    // rete di sicurezza: dopo 7 s ciò che è in vista e ancora staccato si appende
    setTimeout(function () {
      grucce.forEach(function (g) {
        if (g.getAttribute('data-stato') !== 'staccata') return;
        var r = g.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) appendi(g, true);
      });
    }, 7000);
  } else {
    var f0 = document.getElementById('introFine'); if (f0) f0.classList.add('is-on');
  }

  window.bespokeHeroEntrance = function () {
    var hero = document.getElementById('heroAppeso');
    if (!grucceVive) { if (hero) appendi(hero, true); return; }
    if (hero) appendi(hero);
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(['.apertura__k', '.apertura__p', '.apertura__stato', '.apertura__azioni', '.apertura__badge'], { opacity: 0, y: 16, duration: .6, stagger: .08 }, 0.4)
      .from('.apertura__foto', { opacity: 0, y: 24, duration: .8 }, '-=.6');
  };

})();
