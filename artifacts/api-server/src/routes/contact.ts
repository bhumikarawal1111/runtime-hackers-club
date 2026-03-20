import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactsTable } from "@workspace/db/schema";
import { SendContactMessageBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  const session = req.session as any;
  if (!session.userId || session.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  const messages = await db
    .select()
    .from(contactsTable)
    .orderBy(desc(contactsTable.createdAt));
  
  res.json(messages.map(m => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    createdAt: m.createdAt?.toISOString() ?? new Date().toISOString(),
  })));
});

router.post("/", async (req, res) => {
  const parseResult = SendContactMessageBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const data = parseResult.data;
  await db.insert(contactsTable).values({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
  });

  res.status(201).json({ message: "Message sent successfully" });
});

export default router;
