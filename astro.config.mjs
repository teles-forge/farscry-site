
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
