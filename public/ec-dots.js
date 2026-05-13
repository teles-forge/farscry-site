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

      var colors = ['#ff5f57', '#febc2e', '#28c840'];
      colors.forEach(function (color) {
        var dot = document.createElement('span');
        dot.className = 'ec-dot';
        /* Explicit resets prevent all:revert + UA styles from adding
           borders, outlines or box-shadows that create a dark-center look */
        dot.style.cssText =
          'display:inline-block;width:12px;height:12px;border-radius:50%;' +
          'background:' + color + ';' +
          'border:0;outline:0;box-shadow:none;' +
          'padding:0;margin:0;' +
          'flex-shrink:0;';
        /* Force via setProperty so !important wins over all:revert */
        dot.style.setProperty('background', color, 'important');
        dot.style.setProperty('border', '0', 'important');
        dot.style.setProperty('box-shadow', 'none', 'important');
        dot.style.setProperty('outline', '0', 'important');
        wrap.appendChild(dot);
      });

      /* Style the wrapper */
      wrap.style.cssText =
        'display:inline-flex;align-items:center;gap:6px;' +
        'flex-shrink:0;flex-grow:0;';

      /* Insert before any existing content */
      header.insertBefore(wrap, header.firstChild);

      /* Force the header itself to flex-start so dots stay on the left */
      header.style.cssText =
        'display:flex!important;flex-direction:row!important;' +
        'align-items:center!important;justify-content:flex-start!important;' +
        'width:100%!important;background:#16161a!important;' +
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
