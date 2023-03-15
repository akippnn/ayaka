import sqlite3 from "sqlite3";

const db: sqlite3.Database = new sqlite3.Database(
  "ayaka.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
);

try {
  db.run(`CREATE TABLE IF NOT EXISTS active_channel (
    guild_snowflake TEXT,
    channel_snowflake TEXT,
    PRIMARY KEY (guild_snowflake, channel_snowflake)
    )
  `);
} catch (err) {
  console.log(`${err}`);
}

export default db;
