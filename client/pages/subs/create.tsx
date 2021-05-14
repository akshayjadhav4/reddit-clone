import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { FormEvent, useState } from "react";

import Axios from "axios";
import classnames from "classnames";

export default function Create() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Partial<any>>({});
  const router = useRouter();
  const createSub = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await Axios.post("/subs/create", {
        title,
        name,
        description,
      });
      router.push(`/r/${res.data.name}`);
    } catch (error) {
      console.log("ERROR WHILE CREATING SUB");
      setErrors(error.response.data);
    }
  };
  return (
    <div className="flex bg-white">
      <Head>
        <title>Create a Community</title>
      </Head>
      <div
        className="w-40 h-screen bg-center bg-cover side-view-img"
        style={{ backgroundImage: "url('/images/side-view-art.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6 ">
        <div className="w-98">
          <h1 className="mb-2 text-lg font-medium">Create a Community</h1>
          <hr />
          <form onSubmit={createSub}>
            <div className="my-6">
              <p className="font-medium ">Name</p>
              <p className="mb-2 text-xs text-gray-500">
                Community names including capitalization cannot be changed.{" "}
              </p>
              <input
                type="text"
                className={classnames(
                  "w-full p-3 border border-gray-200 rounded hover:border-gray-500",
                  { "border-red-600": errors.name }
                )}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <small className="font-medium text-red-600">{errors.name}</small>
            </div>
            <div className="my-6">
              <p className="font-medium ">Title</p>
              <p className="mb-2 text-xs text-gray-500">
                Community title represents the topic.
              </p>
              <input
                type="text"
                className={classnames(
                  "w-full p-3 border border-gray-200 rounded hover:border-gray-500",
                  { "border-red-600": errors.title }
                )}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <small className="font-medium text-red-600">{errors.title}</small>
            </div>
            <div className="my-6">
              <p className="font-medium ">Description</p>
              <p className="mb-2 text-xs text-gray-500">
                This is how new members came to understand your group.
              </p>
              <textarea
                className={classnames(
                  "w-full p-3 border border-gray-200 rounded hover:border-gray-500",
                  { "border-red-600": errors.description }
                )}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <small className="font-medium text-red-600">
                {errors.description}
              </small>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-1 text-sm font-semibold capitalize blue button">
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
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
