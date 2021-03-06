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
  sub?: Sub;
}

export interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sub {
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  description: string;
  imageURN: string;
  bannerURN: string;
  username: string;
  posts: Post[];
  imageURL: string;
  bannerURL: string;
  postCount?: number;
}

export interface Comment {
  createdAt: string;
  updatedAt: string;
  identifier: string;
  body: string;
  username: string;
  userVote: number;
  voteScore: number;
}
