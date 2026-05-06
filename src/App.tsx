import { BrowserRouter, useLocation } from "react-router-dom";
import Navbar from "./layout/Navbar";
import MobileNav from "./layout/MobileNav";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function AppLayout() {
  const location = useLocation();

  // Nascondi MobileNav quando sei dentro una chat
  const hideMobileNav = location.pathname.startsWith("/messages/");

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--gray-900)]">

      {/* NAVBAR DESKTOP */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* CONTENUTO PRINCIPALE */}
      {/* pb-20 solo se MobileNav è visibile */}
      <main className={hideMobileNav ? "pb-0" : "pb-20 md:pb-0"}>
        <AppRoutes />
      </main>

      {/* NAVBAR MOBILE */}
      {!hideMobileNav && (
        <div className="md:hidden">
          <MobileNav />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppLayout />
    </BrowserRouter>
  );
}
