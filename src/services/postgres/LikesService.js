import { Pool } from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError";

export class LikesService {
  constructor() {
    this._pool = new Pool();
  }

  async addLike(albumId, userId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO likes (id, album_id, user_id) VALUES ($1, $2, $3) RETURNING id",
      values: [id, albumId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Failed to add like");
    }
  }

  async getLike(albumId, userId) {
    const query = {
      text: "SELECT * FROM likes WHERE album_id = $1 AND user_id = $2",
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Failed to get like");
    }
    return result.rows[0];
  }

  async deleteLike(albumId, userId) {
    const query = {
      text: "DELETE FROM likes WHERE album_id = $1 AND user_id = $2 RETURNING id",
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Failed to delete like");
    }
  }
}
