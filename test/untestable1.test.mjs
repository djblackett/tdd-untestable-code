import { describe, test } from "vitest";
import { expect } from "chai";
import { daysUntilChristmas } from "../src/untestable1-refactor.mjs";

describe("Untestable 1: days until Christmas", () => {
  const januaryFirst = "2015-01-01";
  const decemberTwentieth = "2015-12-20";

  test("daysUntilChristmas should return a number", () => {
    expect(daysUntilChristmas()).to.be.a("number");
  });

  test("should return 5", () => {
    expect(daysUntilChristmas(decemberTwentieth)).toEqual(5);
  })


});
