import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { achievementsTable } from "@workspace/db/schema";
import { CreateAchievementBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const achievements = await db
    .select()
    .from(achievementsTable)
    .orderBy(desc(achievementsTable.year));
  
  res.json(achievements.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description,
    year: a.year,
    awardedTo: a.awardedTo,
    category: a.category,
    icon: a.icon ?? undefined,
  })));
});

router.post("/", async (req, res) => {
  const session = req.session as any;
  if (!session.userId || session.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  const parseResult = CreateAchievementBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const data = parseResult.data;
  const [achievement] = await db.insert(achievementsTable).values({
    title: data.title,
    description: data.description,
    year: data.year,
    awardedTo: data.awardedTo,
    category: data.category,
    icon: data.icon,
  }).returning();

  res.status(201).json({
    id: achievement.id,
    title: achievement.title,
    description: achievement.description,
    year: achievement.year,
    awardedTo: achievement.awardedTo,
    category: achievement.category,
    icon: achievement.icon ?? undefined,
  });
});

export default router;
