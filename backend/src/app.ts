import express from "express";
import githubRouter from "./routes/github";
import healthRouter from "./routes/health";

const app = express();

app.use(express.json());
app.use("/health", healthRouter);
app.use("/api/github", githubRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "Portfolio backend is running",
  });
});

export default app;
