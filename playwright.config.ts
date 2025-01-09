import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    headless: true, // Run tests in headless mode
    baseURL: "https://test-assignment-dun-ten.vercel.app/", // Replace with your app's URL
    viewport: { width: 1280, height: 720 },
  },
});
