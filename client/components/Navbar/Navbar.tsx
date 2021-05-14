import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import RedditLogo from "../../images/2SL.svg";
import { useAuthState, useAuthDispath } from "../../context/auth";

import Axios from "axios";
import { Sub } from "../../types";

const Navbar: React.FC = () => {
  const { authenticated, loading } = useAuthState();
  const dispath = useAuthDispath();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [subs, setSubs] = useState<Sub[]>([]);
  const [timer, setTimer] = useState(null);

  const logout = () => {
    Axios.get("/auth/logout")
      .then(() => {
        dispath({
          type: "LOGOUT",
        });
        window.location.reload();
      })
      .catch((error) => console.log("ERROR WHILE LOGOUT"));
  };

  const searchSubs = async () => {
    setTimer(
      setTimeout(async () => {
        try {
          const { data } = await Axios.get(`/subs/search/${searchTerm}`);
          setSubs(data);
        } catch (error) {
          console.log("ERROR WHILE SEARCHING SUBS", error);
        }
      }, 1000)
    );
  };

  const gotoSub = (subName: string) => {
    router.push(`/r/${subName}`);
    setSearchTerm("");
  };
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSubs([]);
      return;
    }
    searchSubs();
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white ">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <a className="flex">
            <RedditLogo className="w-8 h-8 mr-2" />
            <span className="hidden text-2xl font-semibold lg:block">
              reddit
            </span>
          </a>
        </Link>
      </div>
      {/* Search bar */}
      <div className="max-w-full px-4 w-160">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
          <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
          <input
            type="text"
            className="py-1 pr-3 bg-transparent rounded outline-none "
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div
            className="absolute left-0 right-0 bg-white"
            style={{ top: "100%" }}
          >
            {subs?.map((sub) => (
              <div
                className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                key={sub.name}
                onClick={() => gotoSub(sub.name)}
              >
                <Image
                  src={sub.imageURL}
                  alt="sub-image"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="ml-4 text-sm">
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-gray-600">{sub.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* buttons */}
      <div className="flex">
        {!loading &&
          (authenticated ? (
            <button
              className="hidden w-20 py-1 mr-5 leading-5 sm:block lg:w-32 hollow blue button"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <a className="hidden w-20 py-1 mr-5 leading-5 sm:block lg:w-32 hollow blue button">
                  Log in
                </a>
              </Link>
              <Link href="/register">
                <a className="hidden w-20 py-1 leading-5 sm:block lg:w-32 blue button">
                  Sign Up
                </a>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
