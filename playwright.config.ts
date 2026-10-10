import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  use: {
    channel: process.env.FRA_BROWSER_CHANNEL || undefined,
    baseURL: "http://127.0.0.1:4173/Fusion-Research-Atlas/",
    viewport: { width: 1440, height: 1000 },
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173/Fusion-Research-Atlas/",
    reuseExistingServer: !process.env.CI,
  },
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/browser-results.json" }],
  ],
});
