import { EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useRef, useState } from "react";
import { api } from "../../../../shared/services/api";

export function EmailForm() {
  const usernameRef = useRef<HTMLInputElement>(null!);
  const passwordRef = useRef<HTMLInputElement>(null!);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col justify-center w-full px-10">
      <p className="mb-4 text-4xl font-bold text-center">ACCESO A TU CUENTA</p>

      <EmailInput inputRef={usernameRef} />
      <PasswordInput inputRef={passwordRef} />
      <LoginButton usernameRef={usernameRef} passwordRef={passwordRef} onError={setError} />

      {error && (
        <p className="text-red-400 text-center mt-2 text-lg font-semibold">{error}</p>
      )}

      <div className="flex flex-col items-center w-full gap-1">
        <ForgottenPassword />
        <CreateAccount />
      </div>
    </div>
  );
}

function EmailInput({ inputRef }: { inputRef: React.RefObject<HTMLInputElement> }) {
  const { ref, focused } = useFocusable({
    focusKey: "FIRST_CARD",
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

function PasswordInput({ inputRef }: { inputRef: React.RefObject<HTMLInputElement> }) {
  const { ref, focused } = useFocusable({
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

function LoginButton({
  usernameRef,
  passwordRef,
  onError,
}: {
  usernameRef: React.RefObject<HTMLInputElement>;
  passwordRef: React.RefObject<HTMLInputElement>;
  onError: (err: string | null) => void;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { ref, focused } = useFocusable({
    onEnterPress: async () => {
      const username = usernameRef.current?.value?.trim();
      const password = passwordRef.current?.value;
      if (!username || !password) {
        onError("Ingresa usuario y contraseña");
        return;
      }
      setLoading(true);
      onError(null);
      try {
        await api.login(username, password);
        navigate("/home");
      } catch (err: any) {
        onError(err.message || "Credenciales inválidas");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <button
      ref={ref}
      disabled={loading}
      className={`p-4 mb-4 rounded-xl ring-4 font-semibold text-2xl mt-2 bg-gradient-to-r from-purple-600 to-purple-950 transition-all duration-300 disabled:opacity-50 ${focused ? "ring-purple-500" : "ring-transparent"}`}
    >
      {loading ? "CARGANDO..." : "ENTRAR"}
    </button>
  );
}

function ForgottenPassword() {
  return (
    <p className="text-xs underline text-slate-400">¿Olvidaste tu contraseña?</p>
  );
}

function CreateAccount() {
  return (
    <p className="text-xs underline text-slate-400">Crear cuenta</p>
  );
}
