import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, createRef, useEffect, useState } from "react";
import useSWR from "swr";
import classnames from "classnames";
import Axios from "axios";

import PostCard from "../../components/PostCard/PostCard";
import { Sub } from "../../types";
import { useAuthState } from "../../context/auth";
import Sidebar from "../../components/Sidebar/Sidebar";

export default function SubPage() {
  const router = useRouter();
  const fileInputRef = createRef<HTMLInputElement>();
  const { authenticated, user } = useAuthState();
  const subName = router.query.sub;
  const [ownSub, setOwnSub] = useState(false);

  const { data: sub, error, revalidate } = useSWR<Sub>(
    subName ? `/subs/getSub/${subName}` : null
  );

  const openFileInput = (type: string) => {
    if (!ownSub) {
      return;
    }
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current.name);

    try {
      await Axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // refresh data
      revalidate();
    } catch (error) {
      console.log("ERROR WHILE UPLOADING IMAGE", error);
    }
  };

  let pageContent;
  if (error) {
    router.push("/");
  }
  if (!sub) {
    pageContent = <div className="text-5xl text-center">Loading...</div>;
  } else if (sub.posts.length === 0) {
    pageContent = <div className="text-5xl text-center">No posts</div>;
  } else {
    pageContent = sub.posts.map((post) => (
      <PostCard key={post.identifier} post={post} />
    ));
  }

  useEffect(() => {
    if (!sub) {
      return;
    }
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  return (
    <div>
      <div>
        <Head>
          <title>{sub?.title}</title>
        </Head>
      </div>
      {sub && (
        <>
          {/* Sub info & banner */}
          <input
            type="file"
            ref={fileInputRef}
            hidden={true}
            onChange={uploadImage}
          />
          <div>
            {/* banner Image */}
            <div
              className={classnames("bg-blue-500", {
                "cursor-pointer": ownSub,
              })}
              onClick={() => openFileInput("banner")}
            >
              {sub?.bannerURL ? (
                <div
                  className="h-56 bg-blue-500"
                  style={{
                    backgroundImage: `url(${sub?.bannerURL})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-blue-500 "></div>
              )}
            </div>
            {/* Info */}
            <div className="h-20 bg-white">
              <div className="container relative flex">
                <div className="absolute" style={{ top: -20 }}>
                  <Image
                    src={sub.imageURL}
                    alt="sub"
                    width={70}
                    height={70}
                    className={classnames("rounded-full", {
                      "cursor-pointer": ownSub,
                    })}
                    onClick={() => openFileInput("image")}
                  />
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-sm text-gray-600 font-body">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Posts & sidebar */}
          <div className="container flex pt-5">
            <div className="w-160">{pageContent}</div>
            <Sidebar sub={sub} />
          </div>
        </>
      )}
    </div>
  );
}
