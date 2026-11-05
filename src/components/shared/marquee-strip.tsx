export function MarqueeStrip() {
  const items = [
    "BANDUNG ★ MALAM SHOEGAZE & KASET PITA",
    "JAKARTA ★ BEDAH SISTEM & CETAK RISOGRAPH",
    "YOGYAKARTA ★ AKUSTIK SENJA & SYNTH ANALOG",
    "SURABAYA ★ PASAR REMPAH & KOPI SANGRAI",
    "DENPASAR ★ LAYAR TANCAP SINEMA 16MM",
    "NEWTIX CLUB ★ TIKET AMAN HATI TENANG",
  ];

  return (
    <div className="w-full border-y-2 border-ink bg-denim text-white py-2.5 overflow-hidden select-none">
      <div className="animate-marquee flex items-center gap-8 font-mono text-xs font-bold uppercase tracking-widest">
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8 shrink-0">
            <span>{text}</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-butter border border-[#14121F]" />
          </div>
        ))}
      </div>
    </div>
  );
}
