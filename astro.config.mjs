// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://artemiskit.dev",
  integrations: [
    starlight({
      title: "ArtemisKit",
      favicon: "/favicon.svg",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/code-sensei/artemiskit",
        },
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.gg/artemiskit",
        },
        { icon: "x.com", label: "X", href: "https://twitter.com/artemiskit" },
      ],
      customCss: ["./src/styles/global.css"],
      sidebar: [
        {
          label: "Home",
          items: [{ label: "Introduction", link: "/docs/" }],
        },
        {
          label: "CLI (@artemiskit/cli)",
          collapsed: false,
          items: [
            { label: "Overview", link: "/docs/cli/" },
            { label: "Installation", link: "/docs/cli/installation/" },
            { label: "Getting Started", link: "/docs/cli/getting-started/" },
            {
              label: "Commands",
              collapsed: true,
              items: [
                { label: "run", link: "/docs/cli/commands/run/" },
                { label: "redteam", link: "/docs/cli/commands/redteam/" },
                { label: "stress", link: "/docs/cli/commands/stress/" },
                { label: "report", link: "/docs/cli/commands/report/" },
                { label: "compare", link: "/docs/cli/commands/compare/" },
              ],
            },
            {
              label: "Scenarios",
              collapsed: true,
              items: [
                { label: "Format", link: "/docs/cli/scenarios/format/" },
                {
                  label: "Expectations",
                  link: "/docs/cli/scenarios/expectations/",
                },
              ],
            },
            {
              label: "Providers",
              collapsed: true,
              items: [
                { label: "OpenAI", link: "/docs/cli/providers/openai/" },
                { label: "Azure OpenAI", link: "/docs/cli/providers/azure/" },
                { label: "Anthropic", link: "/docs/cli/providers/anthropic/" },
                {
                  label: "OpenRouter",
                  link: "/docs/cli/providers/openrouter/",
                },
              ],
            },
            { label: "CI/CD Integration", link: "/docs/cli/ci-cd/" },
          ],
        },
        {
          label: "API (@artemiskit/core)",
          collapsed: true,
          badge: { text: "Coming Soon", variant: "caution" },
          items: [{ label: "Overview", link: "/docs/api/" }],
        },
      ],
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
