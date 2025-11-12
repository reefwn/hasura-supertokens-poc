import { config } from "./config.js"
import { debugResponse } from "./util.js"

import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";

import db from "./db.js";

const router = express.Router();

// ---- Signup Endpoint ----
router.post("/signup", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${config.INTERNAL_SECRET}`) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { client_id, client_secret, role } = req.body;
  if (!client_id || !client_secret || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await db.query(
      `INSERT INTO m2m_credentials (client_id, client_secret, role) VALUES ($1, $2, $3)`,
      [client_id, client_secret, role]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ---- Signin Endpoint ----
router.post("/signin", async (req, res) => {
  const { client_id, client_secret } = req.body;
  if (!client_id || !client_secret) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const { rows } = await db.query(
      `SELECT * FROM m2m_credentials WHERE client_id = $1`,
      [client_id]
    );
    if (rows.length === 0 || rows[0].client_secret !== client_secret) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const role = rows?.[0]?.role;
    const payload = {
      sub: client_id,
      "https://hasura.io/jwt/claims": {
        "x-hasura-user-id": client_id,
        "x-hasura-default-role": role,
        "x-hasura-allowed-roles": [role],
      },
    };

    const privateKey = fs.readFileSync("./private.pem", "utf8");
    const token = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "30m",
      audience: "hasura",
    });

    return res.json({ accessToken: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ---- Delete User Endpoint ----
router.delete("/client/:client_id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${config.INTERNAL_SECRET}`) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { client_id } = req.params;
  try {
    await db.query(
      `DELETE FROM m2m_credentials WHERE client_id = $1`,
      [client_id]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;