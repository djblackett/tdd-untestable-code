import { afterEach, beforeEach, describe, test } from "vitest";
import { PostgresUserDao } from "../src/untestable4.mjs";
import {InMemoryUserDao, MockHasher, PasswordService} from "../src/untestable4-refactor.mjs";
import { expect } from "chai";
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
    // PostgresUserDao.getInstance().close();
  });

  test("should be able to save user", async () => {
    const user = {
      userId,
      passwordHash: hasher.hashPassword("password-123")
    };

    await users.save(user);

    const userFromDb = await users.getById(user.userId);

    expect(user).toEqual(userFromDb);
  })

  test("should be able to change password", async () => {
    const user = {
      userId,
      passwordHash: hasher.hashPassword("old-password-123")
    };

    await users.save(user);

    await service.changePassword(userId, "old-password-123", "new-password-456")

    const userWithNewPassword = await users.getById(user.userId);
    console.log(userWithNewPassword)
    expect(user.passwordHash).not.to.equal(userWithNewPassword.passwordHash);
    expect(hasher.verifyPassword(userWithNewPassword.passwordHash, "new-password-456")).to.be.true;

  });
});
