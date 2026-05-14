import { Router } from "express";
import {
  exchangeSpotifyCodeForTokens,
  getSpotifyAuthorizeUrl,
} from "../features/spotify/auth";

const spotifyRouter = Router();

spotifyRouter.get("/login", (_req, res) => {
  res.redirect(getSpotifyAuthorizeUrl());
});

spotifyRouter.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (typeof code !== "string" || code.length === 0) {
    res.status(400).json({
      message: "Missing Spotify authorization code",
    });
    return;
  }

  try {
    const tokens = await exchangeSpotifyCodeForTokens(code);

    res.type("html").send(`
      <main style="font-family: sans-serif; max-width: 48rem; margin: 3rem auto; padding: 0 1rem; line-height: 1.5;">
        <h1>Spotify token received</h1>
        <p>Copy this refresh token into your <code>backend/.env</code> as <code>SPOTIFY_REFRESH_TOKEN</code>.</p>
        <pre style="padding: 1rem; background: #111; color: #f5f5f5; border-radius: 0.75rem; overflow: auto;">${tokens.refresh_token ?? "No refresh token returned"}</pre>
        <p>Configured redirect URI:</p>
        <pre style="padding: 1rem; background: #f3f3f3; border-radius: 0.75rem; overflow: auto;">${process.env.SPOTIFY_REDIRECT_URI ?? "http://127.0.0.1:4000/api/spotify/callback"}</pre>
      </main>
    `);
  } catch (error) {
    console.error(error);

    res.status(502).json({
      message: "Failed to complete Spotify authorization",
      details:
        error instanceof Error && process.env.NODE_ENV !== "production"
          ? error.message
          : undefined,
    });
  }
});

export default spotifyRouter;
