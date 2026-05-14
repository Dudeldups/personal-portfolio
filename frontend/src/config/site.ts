const splitConfigLines = (value?: string) =>
  (value ?? "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

export const siteConfig = {
  legalName: import.meta.env.VITE_LEGAL_NAME ?? "",
  legalEmail: import.meta.env.VITE_LEGAL_EMAIL ?? "",
  legalAddressLines: splitConfigLines(import.meta.env.VITE_LEGAL_ADDRESS),
  hostingProviderLines: splitConfigLines(import.meta.env.VITE_HOSTING_PROVIDER),
  privacyUpdatedAt: import.meta.env.VITE_PRIVACY_UPDATED_AT ?? "",
  githubOwner: import.meta.env.VITE_GITHUB_OWNER ?? "",
  githubRepo: import.meta.env.VITE_GITHUB_REPO ?? "",
  spotifyRecentTrackEndpoint:
    import.meta.env.VITE_SPOTIFY_RECENT_TRACK_ENDPOINT ?? "",
  spotifyProfileUrl: import.meta.env.VITE_SPOTIFY_PROFILE_URL ?? "",
};
