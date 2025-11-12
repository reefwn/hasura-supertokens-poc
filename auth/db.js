import { config } from "./config.js";

import { Pool } from "pg";

const pool = new Pool({
  connectionString: config.SUPERTOKENS_DB_URL,
});

export default pool;