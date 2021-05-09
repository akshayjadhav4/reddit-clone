import {
  Entity as TOEntity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  Index,
  OneToMany,
} from "typeorm";

import { Exclude, Expose } from "class-transformer";

import { makeId } from "../utils/helpers";

import Entity from "./Entity";
import Post from "./Post";
import User from "./User";
import Vote from "./Vote";

@TOEntity("comments")
export default class Comment extends Entity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Index()
  @Column()
  identifier: string; // 7 char id

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  @Expose() get voteScore(): number {
    return this.votes?.reduce(
      (prev, current) => prev + (current.value || 0),
      0
    );
  }

  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex(
      (vote) => vote.username === user.username
    );
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8);
  }
}
