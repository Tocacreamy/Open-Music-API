export const up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      notNull: false, // Opsional
    },
    album_id: { // Menggunakan snake_case untuk konsistensi di database
      type: 'VARCHAR(50)',
      notNull: false, // Opsional jika lagu bisa tanpa album
      references: 'albums(id)', // Menandakan ini foreign key
      onDelete: 'CASCADE',      // Jika album dihapus, lagu ikut terhapus
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('songs');
};