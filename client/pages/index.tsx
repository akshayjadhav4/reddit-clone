import { useEffect, useState } from "react";
import Head from "next/head";

import Axios from "axios";

import { Post } from "../types";
import PostCard from "../components/PostCard/PostCard";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    Axios.get("/posts/getPosts")
      .then((res) => setPosts(res.data))
      .catch((error) => console.log("FETCH POSTS ERROR ", error));
    return () => {};
  }, []);
  return (
    <div className="pt-12 home">
      <Head>
        <title>Get the information</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container flex pt-4">
        {/* POSTS */}
        <div className="w-160">
          <h1>Recent Posts</h1>
          {posts.map((post) => (
            <PostCard key={post.identifier} post={post} />
          ))}
        </div>
        {/* sidebar */}
      </div>
    </div>
  );
}
