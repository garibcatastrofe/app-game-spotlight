import { Routes, Route, HashRouter, useLocation, Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { Login } from "../app/login/Login";
import { Home } from "../app/home/Home";
import { GamesView } from "../app/games/GamesView";
import { LaunchesView } from "../app/launches/LaunchesView";
import { TrailersView } from "../app/trailers/TrailersView";
import { FavoritesView } from "../app/favorites/FavoritesView";
import { SettingsView } from "../app/settings/SettingsView";
import { NoticiasView } from "../app/noticias/NoticiasView";
import { GenresView } from "../app/genres/Genres";
import { PlatformsView } from "../app/platforms/PlatformsView";
import { SearchView } from "../app/search/SearchView";
import { NotificationsView } from "../app/notifications/NotificationsView";
import { Navbar } from "../shared/components/navbar/Navbar";
import { Sidebar } from "../shared/components/sidebar/Sidebar";
import { Tagbar } from "../shared/components/tagbar/Tagbar";
import { ProtectedRoute } from "./ProtectedRoute";

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const isInLogin = pathname === "/";
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    setFocus(`SIDEBAR_${pathname}`);
  }, [pathname]);

  return (
    <main className="flex flex-col h-screen bg-[#0c090c] text-white">
      {!isInLogin && <Navbar />}

      <div className="flex flex-1 min-h-0">
        {!isInLogin && <Sidebar />}

        <div ref={contentRef} className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto flex flex-col bg-[#0c090c]">
          <Routes>
            <Route path="/" element={<Login />} />
            {/* Everything below requires an authenticated session */}
            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
              <Route path="/home" element={<Home />} />
              <Route path="/games" element={<GamesView />} />
              <Route path="/trailers" element={<TrailersView />} />
              <Route path="/launches" element={<LaunchesView />} />
              <Route path="/noticias" element={<NoticiasView />} />
              <Route path="/genres" element={<GenresView />} />
              <Route path="/platforms" element={<PlatformsView />} />
              <Route path="/search" element={<SearchView />} />
              <Route path="/notifications" element={<NotificationsView />} />
              <Route path="/favorites" element={<FavoritesView />} />
              <Route path="/list" element={<FavoritesView />} />
              <Route path="/settings" element={<SettingsView />} />
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
