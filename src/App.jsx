import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("havenlyFavorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("havenlyLoggedIn");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "havenlyFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  const handleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleRegister = (registeredUser) => {
    setUser(registeredUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("havenlyLoggedIn");
    localStorage.removeItem("havenlyRememberMe");
    localStorage.removeItem("havenlyToken");

    setUser(null);
  };

  return (
    <div className="app">
      {!isAdminPage && (
        <Navbar user={user} onLogout={handleLogout} />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Home
              favorites={favorites}
              onFavorite={handleFavorite}
            />
          }
        />

        <Route
          path="/properties"
          element={
            <Properties
              favorites={favorites}
              onFavorite={handleFavorite}
            />
          }
        />

        <Route
          path="/properties/:id"
          element={
            <PropertyDetails
              favorites={favorites}
              onFavorite={handleFavorite}
            />
          }
        />

        <Route
          path="/favorites"
          element={
            <Favorites
              favorites={favorites}
              onFavorite={handleFavorite}
              user={user}
            />
          }
        />

        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />

        <Route
          path="/register"
          element={<Register onRegister={handleRegister} />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
      </Routes>

      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;