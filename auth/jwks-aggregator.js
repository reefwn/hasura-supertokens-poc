import { config } from "./config.js";

import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import { pem2jwk } from "pem-jwk";

const router = express.Router();
const publicKey = fs.readFileSync("./public.pem", "utf8");
const jwk = pem2jwk(publicKey);
jwk.kid = "m2m-v1";
jwk.use = "sig";
jwk.alg = "RS256";

router.get("/.well-known/jwks.json", async (req, res) => {
  try {
    // SuperTokens core JWK URL
    const stResp = await fetch(config.SUPERTOKENS_JWK_URL);
    const stJwks = await stResp.json();

    // Combine keys: SuperTokens + M2M
    const combinedKeys = [...stJwks.keys, jwk];

    res.json({ keys: combinedKeys });
  } catch (err) {
    console.error("Failed to fetch SuperTokens JWKs", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
