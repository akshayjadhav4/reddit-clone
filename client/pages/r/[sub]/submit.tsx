import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

import useSWR from "swr";
import Axios from "axios";

import Sidebar from "../../../components/Sidebar/Sidebar";
import { Post, Sub } from "../../../types";
import { GetServerSideProps } from "next";

export default function Submit() {
  const router = useRouter();
  const subName = router.query.sub;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { data: sub, error } = useSWR<Sub>(
    subName ? `/subs/getSub/${subName}` : null
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (title.trim() === "") {
      return;
    }
    try {
      const { data: post } = await Axios.post<Post>("/posts/create", {
        title: title.trim(),
        body,
        subName: sub.name,
      });
      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (error) {
      console.log("ERROR WHILE ADDING POST", error);
    }
  };
  if (error) {
    router.push("/");
  }
  return (
    <div className="container flex pt-5 ">
      <Head>
        <title>Submit to Reddit</title>
      </Head>
      <div className="w-160">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg">Submit post to a /r/{subName}</h1>
          <form onSubmit={submit}>
            <div className="relative mb-2">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                placeholder="Title"
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                className="absolute mb-2 text-sm text-gray-500 select-none"
                style={{ top: 10, right: 10 }}
              >
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
              value={body}
              placeholder="Text (Optional)"
              rows={4}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-2 py-1 blue button"
                disabled={title.trim().length === 0}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {sub && <Sidebar sub={sub} />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error("Missing Auth Cookie");
    await Axios.get("/auth/isAuthenticated", { headers: { cookie } });
    return { props: {} };
  } catch (error) {
    res.writeHead(307, { Location: "/login" }).end();
  }
};
