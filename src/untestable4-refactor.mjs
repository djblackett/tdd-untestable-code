import argon2 from "@node-rs/argon2";
import pg from "pg";

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


export class SecureHasher {
    hashPassword() {

    }

    verifyPassword() {

    }
}

export class MockHasher {

    hashPassword() {

    }

    verifyPassword() {

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
    if (this.hasher.verifySync(user.passwordHash, oldPassword)) {
      throw new Error("wrong old password");
    }
    user.passwordHash = this.hasher.hashSync(newPassword);
    await this.users.save(user);
  }
}
