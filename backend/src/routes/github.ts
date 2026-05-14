import { Router } from "express";
import { getLatestCommit } from "../features/github/getLatestCommit";

const githubRouter = Router();

githubRouter.get("/latest-commit", async (_req, res) => {
  try {
    const latestCommit = await getLatestCommit();

    res.json(latestCommit);
  } catch (error) {
    console.error(error);

    res.status(502).json({
      message: "Failed to load latest GitHub commit",
    });
  }
});

export default githubRouter;
