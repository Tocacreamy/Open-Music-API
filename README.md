# OpenMusic API V1 🎵🚀

REST API untuk mengelola Album dan Lagu menggunakan Hapi.js dan PostgreSQL. Validasi payload dengan Joi, migrasi skema database dengan node-pg-migrate, dan filter pencarian lagu via query parameter. Fokus keamanan: input tervalidasi, query ter-parameterisasi, dan kredensial via environment variables. 🔐

- Server: [src/app/server.js](src/app/server.js)
  - Error mapping global via `onPreResponse` memanfaatkan [`exceptions.ClientError`](src/exceptions/ClientError.js)
- Albums:
  - Plugin: [`api.albums.albums`](src/api/albums/index.js)
  - Handler: [`api.albums.AlbumsHandler`](src/api/albums/handler.js)
  - Routes: [`api.albums.routes`](src/api/albums/routes.js)
  - Service: [`services.postgres.AlbumsService`](src/services/postgres/AlbumsService.js)
  - Validator: [`validator.albums.AlbumsValidator`](src/validator/albums/index.js), Skema: [`validator.albums.AlbumPayloadSchema`](src/validator/albums/schema.js)
- Songs:
  - Plugin: [`api.songs.songs`](src/api/songs/index.js)
  - Handler: [`api.songs.SongsHandler`](src/api/songs/handler.js)
  - Routes: [`api.songs.routes`](src/api/songs/routes.js)
  - Service: [`services.postgres.SongsService`](src/services/postgres/SongsService.js)
  - Validator: [`validator.songs.SongsValidator`](src/validator/songs/index.js), Skema: [`validator.songs.SongPayloadSchema`](src/validator/songs/schema.js)
- Exceptions: [`exceptions.ClientError`](src/exceptions/ClientError.js), [`exceptions.InvariantError`](src/exceptions/InvariantError.js), [`exceptions.NotFoundError`](src/exceptions/NotFoundError.js)
- Migrasi: [migrations/1759030711231_create-table-albums.js](migrations/1759030711231_create-table-albums.js), [migrations/1759030750189_create-table-songs.js](migrations/1759030750189_create-table-songs.js)
- Postman collection: [OpenMusic API V1 Test/OpenMusicAPIV1PostmanTest](OpenMusic%20API%20V1%20Test/OpenMusicAPIV1PostmanTest) 🧩

## Fitur Utama ✨

- Albums: CRUD lengkap (POST/GET by id/PUT/DELETE).
- Songs: CRUD lengkap + filter via query `title` dan/atau `performer` (ILIKE, partial, case-insensitive).
- Relasi songs → albums (FK `album_id`, ON DELETE CASCADE).
- Validasi payload dengan Joi; error konsisten via `ClientError`.
- Query database aman menggunakan parameterized queries (pg). 🔒

## Persyaratan Sistem ⚙️

- Node.js 18+ (disarankan).
- PostgreSQL 13+.
- NPM 9+.

## Instalasi & Konfigurasi 📦

1. Install dependency:

```bash
npm install
```

2. Siapkan database PostgreSQL (contoh dev):

```bash
createdb openmusic
```

3. Buat file `.env` (jangan commit; sudah di-ignore) dengan nilai aman:

```bash
# Server
HOST=127.0.0.1
PORT=5000

# Koneksi database (gunakan salah satu, atau keduanya)
# Opsi A: Variabel PG*
PGHOST=127.9.9.9
PGPORT=5432
PGDATABASE=openmusic
PGUSER=postgres
PGPASSWORD=strong-password-here

# Opsi B: DATABASE_URL (dipakai node-pg-migrate juga)
# DATABASE_URL=postgresql://postgres:strong-password-here@127.0.0.1:5432/openmusic
```

4. Jalankan migrasi skema:

```bash
npm run migrate
```

5. Menjalankan server (dev, dengan nodemon):

```bash
npm start
```

Server berjalan di http://HOST:PORT (default 127.0.0.1:5000).

## Arsitektur Singkat 🧱

- Hapi Plugin pattern:
  - Albums: [`api.albums.albums`](src/api/albums/index.js) → [`api.albums.routes`](src/api/albums/routes.js) → [`api.albums.AlbumsHandler`](src/api/albums/handler.js) → [`services.postgres.AlbumsService`](src/services/postgres/AlbumsService.js)
  - Songs: [`api.songs.songs`](src/api/songs/index.js) → [`api.songs.routes`](src/api/songs/routes.js) → [`api.songs.SongsHandler`](src/api/songs/handler.js) → [`services.postgres.SongsService`](src/services/postgres/SongsService.js)
- Validasi: [`validator.albums.AlbumsValidator`](src/validator/albums/index.js), [`validator.songs.SongsValidator`](src/validator/songs/index.js)
- Error handling: mapping `ClientError` menjadi response `{status:'fail'}`, exception lain → 500 (lihat [src/app/server.js](src/app/server.js)). 🛡️

Skema tabel:

- albums(id, name, year)
- songs(id, title, year, performer, genre, duration, album_id nullable → albums.id, ON DELETE CASCADE)

## Endpoint Referensi API 📚

Base URL: `http://localhost:PORT`

- POST /albums
  - Body:

```json
{ "name": "Viva la vida", "year": 2008 }
```

- Respon: `201 { "status":"success", "data": { "albumId": "album-..." } }`

- GET /albums/{id}

  - Respon: `200 { "status":"success", "data": { "album": { "id","name","year","songs":[{ "id","title","performer" }] } } }`

- PUT /albums/{id}

  - Body: `{ "name":"...", "year": 2010 }`
  - Respon: `200 { "status":"success", "message":"Album berhasil diupdate" }`

- DELETE /albums/{id}

  - Respon: `200 { "status":"success", "message":"Album berhasil dihapus" }`

- POST /songs
  - Body:

```json
{
  "title": "Life in Technicolor",
  "year": 2008,
  "performer": "Coldplay",
  "genre": "Pop",
  "duration": 120,
  "albumId": "album-optional"
}
```

- Respon: `201 { "status":"success", "data": { "songId": "song-..." } }`

- GET /songs

  - Query optional: `?title=cint&performer=chris`
  - Respon: `200 { "status":"success", "data": { "songs":[ { "id","title","performer" } ] } }`

- GET /songs/{id}

  - Respon: detail lengkap kolom songs.

- PUT /songs/{id}

  - Body sama seperti POST /songs.
  - Respon: `200 { "status":"success", "message":"Lagu berhasil diupdate" }`

- DELETE /songs/{id}
  - Respon: `200 { "status":"success", "message":"Lagu berhasil dihapus" }`

Validasi Payload ✅

- Album: [`validator.albums.AlbumPayloadSchema`](src/validator/albums/schema.js)
  - name: string, required
  - year: number, required
- Lagu: [`validator.songs.SongPayloadSchema`](src/validator/songs/schema.js)
  - title, year, performer, genre: required
  - duration, albumId: optional

Contoh cURL 🧪

```bash
# Tambah album
curl -X POST http://localhost:5000/albums \
  -H "Content-Type: application/json" \
  -d '{ "name":"Viva la vida", "year":2008 }'

# Cari lagu (title mengandung 'cint')
curl "http://localhost:5000/songs?title=cint"
```

## Keamanan & Praktik Terbaik 🔐

- Jangan commit file .env (sudah ada di [.gitignore](.gitignore)).
- Gunakan password DB yang kuat dan unik; prefer `DATABASE_URL` lewat secret manager di production.
- CORS saat ini diaktifkan untuk semua origin di [src/app/server.js](src/app/server.js). Batasi `routes.cors.origin` ke domain tepercaya saat production.
- Input tervalidasi oleh Joi; jika invalid, dilempar [`exceptions.InvariantError`](src/exceptions/InvariantError.js) → response `400`.
- Query ke database selalu ter-parameterisasi (hindari SQL Injection).
- Error internal tidak membocorkan stack ke klien; mapping 500 dengan pesan generik. Simpan log server secara aman.

## Pengujian dengan Postman 🧩

- Collection: [OpenMusic API V1 Test/OpenMusicAPIV1PostmanTest/Open Music API V1 Test.postman_collection.json](OpenMusic%20API%20V1%20Test/OpenMusicAPIV1PostmanTest/Open%20Music%20API%20V1%20Test.postman_collection.json)
- Environment: [OpenMusic API V1 Test/OpenMusicAPIV1PostmanTest/OpenMusic API Test.postman_environment.json](OpenMusic%20API%20V1%20Test/OpenMusicAPIV1PostmanTest/OpenMusic%20API%20Test.postman_environment.json)
- Set variable `port=5000` (atau sesuai .env).

## Script NPM 🧰

- start: `nodemon ./src/app/server.js`
- migrate: `node-pg-migrate`

## Lisensi 📄

ISC (lihat [package.json](package.json)
