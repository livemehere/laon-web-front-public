import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/App.scss";
import { RecoilRoot } from "recoil";
import Wrap from "../components/Wrap";
import Script from "next/script";
import { useEffect } from "react";
import AxiosManager from "../util/axiosManager";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
    });
  }, []);

  return (
    <>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.naverClientKey}`}
        strategy={"beforeInteractive"}
      />
      <Script
        src={"https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js"}
        strategy={"beforeInteractive"}
      />
      <Head>
        <title>라온디어스 체험단</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Wrap>
            <Component {...pageProps} />
          </Wrap>
          {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        </QueryClientProvider>
      </RecoilRoot>
    </>
  );
}

export default MyApp;
