import { FormEvent, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import Axios from "axios";

import InputGroup from "../components/InputGroup/InputGroup";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  const registerUser = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await Axios.post("auth/register", {
        email,
        password,
        username,
      });
      router.push("/login");
    } catch (error) {
      console.log("ERROR WHILE SIGNUP OPERATION", error.response.data);
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex bg-white register">
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
          <h1 className="mb-2 text-lg font-bold">Sign Up</h1>
          <p className="mb-12 text-xs">
            By continuing, you agree to our{" "}
            <span className="text-blue-500 cursor-pointer">User Agreement</span>{" "}
            and{" "}
            <span className="text-blue-500 cursor-pointer">Privacy Policy</span>
            .
          </p>
          <form onSubmit={registerUser}>
            <InputGroup
              className="mb-2"
              type="email"
              placeholder="Email"
              value={email}
              error={errors.email}
              setValue={setEmail}
            />
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
              Sign Up
            </button>
          </form>
          <small className="text-sm ">
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
