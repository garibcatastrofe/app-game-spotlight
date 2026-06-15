import { Routes, Route, HashRouter } from "react-router-dom";
import { Login } from "../app/login/Login";
import { Home } from "../app/home/Home";

const Layout: React.FC = () => {
  return (
    <main className="flex p-6">
      {/* RUTAS */}
      <Routes>
        {/* GENERALES */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />

        {/* USUARIOS */}
        {/* <Route path="/users/" element={<UsuariosPage />}>
          <Route path="clients" element={<ClientesPage />} />
          <Route path="employees" element={<EmpleadosPage />} />
        </Route> */}

        {/* NOT FOUND */}
        <Route path="/*" element={<p>Not Found</p>} />
      </Routes>
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
