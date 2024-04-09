import { afterEach, beforeEach, describe, test } from "vitest";
import { PostgresUserDao } from "../src/untestable4.mjs";
import {InMemoryUserDao, MockHasher, PasswordService} from "../src/untestable4-refactor.mjs";

describe("Untestable 4: enterprise application", () => {
  let userId = 12345;
  let service;
  let hasher;
  let users;

  beforeEach(() => {
    users = new InMemoryUserDao()
    hasher = new MockHasher()
    service = new PasswordService(users, hasher)
  });

  afterEach(() => {
    PostgresUserDao.getInstance().close();
  });

  test("todo", async () => {
    // TODO: write proper tests for both PasswordService and PostgresUserDao
  });
});
