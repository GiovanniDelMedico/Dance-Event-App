import { BrowserRouter } from "react-router-dom";
import Navbar from "./layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      {/* Toaster globale */}
      <Toaster position="top-right" />

      {/* Layout principale */}
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
