import Head from "next/head";
import Link from "next/link";

export default function Register() {
  return (
    <div className="flex register">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="w-40 h-screen bg-center bg-cover side-view-img"
        style={{ backgroundImage: "url('/images/side-view-art.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6 form-container">
        <div className="w-72">
          <h1 className="mb-2 font-sans text-lg font-bold">Sign Up</h1>
          <p className="mb-12 font-sans text-xs">
            By continuing, you agree to our{" "}
            <span className="text-blue-500 cursor-pointer">User Agreement</span>{" "}
            and{" "}
            <span className="text-blue-500 cursor-pointer">Privacy Policy</span>
            .
          </p>
          <form>
            <div className="mb-2">
              <input
                type="email"
                className="w-full px-3 py-2 bg-gray-100 border-gray-400 rounded focus:outline-none"
                placeholder="Email"
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-100 border-gray-400 rounded focus:outline-none"
                placeholder="Username"
              />
            </div>
            <div className="mb-2">
              <input
                type="password"
                className="w-full px-3 py-2 bg-gray-100 border-gray-400 rounded focus:outline-none"
                placeholder="Confirm Password"
              />
            </div>
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded hover:bg-blue-400">
              Sign Up
            </button>
          </form>
          <small className="font-sans text-sm">
            Already a have an account ?{" "}
            <Link href="/login">
              <a className="text-blue-500">LOG IN</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
