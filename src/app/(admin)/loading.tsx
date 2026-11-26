export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 bg-[#e7f1fb] border border-[#d8eaf6]" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="h-28 bg-[#edf9ff] border border-[#d8eaf6]" />
        <div className="h-28 bg-[#edf9ff] border border-[#d8eaf6]" />
        <div className="h-28 bg-[#edf9ff] border border-[#d8eaf6]" />
      </div>
      <div className="h-64 bg-white border border-[#d9d9d9]" />
    </div>
  );
}
