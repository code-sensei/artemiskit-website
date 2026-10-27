// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";
import { createNodeAssessmentListener } from "./server/http.mjs";

/** @returns {import("vite").Plugin} */
function assessmentPreview() {
  /** @param {import("vite").ViteDevServer | import("vite").PreviewServer} server @param {boolean} [isPreview] */
  function mount(server, isPreview = false) {
    const port = (isPreview ? server.config.preview.port : server.config.server.port) || 4321;
    const env = { ...loadEnv("development", process.cwd(), ""), ...process.env };
    env.ASSESSMENT_ALLOWED_ORIGINS = [env.ASSESSMENT_ALLOWED_ORIGINS, `http://terminal.local:${port}`, `http://localhost:${port}`].filter(Boolean).join(",");
    const handle = createNodeAssessmentListener({ env });
    server.middlewares.use((req, res, next) => {
      const path = (req.url || "").split("?")[0];
      if (path === "/api/assessment" || path === "/api/assessment/") return handle(req, res);
      next();
    });
  }
  return { name: "assessment-local-endpoint", configureServer: server => mount(server), configurePreviewServer: server => mount(server, true) };
}

// https://astro.build/config
export default defineConfig({
  site: "https://www.artemiskit.dev",
  output: "static",
  server: { allowedHosts: ["terminal.local"] },
  trailingSlash: "always",
  redirects: {
    "/results": "/leaderboard/",
    "/ai-red-team": "/docs/cli/commands/redteam/",
    "/ai-security-testing": "/toolkit/",
    "/llm-testing": "/docs/getting-started/",
    "/prompt-injection-testing": "/docs/cli/commands/redteam/",
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/admin"),
    }),
    starlight({
      title: "ArtemisKit",
      components: { ThemeProvider: "./src/components/ThemeProvider.astro", ThemeSelect: "./src/components/ThemeSelect.astro", Footer: "./src/components/docs/Footer.astro" },
      favicon: "/favicon-32.png",
      logo: {
        light: "./public/artemiskit-wordmark-dark.webp",
        dark: "./public/artemiskit-wordmark-light.webp",
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
      customCss: ["./src/styles/docs-identity.css"],
      head: [
        { tag: "meta", attrs: { name: "theme-color", content: "#0D1115" } },
        { tag: "meta", attrs: { property: "og:image", content: "https://www.artemiskit.dev/og-image.png" } },
        { tag: "meta", attrs: { property: "og:image:alt", content: "ArtemisKit — open-source AI assurance" } },
        { tag: "meta", attrs: { name: "twitter:image", content: "https://www.artemiskit.dev/og-image.png" } },
        { tag: "meta", attrs: { name: "twitter:image:alt", content: "ArtemisKit — open-source AI assurance" } },
      ],
      lastUpdated: false,
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
          label: "Agent workflows",
          collapsed: false,
          autogenerate: { directory: "docs/workflows" },
        },
        {
          label: "Current reference guides",
          collapsed: true,
          autogenerate: { directory: "docs/reference" },
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
    plugins: [tailwindcss(), assessmentPreview()],
  },
});
