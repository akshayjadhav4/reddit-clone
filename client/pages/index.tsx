import Head from "next/head";

import useSWR from "swr";

import PostCard from "../components/PostCard/PostCard";

export default function Home() {
  const { data: posts } = useSWR("/posts/getPosts");

  return (
    <div className="home">
      <Head>
        <title>Get the information</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container flex pt-4">
        {/* POSTS */}
        <div className="w-160">
          <h1>Recent Posts</h1>
          {posts?.map((post) => (
            <PostCard key={post.identifier} post={post} />
          ))}
        </div>
        {/* sidebar */}
      </div>
    </div>
  );
}
