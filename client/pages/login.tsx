import { FormEvent, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import Axios from "axios";

import InputGroup from "../components/InputGroup/InputGroup";
import { useAuthDispath, useAuthState } from "../context/auth";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  const dispatch = useAuthDispath();
  const { authenticated } = useAuthState();

  const loginUser = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await Axios.post("auth/login", {
        password,
        username,
      });
      dispatch({ type: "LOGIN", payload: res.data });
      router.push("/");
    } catch (error) {
      console.log("ERROR WHILE SIGNIN OPERATION", error.response.data);
      setErrors(error.response.data);
    }
  };
  if (authenticated) {
    router.push("/");
  }
  return (
    <div className="flex bg-white login">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="w-40 h-screen bg-center bg-cover side-view-img"
        style={{ backgroundImage: "url('/images/side-view-art.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6 form-container">
        <div className="w-72">
          <h1 className="mb-2 text-lg font-bold">Sign In</h1>

          <form onSubmit={loginUser}>
            <InputGroup
              className="mb-2"
              type="text"
              placeholder="Username"
              value={username}
              error={errors.username}
              setValue={setUsername}
            />
            <InputGroup
              className="mb-2"
              type="password"
              placeholder="Password"
              value={password}
              error={errors.password}
              setValue={setPassword}
            />
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded hover:bg-blue-400">
              Sign In
            </button>
          </form>
          <small className="text-sm ">
            Create an account ?{" "}
            <Link href="/register">
              <a className="text-blue-500">SIGN UP</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
