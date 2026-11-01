import type { Metadata } from "next";
import "./globals.css";
import DataProvider from "@/components/DataProvider";
import OpeningDirectoryModal from "@/components/OpeningDirectoryModal";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "ALTITUDE — Premier Travel Cards",
  description: "A curated concierge for premium travel cards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,400..500&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <DataProvider />
        <main className="wrap" id="view">{children}</main>
        <footer className="site">
          <div className="wrap">
            <p>ALTITUDE · A curated concierge for premium travel cards · Illustrative product data for demonstration</p>
          </div>
        </footer>
        <OpeningDirectoryModal />
        <BottomNav />
      </body>
    </html>
  );
}
