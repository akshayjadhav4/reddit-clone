import "../styles/globals.css";
import { AppProps } from "next/app";
import Axios from "axios";

Axios.defaults.baseURL = "http://localhost:2004/api";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
