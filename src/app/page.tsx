export default function PersonalSiteHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-slate-900" />
            <span className="font-semibold">Roey // Home</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="hover:underline">About</a>
            <a href="#projects" className="hover:underline">Projects</a>
            <a href="#links" className="hover:underline">Links</a>
            <a href="#contact" className="rounded-xl border px-3 py-1.5 hover:bg-slate-50">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20 [mask-image:radial-gradient(50%_50%_at_50%_50%,black,transparent)]">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[40rem] w-[40rem] rounded-full bg-slate-900" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Your personal hub — fast, clean, and yours
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            A simple private site to collect your workouts, media watchlist, and notes. Built with Next.js + Tailwind.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a href="#projects" className="rounded-2xl bg-slate-900 text-white px-5 py-3 font-medium shadow">
              See sections
            </a>
            <a href="#about" className="rounded-2xl border px-5 py-3 font-medium">
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* Quick Cards */}
      <section id="projects" className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-6">
        {[
          { title: "Workouts", desc: "Track A/B split, PRs, and sessions.", href: "#workouts" },
          { title: "Watchlist", desc: "Movies & shows across your services.", href: "#watchlist" },
          { title: "Notes", desc: "Fast, searchable personal notes.", href: "#notes" },
        ].map((c) => (
          <a key={c.title} href={c.href} className="group rounded-2xl border p-6 hover:shadow-md transition-shadow bg-white">
            <h3 className="text-lg font-semibold flex items-center justify-between">
              {c.title}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </h3>
            <p className="mt-2 text-slate-600 text-sm">{c.desc}</p>
          </a>
        ))}
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl font-bold">About this site</h2>
        <p className="mt-3 text-slate-600">
          This starter is minimal on purpose. Replace this content with your own sections. We'll wire data up next (local JSON, a lightweight DB, or a private API).
        </p>
      </section>

      {/* Links */}
      <section id="links" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-bold">Quick Links</h2>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "GitHub", href: "https://github.com" },
            { name: "Vercel Dashboard", href: "https://vercel.com/dashboard" },
            { name: "IMDB", href: "https://www.imdb.com" },
            { name: "Technogym", href: "https://www.technogym.com" },
            { name: "Padel News", href: "https://www.google.com/search?q=padel+news" },
            { name: "Tennis TV", href: "https://www.tennistv.com" },
          ].map((l) => (
            <a key={l.name} href={l.href} className="rounded-xl border p-4 bg-white hover:shadow-sm">
              {l.name}
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-slate-500">
          © {new Date().getFullYear()} Roey. Built with ❤️.
        </div>
      </footer>
    </div>
  );
}
