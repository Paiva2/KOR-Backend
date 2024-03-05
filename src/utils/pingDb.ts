import pool from "../http/lib/pg";
import { PoolClient } from "pg";
import dbInit from "./dbInit";

export async function pingDb() {
  let connection: PoolClient | null = null;

  try {
    connection = await pool.connect();

    const {
      rows: [ping],
    } = await connection.query("SELECT CURRENT_TIME;");

    if (ping != null) {
      console.log("Postgres connected on port: " + 5432);

      await dbInit();
    }
  } catch (e) {
    console.log("Error while connecting to Postgres...", e);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
