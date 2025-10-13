import { Pool } from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";

export class PlaylistsService {
  constructor(songsService) {
    this._pool = new Pool();
    this._songsService = songsService;
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

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username 
           FROM playlists
           LEFT JOIN users ON playlists.owner = users.id
           WHERE playlists.owner = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deletePlaylist(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1",
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1 AND owner = $2",
      values: [id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError(
        "Playlist tidak ditemukan atau Anda bukan pemiliknya"
      );
    }
  }
}
