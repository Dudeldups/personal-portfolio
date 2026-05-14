import type { TFunction } from "i18next";

export type GitHubCommit = {
  message: string;
  url: string | null;
  repo: string;
  committedAt: string;
  sha: string;
  isPrivate: boolean;
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

export const formatRelativeDate = (
  value: string,
  locale: string,
  t: TFunction,
) => {
  const targetDate = new Date(value);
  const now = new Date();

  const targetDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );
  const currentDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const millisecondsPerDay = 86_400_000;
  const dayDifference = Math.round(
    (currentDay.getTime() - targetDay.getTime()) / millisecondsPerDay,
  );

  const timeString = new Intl.DateTimeFormat(locale, {
    timeStyle: "short",
  }).format(targetDate);

  if (dayDifference === 0) {
    return `${t("updates.date.today")} · ${timeString}`;
  }

  if (dayDifference === 1) {
    return `${t("updates.date.yesterday")} · ${timeString}`;
  }

  return formatDate(value, locale);
};

export const getErrorMessage = (t: TFunction, error: string | null) => {
  if (error === "missing-config" || error === "request-failed") {
    return t(`updates.errors.${error}`);
  }

  return t("updates.errors.request-failed");
};
