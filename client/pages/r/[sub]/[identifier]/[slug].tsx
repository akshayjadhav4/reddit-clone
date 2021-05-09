import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

import useSWR from "swr";
import Axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import classnames from "classnames";

import Sidebar from "../../../../components/Sidebar/Sidebar";
import { Post, Comment } from "../../../../types";
import { useAuthState } from "../../../../context/auth";

dayjs.extend(relativeTime);

const ActionButton = ({ children }) => {
  return (
    <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
      {children}
    </div>
  );
};

export default function PostPage() {
  const router = useRouter();
  const { sub, identifier, slug } = router.query;
  const { authenticated, user } = useAuthState();

  const [commentInput, setCommentInput] = useState("");

  const { data: post, error, revalidate: revalidatePost } = useSWR<Post>(
    identifier && slug ? `/posts/getPost/${identifier}/${slug}` : null
  );

  const { data: comments, revalidate } = useSWR<Comment[]>(
    identifier && slug ? `/comments/getComments/${identifier}/${slug}` : null
  );

  const vote = async (value: number, comment?: Comment) => {
    if (!authenticated) router.push("/login");

    // if same value passed i.e reset vote
    if (
      (!comment && value === post.userVote) ||
      (comment && comment.userVote === value)
    ) {
      value = 0;
    }
    try {
      await Axios.post("/msc/vote", {
        identifier: post.identifier,
        slug: post.slug,
        commentIdentifier: comment?.identifier,
        value,
      });

      if (comment) {
        revalidate();
      } else {
        revalidatePost();
      }
    } catch (error) {
      console.log("ERROR WHILE VOTING", error);
    }
  };

  const addComment = async (event: FormEvent) => {
    event.preventDefault();
    if (commentInput.trim() === "") {
      return;
    }
    try {
      await Axios.post(`/comments/${identifier}/${slug}/add`, {
        body: commentInput,
      });
      setCommentInput("");
      revalidate();
    } catch (error) {
      console.log("ERROR WHILE COMMENTING");
    }
  };
  if (error) {
    return router.back();
  }
  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full ">
                  <Image
                    src={post.sub.imageURL}
                    alt="avatar-image"
                    width={32}
                    height={32}
                  />
                </div>
              )}
              <p className="text-xl font-semibold text-white">/r/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        {/* Post */}
        <div className="w-160">
          <div className="bg-white rounded">
            {post && (
              <>
                {/* post */}
                <div className="flex">
                  {/* Vote buttons */}
                  <div className="flex-shrink-0 w-10 py-3 text-center rounded-l">
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                      onClick={() => vote(1)}
                    >
                      <i
                        className={classnames("fas fa-arrow-up", {
                          "text-blue-500": post.userVote === 1,
                        })}
                      ></i>
                    </div>
                    <p className="text-xs font-bold">{post.voteScore}</p>
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                      onClick={() => vote(-1)}
                    >
                      <i
                        className={classnames("fas fa-arrow-down", {
                          "text-red-500": post.userVote === -1,
                        })}
                      ></i>
                    </div>
                  </div>
                  {/* Post Data */}
                  <div className="py-2 pr-2">
                    <div className="w-full">
                      <div className="flex items-center">
                        <p className="text-xs text-gray-500">
                          Posted By{" "}
                          <Link href={`/u/${post.username}`}>
                            <a className="mx-1 hover:underline">
                              /u/{post.username}
                            </a>
                          </Link>
                          <span className="mx-1 hover:underline">
                            {dayjs(post.createdAt).fromNow()}
                          </span>
                        </p>
                      </div>
                      {/* post body */}
                      <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                      <p className="my-3 text-sm ">{post.body}</p>
                      {/* post controls */}
                      <div className="flex ">
                        <Link href={post.url}>
                          <a>
                            <ActionButton>
                              <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                              <span className="font-bold">
                                {post.commentCount} Comments
                              </span>
                            </ActionButton>
                          </a>
                        </Link>
                        <ActionButton>
                          <i className="mr-1 fas fa-share fa-xs"></i>
                          <span className="font-bold">Share</span>
                        </ActionButton>
                        <ActionButton>
                          <i className="mr-1 fas fa-bookmark fa-xs"></i>
                          <span className="font-bold">Save</span>
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                </div>
                {/* comment input */}
                <div className="pl-10 pr-6 mb-4">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        Comment as{" "}
                        <Link href={`/u/${user.username}`}>
                          <a className="font-semibold text-blue-500">
                            {user.username}
                          </a>
                        </Link>
                      </p>
                      <form onSubmit={addComment}>
                        <textarea
                          name="comment"
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                          onChange={(e) => setCommentInput(e.target.value)}
                          value={commentInput}
                        ></textarea>
                        <div className="flex justify-end">
                          <button
                            className="px-3 py-1 blue button"
                            disabled={commentInput.trim() === ""}
                          >
                            Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                      <p className="font-semibold text-gray-400">
                        Log in or sign in to leave a comment
                      </p>
                      <div>
                        <Link href="/login">
                          <a className="px-4 py-1 mr-4 hollow blue button">
                            Log In
                          </a>
                        </Link>
                        <Link href="/register">
                          <a className="px-4 py-1 blue button">Sign In</a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                {/* comment input end */}
                {/* post  end */}
                <hr />
                {/* comments */}
                {comments?.map((comment) => (
                  <div className="flex" key={comment.identifier}>
                    {/* votes button */}
                    <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                      <div
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                        onClick={() => vote(1, comment)}
                      >
                        <i
                          className={classnames("fas fa-arrow-up", {
                            "text-blue-500": comment.userVote === 1,
                          })}
                        ></i>
                      </div>
                      <p className="text-xs font-bold">{comment.voteScore}</p>
                      <div
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                        onClick={() => vote(-1, comment)}
                      >
                        <i
                          className={classnames("fas fa-arrow-down", {
                            "text-red-500": comment.userVote === -1,
                          })}
                        ></i>
                      </div>
                    </div>
                    {/* votes button end */}
                    <div className="py-2 pr-2">
                      <p className="mb-1 text-xs leading-none">
                        <Link href={`/u/${comment.username}`}>
                          <a className="mr-1 font-bold hover:underline">
                            {comment.username}
                          </a>
                        </Link>
                        <span className="text-gray-600">
                          {`${comment.voteScore} Points • ${dayjs(
                            comment.createdAt
                          ).fromNow()}`}
                        </span>
                      </p>
                      <p>{comment.body}</p>
                    </div>
                  </div>
                ))}
                {/* comments end*/}
              </>
            )}
          </div>
        </div>
        {/* Sidebar */}
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  );
}
