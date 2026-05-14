import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "personal-portfolio-backend",
  });
});

app.get("/", (_req, res) => {
  res.json({
    message: "Portfolio backend is running",
  });
});

export default app;
