import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import SuperTokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import AccountLinking from "supertokens-node/recipe/accountlinking";
import UserRoles from "supertokens-node/recipe/userroles";
import { middleware, errorHandler } from "supertokens-node/framework/express";
import { config } from "./config.js"
import { debugResponse } from "./util.js"

const app = express();

// ---- SuperTokens Initialization ----
SuperTokens.init({
  framework: "express",
  supertokens: {
    connectionURI: config.SUPERTOKENS_URI,
  },
  appInfo: {
    appName: "Hasura Auth",
    apiDomain: config.API_DOMAIN,
    websiteDomain: config.WEBSITE_DOMAIN,
    apiBasePath: "/auth",
  },
  recipeList: [
    EmailPassword.init({
      signUpFeature: { disableDefaultImplementation: true },
    }),
    Session.init(),
    AccountLinking.init({
      shouldDoAutomaticAccountLinking: async () => {
        return {
          shouldAutomaticallyLink: false,
          shouldRequireVerification: false,
        };
      },
    }),
    UserRoles.init(),
  ],
});

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["content-type", ...SuperTokens.getAllCORSHeaders()]
  })
);
app.use(bodyParser.json());
app.use(middleware());

// ---- Signup Endpoint ----
app.post("/signup", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${config.INTERNAL_SECRET}`) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const signUpResponse = await EmailPassword.signUp(config.TENANT_ID, email, password, undefined, { role });
    debugResponse("SignUp", signUpResponse);
    if (signUpResponse.status === "EMAIL_ALREADY_EXISTS_ERROR") {
      return res.status(400).json({ error: "Email already exists" });
    }

    const { user } = signUpResponse;
    const createdNewRoleResponse = await UserRoles.createNewRoleOrAddPermissions(role, ["read"]);
    debugResponse("CreatedNewRole", createdNewRoleResponse);

    const addRoleToUserResponse = await UserRoles.addRoleToUser(config.TENANT_ID, user.id, role);
    debugResponse("AddRoleToUser", addRoleToUserResponse);

    console.log(`User ${email} created with role ${role}`);

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ---- Signin Endpoint ----
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const signInResponse = await EmailPassword.signIn("public", email, password);
    debugResponse("SignIn", signInResponse);
    if (signInResponse.status === "WRONG_CREDENTIALS_ERROR") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { recipeUserId } = signInResponse;
    const userId = recipeUserId.getAsString();
    const getRoleForUserResponse = await UserRoles.getRolesForUser(config.TENANT_ID, userId);
    debugResponse("GetRoleForUser", getRoleForUserResponse);

    const role = getRoleForUserResponse.roles[0];
    const accessTokenPayload = {
      "https://hasura.io/jwt/claims": {
        "x-hasura-user-id": userId,
        "x-hasura-default-role": role,
        "x-hasura-allowed-roles": [role],
      },
      aud: "hasura",
    };

    const session = await Session.createNewSession(
      req,
      res,
      config.TENANT_ID,
      recipeUserId,
      accessTokenPayload,
      {},
      { role }
    );

    const accessToken = session.getAccessToken();

    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ---- Delete User Endpoint ----
app.delete("/user/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${config.INTERNAL_SECRET}`) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { id } = req.params;
  try {
    await SuperTokens.deleteUser(id);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

app.use(errorHandler());

// ---- Start Server ----
const port = config.PORT
app.listen(port, '0.0.0.0', () => {
  console.log(`Auth is running on http://localhost:${port}`);
});
