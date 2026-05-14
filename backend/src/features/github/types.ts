export type GitHubUserResponse = {
  login?: string;
};

export type GitHubRepo = {
  full_name?: string;
  private?: boolean;
  owner?: {
    login?: string;
  };
  name?: string;
};

export type GitHubEventCommit = {
  sha?: string;
  message?: string;
};

export type GitHubPushEvent = {
  type?: string;
  public?: boolean;
  created_at?: string;
  repo?: {
    name?: string;
  };
  payload?: {
    head?: string;
    commits?: GitHubEventCommit[];
  };
};

export type GitHubRepoCommit = {
  sha?: string;
  html_url?: string;
  commit?: {
    message?: string;
    author?: {
      date?: string;
    };
    committer?: {
      date?: string;
    };
  };
};

export type LatestGitHubCommit = {
  message: string;
  repo: string;
  sha: string;
  committedAt: string;
  url: string | null;
  isPrivate: boolean;
};
