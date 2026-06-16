import { EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useRef } from "react";

export function EmailForm() {
  return (
    <div className="flex flex-col justify-center w-full px-10">
      <p className="mb-4 text-4xl font-bold text-center">ACCESO A TU CUENTA</p>

      <EmailInput />
      <PasswordInput />
      <LoginButton />

      <div className="flex flex-col items-center w-full gap-1">
        <ForgottenPassword />
        <CreateAccount />
      </div>
    </div>
  );
}

function EmailInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { ref, focused } = useFocusable({
    focusKey: "FIRST_CARD",
    /* onEnterPress: () => {
      console.log(inputRef.current);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, */
    onEnterPress: () => {
      inputRef.current?.focus();
    },
  });

  return (
    <div className="flex flex-col mb-4">
      <p className="mb-4 text-lg text-slate-200">
        CORREO ELECTRÓNICO / USUARIO
      </p>
      <div
        ref={ref}
        className={`flex p-3 border-[3px] rounded-xl bg-slate-700/50 transition-all duration-300 ring-4 border-slate-600 outline-none ${focused ? "ring-purple-500" : "ring-transparent"}`}
      >
        <Mail className="mr-4 size-10 min-h-10 min-w-10 text-slate-300" />
        <input
          ref={inputRef}
          type="text"
          className="w-full bg-transparent"
        />
      </div>
    </div>
  );
}

function PasswordInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { ref, focused } = useFocusable({
    /* onEnterPress: () => {
      console.log(inputRef.current);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, */
    onEnterPress: () => {
      inputRef.current?.focus();
    },
  });

  return (
    <div className="flex flex-col mb-4">
      <p className="mb-4 text-lg text-slate-200">CONTRASEÑA</p>
      <div
        ref={ref}
        className={`flex gap-4 p-3 border-[3px] rounded-xl bg-slate-700/50 transition-all duration-300 ring-4 border-slate-600 ${focused ? "ring-purple-500" : "ring-transparent"}`}
      >
        <Lock className="mr-4 size-10 min-h-10 min-w-10 text-slate-300" />
        <input
          ref={inputRef}
          type="password"
          className="w-full bg-transparent"
        />
        <EyeOff className="ml-4 size-10 min-h-10 min-w-10 text-slate-300" />
      </div>
    </div>
  );
}

function LoginButton() {
  const navigate = useNavigate();

  const { ref, focused } = useFocusable({
    onEnterPress: () => {
      navigate("/home");
    },
  });

  return (
    <button
      ref={ref}
      className={`p-4 mb-4 rounded-xl ring-4 font-semibold text-2xl mt-2 bg-gradient-to-r from-purple-600 to-purple-950 transition-all duration-300 ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      ENTRAR
    </button>
  );
}

function ForgottenPassword() {
  const { ref, focused } = useFocusable();

  return (
    <div
      ref={ref}
      className={`py-1 px-4 rounded-xl ring-4 transition-all duration-300 ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      <p className="text-lg text-center text-slate-400 w-fit">
        ¿Olvidaste tu contraseña?
      </p>
    </div>
  );
}

function CreateAccount() {
  const { ref, focused } = useFocusable();

  return (
    <div
      ref={ref}
      className={`py-1 px-4 rounded-xl ring-4 transition-all duration-300 ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      <p className="text-lg font-semibold text-center text-purple-300 w-fit">
        CREAR NUEVA CUENTA
      </p>
    </div>
  );
}
