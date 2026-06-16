import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { useEffect } from "react";
import videogames from "./images/videogames.webp";
import { EmailForm } from "./components/emailForm/EmailForm";
import { GoogleButton } from "./components/googleButton/GoogleButton";
import { PlaystationButton } from "./components/playstationButton/PlaystationButton";
import { QrCode } from "./components/qrcode/Qrcode";

export function Login() {
  useEffect(() => {
    setFocus("FIRST_CARD");
  }, []);

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

        <EmailForm />

        <div className="h-full min-w-[3px]">
          <div className="w-full h-1/2 bg-gradient-to-t from-purple-500 to-transparent" />
          <div className="w-full h-1/2 bg-gradient-to-b from-purple-500 to-transparent" />
        </div>

        <div className="flex flex-col justify-center w-full px-10">
          <QrCode />
          <GoogleButton />
          <PlaystationButton />
        </div>
      </div>
    </div>
  );
}
