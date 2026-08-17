import { describe, expect, it } from "vitest";
import { FILTERS, PROJECTS, SKILLS } from "./data";

describe("portfolio content", () => {
  it("contains four resume-backed projects with unique deep-link ids", () => {
    expect(PROJECTS).toHaveLength(4);
    expect(new Set(PROJECTS.map((project) => project.id)).size).toBe(PROJECTS.length);
    PROJECTS.forEach((project) => {
      expect(project.title).toBeTruthy();
      expect(project.date).toBeTruthy();
      expect(project.role).toBeTruthy();
      expect(project.bullets.length).toBeGreaterThan(0);
      expect(project.stats.length).toBe(3);
    });
  });

  it("keeps filters and technical skills available for progressive disclosure", () => {
    expect(FILTERS[0]).toBe("All work");
    expect(FILTERS).toContain("AR / Immersive");
    expect(SKILLS.Technical).toContain("Figma");
    expect(SKILLS.Technical).toContain("Unreal Engine");
  });
});
