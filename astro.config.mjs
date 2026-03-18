// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://artemiskit.vercel.app",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/admin"),
    }),
    starlight({
      title: "ArtemisKit",
      favicon: "/favicon-32.png",
      logo: {
        light: "./public/artemiskit-logo-dark.svg",
        dark: "./public/artemiskit-logo.svg",
        alt: "ArtemisKit",
        replacesTitle: true,
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/code-sensei/artemiskit",
        },
      ],
      customCss: ["./src/styles/global.css"],
      sidebar: [
        {
          label: "Home",
          items: [
            { label: "Introduction", link: "/docs/" },
            { label: "Getting Started", link: "/docs/getting-started/" },
          ],
        },
        {
          label: "Core Concepts",
          collapsed: false,
          items: [
            { label: "Overview", link: "/docs/concepts/" },
            { label: "Scenarios", link: "/docs/concepts/scenarios/" },
            { label: "Expectations", link: "/docs/concepts/expectations/" },
            { label: "Providers", link: "/docs/concepts/providers/" },
            { label: "Evaluators", link: "/docs/concepts/evaluators/" },
          ],
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
                { label: "init", link: "/docs/cli/commands/init/" },
                { label: "run", link: "/docs/cli/commands/run/" },
                { label: "redteam", link: "/docs/cli/commands/redteam/" },
                { label: "stress", link: "/docs/cli/commands/stress/" },
                { label: "baseline", link: "/docs/cli/commands/baseline/" },
                { label: "validate", link: "/docs/cli/commands/validate/" },
                { label: "report", link: "/docs/cli/commands/report/" },
                { label: "compare", link: "/docs/cli/commands/compare/" },
                { label: "history", link: "/docs/cli/commands/history/" },
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
                { label: "Overview", link: "/docs/cli/providers/" },
                { label: "OpenAI", link: "/docs/cli/providers/openai/" },
                { label: "Azure OpenAI", link: "/docs/cli/providers/azure/" },
                { label: "Anthropic", link: "/docs/cli/providers/anthropic/" },
                {
                  label: "OpenAI Compatible",
                  link: "/docs/cli/providers/openai-compatible/",
                },
                {
                  label: "Vercel AI SDK",
                  link: "/docs/cli/providers/vercel-ai/",
                },
              ],
            },
            {
              label: "Storage",
              collapsed: true,
              items: [
                { label: "Overview", link: "/docs/cli/storage/" },
                { label: "Local", link: "/docs/cli/storage/local/" },
                { label: "Supabase", link: "/docs/cli/storage/supabase/" },
              ],
            },
            { label: "CI/CD Integration", link: "/docs/cli/ci-cd/" },
          ],
        },
        {
          label: "SDK (@artemiskit/sdk)",
          collapsed: false,
          items: [
            { label: "Overview", link: "/docs/sdk/" },
            {
              label: "Scenario Builders",
              link: "/docs/sdk/builders/",
              badge: { text: "New", variant: "tip" },
            },
            { label: "Evaluation API", link: "/docs/sdk/evaluation/" },
            { label: "Guardian Mode", link: "/docs/sdk/guardian/" },
            { label: "Test Matchers", link: "/docs/sdk/matchers/" },
            {
              label: "Adapters",
              collapsed: true,
              items: [
                { label: "Overview", link: "/docs/sdk/adapters/" },
                { label: "LangChain", link: "/docs/sdk/adapters/langchain/" },
                { label: "DeepAgents", link: "/docs/sdk/adapters/deepagents/" },
              ],
            },
          ],
        },
        {
          label: "Examples & Cookbook",
          collapsed: false,
          items: [
            { label: "Overview", link: "/docs/examples/" },
            {
              label: "CI/CD Integration",
              link: "/docs/examples/ci-cd-integration/",
            },
            {
              label: "Security Testing",
              link: "/docs/examples/security-testing/",
            },
            {
              label: "Regression Testing",
              link: "/docs/examples/regression-testing/",
            },
            { label: "Stress Testing", link: "/docs/examples/stress-testing/" },
            {
              label: "Scenario Builders",
              link: "/docs/examples/scenario-builders/",
            },
            {
              label: "Guardian Recipes",
              link: "/docs/examples/guardian-recipes/",
            },
            {
              label: "Custom Evaluators",
              link: "/docs/examples/custom-evaluators/",
            },
          ],
        },
        {
          label: "API Reference",
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
