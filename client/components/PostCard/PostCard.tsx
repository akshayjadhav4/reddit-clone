import Link from "next/link";
import { useRouter } from "next/router";

import Axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import classnames from "classnames";
import { Post } from "../../types";
import { useAuthState } from "../../context/auth";

interface PostCardProps {
  post: Post;
  revalidate?: Function;
}

dayjs.extend(relativeTime);

const ActionButton = ({ children }) => {
  return (
    <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
      {children}
    </div>
  );
};

export default function PostCard({ post, revalidate }: PostCardProps) {
  const { authenticated } = useAuthState();
  const router = useRouter();

  const vote = async (value) => {
    if (!authenticated) router.push("/login");
    if (value === post.userVote) {
      value = 0;
    }
    try {
      const res = await Axios.post("/msc/vote", {
        identifier: post.identifier,
        slug: post.slug,
        value,
      });
      if (revalidate) {
        revalidate();
      }
    } catch (error) {
      console.log("ERROR WHILE VOTING", error);
    }
  };

  return (
    <div
      key={post.identifier}
      id={post.identifier}
      className="flex mb-4 bg-white rounded"
    >
      {/* Vote section */}
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
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
      {/* Post section */}
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${post.subName}`}>
            <img
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              alt="avatar"
              className="w-6 h-6 mr-1 rounded-full cursor-pointer"
            />
          </Link>
          <Link href={`/r/${post.subName}`}>
            <a className="text-xs font-bold hover:underline">
              /r/{post.subName}
            </a>
          </Link>
          <p className="text-xs text-gray-500">
            <span className="mx-1">•</span> Posted By{" "}
            <Link href={`/u/${post.username}`}>
              <a className="mx-1 hover:underline">/u/{post.username}</a>
            </Link>
            <Link href={post.url}>
              <a className="mx-1 hover:underline">
                {dayjs(post.createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={post.url}>
          <a className="my-1 text-lg font-medium">{post.title}</a>
        </Link>
        {post.body && <p className="my-1 text-sm ">{post.body}</p>}
        <div className="flex ">
          <Link href={post.url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{post.commentCount} Comments</span>
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
  );
}
