import { Pool } from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";

export class LikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLike(albumId, userId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO user_album_likes (id, album_id, user_id) VALUES ($1, $2, $3) RETURNING id",
      values: [id, albumId, userId],
    };

    try {
      const result = await this._pool.query(query);

      if (result.rowCount === 0) {
        throw new InvariantError("Gagal menambahkan like");
      }

      await this._cacheService.delete(`album-likes:${albumId}`);
      return result.rows[0].id;
    } catch (err) {
      if (err && err.code === "23505") {
        throw new InvariantError("Anda sudah menyukai album ini");
      }
      throw err;
    }
  }

  async deleteLike(albumId, userId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id",
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Failed to delete like");
    }
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async getLikesCount(albumId) {
    try {
      const likesFromCache = await this._cacheService.get(
        `album-likes:${albumId}`
      );
      return {
        likes: parseInt(likesFromCache, 10),
        source: "cache",
      };
    } catch {
      const query = {
        text: "SELECT COUNT(*)::int AS likes FROM user_album_likes WHERE album_id = $1",
        values: [albumId],
      };
      const result = await this._pool.query(query);
      const likesFromDB = result.rows[0].likes;
      try {
        await this._cacheService.set(
          `album-likes:${albumId}`,
          likesFromDB.toString()
        );
      } catch (cacheSetError) {
        console.error("Cache SET Error:", cacheSetError.message);
      }

      return {
        likes: likesFromDB,
        source: "db",
      };
    }
  }

  async verifyAlbumNotLiked(albumId, userId) {
    const query = {
      text: "SELECT 1 FROM user_album_likes WHERE album_id = $1 AND user_id = $2",
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError("Anda sudah menyukai album ini");
    }
  }
}
