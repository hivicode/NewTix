export default function GlobalLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden bg-[#edf9ff]"
    >
      <div className="h-full w-1/3 bg-gradient-to-r from-[#2867a6] via-[#ff8a09] to-[#2867a6] animate-[kk-bar_1s_ease-in-out_infinite] relative" />
    </div>
  );
}
