import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { eventsTable } from "@workspace/db/schema";
import { CreateEventBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const events = await db
    .select()
    .from(eventsTable)
    .orderBy(desc(eventsTable.createdAt));
  
  res.json(events.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    date: e.date,
    location: e.location,
    category: e.category,
    imageUrl: e.imageUrl ?? undefined,
  })));
});

router.post("/", async (req, res) => {
  const session = req.session as any;
  if (!session.userId || session.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  const parseResult = CreateEventBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const data = parseResult.data;
  const [event] = await db.insert(eventsTable).values({
    title: data.title,
    description: data.description,
    date: data.date,
    location: data.location,
    category: data.category,
    imageUrl: data.imageUrl,
  }).returning();

  res.status(201).json({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    location: event.location,
    category: event.category,
    imageUrl: event.imageUrl ?? undefined,
  });
});

export default router;
