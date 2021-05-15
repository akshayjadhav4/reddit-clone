import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import useSWR, { useSWRInfinite } from "swr";

import PostCard from "../components/PostCard/PostCard";
import { useAuthState } from "../context/auth";
import { Sub, Post } from "../types";

export default function Home() {
  const [observedPost, setObservedPost] = useState("");
  const { authenticated } = useAuthState();

  // const { data: posts } = useSWR<Post[]>("/posts/getPosts");
  const { data: subs } = useSWR<Sub[]>("/msc/topSubs");

  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    revalidate,
  } = useSWRInfinite<Post[]>((index) => `/posts/getPosts?page=${index}`);

  const posts: Post[] = data ? [].concat(...data) : [];
  const isInitialLoading = !data && !error;
  const observeElement = (element: HTMLElement) => {
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log("Page end");
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
  };
  useEffect(() => {
    if (!posts || posts.length === 0) {
      return;
    }
    const id = posts[posts.length - 1].identifier;
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);
  return (
    <div className="home">
      <Head>
        <title>Get the information</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container flex pt-4">
        {/* POSTS */}
        <div className="w-full px-4 md:w-160 md:p-0">
          {isInitialLoading && (
            <p className="text-lg text-center">Loading...</p>
          )}
          {posts?.map((post) => (
            <PostCard
              key={post.identifier}
              post={post}
              revalidate={revalidate}
            />
          ))}
          {isValidating && posts.length > 0 && (
            <p className="text-lg text-center">Loading next posts...</p>
          )}
        </div>
        {/* sidebar */}
        <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center ">
                Top Communities
              </p>
            </div>
          </div>
          {subs?.map((sub) => (
            <div
              key={sub.name}
              className="flex items-center px-4 py-2 text-xs bg-white border-b"
            >
              <Link href={`/r/${sub.name}`}>
                <a>
                  <Image
                    src={sub.imageURL}
                    alt="avatar-image"
                    width={24}
                    height={24}
                    className="rounded-full cursor-pointer"
                  />
                </a>
              </Link>
              <Link href={`/r/${sub.name}`}>
                <a className="ml-2 font-bold hover:cursor-pointer ">
                  /r/{sub.name}
                </a>
              </Link>
              <p className="ml-auto font-medium">{sub.postCount}</p>
            </div>
          ))}
          {authenticated && (
            <div className="p-4 bg-white border-t-2">
              <Link href="/subs/create">
                <a className="w-full px-2 py-1 blue button">Create Community</a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
