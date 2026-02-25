import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <Navbar />
        <main className="min-h-screen px-4 sm:px-6 md:px-12 lg:px-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}