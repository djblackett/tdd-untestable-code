import { afterEach, beforeEach, beforeAll, afterAll, describe, test } from "vitest";
import {InMemoryUserDao, PostgresUserDao, MockHasher, PasswordService, SecureHasher} from "../src/untestable4-refactor.mjs";
import { expect } from "chai";
import pg from "pg";
import  { readFileSync } from "fs";

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


  test("should be able to save and retrieve user", async () => {
    const user = {
      userId,
      passwordHash: hasher.hashPassword("password-123")
    };

    await users.save(user);

    const userFromDb = await users.getById(user.userId);

    expect(user).toEqual(userFromDb);
  });

  test("Should return null if user not found", async () => {
    const user = await users.getById(853);
    expect(user).toBeNull();
  })

  test("should be able to change password", async () => {
    const user = {
      userId,
      passwordHash: hasher.hashPassword("old-password-123")
    };

    await users.save(user);
    await service.changePassword(userId, "old-password-123", "new-password-456")

    const userWithNewPassword = await users.getById(user.userId);
    expect(user.passwordHash).not.to.equal(userWithNewPassword.passwordHash);
    expect(hasher.verifyPassword(userWithNewPassword.passwordHash, "new-password-456")).to.be.true;
  });

  test("should fail with wrong old password", async () => {
    const user = {
      userId,
      passwordHash: hasher.hashPassword("old-password-123")
    };

    await users.save(user);

    let error;
    try {
      await service.changePassword(userId, "oops-wrong-password", "new-password-456");
    } catch (e) {
      error = e;
    }
    expect(error).to.deep.equal(new Error("wrong old password"));
  })


  // runs same tests against different implementations of the interface
  function PasswordHasherContract(hasher) {
    const hash = hasher.hashPassword("correct-password");

    test("should successfully verify a password", () => {
      expect(hasher.verifyPassword(hash, "correct-password")).to.be.true
    })

    test("should fail verification with wrong password", () => {
      expect(hasher.verifyPassword(hash, "wrong-password")).to.be.false
    })
  }

  describe("test MockHasher", () => {
    PasswordHasherContract(new MockHasher());
  });

  describe("test SecureHasher", () => {
    PasswordHasherContract(new SecureHasher());
  })


  async function createTables(db) {
    await db.query(readFileSync("./src/create-tables.sql", {encoding: "utf8", flag: "r"}));
  }

  async function dropTables(db) {
    await db.query(readFileSync("./src/drop-tables.sql", {encoding: "utf8", flag: "r"}));
  }

  async function truncateTables(db) {
    await db.query("truncate users");
  }

  async function getConnection() {
    return new pg.Pool({
      user: "untestable",
      host: "127.0.0.1",
      database: "untestable",
      password: "secret",
      port: 5432,
    });
  }

  describe("test psql db", async () => {
    let db;
    let dao;

    beforeAll(async () => {
      // hardcoding for simplicity
        db = await getConnection()
        await dropTables(db);
        await createTables(db)
        dao = new PostgresUserDao(db);
    })


    afterAll(async () => {
      await db.end();
    });




    test("should be able to save and get a user", async () => {
      const user = {
        userId: userId,
        passwordHash: hasher.hashPassword("password-123")
      }

      await dao.save(user);
      const user2 = await dao.getById(userId);

      expect(user).toEqual(user2);
    })

    test("Should return null if user not found", async () => {
      const user = await users.getById(853);
      expect(user).toBeNull();
    })
  })

})


