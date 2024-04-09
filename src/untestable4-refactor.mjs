import argon2 from "@node-rs/argon2";
import pg from "pg";
import {crc32} from "@node-rs/crc32";

export class PostgresUserDao {

 constructor(db) {
   this.db = db;
 }


  #rowToUser(row) {
    return { userId: row.user_id, passwordHash: row.password_hash };
  }

  async getById(userId) {
    const { rows } = await this.db.query(
      `select user_id, password_hash
       from users
       where user_id = $1`,
      [userId]
    );
    return rows.map(this.#rowToUser)[0] || null;
  }

  async save(user) {
    await this.db.query(
      `insert into users (user_id, password_hash)
       values ($1, $2)
       on conflict (user_id) do update
           set password_hash = excluded.password_hash`,
      [user.userId, user.passwordHash]
    );
  }
}

// Used to decouple the db from the Dao and use the fake in memory Dao for faster tests
// must implement same interface as PostgresUserDao class
export class InMemoryUserDao {
    users = {};

    async getById(userId) {
        return structuredClone(this.users[userId]) || null;
    }

    async save(user) {
        this.users[user.userId] = structuredClone(user);
    }
}

// Contains original code but can now be swapped out for the MockHasher
export class SecureHasher {
    hashPassword(password) {
        return argon2.hashSync(password);
    }

    verifyPassword(hash, password) {
        return argon2.verifySync(hash, password);
    }
}

// depended on reference solution for this fake hash function. crc32 was new for me
export class MockHasher {
    intToHex(n) {
        return (n >>> 0).toString(16).padStart(8, "0");
    }

    hashPassword(password) {
        return this.intToHex(crc32(password));
    }

    verifyPassword(hash, password) {
        return this.hashPassword(password) === hash;
    }


}

// inject users and hasher so they can be mocked and tested
export class PasswordService {
  constructor(users, hasher) {
   this.users = users;
   this.hasher = hasher;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.users.getById(userId);
    if (this.hasher.verifyPassword(user.passwordHash, oldPassword)) {
      throw new Error("wrong old password");
    }
    user.passwordHash = this.hasher.hashPassword(newPassword);
    await this.users.save(user);
  }
}
