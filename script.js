// ================= Comena — interactions =================
(function () {
  'use strict';

  /* ---- Sticky header: transparent over hero -> solid white ---- */
  var header = document.getElementById('header');
  var hero = document.querySelector('.hero');
  function onScroll() {
    var threshold = hero ? hero.offsetTop + Math.min(hero.offsetHeight - 120, window.innerHeight - 120) : 120;
    // switch once we've scrolled past most of the hero
    var trigger = hero ? hero.getBoundingClientRect().bottom - 120 : 200;
    if (trigger <= 0) header.classList.add('is-solid');
    else header.classList.remove('is-solid');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Customer logo marquee (duplicated for seamless loop) ---- */
  var logos = [
    { src: 'assets/NHcsBoHEkEAnIKqWGTByEP3ExYM.png', alt: 'BÄCKER' },
    { src: 'assets/A9imE3UzvnpNBcsCySepoFHAbc.png', alt: 'ELSINGHORST' },
    { src: 'assets/Htn8G3OHSVeqTx0ICCN839FJw.png', alt: 'paal' },
    { src: 'assets/MObOzi0CEkmJJqALNGlmN4X2aU.png', alt: 'RUBIX' },
    { src: 'assets/QzucNNOx0YfhuB2E33ao1x2gJwU.png', alt: 'krumm&andré' },
    { src: 'assets/iS5UzAlxZQP9FCVD4TL2solp3eM.png', alt: 'hapare' },
    { src: 'assets/VgTJzS8Fkk7ZcMrLGe9pwFzjUs.png', alt: 'PIEL' },
    { src: 'assets/eklc99u8YSS1hqMYk8z2hiKnOWA.png', alt: 'ETTINGER' }
  ];
  var track = document.getElementById('marqueeTrack');
  if (track) {
    var html = '';
    for (var r = 0; r < 2; r++) {
      logos.forEach(function (l) {
        html += '<img src="' + l.src + '" alt="' + l.alt + '">';
      });
    }
    track.innerHTML = html;
  }

  /* ---- Language dropdown ---- */
  var lang = document.getElementById('lang');
  if (lang) {
    var langBtn = lang.querySelector('.lang__btn');
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      lang.classList.toggle('is-open');
      langBtn.setAttribute('aria-expanded', lang.classList.contains('is-open'));
    });
    document.addEventListener('click', function () { lang.classList.remove('is-open'); });
    lang.querySelectorAll('.lang__menu button').forEach(function (b) {
      b.addEventListener('click', function () {
        lang.querySelectorAll('.lang__menu button').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        lang.classList.remove('is-open');
      });
    });
  }

  /* ---- Mobile menu ---- */
  var burger = document.getElementById('burger');
  var mobilemenu = document.getElementById('mobilemenu');
  if (burger && mobilemenu) {
    burger.addEventListener('click', function () {
      mobilemenu.classList.toggle('is-open');
    });
    mobilemenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobilemenu.classList.remove('is-open'); });
    });
  }

  /* ---- Generic accordion (single-open) ---- */
  function initAccordion(el, onOpen) {
    if (!el) return;
    var items = Array.prototype.slice.call(el.querySelectorAll('.acc-item'));
    items.forEach(function (item) {
      var head = item.querySelector('.acc-head');
      head.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        items.forEach(function (i) { i.classList.remove('is-open'); });
        if (!isOpen) {
          item.classList.add('is-open');
          if (onOpen) onOpen(item);
        }
      });
    });
  }

  // FAQ
  initAccordion(document.getElementById('faqAcc'));

  // Solution accordion — swaps the media image
  var solutionImg = document.getElementById('solutionImg');
  initAccordion(document.getElementById('solutionAcc'), function (item) {
    var img = item.getAttribute('data-img');
    if (img && solutionImg && solutionImg.getAttribute('src') !== img) {
      solutionImg.style.opacity = '0';
      setTimeout(function () {
        solutionImg.setAttribute('src', img);
        solutionImg.style.opacity = '1';
      }, 180);
    }
  });

  /* ---- Testimonials carousel ---- */
  var tstTrack = document.getElementById('tstTrack');
  if (tstTrack) {
    var slides = tstTrack.children.length;
    var idx = 0;
    function go(n) {
      idx = (n + slides) % slides;
      tstTrack.style.transform = 'translateX(-' + (idx * 100) + '%)';
    }
    document.getElementById('tstPrev').addEventListener('click', function () { go(idx - 1); });
    document.getElementById('tstNext').addEventListener('click', function () { go(idx + 1); });

    // basic swipe support
    var startX = null;
    tstTrack.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    tstTrack.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) go(dx < 0 ? idx + 1 : idx - 1);
      startX = null;
    });
  }

  /* ---- Cookie consent + cookie-gated YouTube embed ---- */
  var CONSENT_KEY = 'comena_marketing_consent';
  var cookiebar = document.getElementById('cookiebar');
  var cookieAccept = document.getElementById('cookieAccept');
  var cookieDecline = document.getElementById('cookieDecline');
  var videoIframe = document.getElementById('videoIframe');
  var videoBlocked = document.getElementById('videoBlocked');
  var videoPlay = document.getElementById('videoPlay');

  function hasMarketingConsent() {
    return localStorage.getItem(CONSENT_KEY) === 'true';
  }

  function syncVideo() {
    if (!videoIframe || !videoBlocked) return;
    if (hasMarketingConsent()) {
      if (videoIframe.getAttribute('src') === 'about:blank') {
        videoIframe.setAttribute('src', videoIframe.getAttribute('data-src'));
      }
      videoBlocked.classList.add('is-hidden');
    } else {
      videoIframe.setAttribute('src', 'about:blank');
      videoBlocked.classList.remove('is-hidden');
    }
  }

  function openCookiebar() {
    if (cookiebar) cookiebar.classList.add('is-open');
  }

  function closeCookiebar() {
    if (cookiebar) cookiebar.classList.remove('is-open');
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'true');
      closeCookiebar();
      syncVideo();
    });
  }
  if (cookieDecline) {
    cookieDecline.addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'false');
      closeCookiebar();
      syncVideo();
    });
  }
  if (videoPlay) {
    videoPlay.addEventListener('click', openCookiebar);
  }

  syncVideo();
  if (localStorage.getItem(CONSENT_KEY) === null) openCookiebar();

  /* ---- Contact form -> Formspree (sends email to elias.uebel@comena.ai) ---- */
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/mjgngwqp';
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.disabled = true;

      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          btn.textContent = res.ok ? 'Vielen Dank! Wir melden uns.' : 'Fehler – bitte erneut versuchen.';
          if (res.ok) form.reset();
        })
        .catch(function () {
          btn.textContent = 'Fehler – bitte erneut versuchen.';
        })
        .finally(function () {
          setTimeout(function () { btn.textContent = original; btn.disabled = false; }, 3200);
        });
    });
  }
})();
