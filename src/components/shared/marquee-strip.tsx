export function MarqueeStrip() {
  const items = [
    "BANDUNG // GIGS GUDANG SELATAN",
    "JAKARTA // BEDAH SISTEM & CETAK RISOGRAPH",
    "YOGYAKARTA // PANGGUNG SENJA & MODULAR SYNTH",
    "SURABAYA // PASAR REMPAH & KOPI SANGRAI",
    "DENPASAR // LAYAR TANCAP SINEMA 16MM",
    "KARCIS RESMI // BEBAS ANTRE // TANPA CALO",
  ];

  return (
    <div className="w-full border-y-2 border-ink bg-ink text-paper py-2.5 overflow-hidden select-none">
      <div className="animate-marquee flex items-center gap-8 font-mono text-xs font-bold uppercase tracking-widest">
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8 shrink-0">
            <span>{text}</span>
            <span className="inline-block w-2 h-2 bg-vermilion rotate-45" />
          </div>
        ))}
      </div>
    </div>
  );
}

