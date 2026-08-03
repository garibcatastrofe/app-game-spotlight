import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { useEffect } from "react";
import videogames from "../login/images/videogames.webp";
import { RegisterForm } from "./components/RegisterForm";
import { api } from "../../shared/services/api";
import { useNavigate } from "react-router-dom";

export function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    if (api.isLoggedIn()) {
      navigate("/home");
    } else {
      setFocus("FIRST_CARD");
    }
  }, [navigate]);

  return (
    <div className="relative flex flex-col flex-1 h-full p-6">
      <img
        src={videogames}
        className="absolute top-0 left-0 z-0 object-cover object-center w-full h-full"
      />

      <div
        className="z-10 h-full flex p-6 border-[3px] border-purple-500 rounded-2xl bg-slate-950/70 relative"
        style={{
          boxShadow: "0px 0px 10px 10px #a855f744",
        }}
      >
        <div
          className="absolute inset-0 rounded-xl"
          style={{ boxShadow: "inset 0px 0px 10px 5px #a855f744" }}
        />

        <RegisterForm />
      </div>
    </div>
  );
}
