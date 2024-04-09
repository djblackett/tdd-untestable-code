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

  test("should be able to change password", async () => {
    const user = {user_id: userId, password_hash: hasher.hashPassword("old-password-123")};


  });
});
