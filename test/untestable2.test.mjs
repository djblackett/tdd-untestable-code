import { describe, test } from "vitest";
import { expect } from "chai";
import { diceHandValue } from "../src/untestable2-refactor.mjs";

describe("Untestable 2: a dice game", () => {

  test("should return a number", () => {
    expect(diceHandValue()).to.be.a("number");
  });

  test("should return 600", () => {
    expect(diceHandValue(6, 6)).toEqual(106);
  })

  test("should return 5", () => {
    expect(diceHandValue(2, 5)).toEqual(5);
  })
});
