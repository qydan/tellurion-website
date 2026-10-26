import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import tellurionMark from "../assets/brand/tellurion-mark-brass.svg";
import researchFigure from "../assets/img/figure1.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function NumberTicker({
  value,
  decimals = 0,
  suffix = "",
  ariaSuffix = suffix,
  className = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();
  const count = useMotionValue(prefersReducedMotion ? value : 0);
  const display = useTransform(count, (current) =>
    `${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(current)}${suffix}`,
  );

  useEffect(() => {
    if (!isInView) return undefined;
    if (prefersReducedMotion) {
      count.set(value);
      return undefined;
    }
    const controls = animate(count, value, { duration: 1.35, ease: "easeOut" });
    return () => controls.stop();
  }, [count, isInView, prefersReducedMotion, value]);

  const accessibleValue = `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)}${ariaSuffix}`;

  return (
    <motion.span
      ref={ref}
      className={className}
      aria-label={accessibleValue}
      aria-live="off"
    >
      {display}
    </motion.span>
  );
}

function Arrow({ diagonal = false }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      viewBox="0 0 16 16"
      fill="none"
    >
      {diagonal ? (
        <path d="M4 12 12 4M5 4h7v7" stroke="currentColor" strokeWidth="1.4" />
      ) : (
        <path d="M2 8h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
      )}
    </svg>
  );
}

function ThemeIcon({ theme }) {
  return theme === "dark" ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2.5v2m0 15v2M4.5 4.5l1.4 1.4m12.2 12.2 1.4 1.4m-17-7.5h2m15 0h2M4.5 19.5l1.4-1.4M18.1 5.9l1.4-1.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
      <path
        d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.6 8.6 0 1 0 20.2 15.1Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="m16.5 4 .5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z" fill="currentColor" />
    </svg>
  );
}

function Header() {
  const location = useLocation();
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "dark",
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#0E1B2C" : "#F5F1E8",
    );
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("tellurion-theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <header className="site-header sticky top-0 z-50 border-b border-rule bg-page/90 backdrop-blur-xl">
      <div className="wrap flex min-h-[76px] items-center justify-between gap-5">
        <Link className="group flex items-center gap-3 no-underline" to="/" aria-label="Tellurion home">
          <img className="h-8 w-8" src={tellurionMark} alt="" />
          <span className="display text-[25px] leading-none tracking-normal text-ivory">
            Tellurion
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-[13px] sm:gap-8 sm:text-sm" aria-label="Main navigation">
          <NavLink
            className={({ isActive }) =>
              `transition-colors hover:text-brass ${isActive ? "text-brass" : "text-mist"}`
            }
            to="/timeline/"
          >
            Timeline
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `transition-colors hover:text-brass ${isActive ? "text-brass" : "text-mist"}`
            }
            to="/research/"
          >
            Research
          </NavLink>
          <a
            className="hidden text-mist transition-colors hover:text-brass sm:inline"
            href="https://github.com/tellurionai"
          >
            Open source
          </a>
          <a className="text-mist transition-colors hover:text-brass" href="/#contact">
            Contact
          </a>
          <button
            className="theme-toggle inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rule text-mist transition-colors hover:border-brass hover:text-brass"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <ThemeIcon theme={theme} />
          </button>
        </nav>
      </div>
    </header>
  );
}

function Footer({ compact = false }) {
  return (
    <footer id="contact" className="section-rule">
      {!compact && (
        <div className="wrap flex flex-col justify-between gap-10 py-16 sm:flex-row sm:items-end sm:py-20">
          <div>
            <p className="eyebrow mb-4">Start a conversation</p>
            <h2 className="display max-w-[18ch] text-4xl leading-[1.05] text-ivory sm:text-5xl">
              Working with models of the physical world?
            </h2>
            <p className="mt-4 text-mist">
              We&apos;d like to hear where they fail you.{" "}
              <a
                className="text-brass underline decoration-brass/50 underline-offset-4 hover:decoration-brass"
                href="mailto:hello@tellurionai.com"
              >
                Get in touch
              </a>
            </p>
          </div>
          <div className="flex gap-6 text-sm text-mist">
            <a className="transition-colors hover:text-brass" href="https://github.com/tellurionai">
              GitHub <Arrow diagonal />
            </a>
            <a
              className="transition-colors hover:text-brass"
              href="https://www.linkedin.com/company/tellurionai"
            >
              LinkedIn <Arrow diagonal />
            </a>
          </div>
        </div>
      )}
      <div className="wrap flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] py-6 font-mono text-[11px] text-mist/70">
        <span>© 2026 Tellurion</span>
        <span className="italic">Nullius in verba</span>
      </div>
    </footer>
  );
}

function SectionHeading({ label, children, className = "" }) {
  return (
    <div className={className}>
      <p className="eyebrow mb-5">{label}</p>
      <h2 className="display max-w-[23ch] text-4xl leading-[1.08] text-ivory sm:text-5xl lg:text-[56px]">
        {children}
      </h2>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <main id="main">
        <section className="hero-atmosphere relative isolate overflow-hidden">
          <div
            aria-hidden="true"
            className="hero-glow pointer-events-none absolute -right-40 top-[-12rem] -z-10 h-[52rem] w-[52rem] rounded-full blur-[100px]"
          />
          <div className="wrap grid min-h-[730px] items-center gap-8 py-16 md:grid-cols-[1fr_1fr] md:py-20 lg:min-h-[810px]">
            <div className="relative z-10">
              <motion.p
                className="hero-kicker eyebrow inline-flex items-center gap-3 rounded-full border border-brass/25 bg-brass/[0.07] px-4 py-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brass opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brass" />
                </span>
                Independent science, made legible
              </motion.p>
              <motion.h1
                className="display max-w-[12ch] text-[clamp(3.8rem,7vw,6.7rem)] leading-[0.98] text-ivory"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="block">The model</span>
                <span className="block">says one thing.</span>
                <span className="mt-2 block text-brass italic sm:mt-3">Reality says</span>
                <span className="block text-brass italic">another.</span>
              </motion.h1>
              <motion.p
                className="mt-8 max-w-[48ch] text-base leading-7 text-mist sm:text-lg sm:leading-8"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                We build tools that check AI models of physical systems against real measurements
                — and explain why they disagree.
              </motion.p>
              <motion.div
                className="mt-9 flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.3 }}
              >
                <Link
                  className="hero-cta hero-cta-primary group inline-flex min-h-14 items-center gap-4 rounded-full bg-brass py-2 pl-6 pr-2 text-sm font-semibold text-navy"
                  to="/research/"
                >
                  <span>Explore the first result</span>
                  <span className="hero-cta-icon flex h-10 w-10 items-center justify-center rounded-full bg-navy text-brass">
                    <Arrow />
                  </span>
                </Link>
                <a
                  className="hero-cta hero-cta-secondary group inline-flex min-h-14 items-center gap-3 rounded-full border border-white/20 bg-white/[0.035] px-6 text-sm font-medium text-ivory backdrop-blur-sm"
                  href="https://github.com/tellurionai/tellurion-referee"
                >
                  <span>View the code</span>
                  <span className="hero-cta-arrow"><Arrow diagonal /></span>
                </a>
              </motion.div>
              <motion.div
                className="mt-12 flex items-center gap-4 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <img className="h-6 w-6" src={tellurionMark} alt="" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist/70">
                  Nullius in verba
                </span>
                <span className="text-mist/30">/</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist/70">Take nobody&apos;s word for it</span>
              </motion.div>
            </div>

            <motion.div
              className="relative mx-auto w-full max-w-[560px]"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="hero-instrument relative overflow-hidden rounded-[1.75rem] border border-white/15 p-5 shadow-[0_35px_100px_rgba(0,0,0,0.4)] sm:rounded-[2.25rem] sm:p-7">
                <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brass/25 bg-brass/10">
                      <img className="h-6 w-6" src={tellurionMark} alt="" />
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist/55">Tellurion Referee</p>
                      <p className="mt-0.5 text-sm font-medium text-ivory">Model / measurement check</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-brass/20 bg-brass/[0.08] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-brass">
                    <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                    Illustrative
                  </span>
                </div>
                <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1522]/70 px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-mist/50">Prediction residual</p>
                      <p className="display mt-1 text-3xl text-ivory sm:text-4xl">A mismatch, explained.</p>
                    </div>
                    <span className="font-mono text-[9px] text-mist/45">t − 1.2s</span>
                  </div>
                  <svg className="mt-3 w-full overflow-visible" viewBox="0 0 560 180" fill="none" role="img" aria-label="Illustrative plot comparing a model prediction with measured motion">
                    <path d="M0 30H560M0 75H560M0 120H560M0 165H560M70 0V180M210 0V180M350 0V180M490 0V180" stroke="rgba(236,231,218,.08)" strokeWidth="1" />
                    <path d="M0 105C35 78 55 76 88 98S142 136 176 112 230 67 264 90 320 132 354 107 410 64 444 85 510 129 560 88" stroke="#ECE7DA" strokeOpacity=".52" strokeWidth="2" strokeDasharray="5 6" />
                    <motion.path
                      d="M0 108C35 81 55 78 88 100S142 139 176 115 230 71 264 94 320 138 354 122 410 122 444 146 510 160 560 142"
                      stroke="#CAA24A"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0.4 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, delay: 0.7, ease: "easeOut" }}
                    />
                    <circle cx="356" cy="122" r="5" fill="#CAA24A" />
                    <circle cx="356" cy="122" r="11" stroke="#CAA24A" strokeOpacity=".35" />
                  </svg>
                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.1em] text-mist/55">
                    <span className="inline-flex items-center gap-2"><i className="h-px w-4 bg-ivory/50" /> Model prediction</span>
                    <span className="inline-flex items-center gap-2"><i className="h-[2px] w-4 bg-brass" /> Measured motion</span>
                    <span className="ml-auto">Illustrative signal</span>
                  </div>
                </div>
                <div className="relative z-10 mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-mist/50">Possible source</p>
                    <p className="mt-2 text-sm text-ivory">Model · instrument · new force</p>
                  </div>
                  <div className="rounded-2xl border border-brass/20 bg-brass/[0.08] p-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-brass/70">The useful question</p>
                    <p className="mt-2 text-sm text-brass">What changed?</p>
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-brass/[0.12] blur-[90px]" />
              </div>
              <motion.div
                className="hero-float absolute -bottom-6 -left-4 z-20 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#17283a] px-4 py-3 shadow-xl sm:-left-8"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brass text-lg text-navy">↗</span>
                <span>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.1em] text-mist/55">First result</span>
                  <span className="block text-sm text-ivory">
                    <NumberTicker value={1000} /> locked runs
                  </span>
                </span>
              </motion.div>
            </motion.div>
          </div>
          <div className="hero-ticker overflow-hidden border-y border-white/[0.08] py-4">
            <div className="ticker-track flex w-max items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-mist/65">
              {[0, 1].map((copy) => (
                <div className="flex items-center gap-8" key={copy} aria-hidden={copy === 1}>
                  <span>Model disagreement</span><span className="text-brass">✳</span>
                  <span>Instrument fault</span><span className="text-brass">✳</span>
                  <span>New physics</span><span className="text-brass">✳</span>
                  <span>Evidence over intuition</span><span className="text-brass">✳</span>
                  <span>Nullius in verba</span><span className="text-brass">✳</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="problem" className="section-rule">
          <div className="wrap py-20 sm:py-28">
            <Reveal>
              <SectionHeading label="The problem">
                When a model disagrees with the measurements, there are three explanations.
              </SectionHeading>
              <p className="mt-6 max-w-[68ch] text-base leading-7 text-mist">
                In 2011 the OPERA experiment measured neutrinos travelling faster than light. The
                cause was a loose fibre-optic cable. Telling cases like this apart is slow, expert
                work — and it gets harder as learned models replace hand-built ones.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-3 md:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "The model is wrong",
                  description:
                    "A setting changed, or the model never learned this regime. Re-fit it, retrain it, or stop trusting it here.",
                },
                {
                  n: "02",
                  title: "The instrument is wrong",
                  description:
                    "A sensor froze, drifted or picked up noise. Fix the hardware before believing any result.",
                },
                {
                  n: "03",
                  title: "Something new",
                  description:
                    "A force or effect the model has never seen. This is the case science is looking for.",
                },
              ].map((item, index) => (
                <Reveal key={item.n} delay={index * 0.08}>
                  <article className={`diagnosis-card diagnosis-${item.n} group relative h-full overflow-hidden rounded-[1.5rem] border border-white/[0.09] p-7 transition-colors duration-300 sm:p-9`}>
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-mist/60">Diagnosis {item.n}</span>
                      <span className="font-mono text-xs text-brass">↗</span>
                    </div>
                    <div className="diagnosis-orbit my-8 flex h-24 w-24 items-center justify-center rounded-full border border-brass/20">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brass/40 bg-brass/[0.08]">
                        <span className="font-mono text-lg text-brass">{item.n}</span>
                      </div>
                    </div>
                    <h3 className="display relative z-10 text-3xl text-ivory">{item.title}</h3>
                    <p className="relative z-10 mt-3 max-w-[35ch] text-sm leading-6 text-mist">{item.description}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="result-showcase">
          <div className="wrap grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <Reveal>
              <p className="eyebrow mb-5 !text-navy/65">First result · Tellurion Referee</p>
              <h2 className="display max-w-[14ch] text-4xl leading-[1.05] text-navy sm:text-5xl lg:text-[60px]">
                Confidence isn&apos;t a safety check.
              </h2>
              <p className="mt-6 max-w-[47ch] text-base leading-7 text-navy/75">
                On a locked test of 1,000 simulated pendulum runs, measured once, the referee
                caught more real problems at a similar false-alarm rate.
              </p>
              <Link
                className="group mt-7 inline-flex items-center gap-3 border-b border-navy/35 pb-2 text-sm font-semibold text-navy transition-colors hover:border-navy"
                to="/research/"
              >
                Read how we measured it <Arrow />
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="metric-panel grid gap-6 rounded-[1.75rem] bg-navy p-6 text-ivory shadow-[0_25px_80px_rgba(14,27,44,0.25)] sm:grid-cols-2 sm:p-9">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist/60">
                    Model&apos;s own confidence
                  </p>
                  <p className="display mt-4 text-7xl leading-none text-ivory sm:text-8xl">
                    <NumberTicker value={25.9} decimals={1} ariaSuffix="%" /><span className="text-4xl text-mist/60">%</span>
                  </p>
                  <p className="mt-3 text-sm text-mist">of real problems missed</p>
                  <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div className="h-full rounded-full bg-ivory/55" initial={{ width: 0 }} whileInView={{ width: "90%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} />
                  </div>
                </div>
                <div className="rounded-2xl border border-brass/25 bg-brass/[0.08] p-5 sm:p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brass">
                    Tellurion Referee
                  </p>
                  <p className="display mt-4 text-7xl leading-none text-brass sm:text-8xl">
                    <NumberTicker value={3.6} decimals={1} ariaSuffix="%" /><span className="text-4xl text-brass/70">%</span>
                  </p>
                  <p className="mt-3 text-sm text-ivory/80">missed · and named the likely cause</p>
                  <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div className="h-full rounded-full bg-brass" initial={{ width: 0 }} whileInView={{ width: "14%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }} />
                  </div>
                </div>
                <p className="col-span-full border-t border-white/[0.08] pt-4 font-mono text-[10px] leading-5 text-mist/55 sm:text-[11px]">
                  LOCKED TEST / 1,000 SIMULATED RUNS / FULL RESULTS IN RESEARCH NOTE 01
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section-rule">
          <div className="wrap py-20 sm:py-28">
            <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading label="Latest from the lab">Research, in the open.</SectionHeading>
              <Link className="group inline-flex items-center gap-3 text-sm text-brass" to="/timeline/">
                Full timeline <Arrow />
              </Link>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <Reveal>
                <Link
                  className="latest-card group flex h-full flex-col border border-white/10 bg-white/[0.025] p-7 transition-colors hover:border-brass/35 hover:bg-white/[0.04] sm:p-9"
                  to="/research/"
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-brass">
                      Research · Hackathon
                    </span>
                    <span className="font-mono text-[10px] text-mist/60">OCT 21—22, 2026</span>
                  </span>
                  <h3 className="display mt-8 text-3xl text-ivory transition-colors group-hover:text-brass sm:text-4xl">
                    Tellurion Referee at the OSI Hackathon
                  </h3>
                  <p className="mt-4 max-w-[52ch] text-sm leading-6 text-mist">
                    A referee that names why a world model and the measurements disagree. Tested
                    once on 1,000 locked runs.
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm text-brass">
                    Read the note <Arrow />
                  </span>
                </Link>
              </Reveal>
              <Reveal delay={0.08}>
                <Link
                  className="latest-card group flex h-full flex-col border border-white/10 bg-white/[0.025] p-7 transition-colors hover:border-brass/35 hover:bg-white/[0.04] sm:p-9"
                  to="/timeline/"
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-mist">
                      Next · Research
                    </span>
                    <span className="font-mono text-[10px] text-mist/60">PLANNED</span>
                  </span>
                  <h3 className="display mt-8 text-3xl text-ivory transition-colors group-hover:text-brass sm:text-4xl">
                    Does the referee work on a real pendulum?
                  </h3>
                  <p className="mt-4 max-w-[52ch] text-sm leading-6 text-mist">
                    Real recordings with faults we introduce ourselves, and a referee that waits a
                    moment before naming the cause.
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm text-brass">
                    See the timeline <Arrow />
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section-rule">
          <div className="wrap grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.75fr_1.25fr]">
            <Reveal>
              <SectionHeading label="How we work">Evidence before claims.</SectionHeading>
            </Reveal>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                ["01", "Open by default", "Benchmarks, test protocols and reference code are public."],
                ["02", "Locked tests", "Held-out results are run once and logged. We publish weak numbers too."],
                ["03", "Physics first", "Known laws and instrument physics help explain what is off."],
              ].map(([n, title, description], index) => (
                <Reveal key={n} delay={index * 0.08}>
                  <div className="border-t border-white/15 pt-5">
                    <p className="font-mono text-[10px] text-brass">{n}</p>
                    <h3 className="display mt-5 text-2xl text-ivory">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-mist">{description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ResearchPage() {
  return (
    <>
      <main id="main" className="research-page text-navy">
        <div className="mx-auto grid w-[min(100%-36px,1240px)] gap-10 py-12 sm:py-16 lg:grid-cols-[210px_minmax(0,760px)] lg:gap-16">
          <aside className="text-sm text-mist lg:sticky lg:top-28 lg:h-fit">
            <p className="eyebrow !text-brass">Research note 01</p>
            <p className="mt-2">October 2026</p>
            <p className="eyebrow !mb-2 !mt-8 !text-brass">Links</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:flex-col">
              <li><a className="underline decoration-brass/40 underline-offset-4 hover:text-brass" href="https://github.com/tellurionai/tellurion-referee">Code (Apache-2.0)</a></li>
              <li><a className="underline decoration-brass/40 underline-offset-4 hover:text-brass" href="https://tellurionai.github.io/tellurion-referee/">Live demo</a></li>
              <li><a className="underline decoration-brass/40 underline-offset-4 hover:text-brass" href="https://github.com/tellurionai/tellurion-referee/blob/main/docs/results_fact_sheet.md">Results fact sheet</a></li>
              <li><a className="underline decoration-brass/40 underline-offset-4 hover:text-brass" href="https://github.com/tellurionai/tellurion-referee/tree/v0.1-hackathon-test">Exact code tested</a></li>
            </ul>
            <p className="eyebrow !mb-2 !mt-8 !text-brass">Built for</p>
            <p>OSI hackathon, Oct 21–22, 2026</p>
          </aside>
          <article className="research-paper min-w-0 rounded-[1.75rem] p-6 sm:p-10 lg:p-12">
            <p className="eyebrow !text-brass-ink">Research note 01 / October 2026</p>
            <h1 className="display mt-5 text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.98]">
              When a model disagrees with reality, say why.
            </h1>
            <p className="mt-7 max-w-[65ch] text-lg leading-8 text-[#2c3b4a]">
              The referee watches a learned world model as it runs. When its predictions stop
              matching the measurements, it decides whether the model is wrong, the instrument is
              wrong, or something new is acting on the system — and shows its evidence.
            </p>
            <figure className="mt-12">
              <img
                className="w-full border border-[#d3d8dc] bg-white"
                src={researchFigure}
                width="2300"
                height="980"
                alt="Figure 1. Left: share of real problems missed by each method, with 95% confidence intervals. Right: true cause versus the referee's verdict."
                loading="lazy"
              />
              <figcaption className="mt-3 text-sm leading-6 text-[#4f5b67]">
                <strong>Figure 1.</strong> Left: real problems missed, 95% CIs from 1,000 bootstrap
                resamples. Right: true cause vs the referee&apos;s verdict on the locked test.
              </figcaption>
            </figure>

            <h2 className="display mt-14 text-4xl">Result</h2>
            <p className="mt-3 text-[#2c3b4a]">
              Measured once, on a locked test of 1,000 simulated pendulum runs never seen during
              development.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[580px] border-collapse text-sm tabular-nums">
                <thead>
                  <tr className="border-b border-navy text-right">
                    <th className="px-3 py-3 text-left font-medium" scope="col"><span className="sr-only">Metric</span></th>
                    <th className="px-3 py-3 font-semibold text-brass-ink" scope="col">Referee</th>
                    <th className="px-3 py-3 font-medium" scope="col">Model&apos;s confidence</th>
                    <th className="px-3 py-3 font-medium" scope="col">Prediction gap</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Real problems missed", "3.6%", "25.9%", "3.6%"],
                    ["Detection AUROC", "0.981", "0.868", "0.982"],
                    ["False alarms, normal runs", "5.3%", "6.2%", "7.0%"],
                    ["Naming the cause (macro-F1)", "0.472", "0.292", "0.365"],
                  ].map((row) => (
                    <tr className="border-b border-[#d3d8dc]" key={row[0]}>
                      <th className="py-3 pr-3 text-left font-medium text-[#2c3b4a]" scope="row">{row[0]}</th>
                      {row.slice(1).map((value, index) => {
                        const decimals = value.match(/\.(\d+)/)?.[1].length ?? 0;
                        const suffix = value.endsWith("%") ? "%" : "";
                        return (
                          <td
                            className={`px-3 py-3 text-right font-mono ${index === 0 ? "font-semibold text-navy" : "text-[#2c3b4a]"}`}
                            key={index}
                          >
                            <NumberTicker
                              value={Number.parseFloat(value)}
                              decimals={decimals}
                              suffix={suffix}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="display mt-14 text-4xl">How it decides</h2>
            <ol className="mt-5 space-y-3 pl-6 text-[#2c3b4a] marker:font-mono marker:text-brass-ink">
              <li><strong className="text-navy">Does the prediction match the sensors?</strong> Yes: trust.</li>
              <li><strong className="text-navy">Do the angle and speed sensors agree with each other?</strong> No: the instrument is wrong.</li>
              <li><strong className="text-navy">Does textbook physics explain the motion?</strong> Yes: the model is wrong.</li>
              <li><strong className="text-navy">Does it fit after re-measuring length and friction?</strong> Yes: the model is wrong, a setting changed. No: something new.</li>
            </ol>

            <h2 className="display mt-14 text-4xl">What doesn&apos;t work yet</h2>
            <p className="mt-3 leading-7 text-[#2c3b4a]">
              The referee&apos;s alarm is the prediction gap, so at noticing problems it ties a simple
              gap alarm. Its added value is naming the cause: 99.7% right when the model is at
              fault, but 16.7% for sensor faults and 5.4% for new forces. It gives its verdict at
              the first alarm, when its window still holds mostly pre-fault data. Everything here
              is simulated.
            </p>

            <h2 className="display mt-14 text-4xl">Next</h2>
            <p className="mt-3 leading-7 text-[#2c3b4a]">
              Judging a few steps after the alarm, real pendulum recordings with faults we
              introduce ourselves, and fits that describe the form of a missing force instead of
              only flagging it.
            </p>
          </article>
        </div>
      </main>
      <Footer compact />
    </>
  );
}

function TimelinePage() {
  return (
    <>
      <main id="main" className="timeline-page">
        <section className="timeline-hero section-rule">
          <div className="wrap py-14 sm:py-20">
            <p className="eyebrow mb-5">Timeline / field notes</p>
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <h1 className="display text-[clamp(3.5rem,8vw,6.5rem)] leading-[0.95]">What we&apos;ve shipped.</h1>
              <p className="max-w-[38ch] text-sm leading-6 text-mist">
                Research, hackathons, releases and posts, newest first. Planned work has an open circle.
              </p>
            </div>
          </div>
        </section>
        <section className="section-rule">
          <div className="wrap pb-24 pt-10 sm:pt-14">
            <div className="relative">
              <div className="absolute bottom-0 left-[7px] top-[75px] w-px bg-white/10 md:left-[169px]" />
              <p className="display mb-3 pl-8 text-3xl text-mist/70 md:pl-[205px]">Next</p>
              <article className="timeline-entry relative grid gap-2 py-7 pl-8 md:grid-cols-[170px_1fr] md:gap-9 md:pl-0">
                <span className="absolute left-0 top-[34px] h-4 w-4 rounded-full border border-brass bg-navy md:left-[161px]" />
                <p className="font-mono text-xs text-mist md:pr-8 md:pt-1 md:text-right">Planned</p>
                <div className="timeline-card max-w-[70ch]">
                  <p className="eyebrow !text-[10px]">Research</p>
                  <h2 className="display mt-3 text-3xl leading-tight text-mist">
                    Does the referee work on a real pendulum?
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-mist">
                    Real recordings with faults we introduce ourselves, and a referee that waits a
                    moment after the alarm before naming the cause.
                  </p>
                </div>
              </article>

              <p className="display mb-3 mt-7 pl-8 text-3xl text-ivory md:pl-[205px]">2026</p>
              <article className="timeline-entry relative grid gap-2 py-7 pl-8 md:grid-cols-[170px_1fr] md:gap-9 md:pl-0">
                <span className="absolute left-0 top-[34px] h-4 w-4 rounded-full border-[5px] border-navy bg-brass ring-1 ring-brass md:left-[161px]" />
                <time className="font-mono text-xs text-mist md:pr-8 md:pt-1 md:text-right" dateTime="2026-10-22">
                  Oct 21—22
                </time>
                <div className="timeline-card max-w-[70ch]">
                  <p className="eyebrow !text-[10px]">Hackathon · Open Scientific Intelligence</p>
                  <h2 className="display mt-3 text-3xl leading-tight">
                    <Link className="transition-colors hover:text-brass" to="/research/">
                      Tellurion Referee at the Open Scientific Intelligence Hackathon
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-mist">
                    In two days: a simulated pendulum with an answer key, a learned world model,
                    and a referee that names why the model and the measurements disagree. Tested
                    once on a locked set of 1,000 runs: the model&apos;s own confidence missed 25.9%
                    of real problems; the referee missed 3.6%.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-brass">
                    <Link className="inline-flex items-center gap-2" to="/research/">Write-up <Arrow /></Link>
                    <a className="inline-flex items-center gap-2" href="https://github.com/tellurionai/tellurion-referee">Code <Arrow diagonal /></a>
                    <a className="inline-flex items-center gap-2" href="https://tellurionai.github.io/tellurion-referee/">Live demo <Arrow diagonal /></a>
                    <a className="inline-flex items-center gap-2" href="https://github.com/tellurionai/tellurion-referee/tree/v0.1-hackathon-test">Release v0.1 <Arrow diagonal /></a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer compact />
    </>
  );
}

function NotFoundPage() {
  return (
    <>
      <main className="wrap min-h-[65vh] py-24">
        <p className="eyebrow mb-5">404 · Model disagrees with reality</p>
        <h1 className="display text-6xl sm:text-8xl">This page isn&apos;t here.</h1>
        <p className="mt-5 text-mist">The link may be wrong, or the page may have moved.</p>
        <Link className="mt-8 inline-flex items-center gap-3 bg-brass px-5 py-3 text-sm font-semibold text-navy" to="/">
          Back to the homepage <Arrow />
        </Link>
      </main>
      <Footer compact />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const page = location.pathname.startsWith("/research")
    ? {
        title: "Tellurion Referee — Research · Tellurion",
        description:
          "The Tellurion Referee decides whether a disagreement between a world model and the measurements is the model, the instrument, or something new.",
        canonical: "https://tellurionai.com/research/",
      }
    : location.pathname.startsWith("/timeline")
      ? {
          title: "Timeline · Tellurion",
          description:
            "Everything Tellurion ships, in order: research notes, papers, hackathons, releases and posts.",
          canonical: "https://tellurionai.com/timeline/",
        }
      : location.pathname === "/"
        ? {
            title: "Tellurion — Know when your world model is wrong, and why",
            description:
              "Tellurion builds tools that check AI models of physical systems against reality, and explain why they disagree.",
            canonical: "https://tellurionai.com/",
          }
        : {
            title: "Page not found · Tellurion",
            description: "The page you requested could not be found.",
            canonical: null,
          };

  useEffect(() => {
    document.title = page.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", page.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", page.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", page.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", page.canonical ?? "");
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && page.canonical) canonical.setAttribute("href", page.canonical);
    if (!page.canonical) {
      canonical?.remove();
      document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex");
    }
  }, [location.pathname]);

  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-brass focus:px-4 focus:py-2 focus:text-navy"
        href="#main"
      >
        Skip to content
      </a>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/research/*" element={<ResearchPage />} />
        <Route path="/timeline/*" element={<TimelinePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
