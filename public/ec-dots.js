/* Inject macOS traffic light dots into expressive-code headers.
   Mirrors the exact <span class="dot"> pattern used on the landing page. */
(function () {
  function inject() {
    document.querySelectorAll(
      '.expressive-code .frame .header:not([data-dots])'
    ).forEach(function (header) {
      header.setAttribute('data-dots', '1');

      /* Build the dot container */
      var wrap = document.createElement('span');
      wrap.className = 'ec-dots';
      wrap.setAttribute('aria-hidden', 'true');

      var colors = ['#ff5f57', '#ffbd2e', '#28c840'];
      colors.forEach(function (color) {
        var dot = document.createElement('span');
        dot.className = 'ec-dot';
        dot.style.cssText =
          'display:inline-block;width:12px;height:12px;border-radius:50%;' +
          'background:' + color + ';flex-shrink:0;';
        wrap.appendChild(dot);
      });

      /* Style the wrapper */
      wrap.style.cssText =
        'display:inline-flex;align-items:center;gap:6px;' +
        'flex-shrink:0;margin-right:8px;';

      /* Insert before any existing content */
      header.insertBefore(wrap, header.firstChild);

      /* Force the header itself to flex so dots and title sit side-by-side */
      header.style.cssText =
        'display:flex!important;align-items:center!important;' +
        'background:#16161a!important;' +
        'border-bottom:1px solid rgba(255,255,255,0.07)!important;' +
        'padding:0.625rem 1rem!important;' +
        'gap:0.5rem!important;box-sizing:border-box!important;';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  /* Re-run on Astro view transitions / client-side navigation */
  document.addEventListener('astro:page-load', inject);
})();
