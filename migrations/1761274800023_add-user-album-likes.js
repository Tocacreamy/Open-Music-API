
export const up = (pgm) => {
  pgm.createTable("user_album_likes", {
    id: {
        type: "VARCHAR(50)",
        primaryKey: true,
    },
    user_id: {
        references: "users(id)",
        onDelete: "CASCADE",
        type: "VARCHAR(50)",
        notNull: true,
    },
    album_id: {
        references: "albums(id)",
        onDelete: "CASCADE",
        type: "VARCHAR(50)",
        notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("user_album_likes");
};
