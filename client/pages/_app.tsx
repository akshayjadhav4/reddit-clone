import "../styles/globals.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

import Axios from "axios";
import { SWRConfig } from "swr";

import Navbar from "../components/Navbar/Navbar";
import { AuthProvider } from "../context/auth";
Axios.defaults.baseURL = "http://localhost:2004/api";
Axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
  try {
    const res = await Axios.get(url);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);
  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 20000,
      }}
    >
      <AuthProvider>
        {!authRoute && <Navbar />}
        <div className={authRoute ? "" : "pt-12"}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
