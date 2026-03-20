import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/login", async (req, res) => {
  const parseResult = LoginBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { username, password, role } = parseResult.data;

  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  const user = users[0];

  if (!user || user.password !== password || user.role !== role) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  (req.session as any).userId = user.id;
  (req.session as any).role = user.role;

  res.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email ?? undefined,
    },
    message: "Login successful",
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
});

router.get("/me", async (req, res) => {
  const session = req.session as any;
  if (!session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, session.userId));

  const user = users[0];
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    email: user.email ?? undefined,
  });
});

export default router;
