import type { Metadata } from "next";
import "./globals.css";
import SideBar from "@/components/Sidebar/SideBar";
import Header from "@/components/Header/Header";

export const metadata: Metadata = {
  title: "Active Expenses",
  description: "expense tracking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header/>
        <div className="flex">
          <SideBar/>
          {children}
        </div>
      </body>
    </html>
  );
}
