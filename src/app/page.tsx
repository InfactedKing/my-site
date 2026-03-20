"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const interests = [
    { icon: "🎾", title: "Padel & Tennis", desc: "The gap between amateur and professional padel is one of the most fascinating things in sport. I have a training wall at home and I use it." },
    { icon: "🎮", title: "Gaming", desc: "From Rocket League to Celeste to Minecraft — I play competitively and creatively. Gaming is where my competitive side and my solitude meet." },
    { icon: "🎵", title: "Music", desc: "Israeli mizrahi, indie rock, and artists like Ren and Poor Man's Poison that most people haven't found. Music is where my inner world lives loudest." },
    { icon: "🧮", title: "Mathematics", desc: "5-unit math is hard. That's exactly why it's satisfying. There's a unique feeling in working through something that resists you until it finally gives." },
    { icon: "🎬", title: "Film", desc: "Whiplash is my favorite film. That should tell you something. I'm drawn to stories about people who go all in — and the cost of that." },
    { icon: "🏋️", title: "Training", desc: "Gym sessions, padel drills, staying sharp. Being physically capable isn't just aesthetic — it's discipline made visible." },
  ];

  const values = [
    { num: "01", title: "Depth over surface", desc: "Anyone can seem passionate. Real investment shows in the details — in caring when no one's watching." },
    { num: "02", title: "Leading quietly", desc: "The best leaders don't announce themselves. They show up consistently and people naturally follow." },
    { num: "03", title: "Two selves, one person", desc: "I love people and I love solitude. Both are real. Neither is a mask." },
    { num: "04", title: "Compete with yourself first", desc: "The most honest competition isn't against others — it's against who you were yesterday." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#0e0e0e;--surface:#161616;--surface2:#1e1e1e;--text:#f0ece4;--muted:#7a7570;--accent:#c8a97e;--accent2:#7eb8c8;--border:rgba(255,255,255,0.07);--fd:'Cormorant Garamond',serif;--fb:'DM Sans',sans-serif}
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:var(--fb);font-weight:300;line-height:1.7;overflow-x:hidden}
        nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.5rem 4rem;display:flex;justify-content:space-between;align-items:center;transition:background 0.4s}
        nav.scrolled{background:rgba(14,14,14,0.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--border)}
        .nl{font-family:var(--fd);font-size:1.4rem;font-weight:300;color:var(--text);text-decoration:none}
        .nls{display:flex;gap:2.5rem;list-style:none}
        .nls a{color:var(--muted);text-decoration:none;font-size:.8rem;letter-spacing:.15em;text-transform:uppercase;transition:color .3s}
        .nls a:hover{color:var(--text)}
        .hero{min-height:100vh;display:grid;place-items:center;padding:8rem 4rem 4rem;position:relative;overflow:hidden}
        .hbg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 20% 50%,rgba(200,169,126,.06) 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 80% 30%,rgba(126,184,200,.04) 0%,transparent 60%)}
        .hc{position:relative;max-width:900px;width:100%}
        .htag{font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);margin-bottom:2rem;opacity:0;animation:fu .8s ease forwards .2s}
        .htitle{font-family:var(--fd);font-size:clamp(4rem,10vw,8rem);font-weight:300;line-height:1;letter-spacing:-.02em;margin-bottom:2rem;opacity:0;animation:fu .8s ease forwards .4s}
        .htitle em{font-style:italic;color:var(--accent)}
        .hsub{font-size:1rem;color:var(--muted);max-width:480px;line-height:1.8;opacity:0;animation:fu .8s ease forwards .6s;margin-bottom:3rem}
        .hcta{display:inline-flex;align-items:center;gap:.75rem;color:var(--text);text-decoration:none;font-size:.85rem;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid var(--accent);padding-bottom:.25rem;opacity:0;animation:fu .8s ease forwards .8s;transition:gap .3s}
        .hcta:hover{gap:1.25rem}
        .hscroll{position:absolute;bottom:3rem;right:4rem;writing-mode:vertical-rl;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);opacity:0;animation:fu 1s ease forwards 1.2s}
        section{padding:8rem 4rem}
        .sl{font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem}
        .about{display:grid;grid-template-columns:1fr 1fr;gap:8rem;max-width:1100px;margin:0 auto;align-items:start}
        .ah{font-family:var(--fd);font-size:clamp(2.5rem,5vw,4rem);font-weight:300;line-height:1.1}
        .ah em{font-style:italic;color:var(--accent)}
        .at{color:var(--muted);font-size:.95rem;line-height:1.9;margin-top:2rem}
        .at p+p{margin-top:1.2rem}
        .as{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-top:3rem}
        .stat{border-top:1px solid var(--border);padding-top:1.5rem}
        .sn{font-family:var(--fd);font-size:2.5rem;font-weight:300;color:var(--accent);line-height:1}
        .sl2{font-size:.75rem;color:var(--muted);letter-spacing:.1em;margin-top:.5rem;text-transform:uppercase}
        .ig{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;max-width:1100px;margin:4rem auto 0}
        .ic{background:var(--surface);border:1px solid var(--border);padding:2.5rem;position:relative;overflow:hidden;transition:border-color .3s,transform .3s}
        .ic::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(200,169,126,.05),transparent);opacity:0;transition:opacity .3s}
        .ic:hover{border-color:rgba(200,169,126,.3);transform:translateY(-4px)}
        .ic:hover::before{opacity:1}
        .ii{font-size:1.8rem;margin-bottom:1.5rem}
        .it{font-family:var(--fd);font-size:1.5rem;font-weight:400;margin-bottom:.75rem}
        .id{font-size:.85rem;color:var(--muted);line-height:1.8}
        .vs{background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .vi{max-width:1100px;margin:0 auto}
        .vh{font-family:var(--fd);font-size:clamp(2rem,4vw,3.5rem);font-weight:300;line-height:1.2;max-width:700px;margin-bottom:4rem}
        .vh em{font-style:italic;color:var(--accent2)}
        .vl{display:grid;grid-template-columns:repeat(2,1fr)}
        .vitem{padding:2.5rem;border:1px solid var(--border);margin:-1px 0 0 -1px;transition:background .3s}
        .vitem:hover{background:var(--surface2)}
        .vn{font-family:var(--fd);font-size:3rem;color:var(--border);line-height:1;margin-bottom:1rem}
        .vt{font-size:.85rem;letter-spacing:.15em;text-transform:uppercase;color:var(--text);margin-bottom:.75rem}
        .vd{font-size:.85rem;color:var(--muted);line-height:1.8}
        .ci{max-width:700px;margin:0 auto;text-align:center}
        .ch{font-family:var(--fd);font-size:clamp(3rem,7vw,6rem);font-weight:300;line-height:1;letter-spacing:-.02em;margin-bottom:1.5rem}
        .ch em{font-style:italic;color:var(--accent)}
        .csub{color:var(--muted);font-size:.95rem;margin-bottom:3rem}
        .ce{display:inline-block;font-family:var(--fd);font-size:1.5rem;font-weight:300;color:var(--text);text-decoration:none;border-bottom:1px solid var(--accent);padding-bottom:.25rem;transition:color .3s}
        .ce:hover{color:var(--accent)}
        footer{padding:2rem 4rem;display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border)}
        footer span{font-size:.75rem;color:var(--muted);letter-spacing:.1em}
        .div{width:60px;height:1px;background:var(--accent);margin:0 auto 5rem;opacity:.4}
        @keyframes fu{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .reveal{opacity:0;transform:translateY(32px);transition:opacity .8s ease,transform .8s ease}
        .reveal.visible{opacity:1;transform:translateY(0)}
        @media(max-width:768px){nav{padding:1.5rem 2rem}.nls{display:none}section{padding:5rem 2rem}.hero{padding:8rem 2rem 4rem}.about{grid-template-columns:1fr;gap:3rem}.ig{grid-template-columns:1fr}.vl{grid-template-columns:1fr}footer{padding:2rem;flex-direction:column;gap:1rem}.hscroll{display:none}}
      `}</style>
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#" className="nl">Roey Halfon</a>
        <ul className="nls">
          <li><a href="#about">About</a></li>
          <li><a href="#interests">Interests</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <section className="hero">
        <div className="hbg" />
        <div className="hc">
          <p className="htag">Based in Israel · 2026</p>
          <h1 className="htitle">Roey<br /><em>Halfon</em></h1>
          <p className="hsub">Competitive. Passionate. A leader with a quiet inner world — someone who feels everything deeply and shows only what is needed.</p>
          <a href="#about" className="hcta">Discover more</a>
        </div>
        <span className="hscroll">Scroll to explore</span>
      </section>
      <section id="about">
        <div className="about reveal">
          <div>
            <p className="sl">Who I am</p>
            <h2 className="ah">Built on passion and <em>discipline</em></h2>
            <div className="as">
              <div className="stat"><div className="sn">12th</div><div className="sl2">Grade</div></div>
              <div className="stat"><div className="sn">5U</div><div className="sl2">Math</div></div>
              <div className="stat"><div className="sn">IL</div><div className="sl2">Israel</div></div>
              <div className="stat"><div className="sn">Army</div><div className="sl2">Next</div></div>
            </div>
          </div>
          <div className="at">
            <p>I am Roey — a high school senior finishing my last chapter before the army. On the surface social, driven, and easy to be around. Underneath, there is a lot more going on.</p>
            <p>I study 5-unit mathematics — the hardest level — not because I have to, but because there is something deeply satisfying about working through problems that actually resist you.</p>
            <p>I get fully into things. Whether padel, gaming, a song I cannot stop replaying, or a film that changes how I see something — I do not do things halfway.</p>
            <p>I believe in leading by how you carry yourself. People follow those who are genuinely invested, and I always am.</p>
          </div>
        </div>
      </section>
      <section id="interests">
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <p className="sl reveal">What drives me</p>
          <div className="div" />
          <div className="ig">
            {interests.map((item, i) => (
              <div key={i} className="ic reveal">
                <div className="ii">{item.icon}</div>
                <h3 className="it">{item.title}</h3>
                <p className="id">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="vs">
        <div className="vi">
          <h2 className="vh reveal">The things I actually believe <em>in</em></h2>
          <div className="vl">
            {values.map((v, i) => (
              <div key={i} className="vitem reveal">
                <div className="vn">{v.num}</div>
                <div className="vt">{v.title}</div>
                <p className="vd">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="contact">
        <div className="ci reveal">
          <p className="sl">Get in touch</p>
          <h2 className="ch">Let us <em>talk</em></h2>
          <p className="csub">Padel, music, math, or something else — always up for a real conversation.</p>
          <a href="mailto:roeykhalfon@gmail.com" className="ce">roeykhalfon@gmail.com</a>
        </div>
      </section>
      <footer>
        <span>2026 Roey Halfon</span>
        <span>Built with intention</span>
      </footer>
    </>
  );
}
