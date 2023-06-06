import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      className="h-full bg-gray-900 antialiased scroll-smooth overflow-x-hidden"
      lang="en"
    >
      <Head />

      <body className="flex h-full flex-col">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
