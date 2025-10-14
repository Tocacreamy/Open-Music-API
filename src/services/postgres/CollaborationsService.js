import {Pool} from "pg";
import InvariantError from "../../exceptions/InvariantError.js";
import {nanoid} from "nanoid";

export class CollaborationsService {
    constructor() {
        this._pool = new Pool();
    }

    async addCollaboration(userId, playlistId) {
        const id = `collaboration-${nanoid(16)}`;

        console.log(`cek dlu,user: ${userId},playlist: ${playlistId}`)
        const query = {
            text: 'INSERT INTO collaborations (id, user_id, playlist_id) VALUES ($1, $2, $3) RETURNING id',
            values: [id, userId, playlistId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('Collaboration failed');
        }
        return result.rows[0].id;
    }

    async deleteCollaboration(userId, playlistId) {
        const query = {
            text: 'DELETE FROM collaborations WHERE user_id = $1 AND playlist_id = $2 RETURNING id',
            values: [userId, playlistId],
        };
        const result = await this._pool.query(query);
        
        if (!result.rows.length) {
            throw new InvariantError('Collaboration deletion failed');
        }
        return result.rows[0].id;
    }
}