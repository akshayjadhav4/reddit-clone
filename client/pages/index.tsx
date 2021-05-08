import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import useSWR from "swr";

import PostCard from "../components/PostCard/PostCard";
import { Sub } from "../types";

export default function Home() {
  const { data: posts } = useSWR("/posts/getPosts");
  const { data: subs } = useSWR("/msc/topSubs");

  return (
    <div className="home">
      <Head>
        <title>Get the information</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container flex pt-4">
        {/* POSTS */}
        <div className="w-160">
          {posts?.map((post) => (
            <PostCard key={post.identifier} post={post} />
          ))}
        </div>
        {/* sidebar */}
        <div className="ml-6 w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center ">
                Top Communities
              </p>
            </div>
          </div>
          {subs?.map((sub: Sub) => (
            <div
              key={sub.name}
              className="flex items-center px-4 py-2 text-xs bg-white border-b"
            >
              <Link href={`/r/${sub.name}`}>
                <Image
                  src={sub.imageURL}
                  alt="avatar-image"
                  width={24}
                  height={24}
                  className="rounded-full cursor-pointer"
                />
              </Link>
              <Link href={`/r/${sub.name}`}>
                <a className="ml-2 font-bold hover:cursor-pointer ">
                  /r/${sub.name}
                </a>
              </Link>
              <p className="ml-auto font-medium">{sub.postCount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
