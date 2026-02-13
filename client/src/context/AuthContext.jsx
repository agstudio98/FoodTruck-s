import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Iniciar sesión con localStorage/sessionStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    
    // Capturar query params de Google OAuth callback
    const params = new URLSearchParams(window.location.search);
    const paramToken = params.get('token');
    const paramUserStr = params.get('user');
    
    if (paramToken && paramUserStr) {
      try {
        const paramUser = JSON.parse(decodeURIComponent(paramUserStr));
        localStorage.setItem("token", paramToken);
        localStorage.setItem("user", JSON.stringify(paramUser));
        setIsAuthenticated(true);
        setUser(paramUser);
        // Limpiar URL de query params
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error('Error parsing Google OAuth params:', err);
      }
    }
    
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = async (formData) => {
    try {
      // Prioridad: user from context > localStorage > sessionStorage
      let currentUser = user;
      if (!currentUser) {
        const stored = localStorage.getItem('user');
        if (stored) currentUser = JSON.parse(stored);
      }
      if (!currentUser) {
        const session = sessionStorage.getItem('user');
        if (session) currentUser = JSON.parse(session);
      }

      const id = currentUser?._id || currentUser?.id;
      if (!id) {
        console.error('No user id found:', { currentUser });
        return { success: false, msg: 'No user id - please log in again' };
      }

      const optimistic = { ...(currentUser || {}), ...formData };
      setUser(optimistic);
      localStorage.setItem("user", JSON.stringify(optimistic));

      const response = await fetch("http://localhost:5000/api/auth/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { success: true };
      } else {
        // Revert optimistic update on failure
        const previous = currentUser;
        setUser(previous);
        localStorage.setItem('user', JSON.stringify(previous));
        try {
          const json = await response.json();
          console.error('Update error:', json);
          return { success: false, msg: json.msg || JSON.stringify(json) };
        } catch {
          const text = await response.text();
          console.error('Update error text:', text);
          return { success: false, msg: text };
        }
      }
    } catch (error) {
      console.error("Error al sincronizar perfil:", error);
      return { success: false, msg: error.message };
    }
  };

  const fetchUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/user/${id}`);
      if (res.ok) {
        const u = await res.json();
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
        return u;
      }
    } catch (err) {
      console.error('Error fetching user', err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};