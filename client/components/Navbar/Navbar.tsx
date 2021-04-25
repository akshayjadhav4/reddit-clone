import Link from "next/link";

import RedditLogo from "../../images/2SL.svg";
import { useAuthState, useAuthDispath } from "../../context/auth";

import Axios from "axios";

const Navbar: React.FC = () => {
  const { authenticated, loading } = useAuthState();
  const dispath = useAuthDispath();
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

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white ">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <a className="flex">
            <RedditLogo className="w-8 h-8 mr-2" />
            <span className="text-2xl font-semibold">reddit</span>
          </a>
        </Link>
      </div>
      {/* Search bar */}
      <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
        <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
        <input
          type="text"
          className="py-1 pr-3 bg-transparent rounded outline-none w-160"
          placeholder="Search"
        />
      </div>
      {/* buttons */}
      <div className="flex">
        {!loading &&
          (authenticated ? (
            <button
              className="w-32 py-1 mr-5 leading-5 hollow blue button"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <a className="w-32 py-1 mr-5 leading-5 hollow blue button">
                  Log in
                </a>
              </Link>
              <Link href="/register">
                <a className="w-32 py-1 leading-5 blue button">Sign Up</a>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
