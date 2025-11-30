import { Providers } from "../providers";
import "./globals.css";
import Navbar from "../components/head/navbar";
import Footer from "../components/head/footer";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
       <NextSSRPlugin
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
