import { Pool } from "pg";
import { nanoid } from "nanoid";
import AuthorizationError from "../../exceptions/AuthorizationError.js";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";
export class PlaylistsService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getPlaylists(userId) {
    const query = {
      text: `
      SELECT DISTINCT p.id, p.name, u.username
      FROM playlists AS p
      JOIN users AS u ON p.owner = u.id
      LEFT JOIN collaborations AS c ON p.id = c.playlist_id
      WHERE p.owner = $1 OR c.user_id = $1
      `,
      values: [userId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getPlaylistById(id) {

    const query = {
      text: "SELECT * FROM playlists WHERE id = $1 ",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
    return result.rows[0];
  }

  async deletePlaylist(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Playlist gagal dihapus");
    }

    return result.rows[0].id;
  }

  async verifyPlaylistOwner(id, owner) {
    // await this.getPlaylistById(id);
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1 AND owner = $2",
      values: [id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }

    // if (result.rows[0].owner !== owner) {
    //   throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    // }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    const query = {
      text: `
            SELECT p.owner, c.user_id AS collaborator_id
            FROM playlists AS p
            LEFT JOIN collaborations AS c ON p.id = c.playlist_id AND c.user_id = $2
            WHERE p.id = $1
        `,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];
    const isOwner = playlist.owner === userId;
    const isCollaborator = playlist.collaborator_id === userId;

    if (!isOwner && !isCollaborator) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }
}
