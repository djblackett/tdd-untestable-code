import { describe, test } from "vitest";
import { expect } from "chai";
import { parsePeopleCsv } from "../src/untestable3-refactor.mjs";

describe("Untestable 3: CSV file parsing", () => {
  const exampleInput = "Loid,Forger,,Male\nAnya,Forger,6,Female\nYor,Forger,27,Female"
  const peopleArr = [
    {
      firstName: "Loid",
      lastName: "Forger",
      gender: "m",
    },
    {
      firstName: "Anya",
      lastName: "Forger",
      gender: "f",
      age: 6
    },
    {
      firstName: "Yor",
      lastName: "Forger",
      gender: "f",
      age: 27
    }
  ]
  test("todo", async () => {
      expect(await parsePeopleCsv(exampleInput)).to.deep.equal(peopleArr);
  });
});
