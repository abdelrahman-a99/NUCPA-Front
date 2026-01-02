import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <h1>404 Not Found</h1>
      </main>
      <Footer />
    </div>
  );
}
