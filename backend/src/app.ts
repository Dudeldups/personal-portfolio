import path from "node:path";
import express from "express";
import githubRouter from "./routes/github";
import healthRouter from "./routes/health";
import spotifyRouter from "./routes/spotify";

const app = express();
const frontendDistPath =
  process.env.FRONTEND_DIST_PATH ?? path.resolve(process.cwd(), "../frontend/dist");

app.use(express.json());
app.use("/health", healthRouter);
app.use("/api/github", githubRouter);
app.use("/api/spotify", spotifyRouter);

app.use(express.static(frontendDistPath));

app.get("/{*path}", (req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/health")) {
    next();
    return;
  }

  res.sendFile(path.join(frontendDistPath, "index.html"));
});

export default app;
