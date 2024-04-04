import { describe, test } from "vitest";
import { expect } from "chai";
import { daysUntilChristmas } from "../src/untestable1-refactor.mjs";

describe("Untestable 1: days until Christmas", () => {
  const januaryFirst = "2015-01-01";
  const decemberTwentieth = "2015-12-20";
  const december25 = "2023-12-25"
  const december26 = "1999-12-26"

  test("daysUntilChristmas should return a number", () => {
    expect(daysUntilChristmas()).to.be.a("number");
  });

  test("December 20 should return 5", () => {
    expect(daysUntilChristmas(decemberTwentieth)).toEqual(5);
  })

  test("December 26 should return 364", () => {
    expect(daysUntilChristmas(december26)).toEqual(364);
  })

  test("January 1 should return 359", () => {
    expect(daysUntilChristmas(januaryFirst)).toEqual(359);
  })

  test("December 25 should return 0", () => {
    expect(daysUntilChristmas(december25)).toEqual(0)
  })
});
