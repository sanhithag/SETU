import fs from "fs";
import path from "path";

const seedPath = path.join(process.cwd(), "data", "db.json");
const runtimePath = path.join(process.cwd(), "data", "runtime.json");

export type DB = any;

export function readDB(): DB {
  const file = fs.existsSync(runtimePath) ? runtimePath : seedPath;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
export function writeDB(db: DB) {
  fs.writeFileSync(runtimePath, JSON.stringify(db, null, 2));
}
export function resetDB() {
  fs.copyFileSync(seedPath, runtimePath);
}