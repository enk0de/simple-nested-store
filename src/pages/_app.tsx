import { StoreProvider } from "@/contexts/StoreContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider
      id="Global"
      initialState={{ foo: "Hi", bar: { a: 2, b: "cake" } }}
    >
      <Component {...pageProps} />
    </StoreProvider>
  );
}
