export const up = (pgm) => {
  // store uploaded filename; response will map it to coverUrl
  pgm.addColumn("albums", {
    cover: { type: "TEXT", notNull: false },
  });
};

export const down = (pgm) => {
  pgm.dropColumn("albums", "cover");
};
