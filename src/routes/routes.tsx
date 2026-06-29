import { Routes, Route, HashRouter, useLocation, Outlet } from "react-router-dom";
import { Login } from "../app/login/Login";
import { Home } from "../app/home/Home";
import { GamesView } from "../app/games/GamesView";
import { LaunchesView } from "../app/launches/LaunchesView";
import { TrailersView } from "../app/trailers/TrailersView";
import { FavoritesView } from "../app/favorites/FavoritesView";
import { SettingsView } from "../app/settings/SettingsView";
import { Navbar } from "../shared/components/navbar/Navbar";
import { Sidebar } from "../shared/components/sidebar/Sidebar";
import { Tagbar } from "../shared/components/tagbar/Tagbar";
import { ProtectedRoute } from "./ProtectedRoute";

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const isInLogin = pathname === "/";

  return (
    <main className="flex flex-col h-screen bg-[#0c090c] text-white">
      {!isInLogin && <Navbar />}

      <div className="flex flex-1 min-h-0">
        {!isInLogin && <Sidebar />}

        <div className="flex-1 min-w-0 overflow-hidden bg-[#0c090c]">
          <Routes>
            <Route path="/" element={<Login />} />
            {/* Everything below requires an authenticated session */}
            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
              <Route path="/home" element={<Home />} />
              <Route path="/games" element={<GamesView />} />
              <Route path="/trailers" element={<TrailersView />} />
              <Route path="/launches" element={<LaunchesView />} />
              <Route path="/favorites" element={<FavoritesView />} />
              <Route path="/list" element={<FavoritesView />} />
              <Route path="/settings" element={<SettingsView />} />

              {/* Fallbacks */}
              <Route path="/genres" element={<GamesView />} />
              <Route path="/platforms" element={<GamesView />} />
              <Route path="/features" element={<Home />} />
            </Route>

            <Route path="/*" element={<p className="p-8 text-xl font-bold text-center">Página no encontrada</p>} />
          </Routes>
        </div>
      </div>

      {!isInLogin && <Tagbar />}
    </main>
  );
};

const MyRoutes: React.FC = () => {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
};

export default MyRoutes;
