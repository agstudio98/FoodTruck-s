import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import "./styles/chatbot.css";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Marketplace from "./pages/MarketPlace.jsx";
import Cart from "./components/Cart.jsx";
import SupportChat from "./pages/SupportChat.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import OrderTracking from "./pages/OrderTracking.jsx";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <div className="loading-screen">Cargando...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/marketplace" element={<Marketplace />} />
            
            {/* Rutas Protegidas */}
            <Route path="/dashboard" element={
              <PrivateRoute><UserDashboard /></PrivateRoute>
            } />
            <Route path="/SupportChat" element={
              <PrivateRoute><SupportChat /></PrivateRoute>
            } />
            <Route path="/order-tracking/:orderId" element={
              <PrivateRoute><OrderTracking /></PrivateRoute>
            } />
            <Route path="/cart" element={
              <PrivateRoute><Cart /></PrivateRoute>
            } />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}