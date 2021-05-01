import "../styles/globals.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

import Axios from "axios";
import { SWRConfig } from "swr";

import Navbar from "../components/Navbar/Navbar";
import { AuthProvider } from "../context/auth";
Axios.defaults.baseURL = "http://localhost:2004/api";
Axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);
  return (
    <SWRConfig
      value={{
        fetcher: (url) => Axios.get(url).then((res) => res.data),
        dedupingInterval: 20000,
      }}
    >
      <AuthProvider>
        {!authRoute && <Navbar />}
        <Component {...pageProps} />
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
