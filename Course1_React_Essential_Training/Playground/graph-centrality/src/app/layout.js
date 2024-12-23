import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// in layout.js you can write any components that you want to appear in multiple pages
// Custom Defined Component
// Child Component-1/Header
// Place this child component inside the RootLayout
function Header(){
    return (
        <header className="bg-amber-500 py-4">
            <div className="container mx-auto px-4">
                <nav className="flex items-center justify-between">
                    <div className="bg-amber-400 flex items-center">
                        <Link href="/">Main</Link>
                    </div>
                    <div className="flex items-center">
                        <Link href="/utils">Utils-BFS</Link>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Header/>
        {children}
      </body>
    </html>
  );
}
