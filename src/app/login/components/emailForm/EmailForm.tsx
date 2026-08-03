import { EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useRef, useState } from "react";
import { api } from "../../../../shared/services/api";
import { LinkRegister } from "../linkRegister/LinkRegister";

export function EmailForm() {
  const usernameRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const username = usernameRef.current?.value?.trim();
    const password = passwordRef.current?.value;
    if (!username || !password) {
      setError("Ingresa usuario y contraseña");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.login(username, password);
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full px-10">
      <p className="mb-4 text-4xl font-bold text-center text-white">ACCESO A TU CUENTA</p>

      <EmailInput
        inputRef={usernameRef}
        onAdvance={() => {
          /* usernameRef.current?.blur();
          setFocus("LOGIN_PASSWORD");
          passwordRef.current?.focus(); */
        }}
      />
      <PasswordInput
        inputRef={passwordRef}
        onSubmit={() => {
          /* passwordRef.current?.blur();
          handleLogin(); */
        }}
      />
      <LoginButton loading={loading} onSubmit={handleLogin} />

      <LinkRegister />

      {error && (
        <p className="mt-2 text-lg font-semibold text-center text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

function EmailInput({
  inputRef,
  onAdvance,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  onAdvance: () => void;
}) {
  const { ref, focused } = useFocusable({
    focusKey: "FIRST_CARD",
    onEnterPress: () => inputRef.current?.focus(),
  });

  return (
    <div className="flex flex-col mb-4">
      <p className="mb-4 text-lg text-slate-200">
        CORREO ELECTRÓNICO / USUARIO
      </p>
      <div
        ref={ref}
        tabIndex={-1}
        className={`flex p-3 border-[3px] rounded-xl bg-slate-700/50 transition-all duration-300 ring-4 border-slate-600 outline-none ${
          focused ? "ring-purple-500" : "ring-transparent"
        }`}
      >
        <Mail className="mr-4 size-10 min-h-10 min-w-10 text-slate-300" />
        <input
          ref={inputRef}
          type="text"
          className="w-full bg-transparent outline-none"
          onKeyDown={(e) => {
            //if (ARROW_KEYS.includes(e.key)) e.stopPropagation();
            if (e.key === "Enter") {
              e.preventDefault();
              onAdvance();
            }
          }}
        />
      </div>
    </div>
  );
}

function PasswordInput({
  inputRef,
  onSubmit,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: () => void;
}) {
  const { ref, focused } = useFocusable({
    focusKey: "LOGIN_PASSWORD",
    onEnterPress: () => inputRef.current?.focus(),
  });

  return (
    <div className="flex flex-col mb-4">
      <p className="mb-4 text-lg text-slate-200">CONTRASEÑA</p>
      <div
        ref={ref}
        tabIndex={-1}
        className={`flex gap-4 p-3 border-[3px] rounded-xl bg-slate-700/50 transition-all duration-300 ring-4 border-slate-600 outline-none ${
          focused ? "ring-purple-500" : "ring-transparent"
        }`}
      >
        <Lock className="mr-4 size-10 min-h-10 min-w-10 text-slate-300" />
        <input
          ref={inputRef}
          type="password"
          className="w-full bg-transparent outline-none"
          onKeyDown={(e) => {
            //if (ARROW_KEYS.includes(e.key)) e.stopPropagation();
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
      </div>
    </div>
  );
}

function LoginButton({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: () => void;
}) {
  const { ref, focused } = useFocusable({
    focusKey: "LOGIN_BTN",
    onEnterPress: onSubmit,
  });

  return (
    <button
      ref={ref}
      onClick={onSubmit}
      disabled={loading}
      className={`p-4 mb-4 rounded-xl ring-4 font-semibold text-2xl mt-2 bg-gradient-to-r from-purple-600 to-purple-950 transition-all duration-300 disabled:opacity-50 ${
        focused ? "ring-purple-500" : "ring-transparent"
      }`}
    >
      {loading ? "CARGANDO..." : "ENTRAR"}
    </button>
  );
}
