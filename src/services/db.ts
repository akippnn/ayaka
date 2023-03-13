import sqlite3 from "sqlite3";
const db = new sqlite3.Database("ayaka.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

db.run(`CREATE TABLE active_channel (
  guild_snowflake TEXT,
  channel_snowflake TEXT,
  PRIMARY KEY (guild_snowflake, channel_snowflake)
  )
`);

export default db;