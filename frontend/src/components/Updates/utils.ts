import type { TFunction } from "i18next";

export type GitHubCommit = {
  message: string;
  url: string;
  repo: string;
  committedAt: string;
  sha: string;
};

export type SpotifyTrack = {
  title: string;
  artists: string;
  album?: string;
  url: string;
  playedAt?: string;
  isPlaying?: boolean;
};

export type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

export const initialState = <T,>(): AsyncState<T> => ({
  data: null,
  isLoading: true,
  error: null,
});

export const formatDate = (value: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const getErrorMessage = (t: TFunction, error: string | null) => {
  if (error === "missing-config" || error === "request-failed") {
    return t(`updates.errors.${error}`);
  }

  return t("updates.errors.request-failed");
};
