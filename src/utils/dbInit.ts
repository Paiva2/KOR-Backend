import pool from "../http/lib/pg";

export default async function dbInit() {
  try {
    const {
      rows: [tablesAlreadyCrated],
    } = await pool.query(`
            SELECT EXISTS (
              SELECT FROM pg_tables
              WHERE schemaname = 'public'
              AND tablename  = 'tb_clients'
            );
          `);

    if (tablesAlreadyCrated.exists) return;

    await pool.query(`
            CREATE TYPE PROCESS_TYPE AS ENUM ('administrative', 'judicial');
            CREATE TYPE PARTICIPANT_TYPE AS ENUM ('lawyer', 'defendant');

            CREATE TABLE IF NOT EXISTS tb_clients (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
                full_name VARCHAR(50) NOT NULL, 
                cnpj VARCHAR(20) NOT NULL UNIQUE,
                created_at TIMESTAMP NOT NULL DEFAULT now(), 
                updated_at TIMESTAMP NOT NULL DEFAULT now(),
                deleted_at TIMESTAMP DEFAULT NULL
            );
    
            CREATE TABLE IF NOT EXISTS tb_process (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                number VARCHAR(200) NOT NULL UNIQUE,
                cause_value VARCHAR(100),
                type PROCESS_TYPE,
                quote_date TIMESTAMP NOT NULL,
                audience_date TIMESTAMP NOT NULL,
                forum VARCHAR(100) NOT NULL,
                city VARCHAR(50) NOT NULL,
                state VARCHAR(50) NOT NULL,
                client_id UUID NOT NULL REFERENCES tb_clients(id) ON DELETE CASCADE,
                created_at TIMESTAMP NOT NULL DEFAULT now(), 
                updated_at TIMESTAMP NOT NULL DEFAULT now(),
                deleted_at TIMESTAMP DEFAULT NULL
            );

            CREATE TABLE IF NOT EXISTS tb_participants (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                phone VARCHAR(20) NOT NULL UNIQUE,
                document VARCHAR(20) NOT NULL UNIQUE,
                type PARTICIPANT_TYPE NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT now(), 
                updated_at TIMESTAMP NOT NULL DEFAULT now(),
                deleted_at TIMESTAMP DEFAULT NULL
            );
    
            CREATE TABLE IF NOT EXISTS tb_process_participants (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                process_id UUID NOT NULL REFERENCES tb_process(id) ON DELETE CASCADE,
                participant_id UUID NOT NULL REFERENCES tb_participants(id) ON DELETE CASCADE,
                created_at TIMESTAMP NOT NULL DEFAULT now(), 
                updated_at TIMESTAMP NOT NULL DEFAULT now(),
                deleted_at TIMESTAMP DEFAULT NULL
            );
          `);
  } catch (e) {
    console.error(e);
    console.log("Error while creating initial tables...");
  }
}
