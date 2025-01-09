import { test, expect } from "@playwright/test";

test.describe("TodoApp", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should add a new todo", async ({ page }) => {});

  test("should mark a todo as completed", async ({ page }) => {});

  test("should delete a todo", async ({ page }) => {});
});
