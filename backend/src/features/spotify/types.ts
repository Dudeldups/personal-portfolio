export type SpotifyTokenResponse = {
  access_token?: string;
  token_type?: string;
  scope?: string;
  expires_in?: number;
  refresh_token?: string;
  error?: string;
  error_description?: string;
};

export type SpotifyRecentTrackResponse = {
  items?: Array<{
    track?: {
      name?: string;
      album?: {
        name?: string;
      };
      artists?: Array<{
        name?: string;
      }>;
      external_urls?: {
        spotify?: string;
      };
    };
    played_at?: string;
  }>;
  error?: {
    message?: string;
  };
};

export type SpotifyRecentTrack = {
  title: string;
  artists: string;
  album?: string;
  url: string;
  playedAt?: string;
  isPlaying: false;
};
