import { Router } from "express";
import { getLatestCommit } from "../features/github/service";

const githubRouter = Router();

githubRouter.get("/latest-commit", async (_req, res) => {
  try {
    const latestCommit = await getLatestCommit();

    res.json(latestCommit);
  } catch (error) {
    console.error(error);

    const details = error instanceof Error ? error.message : "Unknown error";

    res.status(502).json({
      message: "Failed to load latest GitHub commit",
      details:
        process.env.NODE_ENV === "production" ? undefined : details,
    });
  }
});

export default githubRouter;
