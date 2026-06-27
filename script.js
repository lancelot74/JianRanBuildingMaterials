/* ===== China — catalog + interactions ===== */
(function () {
  'use strict';

  var CATEGORIES = [
    { id: 'kitchen',  label: 'Kitchen & Cabinetry' },
    { id: 'windows',  label: 'Windows & Doors' },
    { id: 'tiles',    label: 'Tiles' },
    { id: 'stone',    label: 'Stone & Marble' },
    { id: 'flooring', label: 'Flooring' },
    { id: 'lighting', label: 'Lighting' }
  ];

  function $(id) { return document.getElementById(id); }
  function escHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------- Catalog data ---------- */
  function catalogItems() {
    var seed = window.__CATALOG_SEED || [];
    var admin = window.__CATALOG_ADMIN || { adds: [], hidden: [] };
    var hidden = admin.hidden || [];
    return seed.concat(admin.adds || []).filter(function (it) { return hidden.indexOf(it.slug) === -1; });
  }
  function itemsIn(id) { return catalogItems().filter(function (it) { return it.category === id; }); }

  var catCards = $('catCards');
  var catGallery = $('catGallery');
  var galleryHead = $('galleryHead');
  var galleryGrid = $('galleryGrid');

  function renderCards() {
    if (!catCards) return;
    catCards.innerHTML = CATEGORIES.map(function (cat) {
      var list = itemsIn(cat.id);
      var filled = list.length > 0;
      var meta = filled ? (list.length + (list.length === 1 ? ' photo' : ' photos')) : 'Coming soon';
      return '<a class="cat-card' + (filled ? '' : ' is-empty') + '" href="#cat=' + cat.id + '">' +
               '<span class="cat-cover">' + (filled ? '<img src="' + escHtml(list[0].src) + '" alt="" loading="lazy">' : '') + '</span>' +
               '<span class="cat-name">' + escHtml(cat.label) + '</span>' +
               '<span class="cat-meta">' + meta + '</span>' +
             '</a>';
    }).join('');
  }

  function renderGallery(id) {
    var cat = null, i;
    for (i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) cat = CATEGORIES[i];
    if (!cat) { showCards(); return; }
    var list = itemsIn(id);
    galleryHead.textContent = cat.label;
    if (list.length === 0) {
      galleryGrid.innerHTML = '<p class="gallery-empty">Photos coming soon.</p>';
    } else {
      galleryGrid.innerHTML = list.map(function (it) {
        return '<figure class="ph" data-caption="' + escHtml(it.caption || '') + '">' +
                 '<img src="' + escHtml(it.src) + '" alt="' + escHtml(it.caption || '') + '" loading="lazy">' +
               '</figure>';
      }).join('');
    }
    catCards.hidden = true;
    catGallery.hidden = false;
  }

  function showCards() {
    if (!catGallery || !catCards) return;
    catGallery.hidden = true;
    catCards.hidden = false;
  }

  function route() {
    var m = (location.hash || '').match(/^#cat=([a-z]+)/);
    if (m) renderGallery(m[1]);
    else showCards();
  }

  if (catCards && catGallery) {
    renderCards();
    window.addEventListener('hashchange', route);
    route();
  }

  /* ---------- Mobile nav ---------- */
  var hamburger = $('hamburger');
  var nav = $('nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Hero thumbnail swap ---------- */
  var heroBg = $('heroBg');
  var heroThumbs = $('heroThumbs');
  if (heroBg && heroThumbs) {
    heroThumbs.querySelectorAll('.hthumb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var src = btn.getAttribute('data-hero');
        if (!src) return;
        heroBg.src = src;
        heroThumbs.querySelectorAll('.hthumb').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
      });
    });
  }

  /* ---------- Lightbox (operates on the currently-rendered .ph tiles) ---------- */
  var lightbox = $('lightbox');
  var lbImg = $('lbImg');
  var lbCaption = $('lbCaption');
  var figs = [];
  var lbIndex = 0;

  function refreshFigs() { figs = Array.prototype.slice.call(document.querySelectorAll('.ph')); }
  function showSlide(i) {
    var n = figs.length; if (!n) return;
    lbIndex = (i + n) % n;
    var fig = figs[lbIndex];
    var img = fig.querySelector('img');
    lbImg.src = img.getAttribute('src');
    lbImg.alt = img.getAttribute('alt') || '';
    lbCaption.textContent = fig.getAttribute('data-caption') || '';
  }
  function openLightbox(i) {
    showSlide(i);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (lightbox) {
    document.addEventListener('click', function (e) {
      var fig = e.target.closest && e.target.closest('.ph');
      if (!fig) return;
      refreshFigs();
      openLightbox(figs.indexOf(fig));
    });
    $('lbClose').addEventListener('click', closeLightbox);
    $('lbPrev').addEventListener('click', function () { showSlide(lbIndex - 1); });
    $('lbNext').addEventListener('click', function () { showSlide(lbIndex + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showSlide(lbIndex - 1);
      else if (e.key === 'ArrowRight') showSlide(lbIndex + 1);
    });
  }
})();
