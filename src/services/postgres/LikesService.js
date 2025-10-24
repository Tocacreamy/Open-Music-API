import { Pool } from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";

export class LikesService {
  constructor() {
    this._pool = new Pool();
  }

  async addLike(albumId, userId) {
    // prevent duplicate
    const existsQuery = {
      text: "SELECT 1 FROM user_album_likes WHERE album_id = $1 AND user_id = $2",
      values: [albumId, userId],
    };
    const exists = await this._pool.query(existsQuery);
    if (exists.rowCount > 0) {
      throw new InvariantError("Anda sudah menyukai album ini");
    }

    const id = `like-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO user_album_likes (id, album_id, user_id) VALUES ($1, $2, $3) RETURNING id",
      values: [id, albumId, userId],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new InvariantError("Gagal menambahkan like");
      }
      return result.rows[0].id;
    } catch (err) {
      // safeguard if unique constraint exists
      if (err && err.code === "23505") {
        throw new InvariantError("Anda sudah menyukai album ini");
      }
      throw err;
    }
  }

//   async getLike(albumId, userId) {
//     const query = {
//       text: "SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2",
//       values: [albumId, userId],
//     };
//     const result = await this._pool.query(query);
//     if (!result.rows.length) {
//       throw new InvariantError("Failed to get like");
//     }
//     return result.rows[0];
//   }

  async deleteLike(albumId, userId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id",
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Failed to delete like");
    }
  }

  async getLikesCount(albumId) {
    const query = {
      text: "SELECT COUNT(*)::int AS likes FROM user_album_likes WHERE album_id = $1",
      values: [albumId],
    };
    const result = await this._pool.query(query);
    return result.rows[0].likes; 
  }
}
