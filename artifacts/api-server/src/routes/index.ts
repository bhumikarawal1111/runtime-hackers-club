import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import eventsRouter from "./events";
import achievementsRouter from "./achievements";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/events", eventsRouter);
router.use("/achievements", achievementsRouter);
router.use("/contact", contactRouter);

export default router;
