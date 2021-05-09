import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import useSWR from "swr";
import Axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import classnames from "classnames";

import Sidebar from "../../../../components/Sidebar/Sidebar";
import { Post } from "../../../../types";
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
  const { authenticated } = useAuthState();

  const { data: post, error, revalidate } = useSWR<Post>(
    identifier && slug ? `/posts/getPost/${identifier}/${slug}` : null
  );

  const vote = async (value: number) => {
    if (!authenticated) router.push("/login");

    // if same value passed i.e reset vote
    if (value === post.userVote) {
      value = 0;
    }
    try {
      const res = await Axios.post("/msc/vote", {
        identifier: post.identifier,
        slug: post.slug,
        value,
      });
      revalidate();
    } catch (error) {
      console.log("ERROR WHILE VOTING", error);
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
              <div className="flex">
                {/* Vote buttons */}
                <div className="w-10 py-3 text-center rounded-l">
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
                <div className="p-2">
                  <div className="w-full p-2">
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
            )}
          </div>
        </div>
        {/* Sidebar */}
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  );
}
