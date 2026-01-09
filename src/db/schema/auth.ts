import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../index";
import * as schema from "./index";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
        ...schema,
        users: schema.users,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4321",
  trustedOrigins: [
    "http://localhost:4321",
    process.env.PRODUCTION_URL || "",
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, 
    autoSignIn: true
 },
});

type Session = typeof auth.$Infer.Session