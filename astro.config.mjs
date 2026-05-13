
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://farscry.dev',
  integrations: [
    starlight({
      title: 'farscry',
      description: 'Screenshot diff for visual automation. Local. Free. Reproducible.',
      logo: {
        src: './src/assets/logo.svg',
        alt: 'farscry',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/teles-forge/farscry' },
      ],
      customCss: ['./src/styles/custom.css'],
      head: [
        {
          tag: 'script',
          content: "(function(){function i(){document.querySelectorAll('.expressive-code .frame .header:not([data-dots])').forEach(function(h){h.setAttribute('data-dots','1');var w=document.createElement('span');w.setAttribute('aria-hidden','true');w.style.cssText='display:inline-flex;align-items:center;gap:6px;flex-shrink:0;flex-grow:0;';['#ff5f57','#ffbd2e','#28c840'].forEach(function(c){var d=document.createElement('span');d.style.cssText='display:inline-block;width:12px;height:12px;border-radius:50%;background:'+c+';flex-shrink:0;';w.appendChild(d);});h.insertBefore(w,h.firstChild);h.style.cssText='display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-start!important;width:100%!important;background:#16161a!important;border-bottom:1px solid rgba(255,255,255,.07)!important;padding:.625rem 1rem!important;gap:.5rem!important;box-sizing:border-box!important;';});}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',i);}else{i();}document.addEventListener('astro:page-load',i);})();",
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/teles-forge/farscry/edit/main/site/',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Installation', slug: 'docs/install' },
            { label: 'Quick Start', slug: 'docs/quickstart' },
          ],
        },
        {
          label: 'CLI Reference',
          items: [
            { label: 'extract', slug: 'docs/cli/extract' },
            { label: 'diff', slug: 'docs/cli/diff' },
            { label: 'serve', slug: 'docs/cli/serve' },
            { label: 'install-lang', slug: 'docs/cli/install-lang' },
          ],
        },
        {
          label: 'SDK',
          items: [
            { label: 'npm (TypeScript)', slug: 'docs/sdk/npm' },
            { label: 'pip (Python)', slug: 'docs/sdk/pip' },
          ],
        },
        {
          label: 'MCP Server',
          badge: { text: 'New', variant: 'tip' },
          items: [
            { label: 'Overview', slug: 'docs/mcp' },
            { label: 'Tools Reference', slug: 'docs/mcp/tools' },
            { label: 'Configuration', slug: 'docs/mcp/configure' },
          ],
        },
        {
          label: 'VASP Format',
          badge: { text: 'Open Spec', variant: 'note' },
          items: [
            { label: 'Overview', slug: 'docs/vasp/overview' },
            { label: 'Screen Types', slug: 'docs/vasp/screen-types' },
            { label: 'Affordances', slug: 'docs/vasp/affordances' },
            { label: 'Diff Output', slug: 'docs/vasp/diff' },
          ],
        },
        {
          label: 'Integrations',
          items: [
            { label: 'MCP workflow', slug: 'docs/integrations/workflow-mcp' },
            { label: 'Action verification', slug: 'docs/integrations/workflow' },
            { label: 'Support Engineer', slug: 'docs/integrations/support-engineer' },
          ],
        },
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})
