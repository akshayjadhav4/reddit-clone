import "../styles/globals.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

import Axios from "axios";

import Navbar from "../components/Navbar/Navbar";
import { AuthProvider } from "../context/auth";
Axios.defaults.baseURL = "http://localhost:2004/api";
Axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);
  return (
    <AuthProvider>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;
