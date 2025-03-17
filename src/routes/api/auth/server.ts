import { Elysia } from "elysia";
import bcrypt from "bcryptjs";
import { users } from './schema';
import jwt from '@elysiajs/jwt';
import { db } from '~/routes/api/db';
import { eq } from "drizzle-orm";
import "dotenv/config";
import { cookie } from '@elysiajs/cookie';

export const usersRoute = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET_TOKEN ?? "", //Store securely in .env
      exp: "20m",
    })
  )
  .use(cookie())
  .post("/register", async ({ body }) => {
    // @ts-ignore
    const { username, password } = body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Inserting:", { username, password: hashedPassword });
    try {
      await db.insert(users).values({ username, password: hashedPassword });
      return { success: true };
    } catch (err) {
      console.error("DB Insert Error:", err);
      return { error: err.message };
    }
    return { success: true };
  })
  .post("/login", async ({ body, jwt,  cookie: { auth } }) => {
    // @ts-ignore
    const { username, password } = body;

    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (!user.length) return { error: "User not found" };
      const firstUser = user[0] ?? { id: "", password: "" };
      const valid = await bcrypt.compare(password, firstUser.password);
      if (!valid) return { error: "Invalid credentials" };

      const token = await jwt.sign({ id: firstUser.id, username });
      auth?.set({
        value: token,
        httpOnly: true,
        maxAge: 7 * 86400,
        path: '/',
        sameSite: "lax"
      })

      return { token };
    } catch (err) {
      console.error("Select users error:", err);
      return { error: err.message  };
    }
  }).post('/profile', async ({ jwt, error, cookie: { auth } }) => {
    const profile = await jwt.verify(auth?.value)

    if (!profile) return error(401, 'Unauthorized')
    return `Hello ${profile.username}`
  }).get("/me", async ({ jwt, request, set }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      set.status = 401;
      return { error: "Missing or invalid Authorization header" };
    }

    const token = authHeader.split(" ")[1];
    const user = await jwt.verify(token);

    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    return user;
  }).post("/logout", async ({ cookie: { auth } }) => {
    try {
      auth?.set({
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        expires: new Date(0) // Expire the cookie immediately
      });
    } catch (err) {
      console.error("Logout Cookie Error:", err);
      return { error: err.message  };
    }
    return { message: "Logged out" };
  });


console.log("Server running on http://localhost:3000");
