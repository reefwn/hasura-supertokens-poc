import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || "3000",
  API_DOMAIN: process.env.API_DOMAIN || "http://localhost:3000",
  WEBSITE_DOMAIN: process.env.WEBSITE_DOMAIN || "http://localhost:3000",
  INTERNAL_SECRET: process.env.INTERNAL_SECRET || "changeme",
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || "secret-key",
  TENANT_ID: process.env.TENANT_ID || "public",
  SUPERTOKENS_URI: process.env.SUPERTOKENS_URI || "http://supertokens:3567",
  SUPERTOKENS_DB_URL: process.env.SUPERTOKENS_DB_URL || "postgresql://postgres:postgrespassword@postgres-supertokens:5432/supertokens",
  SUPERTOKENS_JWK_URL: process.env.SUPERTOKENS_JWK_URL || "http://supertokens:3567/.well-known/jwks.json"
}