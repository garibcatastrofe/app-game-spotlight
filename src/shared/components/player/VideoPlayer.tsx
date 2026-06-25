import { useEffect, useRef, useState } from "react";
import { useFocusable, setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
}

export function VideoPlayer({ videoUrl, title, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<any>(null);

  // Focus keys for spatial navigation
  const { ref: containerRef } = useFocusable({
    focusKey: "PLAYER_CONTAINER",
  });

  const { ref: playBtnRef, focused: playBtnFocused } = useFocusable({
    focusKey: "PLAYER_PLAY",
    onEnterPress: () => togglePlay(),
  });

  const { ref: muteBtnRef, focused: muteBtnFocused } = useFocusable({
    focusKey: "PLAYER_MUTE",
    onEnterPress: () => toggleMute(),
  });

  const { ref: closeBtnRef, focused: closeBtnFocused } = useFocusable({
    focusKey: "PLAYER_CLOSE",
    onEnterPress: () => onClose(),
  });

  // Reset controls hide timer
  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  };

  useEffect(() => {
    // Initial focus on the play button
    setFocus("PLAYER_PLAY");
    resetControlsTimer();

    // Listen to keydown to catch Escape/Backspace for TV back button
    const handleKeyDown = (e: KeyboardEvent) => {
      resetControlsTimer();
      if (e.key === "Escape" || e.key === "Backspace") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [onClose]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch((err) => console.log(err));
      setIsPlaying(true);
    }
    resetControlsTimer();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    resetControlsTimer();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(current);
    setProgress(dur > 0 ? (current / dur) * 100 : 0);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center cursor-none select-none"
      onClick={resetControlsTimer}
      onMouseMove={resetControlsTimer}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onClose}
      />

      {/* Control Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 transition-opacity duration-500 flex flex-col justify-between p-8 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-purple-400 font-bold uppercase tracking-wider text-sm">Reproduciendo Tráiler</span>
            <h2 className="text-3xl font-black text-white drop-shadow-md">{title}</h2>
          </div>
          <button
            ref={closeBtnRef}
            className={`p-3 rounded-full border-2 bg-slate-900/60 transition-all duration-200 outline-none ${
              closeBtnFocused ? "border-purple-500 scale-110 bg-purple-600/30" : "border-slate-600 hover:border-white"
            }`}
          >
            <X className="size-6 text-white" />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col gap-4 w-full">
          {/* Progress Bar */}
          <div className="flex items-center gap-4 text-sm text-slate-300 font-mono">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1 h-2 bg-slate-700/60 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-purple-500 transition-all duration-100 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Button Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Play / Pause */}
              <button
                ref={playBtnRef}
                className={`p-4 rounded-xl flex items-center gap-2 font-bold outline-none transition-all duration-200 ${
                  playBtnFocused
                    ? "bg-purple-500 text-white scale-105 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                    : "bg-slate-800/80 text-slate-300 border border-slate-700"
                }`}
              >
                {isPlaying ? <Pause className="size-6" /> : <Play className="size-6" />}
                <span>{isPlaying ? "Pausar" : "Reproducir"}</span>
              </button>

              {/* Mute / Unmute */}
              <button
                ref={muteBtnRef}
                className={`p-4 rounded-xl flex items-center gap-2 font-bold outline-none transition-all duration-200 ${
                  muteBtnFocused
                    ? "bg-purple-500 text-white scale-105 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                    : "bg-slate-800/80 text-slate-300 border border-slate-700"
                }`}
              >
                {isMuted ? <VolumeX className="size-6" /> : <Volume2 className="size-6" />}
                <span>{isMuted ? "Activar Sonido" : "Silenciar"}</span>
              </button>
            </div>

            <div className="text-slate-400 text-sm italic">
              Pulsa <span className="font-bold text-slate-200">BACK</span> o <span className="font-bold text-slate-200">ESC</span> para salir
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
