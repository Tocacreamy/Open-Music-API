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
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3)",
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
      text: "SELECT songs.id, songs.title FROM songs JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1 AND playlist_songs.owner = $2",
      values: [playlistId, credentialId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Lagu gagal diambil dari playlist");
    }
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2",
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Lagu gagal dihapus dari playlist");
    }
    return result.rows[0].id;
  }
}
