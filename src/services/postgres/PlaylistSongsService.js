import { Pool } from "pg";
import InvariantError from "../../exceptions/InvariantError.js";
import { nanoid } from "nanoid";

export class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist_song-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Lagu gagal ditambahkan ke playlist");
    }
    return result.rows[0].id;
  }

  async getSongsFromPlaylist(playlistId, credentialId) {
    const query = {
      text: `
      SELECT 
        p.id AS playlist_id, 
        p.name, 
        u.username,
        s.id AS song_id, 
        s.title, 
        s.performer
      FROM playlists p
      JOIN users u ON p.owner = u.id
      LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
      LEFT JOIN songs s ON ps.song_id = s.id
      WHERE p.id = $1 AND p.owner = $2
    `,
      values: [playlistId, credentialId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal diambil dari playlist");
    }

    const playlistDetails = {
      id: result.rows[0].playlist_id,
      name: result.rows[0].name,
      username: result.rows[0].username,
    };

    const songs = result.rows
      .filter((row) => row.song_id !== null)
      .map((row) => ({
        id: row.song_id,
        title: row.title,
        performer: row.performer,
      }));

    const finalResult = {
      ...playlistDetails,
      songs,
    };
    return finalResult;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Lagu gagal dihapus dari playlist");
    }
    return result.rows[0].id;
  }
}
