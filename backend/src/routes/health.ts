import { Router } from "express";

const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "personal-portfolio-backend",
  });
});

export default healthRouter;
