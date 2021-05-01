import { useRouter } from "next/router";
import useSWR from "swr";
import PostCard from "../../components/PostCard/PostCard";

export default function Sub() {
  const router = useRouter();
  const subName = router.query.sub;

  const { data: sub, error } = useSWR(
    subName ? `/subs/getSub/${subName}` : null
  );
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
  return (
    <div className="container flex pt-5">
      <div className="w-160">{pageContent}</div>
    </div>
  );
}
