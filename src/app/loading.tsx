export default function GlobalLoading() {
  return (
    <div className="kk">
      <div className="kk-loading" role="status" aria-live="polite">
        <div className="win">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="spin-pin" src="/newtix/home/5_Map/Pin1.png" alt="" />
          <p className="win-title">Loading your tickets...</p>
          <p className="win-sub">Please wait, the gate never closes.</p>
          <div className="bar" />
        </div>
      </div>
    </div>
  );
}
