import { useEffect, useState } from "react";
import { useFocusable, setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { api, UserSettings } from "../../shared/services/api";
import { useNavigate } from "react-router-dom";
import { Check, Shield, Tv, Type, Languages, AlertCircle, LogOut } from "lucide-react";

export function SettingsView() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const { ref: containerRef } = useFocusable({
    focusKey: "SETTINGS_CONTAINER",
  });

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      try {
        const data = await api.getSettings();
        if (isMounted) {
          setSettings(data);
          setLoading(false);
          setTimeout(() => {
            setFocus("SETTING_PARENTAL");
          }, 100);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdate = async (key: keyof UserSettings, value: any) => {
    if (!settings) return;
    try {
      const updated = { ...settings, [key]: value };
      setSettings(updated);
      setSaveStatus("Guardando...");
      await api.updateSettings({ [key]: value });
      setSaveStatus("Ajustes guardados");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus("Error al guardar");
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6 p-8 overflow-y-auto w-full max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Ajustes del Sistema</h1>
          <p className="text-slate-400 text-sm mt-1">Configura las preferencias de tu Smart TV para una experiencia a medida.</p>
        </div>
        {saveStatus && (
          <div className="bg-purple-600/30 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 animate-pulse">
            <AlertCircle className="size-4" />
            {saveStatus}
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className="flex flex-col gap-6 mt-4 pb-24"
      >
        {/* Parental Control */}
        <SettingToggleRow
          focusKey="SETTING_PARENTAL"
          icon={<Shield className="size-6 text-purple-400" />}
          title="Control Parental"
          description="Restringe trailers y juegos clasificados para mayores de edad."
          active={settings.controlParental}
          onToggle={() => handleUpdate("controlParental", !settings.controlParental)}
        />

        {/* Video Quality */}
        <SettingOptionRow
          focusKey="SETTING_QUALITY"
          icon={<Tv className="size-6 text-purple-400" />}
          title="Calidad de Video"
          description="Define la resolución por defecto para la reproducción de trailers."
          currentValue={settings.calidadVideo}
          options={[
            { label: "Automático", value: "auto" },
            { label: "1080p Full HD", value: "1080p" },
            { label: "720p HD", value: "720p" },
          ]}
          onSelect={(val) => handleUpdate("calidadVideo", val)}
        />

        {/* Text Size */}
        <SettingOptionRow
          focusKey="SETTING_TEXT_SIZE"
          icon={<Type className="size-6 text-purple-400" />}
          title="Tamaño de Texto"
          description="Ajusta el tamaño de la tipografía para mejorar la lectura a distancia."
          currentValue={settings.tamanoTexto}
          options={[
            { label: "Normal", value: "normal" },
            { label: "Grande", value: "grande" },
          ]}
          onSelect={(val) => handleUpdate("tamanoTexto", val)}
        />

        {/* Language */}
        <SettingOptionRow
          focusKey="SETTING_LANG"
          icon={<Languages className="size-6 text-purple-400" />}
          title="Idioma de Interfaz"
          description="Cambia el idioma predeterminado del catálogo y menús."
          currentValue={settings.idioma}
          options={[
            { label: "Español", value: "es" },
            { label: "English", value: "en" },
          ]}
          onSelect={(val) => handleUpdate("idioma", val)}
        />

        {/* Logout */}
        <SettingLogoutRow
          focusKey="SETTING_LOGOUT"
          onLogout={async () => {
            await api.logout();
            navigate("/");
          }}
        />
      </div>
    </div>
  );
}

function SettingLogoutRow({ focusKey, onLogout }: { focusKey: string; onLogout: () => void }) {
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress: () => onLogout(),
  });

  return (
    <div
      ref={ref}
      className={`flex items-center justify-between p-6 bg-slate-900 border rounded-2xl transition-all duration-200 outline-none select-none ${
        focused ? "border-red-500 ring-4 ring-red-500/20 bg-red-950/30 scale-[1.01]" : "border-slate-800"
      }`}
    >
      <div className="flex gap-4 items-center">
        <div className="p-3 bg-red-950/60 rounded-xl">
          <LogOut className="size-6 text-red-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-white leading-tight">Cerrar Sesión</h3>
          <p className="text-slate-400 text-sm mt-1">Vuelve a la pantalla de inicio de sesión.</p>
        </div>
      </div>
      <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Salir</span>
    </div>
  );
}

interface SettingToggleRowProps {
  focusKey: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}

function SettingToggleRow({ focusKey, icon, title, description, active, onToggle }: SettingToggleRowProps) {
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress: () => onToggle(),
  });

  return (
    <div
      ref={ref}
      className={`flex items-center justify-between p-6 bg-slate-900 border rounded-2xl transition-all duration-200 outline-none select-none ${
        focused ? "border-purple-500 ring-4 ring-purple-500/20 bg-slate-850/60 scale-[1.01]" : "border-slate-800"
      }`}
    >
      <div className="flex gap-4 items-center">
        <div className="p-3 bg-slate-800/80 rounded-xl">{icon}</div>
        <div>
          <h3 className="font-bold text-lg text-white leading-tight">{title}</h3>
          <p className="text-slate-400 text-sm mt-1">{description}</p>
        </div>
      </div>

      <div
        className={`w-16 h-8 rounded-full transition-all duration-300 flex items-center p-1 cursor-pointer ${
          active ? "bg-purple-600 justify-end" : "bg-slate-700 justify-start"
        }`}
      >
        <div className="w-6 h-6 bg-white rounded-full shadow-md" />
      </div>
    </div>
  );
}

interface SettingOptionRowProps {
  focusKey: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  currentValue: string;
  options: { label: string; value: string }[];
  onSelect: (val: string) => void;
}

function SettingOptionRow({ focusKey, icon, title, description, currentValue, options, onSelect }: SettingOptionRowProps) {
  const { ref, focused } = useFocusable({
    focusKey,
  });

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-4 p-6 bg-slate-900 border rounded-2xl transition-all duration-200 outline-none select-none ${
        focused ? "border-purple-500 ring-4 ring-purple-500/20 bg-slate-850/60 scale-[1.01]" : "border-slate-800"
      }`}
    >
      <div className="flex gap-4 items-center">
        <div className="p-3 bg-slate-800/80 rounded-xl">{icon}</div>
        <div>
          <h3 className="font-bold text-lg text-white leading-tight">{title}</h3>
          <p className="text-slate-400 text-sm mt-1">{description}</p>
        </div>
      </div>

      {/* Options Buttons Row */}
      <div className="flex gap-4 ml-16">
        {options.map((opt) => (
          <OptionButton
            key={opt.value}
            label={opt.label}
            active={currentValue === opt.value}
            onSelect={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

interface OptionButtonProps {
  label: string;
  active: boolean;
  onSelect: () => void;
}

function OptionButton({ label, active, onSelect }: OptionButtonProps) {
  const { ref, focused } = useFocusable({
    onEnterPress: () => onSelect(),
  });

  return (
    <button
      ref={ref}
      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 outline-none flex items-center gap-1.5 ${
        active
          ? "bg-purple-600/20 text-purple-300 border-purple-500/60"
          : focused
          ? "bg-slate-700 border-slate-500 text-white scale-105"
          : "bg-slate-800 border-slate-750 text-slate-400"
      }`}
    >
      {active && <Check className="size-4" />}
      <span>{label}</span>
    </button>
  );
}
