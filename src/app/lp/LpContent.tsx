"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { TypingSequence } from "@/components/TypingText";
import { lpText } from "@/data/lp-i18n";
import { services } from "@/data/services";
import type { Lang } from "@/types";
import type { ReactNode } from "react";

// --- Shared helpers ---

function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionCommand({ text }: { text: string }) {
  return (
    <ScrollReveal>
      <p className="text-terminal-green/40 text-sm mb-6 font-mono">{text}</p>
    </ScrollReveal>
  );
}

function SectionDivider() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="h-px lp-divider" />
    </div>
  );
}

// --- Matrix rain background ---

const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const start = useCallback(() => {
    // 前のループを停止
    cleanupRef.current?.();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const fontSize = 14;
    const columns = Math.floor(w / fontSize);
    const drops = new Array(columns).fill(1);

    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue("--raw-terminal-primary").trim() || "#00ff41";

    let animId: number;

    function tick() {
      ctx!.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx!.fillRect(0, 0, w, h);
      ctx!.fillStyle = primary;
      ctx!.globalAlpha = 0.12;
      ctx!.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx!.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      ctx!.globalAlpha = 1;
      animId = requestAnimationFrame(tick);
    }

    tick();
    cleanupRef.current = () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    start();
    const handleResize = () => start();
    window.addEventListener("resize", handleResize);
    return () => {
      cleanupRef.current?.();
      window.removeEventListener("resize", handleResize);
    };
  }, [start]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// --- Animated progress bar ---

function AnimatedProgressBar({ active }: { active: boolean }) {
  return (
    <div className="h-2 mt-1 rounded-sm overflow-hidden bg-terminal-green/10 max-w-xs">
      {active && (
        <motion.div
          className="h-full bg-terminal-green/30 rounded-sm"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
    </div>
  );
}

// --- Sections ---

function HeroSection({ lang, t }: { lang: Lang; t: (typeof lpText)["ja"] }) {
  const [typingDone, setTypingDone] = useState(false);

  return (
    <section className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden lp-scanline lp-flicker px-4">
      {/* Matrix rain background */}
      <MatrixRain />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--raw-terminal-primary) 8%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 text-center max-w-2xl">
        <TypingSequence
          lines={[
            {
              text: t.heroPrompt,
              speed: 5,
              cursor: false,
              className: "text-terminal-green/40 text-sm",
              wrapper: (c) => <p className="mb-6">{c}</p>,
            },
            {
              text: t.heroTagline,
              speed: 4,
              cursor: false,
              className: "text-terminal-green text-2xl sm:text-3xl md:text-4xl glow-text",
              wrapper: (c) => <h1 className="mb-4 font-bold">{c}</h1>,
            },
            {
              text: t.heroSubTagline,
              speed: 3,
              cursor: false,
              className: "text-terminal-green/60 text-sm sm:text-base",
              wrapper: (c) => <p className="mb-8">{c}</p>,
            },
          ]}
          onComplete={() => setTypingDone(true)}
        />

        {typingDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <Link
              href={`/?l=${lang}`}
              className="inline-block border border-terminal-green/50 text-terminal-green px-8 py-3 rounded font-mono text-lg pulse-glow transition-colors hover:bg-terminal-green/10 hover:scale-105"
            >
              {t.heroCta}
            </Link>
            <p className="text-terminal-green/30 text-xs">{t.heroHint}</p>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      {typingDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-terminal-green/40 text-2xl"
          >
            ▼
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

function StepsSection({ t }: { t: (typeof lpText)["ja"] }) {
  return (
    <section className="px-4 py-16 sm:py-20 md:py-24 max-w-5xl mx-auto">
      <SectionCommand text={t.stepsCommand} />
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {t.steps.map((step, i) => (
          <ScrollReveal key={i} delay={i * 0.15} className="flex-1">
            <motion.div
              className="border border-terminal-border rounded-lg p-6 bg-terminal-bg/50 transition-colors"
              whileHover={{
                borderColor: "var(--raw-terminal-primary)",
                boxShadow: "0 0 15px color-mix(in srgb, var(--raw-terminal-primary) 15%, transparent)",
              }}
            >
              <span className="text-terminal-accent text-2xl font-bold glow-text-accent">
                [{i + 1}]
              </span>
              <h3 className="text-terminal-green font-bold mt-3 mb-2">{step.title}</h3>
              <p className="text-terminal-green/50 text-sm">{step.description}</p>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function ServicesSection({ t }: { t: (typeof lpText)["ja"] }) {
  const serviceNames = Object.values(services).map((s) => s.name);

  return (
    <section className="px-4 py-16 sm:py-20 max-w-5xl mx-auto">
      <SectionCommand text={t.servicesCommand} />
      <ScrollReveal>
        <p className="text-terminal-accent text-xs mb-4">{t.servicesCount}</p>
      </ScrollReveal>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {serviceNames.map((name, i) => (
          <ScrollReveal key={name} delay={i * 0.05}>
            <motion.div
              className="border border-terminal-border rounded px-3 py-3 text-center text-sm text-terminal-green/70 transition-colors"
              whileHover={{
                borderColor: "var(--raw-terminal-primary)",
                color: "var(--raw-terminal-primary)",
                boxShadow: "0 0 12px color-mix(in srgb, var(--raw-terminal-primary) 15%, transparent)",
              }}
            >
              {name}
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function DemoSection({ t, lang }: { t: (typeof lpText)["ja"]; lang: Lang }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timers: number[] = [];
    // Stagger the loading steps
    timers.push(window.setTimeout(() => setPhase(1), 300));
    timers.push(window.setTimeout(() => setPhase(2), 900));
    timers.push(window.setTimeout(() => setPhase(3), 1500));
    timers.push(window.setTimeout(() => setPhase(4), 2200));
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  const demoResult = lang === "ja"
    ? {
        name: "Cloudflare Workers",
        cost: "年間¥1,500",
        commercial: "商用OK",
        difficulty: "簡単",
        reason: "無料で商用利用OK、帯域無制限",
        second: "Netlify          ¥0〜",
        third: "Vercel Hobby     ¥0（非商用）",
      }
    : {
        name: "Cloudflare Workers",
        cost: "~$10/yr",
        commercial: "Commercial OK",
        difficulty: "Easy",
        reason: "Free commercial use, unlimited bandwidth",
        second: "Netlify          $0+",
        third: "Vercel Hobby     $0 (non-commercial)",
      };

  return (
    <section className="px-4 py-16 sm:py-20 max-w-3xl mx-auto" ref={ref}>
      <SectionCommand text={t.demoCommand} />
      {/* Demo video — npm run record-demo で自動生成 */}
      <ScrollReveal className="mb-8">
        <div className="border border-terminal-border rounded-lg overflow-hidden">
          {/* 動画ファイルが配置されたら自動で表示、なければプレースホルダー */}
          <video
            src={`/demo-${lang}.webm`}
            autoPlay
            loop
            muted
            playsInline
            aria-label={lang === "ja" ? "診断デモ動画" : "Diagnosis demo video"}
            className="w-full"
            onError={(e) => {
              // 動画が無い場合はプレースホルダーに切り替え
              const target = e.currentTarget;
              target.style.display = "none";
              target.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <div className="hidden aspect-video flex flex-col items-center justify-center bg-terminal-bg/60">
            <span className="text-terminal-green/20 text-4xl mb-3">▶</span>
            <span className="text-terminal-green/30 text-sm">{t.demoVideoCaption}</span>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="border border-terminal-border rounded-lg p-6 bg-terminal-bg/80"
          style={{ boxShadow: "inset 0 0 30px color-mix(in srgb, var(--raw-terminal-primary) 3%, transparent)" }}
        >
          {/* Loading steps */}
          {t.demoSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={phase > i ? { opacity: 1 } : {}}
              transition={{ duration: 0.3 }}
              className="mb-3"
            >
              <span className="text-terminal-green/50 text-sm">{step}</span>
              <AnimatedProgressBar active={phase > i} />
            </motion.div>
          ))}

          {/* Result */}
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 pt-4 border-t border-terminal-border"
            >
              <p className="text-terminal-green glow-text mb-4">{t.demoFound}</p>
              <div className="mb-4">
                <p className="text-terminal-green text-lg font-bold">
                  #1 {demoResult.name}
                </p>
                <p className="text-terminal-green/60 text-sm ml-4">
                  {demoResult.cost} / {demoResult.commercial} / {demoResult.difficulty}
                </p>
                <p className="text-terminal-green/50 text-sm ml-4">
                  → {demoResult.reason}
                </p>
              </div>
              <p className="text-terminal-green/50 text-sm">#2 {demoResult.second}</p>
              <p className="text-terminal-green/50 text-sm">#3 {demoResult.third}</p>
            </motion.div>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}

function FeaturesSection({ t }: { t: (typeof lpText)["ja"] }) {
  return (
    <section className="px-4 py-16 sm:py-20 max-w-3xl mx-auto">
      <SectionCommand text={t.featuresCommand} />
      <div className="space-y-3">
        {t.features.map((feature, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <div className="border-l-2 border-terminal-accent pl-4 py-2">
              <span className="text-terminal-accent text-sm">{">>"}</span>{" "}
              <span className="text-terminal-green/80 text-sm">{feature}</span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function CtaSection({ lang, t }: { lang: Lang; t: (typeof lpText)["ja"] }) {
  return (
    <section className="px-4 py-16 sm:py-24 text-center">
      <SectionCommand text={t.ctaCommand} />
      <ScrollReveal>
        <h2 className="text-terminal-green text-xl sm:text-2xl glow-text mb-8">
          {t.ctaHeading}
        </h2>
        <Link
          href={`/?l=${lang}`}
          className="inline-block border border-terminal-green/50 text-terminal-green px-10 py-4 rounded font-mono text-lg pulse-glow transition-colors hover:bg-terminal-green/10 hover:scale-105"
        >
          {t.ctaButton}
        </Link>
      </ScrollReveal>
    </section>
  );
}

function FooterSection({ lang, t }: { lang: Lang; t: (typeof lpText)["ja"] }) {
  return (
    <footer className="px-4 py-8 text-center">
      <p className="text-terminal-green/20 mb-4 text-xs tracking-widest">
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-terminal-green/40">
        <span>hostme v1.0</span>
        {/* <span>|</span>
        <a
          href="https://github.com/shumatsumonobu/hostme"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-terminal-green transition-colors"
        >
          GitHub
        </a> */}
        <span>|</span>
        <a
          href={`/about?l=${lang}`}
          className="hover:text-terminal-green transition-colors"
        >
          {t.footerAbout}
        </a>
        <span>|</span>
        <a
          href="https://x.com/shumatsumonobu"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-terminal-green transition-colors"
        >
          @shumatsumonobu
        </a>
      </div>
    </footer>
  );
}

// --- Main ---

export function LpContent({ lang }: { lang: Lang }) {
  const t = lpText[lang];
  const oppositeLang = lang === "ja" ? "en" : "ja";

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="min-h-dvh">
      {/* Lang toggle */}
      <a
        href={`/lp?l=${oppositeLang}`}
        aria-label={lang === "ja" ? "Switch to English" : "日本語に切り替え"}
        className="fixed top-3 right-3 z-50 flex items-center font-mono text-xs border border-terminal-border rounded overflow-hidden transition-all hover:border-terminal-green hover:shadow-[0_0_8px_var(--raw-terminal-primary)] cursor-pointer"
      >
        <span className={lang === "en"
          ? "px-2 py-1 bg-terminal-green text-terminal-bg font-bold"
          : "px-2 py-1 text-terminal-green/30"
        }>EN</span>
        <span className="w-px self-stretch bg-terminal-border" />
        <span className={lang === "ja"
          ? "px-2 py-1 bg-terminal-green text-terminal-bg font-bold"
          : "px-2 py-1 text-terminal-green/30"
        }>JA</span>
      </a>

      <HeroSection lang={lang} t={t} />
      <SectionDivider />
      <StepsSection t={t} />
      <SectionDivider />
      <ServicesSection t={t} />
      <SectionDivider />
      <DemoSection t={t} lang={lang} />
      <SectionDivider />
      <FeaturesSection t={t} />
      <SectionDivider />
      <CtaSection lang={lang} t={t} />
      <FooterSection lang={lang} t={t} />
    </div>
  );
}
