import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || "3000",
  API_DOMAIN: process.env.API_DOMAIN || "http://localhost:3000",
  WEBSITE_DOMAIN: process.env.WEBSITE_DOMAIN || "http://localhost:3000",
  INTERNAL_SECRET: process.env.INTERNAL_SECRET || "changeme",
  TENANT_ID: process.env.TENANT_ID || "public",
  SUPERTOKENS_URI: process.env.SUPERTOKENS_URI || "http://supertokens:3567",
}