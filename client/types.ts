export interface Post {
  identifier: string;
  title: string;
  slug: string;
  body?: string;
  subName: string;
  username: string;
  url: string;
  createdAt: string;
  voteScore?: number;
  commentCount?: number;
  userVote?: number;
}

export interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
