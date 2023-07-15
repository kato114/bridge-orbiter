const fs = require("fs");
const sqlite3 = require("better-sqlite3");

const { DBNAME } = require("../config/constants");

function createDbConnection() {
  if (fs.existsSync(DBNAME)) {
    return new sqlite3(DBNAME, { });
  } else {
    const db = new sqlite3(DBNAME, { });
    createTable(db);
    console.log("Connection with SQLite has been established");
    return db;
  }
}

function createTable(db) {
  db.exec(`
  CREATE TABLE blocks
  (
    chain   VARCHAR(50) NOT NULL PRIMARY KEY,
    number   INTEGER NOT NULL
  );
`);
}

module.exports = createDbConnection();
