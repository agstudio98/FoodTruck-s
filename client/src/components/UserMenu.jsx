import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function UserMenu({ close }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <div className="menu-backdrop" onClick={close} />

      <div className="user-menu-dropdown glass-ios fade-in">
        <div className="user-menu-header">
          {user?.profilePic ? (
            <img src={user.profilePic} alt="Avatar" className="user-avatar-img" />
          ) : (
            <div className="user-avatar-fallback">{user?.name?.charAt(0) || "U"}</div>
          )}
          <div className="user-meta">
            <div className="menu-name">{user?.name || "Usuario VIP"}</div>
            <div className="menu-email">{user?.email}</div>
          </div>
        </div>

        <div className="menu-actions">
          <Link to="/dashboard" onClick={close} className="menu-action">
            <span className="action-text">Mi Configuración</span>
          </Link>

          <Link to="/dashboard" onClick={close} className="menu-action">
            <span className="action-text">Métodos de Pago</span>
          </Link>

          <Link to="/SupportChat" onClick={close} className="menu-action">
            <span className="action-text">Soporte</span>
          </Link>
        </div>

        <div className="menu-footer">
          <button className="btn-logout-menu" onClick={() => { logout(); close(); }}>Cerrar Sesión</button>
        </div>
      </div>
    </>
  );
}