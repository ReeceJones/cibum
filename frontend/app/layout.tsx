import { Rubik } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PublicEnvScript } from "next-runtime-env";

const rubik = Rubik({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <PublicEnvScript />
        </head>
        <body className={rubik.className}>{children}</body>
        <Toaster />
      </html>
    </ClerkProvider>
  );
}
