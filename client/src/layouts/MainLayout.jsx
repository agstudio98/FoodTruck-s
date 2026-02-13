import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Support from "../components/Support.jsx";
import SupportBot from "../components/SupportBot.jsx";

export default function MainLayout() {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="main-container">
        <Outlet /> 
      </main>
      <Support />
      <SupportBot />
      <Footer />
    </div>
  );
}