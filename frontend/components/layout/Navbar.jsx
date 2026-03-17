import BrandLogo from "../brand/BrandLogo";

const NAV_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#workspace", label: "Workspace" },
  { href: "#dashboard", label: "Dashboard" },
];

export default function Navbar() {
  return (
    <header className="sticky top-4 z-40">
      <div className="rounded-[26px] border border-white/70 bg-white/72 px-5 py-4 shadow-card backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <a href="#overview" className="w-fit">
            <BrandLogo />
          </a>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-1 lg:justify-end">
            <nav className="flex flex-wrap gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <a
              href="#workspace"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open Workspace
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
