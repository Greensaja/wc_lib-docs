// wc_lib docs — shared interactivity
// Framework toggle (VORP/RSG live code swap), mobile sidebar, copy
// buttons, active-nav highlighting. No build step, no dependencies.

(function () {
  'use strict';

  // ---------------------------------------------------------
  // Framework toggle — the signature interaction. One global
  // choice (persisted in localStorage) drives every fw-toggle
  // group on the page, so the demonstration of "one API, two
  // frameworks" feels coherent across the whole site, not just
  // per-block.
  // ---------------------------------------------------------

  var FW_KEY = 'wclib_docs_framework';

  function getFramework() {
    try {
      return localStorage.getItem(FW_KEY) || 'vorp';
    } catch (e) {
      return 'vorp';
    }
  }

  function setFramework(fw) {
    try { localStorage.setItem(FW_KEY, fw); } catch (e) {}
    applyFramework(fw);
  }

  function applyFramework(fw) {
    document.querySelectorAll('[data-fw-panel]').forEach(function (panel) {
      panel.classList.toggle('fw-active', panel.getAttribute('data-fw-panel') === fw);
    });
    document.querySelectorAll('.fw-toggle button').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-fw-set') === fw);
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-fw-set]');
    if (btn) setFramework(btn.getAttribute('data-fw-set'));
  });

  document.addEventListener('DOMContentLoaded', function () {
    applyFramework(getFramework());
  });

  // ---------------------------------------------------------
  // Copy-to-clipboard for code blocks
  // ---------------------------------------------------------

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;
    var block = btn.closest('.code-block');
    var codeEl = block && block.querySelector('pre code');
    if (!codeEl) return;

    var text = codeEl.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        flashCopied(btn);
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(ta);
      flashCopied(btn);
    }
  });

  function flashCopied(btn) {
    var original = btn.textContent;
    btn.textContent = 'copied';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1400);
  }

  // ---------------------------------------------------------
  // Mobile sidebar toggle
  // ---------------------------------------------------------

  var SIDEBAR_SCROLL_KEY = 'wclib_docs_sidebar_scroll';

  function saveSidebarScroll() {
    var sb = document.querySelector('.sidebar');
    if (!sb) return;
    try { sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(sb.scrollTop)); } catch (e) {}
  }

  function restoreSidebarScroll() {
    var sb = document.querySelector('.sidebar');
    if (!sb) return;
    try {
      var stored = sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
      if (stored !== null) sb.scrollTop = parseInt(stored, 10) || 0;
    } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', restoreSidebarScroll);
  window.addEventListener('beforeunload', saveSidebarScroll);

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-sidebar-toggle]')) {
      var sb = document.querySelector('.sidebar');
      if (sb) sb.classList.toggle('open');
    } else if (e.target.closest('.sidebar a')) {
      saveSidebarScroll();
    } else if (!e.target.closest('.sidebar') && !e.target.closest('[data-sidebar-toggle]')) {
      var sbOpen = document.querySelector('.sidebar.open');
      if (sbOpen && window.innerWidth <= 900) sbOpen.classList.remove('open');
    }
  });

  // ---------------------------------------------------------
  // Active nav-link highlighting based on current path
  // ---------------------------------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-list a').forEach(function (a) {
      var href = a.getAttribute('href').split('/').pop();
      if (href === path) a.classList.add('active');
    });
  });
})();
