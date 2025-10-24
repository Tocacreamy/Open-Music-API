import fs from "fs";
import { nanoid } from "nanoid";
import path from "path";

export class StorageService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const ext = path.extname(meta.filename);
    const filename = `${nanoid(16)}${ext}`;
    const filePath = path.resolve(this._folder, filename);

    const fileStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      fileStream.on("error", (error) => reject(error));
      file.pipe(fileStream);
      file.on("end", () => resolve(filename));
    });
  }
}
