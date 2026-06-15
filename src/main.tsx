import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { init } from "@noriginmedia/norigin-spatial-navigation";

init();

const root = document.getElementById("root");

createRoot(root!).render(<App />);
