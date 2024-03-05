import { Pool } from "pg";

const pool = new Pool({
  user: "development",
  port: 5432,
  database: "kor-test",
  password: "development123",
});

export default pool;
