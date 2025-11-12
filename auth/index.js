
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { config } from "./config.js";
import authRouter from "./auth.js";
import m2mRouter from "./m2m.js";
import jwksAggregator from "./jwks-aggregator.js"

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use("/auth", authRouter); // SuperTokens email/password
app.use("/m2m", m2mRouter); // Stateless machine-to-machine
app.use("/", jwksAggregator); // exposes /.well-known/jwks.json

// ---- Start Server ----
const port = config.PORT
app.listen(port, '0.0.0.0', () => {
  console.log(`Auth is running on http://localhost:${port}`);
});
