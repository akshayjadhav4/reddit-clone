import "../styles/globals.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

import Axios from "axios";

import Navbar from "../components/Navbar/Navbar";

Axios.defaults.baseURL = "http://localhost:2004/api";
Axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);
  return (
    <>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}

export default App;
