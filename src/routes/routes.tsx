import { Routes, Route, HashRouter, useLocation } from "react-router-dom";
import { Login } from "../app/login/Login";
import { Home } from "../app/home/Home";
import { Navbar } from "../shared/components/navbar/Navbar";
import { Sidebar } from "../shared/components/sidebar/Sidebar";
import { Tagbar } from "../shared/components/tagbar/Tagbar";

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const isInLogin = pathname === "/";

  return (
    <main className="flex flex-col h-screen">
      {!isInLogin && <Navbar />}

      <div className="flex flex-1 min-h-0">
        {!isInLogin && <Sidebar />}

        <div className="flex-1 min-w-0 overflow-hidden">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/genres" element={<Home />} />
            <Route path="/launches" element={<Home />} />
            <Route path="/trailers" element={<Home />} />
            <Route path="/platforms" element={<Home />} />
            <Route path="/favorites" element={<Home />} />
            <Route path="/settings" element={<Home />} />
            <Route path="/games" element={<Home />} />
            <Route path="/features" element={<Home />} />
            <Route path="/list" element={<Home />} />
            <Route path="/*" element={<p>Not Found</p>} />
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
