import { afterEach, describe, expect, it } from "vitest";
import { getRoute } from "./main";

describe("portfolio routing", () => {
  afterEach(() => {
    delete globalThis.window;
  });

  it.each([
    ["/", "home"],
    ["/work", "work"],
    ["/about", "about"],
    ["/contact", "contact"],
  ])("maps %s to the %s view", (pathname, page) => {
    globalThis.window = { location: { pathname } };
    expect(getRoute().page).toBe(page);
  });

  it("maps a project path to a case-study view", () => {
    globalThis.window = { location: { pathname: "/work/trueworld" } };
    expect(getRoute()).toMatchObject({ page: "case", id: "trueworld", path: "/work/trueworld" });
  });
});
