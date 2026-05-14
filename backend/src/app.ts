import express from "express";
import githubRouter from "./routes/github";
import healthRouter from "./routes/health";
import spotifyRouter from "./routes/spotify";

const app = express();

app.use(express.json());
app.use("/health", healthRouter);
app.use("/api/github", githubRouter);
app.use("/api/spotify", spotifyRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "Portfolio backend is running",
  });
});

export default app;
