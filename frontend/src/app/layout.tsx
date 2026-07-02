import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { JetBrains_Mono, Geist } from "next/font/google";
import { ThemeProvider, Providers } from "@/app/providers";
import "@/app/globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behaviour="smooth"
      className={cn("font-sans", geist.variable)}
    >
      <body>
        <Toaster position="top-right" />
        <Providers>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
