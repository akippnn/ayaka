import sqlite3 from "sqlite3";
import { Database } from "sqlite3";

const db: Database = new sqlite3.Database(
  "ayaka.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
);

try {
  console.log('test')
  db.run(`CREATE TABLE active_channel (
    guild_snowflake TEXT,
    channel_snowflake TEXT,
    PRIMARY KEY (guild_snowflake, channel_snowflake)
    )
  `);
} catch (err) {
  console.log(err);
}

export default db;
