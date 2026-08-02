import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import '../styles/landing.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Dev-only handle. Lets the timeline be driven manually when inspecting this
   page in a headless/offscreen context, where rAF is suspended. */
if (import.meta.env.DEV) {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

/* ------------------------------------------------------------------
   Deterministic data — stable across reloads so the demo never jumps.
   ------------------------------------------------------------------ */
const seeded = (seed) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const HERO_CANDLES = (() => {
  const r = seeded(20260801);
  let price = 200; 
  return Array.from({ length: 60 }, (_, i) => {
    const open = price;
    // Create a specific trend to match the screenshot roughly
    let bias = 0;
    if (i < 10) bias = 8; // Downward
    else if (i < 20) bias = -12; // Upward
    else if (i > 40 && i < 50) bias = 8; 
    else bias = -8; 

    const change = (r() - 0.5) * 15 + bias;
    const close = open + change;
    price = close;
    const up = close < open; 
    
    const high = Math.min(open, close) - r() * 15;
    const low = Math.max(open, close) + r() * 15;

    return { i, open, close, high, low, up };
  });
})();

/* Authentic, volatile trading data for up-and-down candlestick patterns */
const SCORE_CANDLES = (() => {
  const r = seeded(884422);
  let currentPrice = 650; // start in the middle of [480, 860]
  return Array.from({ length: 144 }, (_, i) => {
    const open = currentPrice;
    
    // Highly volatile moves for clear up/down patterns
    let move = (r() - 0.49) * 45; 
    
    // Occasionally create a massive market move (very tall candle body)
    if (r() > 0.85) {
      move *= 4; 
    }
    
    // Soft boundaries to keep the chart looking authentic but visible
    if (open > 800) move -= Math.abs(move) * 0.4;
    if (open < 520) move += Math.abs(move) * 0.4;
    
    const close = open + move;
    
    const up = close >= open;
    // Long wicks exactly like CryptOwl
    const high = Math.max(open, close) + r() * 45 + 10;
    const low = Math.min(open, close) - r() * 45 - 10;
    
    currentPrice = close;
    return { i, open, close, high, low, up, score: close };
  });
})();

const SCORE_SERIES = SCORE_CANDLES.map(c => c.score);

/* Mirrors frontend/src/engine/CreditScoring.js so the landing page and the
   live underwriting engine can never disagree. */
const tierFor = (score) => {
  if (score >= 780) return { tier: 'Tier A+', label: 'Prime Agent', apr: 4.2, limit: 5000, ok: true };
  if (score >= 700) return { tier: 'Tier A', label: 'Low Risk', apr: 6.5, limit: 2500, ok: true };
  if (score >= 620) return { tier: 'Tier B', label: 'Moderate Risk', apr: 9.8, limit: 1000, ok: true };
  if (score >= 550) return { tier: 'Tier C', label: 'Elevated Risk', apr: 14.5, limit: 500, ok: true };
  return { tier: 'Tier D/F', label: 'High Risk', apr: 22.0, limit: 250, ok: false };
};

const PROVE_CARDS = [
  { side: 'l', dt: 'Agent identity', dd: 'ERC-725 DID' },
  { side: 'r', dt: 'Engine mode', dd: 'Rules or reputation' },
  { side: 'l', dt: 'Execution history', dd: 'Task success rate' },
  { side: 'r', dt: 'Vendor scope', dd: 'Whitelist only' },
  { side: 'l', dt: 'Capital', dd: 'Requested vs. ceiling' },
  { side: 'r', dt: 'Buyer proof', dd: 'Escrow deposit verified' },
  { side: 'l', dt: 'Repayment', dd: 'Revenue interception' },
  { side: 'r', dt: 'Decision logic', dd: 'Score, tier, APR' },
];

const MACHINE_ROWS = [
  { t: 'Escrow initialised', d: 'Capital locked, debt schedule written on-chain.', bars: [6, 10, 14, 18, 12] },
  { t: 'Whitelisted spend', d: 'Disbursed to modal.com for H100 cluster rent.', bars: [8, 16, 11, 20, 15] },
  { t: 'Unauthorized vendor', d: 'Spend attempted outside the approved scope.', bars: [18, 6, 21, 9, 22], alarm: true },
  { t: 'Circuit breaker fired', d: 'Escrow frozen in under 24ms. No capital left.', bars: [22, 20, 22, 19, 22], alarm: true },
  { t: 'Capital reclaimed', d: 'Unspent principal routed back to the lender pool.', bars: [14, 9, 17, 7, 11] },
];

const TIERS = [
  { rank: '01', name: 'Tier A+', sub: 'Prime Agent', score: '780 – 850', apr: '4.2%', limit: '$5,000' },
  { rank: '02', name: 'Tier A', sub: 'Low Risk', score: '700 – 779', apr: '6.5%', limit: '$2,500' },
  { rank: '03', name: 'Tier B', sub: 'Moderate Risk', score: '620 – 699', apr: '9.8%', limit: '$1,000' },
  { rank: '04', name: 'Tier C', sub: 'Elevated Risk', score: '550 – 619', apr: '14.5%', limit: '$500' },
  { rank: '05', name: 'Tier D / F', sub: 'Declined', score: '300 – 549', apr: '—', limit: 'No credit', deny: true },
];

const TICKER = [
  ['Capital extended', '$1,482,500'],
  ['Recovery rate', '99.42%'],
  ['Active escrows', '128'],
  ['Circuit breakers', '14'],
  ['Agent transactions', '840+'],
  ['Collateral required', '$0'],
];

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Mark = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <path d="M16 2.5 4.5 7.4v9.1c0 7.1 4.8 11.9 11.5 13.9 6.7-2 11.5-6.8 11.5-13.9V7.4L16 2.5Z" />
    <path d="M17.6 11.2 12.4 18h4l-1.2 4.6 5.2-6.8h-4l1.2-4.6Z" />
  </svg>
);

export function Landing({ onEnter }) {
  const root = useRef(null);
  const [booting, setBooting] = useState(true);

  /* Live refs written directly during scroll — avoids re-rendering React
     on every scroll frame. */
  const scoreRef = useRef(null);
  const tierRef = useRef(null);
  const aprRef = useRef(null);
  const limitRef = useRef(null);
  const scanRef = useRef(null);
  const chartWrapperRef = useRef(null);
  const barsRef = useRef([]);
  const railRef = useRef([]);
  const rowsRef = useRef([]);

  /* Safety net: the intro timeline lifts the curtain, but rAF is suspended in
     hidden/background tabs, so never let the preloader block the page forever. */
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 4500);
    return () => clearTimeout(t);
  }, []);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* ---------- 0. Preloader ---------- */
      const strokes = gsap.utils.toArray('.ca-preloader__mark path');
      strokes.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const boot = gsap.timeline({
        onComplete: () => setBooting(false),
      });
      boot
        .to(strokes, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: 0.14 })
        .to('.ca-preloader__bar i', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0.1)
        .to('.ca-preloader__pct', {
          duration: 0.9,
          ease: 'power2.inOut',
          onUpdate() {
            const el = document.querySelector('.ca-preloader__pct');
            if (el) el.textContent = `${Math.round(this.progress() * 100)}%  PROTOCOL READY`;
          },
        }, 0.1)
        .to('.ca-preloader__mark', { scale: 1.35, opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.1')
        .to('.ca-preloader', { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, '<0.15');

      /* ---------- 1. Hero intro ---------- */
      const archPaths = gsap.utils.toArray('.ca-arch path');
      archPaths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const intro = gsap.timeline({ delay: 1.5 });
      intro
        .to(archPaths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.12 })
        .from('.ca-plane', { opacity: 0, duration: 1.4, ease: 'power2.out' }, 0)
        .from('.ca-bars rect', {
          scaleY: 0,
          transformOrigin: 'center',
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: { each: 0.012, from: 'start' },
        }, 0.35)
        .from('.ca-hero__kicker', { y: 16, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.5)
        .from('.ca-hero__thin', { y: 34, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0.62)
        .from('.ca-hero__heavy', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0.74)
        .from('.ca-hero__sub', { y: 18, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.98)
        .from('.ca-hero__cta', { y: 18, opacity: 0, duration: 0.7, ease: 'power2.out' }, 1.06)
        .from('.ca-scrollcue', { opacity: 0, duration: 0.7 }, 1.2)
        .from('.ca-topbar > *', { y: -18, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08 }, 0.4);

      /* Endless drift on the perspective planes — the "travelling through
         space" feel that carries the whole page. */
      /* Transform-only, and exactly one grid cell (110px) per loop so the
         reset is seamless. Animating background-position instead would
         repaint the whole plane every frame. */
      if (!reduced) {
        gsap.to('.ca-plane--floor .ca-plane__grid', {
          y: 110,
          duration: 6.5,
          ease: 'none',
          repeat: -1,
        });
        gsap.to('.ca-plane--ceil .ca-plane__grid', {
          y: -110,
          duration: 8.0,
          ease: 'none',
          repeat: -1,
        });
      }

      /* ---------- 1b. Hero scroll — fly through the portal ---------- */
      gsap.timeline({
        scrollTrigger: {
          trigger: '.ca-hero',
          start: 'top top',
          end: '+=1200',
          pin: true,
          scrub: 1,
        },
      })
        .to('.ca-arch', { scale: 4.2, opacity: 0, ease: 'power2.in' }, 0)
        .to('.ca-bars', { xPercent: -55, opacity: 0, ease: 'power1.in' }, 0)
        .to('.ca-hero__content', { y: -90, opacity: 0, ease: 'power1.in' }, 0)
        /* Fade the tunnel rather than re-rotating it — changing rotateX on a
           plane this size forces a full re-rasterisation every frame. */
        .to('.ca-plane', { opacity: 0, ease: 'power1.in' }, 0)
        .to('.ca-scrollcue', { opacity: 0, duration: 0.2 }, 0);

      /* ---------- Ticker marquee ---------- */
      const track = document.querySelector('.ca-ticker__track');
      if (track && !reduced) {
        gsap.to(track, {
          xPercent: -50,
          duration: 26,
          ease: 'none',
          repeat: -1,
        });
      }

      /* ---------- 2. Statement — word by word ---------- */
      gsap.from('.ca-statement .ca-word', {
        scrollTrigger: {
          trigger: '.ca-statement',
          start: 'top 72%',
          end: 'center center',
          scrub: 1,
        },
        yPercent: 110,
        opacity: 0,
        filter: 'blur(12px)',
        stagger: 0.09,
        ease: 'power2.out',
      });
      gsap.from('.ca-statement__eyebrow', {
        scrollTrigger: { trigger: '.ca-statement', start: 'top 78%', toggleActions: 'play none none reverse' },
        opacity: 0,
        y: 14,
        duration: 0.8,
        ease: 'power2.out',
      });
      gsap.fromTo('.ca-statement .ca-focal',
        { scale: 0.4, opacity: 0 },
        {
          scale: 1, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: '.ca-statement', start: 'top bottom', end: 'center center', scrub: 1 },
        });

      /* ---------- 3. Prove — cards converge from both flanks ---------- */
      gsap.from('.ca-prove__head > *', {
        scrollTrigger: { trigger: '.ca-prove', start: 'top 68%', toggleActions: 'play none none reverse' },
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.1,
      });
      gsap.from('.ca-card[data-side="l"]', {
        scrollTrigger: { trigger: '.ca-prove__cards', start: 'top 82%', end: 'center 58%', scrub: 1 },
        x: -190,
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.12,
      });
      gsap.from('.ca-card[data-side="r"]', {
        scrollTrigger: { trigger: '.ca-prove__cards', start: 'top 82%', end: 'center 58%', scrub: 1 },
        x: 190,
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.12,
      });
      gsap.from('.ca-orbit', {
        scrollTrigger: { trigger: '.ca-prove__cards', start: 'top 85%', end: 'bottom 55%', scrub: 1 },
        scale: 0.2,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out',
      });

      /* ---------- 4. Underwriting scrub (pinned) ---------- */
      const bars = barsRef.current.filter(Boolean);
      const scanState = { p: 0 };

      ScrollTrigger.create({
        trigger: '.ca-scrub',
        start: 'top top',
        end: '+=2200',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          scanState.p = self.progress;
          const windowSize = 20;
          const maxStart = SCORE_SERIES.length - windowSize;
          const startIdx = Math.min(maxStart, Math.floor(self.progress * (maxStart + 0.999)));
          const idx = startIdx + windowSize - 1;
          
          const score = SCORE_SERIES[idx];
          const t = tierFor(score);

          if (scoreRef.current) scoreRef.current.textContent = String(score);
          if (tierRef.current) {
            tierRef.current.textContent = t.tier;
            tierRef.current.className = t.ok ? 'is-accent' : 'is-neg';
          }
          if (aprRef.current) aprRef.current.textContent = `${t.apr.toFixed(1)}%`;
          if (limitRef.current) {
            limitRef.current.textContent = t.ok ? `$${t.limit.toLocaleString()}` : 'Declined';
            limitRef.current.className = t.ok ? 'is-pos' : 'is-neg';
          }
          
          const chartWidth = 2500;
          const itemWidth = chartWidth / SCORE_SERIES.length;
          const panX = self.progress * (chartWidth - 1000);
          
          if (chartWrapperRef.current) {
            chartWrapperRef.current.setAttribute('transform', `translate(${-panX}, 0)`);
          }

          if (scanRef.current) {
            const leftPx = startIdx * itemWidth - panX;
            const widthPx = windowSize * itemWidth;
            scanRef.current.style.left = `${(leftPx / 1000) * 100}%`;
            scanRef.current.style.width = `${(widthPx / 1000) * 100}%`;
          }
          
          bars.forEach((b, i) => {
            if (!b) return;
            const on = i >= startIdx && i <= idx;
            b.style.opacity = on ? '1' : '0.16';
          });
        },
      });

      gsap.from('.ca-scrub__title', {
        scrollTrigger: { trigger: '.ca-scrub', start: 'top 60%', toggleActions: 'play none none reverse' },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
      });

      /* ---------- 5. Escrow state machine ---------- */
      gsap.from('.ca-control__head > *', {
        scrollTrigger: { trigger: '.ca-control', start: 'top 68%', toggleActions: 'play none none reverse' },
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.1,
      });
      gsap.fromTo('.ca-row', 
        { x: 60, opacity: 0 },
        {
          scrollTrigger: { trigger: '.ca-machine', start: 'top 78%', toggleActions: 'play none none reverse' },
          x: 0,
          opacity: 1,
          clearProps: 'transform',
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.09,
        }
      );

      ScrollTrigger.create({
        trigger: '.ca-control',
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: true,
        onUpdate: (self) => {
          const active = Math.min(
            MACHINE_ROWS.length - 1,
            Math.floor(self.progress * MACHINE_ROWS.length)
          );
          rowsRef.current.forEach((el, i) => el && el.classList.toggle('is-active', i === active));
          railRef.current.forEach((el, i) => el && el.classList.toggle('is-on', i <= active));
        },
      });

      /* ---------- 6. Rollup graph draws itself ---------- */
      // 1. Floating dots animation (detach from rail and land on graph nodes)
      const floatTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.ca-rollup',
          start: 'top 95%',
          end: 'top 15%',
          scrub: 1.5,
        }
      });
      
      gsap.set('.ca-node-core', { opacity: 0 });
      
      floatTl.to(railRef.current, {
        x: (index, target) => {
          const nodes = document.querySelectorAll('.ca-node-core');
          if (!nodes.length) return 0;
          const nodeIndex = Math.min(index, nodes.length - 1);
          const svgRect = nodes[nodeIndex].getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          return svgRect.left + (svgRect.width / 2) - (targetRect.left + (targetRect.width / 2));
        },
        y: (index, target) => {
          const nodes = document.querySelectorAll('.ca-node-core');
          if (!nodes.length) return 0;
          const nodeIndex = Math.min(index, nodes.length - 1);
          const svgRect = nodes[nodeIndex].getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          return svgRect.top + (svgRect.height / 2) - (targetRect.top + (targetRect.height / 2));
        },
        backgroundColor: '#ffffff',
        boxShadow: 'none',
        scale: 1.5,
        ease: 'power2.inOut'
      }, 0);
      
      floatTl.to(railRef.current, { opacity: 0, duration: 0.05 }, 0.95);
      floatTl.to('.ca-node-core', { opacity: 1, duration: 0.05 }, 0.95);

      // 2. Draw the graph links as the dots land
      const links = gsap.utils.toArray('.ca-graph .ca-link');
      links.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.timeline({
        scrollTrigger: { trigger: '.ca-rollup', start: 'top 15%', toggleActions: 'play none none reverse' },
      })
        .to(links, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', stagger: 0.12 })
        .from('.ca-graph .ca-nodegroup', { scale: 0, transformOrigin: 'center', opacity: 0, duration: 0.7, ease: 'back.out(2)', stagger: 0.1 }, 0.4)
        .from('.ca-stats__item', { x: 26, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.09 }, 0.5)
        .from('.ca-legend__item', { x: -26, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.09 }, 0.5);

      /* Count the headline protocol numbers up as they land. */
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const target = parseFloat(el.dataset.count);
        const dp = parseInt(el.dataset.dp || '0', 10);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
          onUpdate: () => {
            el.textContent =
              prefix +
              obj.v.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp }) +
              suffix;
          },
        });
      });

      /* ---------- 7. Tier table ---------- */
      gsap.from('.ca-tier', {
        scrollTrigger: { trigger: '.ca-tiers__list', start: 'top 78%', toggleActions: 'play none none reverse' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
      });
      gsap.from('.ca-tier__bar', {
        scrollTrigger: { trigger: '.ca-tiers__list', start: 'top 74%', toggleActions: 'play none none reverse' },
        scaleX: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
      });

      /* ---------- 8. Closing ---------- */
      gsap.from('.ca-close__inner > *', {
        scrollTrigger: { trigger: '.ca-close', start: 'top 70%', toggleActions: 'play none none reverse' },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.12,
      });
      gsap.fromTo('.ca-close .ca-focal',
        { scale: 0.5, opacity: 0.2 },
        {
          scale: 1.1, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: '.ca-close', start: 'top bottom', end: 'bottom bottom', scrub: 1 },
        });
    },
    { scope: root }
  );

  const statement = 'Who lends to a machine that owns nothing?'.split(' ');

  return (
    <div className="ca-landing" ref={root}>
      <div className="ca-gridlines" />

      {/* ---------------- Preloader ---------------- */}
      {booting && (
        <div className="ca-preloader">
          <Mark className="ca-preloader__mark" />
          <div className="ca-preloader__pct">0% PROTOCOL READY</div>
          <div className="ca-preloader__bar"><i /></div>
        </div>
      )}

      {/* ---------------- Top bar ---------------- */}
      <header className="ca-topbar">
        <div className="ca-wordmark" style={{ flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
          <img src="/logo.png" alt="CredAgent Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
          <img src="/wordmark.png" alt="CredAgent Wordmark" style={{ width: '120px', objectFit: 'contain' }} />
        </div>
        <div className="ca-topbar__right">
          {/* <div className="ca-chain"><i />ARBITRUM SEPOLIA</div> */}
          <button className="ca-btn" onClick={onEnter}>
            Launch protocol <Arrow />
          </button>
        </div>
      </header>

      {/* ---------------- 1. Hero ---------------- */}
      <section className="ca-hero">
        <div className="ca-hero__space">
          <div className="ca-plane ca-plane--floor">
            <span className="ca-plane__grid" />
          </div>
          <div className="ca-plane ca-plane--ceil">
            <span className="ca-plane__grid" />
          </div>

          <svg className="ca-bars" viewBox="0 0 600 300" preserveAspectRatio="none">
            {/* Price labels and horizontal grid lines to match Image 1 */}
            <g stroke="rgba(255,255,255,0.04)" strokeWidth="1" fontSize="9" fill="rgba(255,255,255,0.3)">
              {[
                { y: 50, label: "74K" },
                { y: 100, label: "72K" },
                { y: 150, label: "70K" },
                { y: 200, label: "68K" },
                { y: 250, label: "66K" }
              ].map((grid, i) => (
                <g key={i}>
                  <line x1="0" y1={grid.y} x2="600" y2={grid.y} />
                  <text x="575" y={grid.y + 3}>{grid.label}</text>
                </g>
              ))}
            </g>

            {HERO_CANDLES.map((c) => {
              if (c.i > 22 && c.i < 37) return null;
              
              const color = c.up ? '#7ee2f4' : '#4179de';
              return (
                <g key={c.i} opacity={0.75}>
                  <line 
                    x1={c.i * 10 + 2.5} 
                    y1={c.high} 
                    x2={c.i * 10 + 2.5} 
                    y2={c.low} 
                    stroke={color} 
                    strokeWidth="1" 
                  />
                  <rect
                    x={c.i * 10}
                    y={Math.min(c.open, c.close)}
                    width="5"
                    height={Math.max(2, Math.abs(c.open - c.close))}
                    fill={color}
                  />
                </g>
              );
            })}
          </svg>

          <svg className="ca-arch" viewBox="0 0 300 400" preserveAspectRatio="xMidYMax meet">
            <path className="ca-arch--halo" d="M34 400 L34 152 A116 116 0 0 1 266 152 L266 400" />
            <path className="ca-arch--ghost" d="M4 400 L4 152 A146 146 0 0 1 296 152 L296 400" />
            <path className="ca-arch--ghost" d="M18 400 L18 152 A132 132 0 0 1 282 152 L282 400" />
            <path d="M34 400 L34 152 A116 116 0 0 1 266 152 L266 400" />
          </svg>

          <div className="ca-hero__vignette" />
        </div>

        <div className="ca-hero__content">
          <div className="ca-hero__kicker">Autonomous agent credit protocol</div>
          <h1>
            <span className="ca-hero__thin">Capital Without</span>
            <span className="ca-hero__heavy" style={{ display: 'block' }}>Collateral</span>
          </h1>
          <p className="ca-hero__sub">
            <b>Underwrite instantly</b> <span>·</span> <b>Spend inside escrow</b> <span>·</span>{' '}
            <span>Repay from revenue</span>
          </p>
          <div className="ca-hero__cta">
            <button className="ca-btn ca-btn--solid" onClick={onEnter}>
              Enter protocol <Arrow />
            </button>
          </div>
        </div>

        <div className="ca-scrollcue">
          <i />
          SCROLL
        </div>
      </section>

      {/* ---------------- Ticker ---------------- */}
      <div className="ca-ticker">
        <div className="ca-ticker__track">
          {[...TICKER, ...TICKER].map(([k, v], i) => (
            <div className="ca-ticker__item" key={i}>
              {k} <b>{v}</b> <span>/</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- 2. Statement ---------------- */}
      <section className="ca-statement">
        <div className="ca-focal" />
        <div className="ca-statement__inner">
          <div className="ca-statement__eyebrow">
            Before compute, every agent faces one question.
          </div>
          <h2 className="ca-statement__text">
            {statement.map((w, i) => (
              <React.Fragment key={i}>
                <span className="ca-word">{w === 'nothing?' ? <em>nothing?</em> : w}</span>{' '}
              </React.Fragment>
            ))}
          </h2>
        </div>
      </section>

      {/* ---------------- 3. Prove the agent ---------------- */}
      <section className="ca-section ca-prove">
        <div className="ca-focal" />
        <div className="ca-prove__grid">
          <div className="ca-prove__head">
            <div className="ca-eyebrow">Identity before capital</div>
            <h2 className="ca-display">
              Prove
              <br />
              the
              <br />
              agent.
            </h2>
            <p className="ca-lede">
              Reputation, execution history, and a verified buyer deposit replace the
              collateral an AI agent can never post.
            </p>
          </div>

          <div className="ca-prove__cards">
            <div className="ca-orbit" style={{ width: 300, height: 300 }} />
            <div className="ca-orbit" style={{ width: 460, height: 460 }} />
            <div className="ca-orbit" style={{ width: 620, height: 620 }} />
            {PROVE_CARDS.map((c, i) => (
              <dl className="ca-card" data-side={c.side} key={i}>
                <dt>{c.dt}</dt>
                <dd>{c.dd}</dd>
              </dl>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 4. Underwriting scrub ---------------- */}
      <section className="ca-scrub">
        <h2 className="ca-scrub__title">Run it through underwriting.</h2>

        <div className="ca-scrub__stage">
          <svg className="ca-scrub__chart" viewBox="0 0 1000 300" preserveAspectRatio="none">
            <g ref={chartWrapperRef}>
              {SCORE_CANDLES.map((c, i) => {
                const mapY = (val) => 300 - ((val - 480) / 380) * 280;
                const yOpen = mapY(c.open);
                const yClose = mapY(c.close);
                const yHigh = mapY(c.high);
                const yLow = mapY(c.low);
                
                const yBody = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(4, Math.abs(yOpen - yClose));
                const color = c.up ? '#7ee2f4' : '#4179de';
                
                const chartWidth = 2500;
                const itemWidth = chartWidth / SCORE_CANDLES.length;
                const xCenter = i * itemWidth + itemWidth / 2;
                // Tightly packed candles like CryptOwl
                const boxWidth = Math.max(2, itemWidth - 6); 
                const xLeft = xCenter - (boxWidth / 2);

                return (
                  <g key={i} ref={(el) => (barsRef.current[i] = el)} opacity="0.16">
                    <line 
                      x1={xCenter} 
                      y1={yHigh} 
                      x2={xCenter} 
                      y2={yLow} 
                      stroke={color} 
                      strokeWidth="1" 
                    />
                    <rect
                      x={xLeft}
                      y={yBody}
                      width={boxWidth}
                      height={bodyHeight}
                      fill={color}
                    />
                  </g>
                );
              })}
            </g>
          </svg>

          <div
            ref={scanRef}
            style={{
              position: 'absolute',
              top: '15%',
              bottom: '15%',
              left: '0%',
              width: '0%',
              background: 'rgba(255, 255, 255, 0.03)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              borderRight: '1px solid rgba(255, 255, 255, 0.2)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%', transform: 'translateX(-3px)' }} />
            <div style={{ height: 1, flex: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
            <div style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%', transform: 'translateX(3px)' }} />
          </div>
        </div>

        <dl className="ca-scrub__readout">
          <div className="ca-readout">
            <dt>Credit score</dt>
            <dd ref={scoreRef}>545</dd>
          </div>
          <div className="ca-readout">
            <dt>Risk tier</dt>
            <dd ref={tierRef} className="is-neg">Tier D/F</dd>
          </div>
          <div className="ca-readout">
            <dt>APR</dt>
            <dd ref={aprRef}>22.0%</dd>
          </div>
          <div className="ca-readout">
            <dt>Borrow ceiling</dt>
            <dd ref={limitRef} className="is-neg">Declined</dd>
          </div>
        </dl>
        <div className="ca-livedot" />
      </section>

      {/* ---------------- 5. Escrow control ---------------- */}
      <section className="ca-section ca-control">
        <div className="ca-control__grid">
          <div className="ca-control__head">
            <div className="ca-eyebrow">Escrow-level control</div>
            <h2 className="ca-display">
              Control
              <br />
              above
              <br />
              capital.
            </h2>
            <p className="ca-lede">
              Funds only ever move to whitelisted compute. Anything else freezes the
              escrow and returns the principal to lenders.
            </p>
          </div>

          <div className="ca-machine">
            <div className="ca-machine__rail">
              {MACHINE_ROWS.map((_, i) => (
                <i key={i} ref={(el) => (railRef.current[i] = el)} className={i === 0 ? 'is-on' : ''} />
              ))}
            </div>
            <div className="ca-machine__rows">
              {MACHINE_ROWS.map((r, i) => (
                <div
                  key={i}
                  ref={(el) => (rowsRef.current[i] = el)}
                  className={`ca-row${r.alarm ? ' is-alarm' : ''}${i === 0 ? ' is-active' : ''}`}
                >
                  <div>
                    <div className="ca-row__title">{r.t}</div>
                    <div className="ca-row__desc">{r.d}</div>
                  </div>
                  <div className="ca-spark">
                    {r.bars.map((h, j) => (
                      <i key={j} style={{ height: h }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 6. Protocol rollup ---------------- */}
      <section className="ca-section ca-rollup">
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div className="ca-eyebrow">Protocol rollup</div>
          <h2 className="ca-display">Settlement across</h2>
        </div>

        <div className="ca-rollup__frame">
          <div className="ca-legend">
            <div className="ca-legend__item">
              <dt>Agents</dt>
              <dd>identity &amp; reputation</dd>
            </div>
            <div className="ca-legend__item">
              <dt>Escrows</dt>
              <dd>scoped capital</dd>
            </div>
            <div className="ca-legend__item">
              <dt>Lenders</dt>
              <dd>senior &amp; junior tranches</dd>
            </div>
          </div>

          <svg className="ca-graph" viewBox="0 0 600 300">
            <path className="ca-link" d="M300 232 C 300 150, 140 170, 120 78" />
            <path className="ca-link" d="M300 232 C 300 160, 300 140, 300 78" />
            <path className="ca-link" d="M300 232 C 300 150, 460 170, 480 78" />
            <path className="ca-link" d="M120 78 C 120 30, 300 40, 300 14" />
            <path className="ca-link" d="M480 78 C 480 30, 300 40, 300 14" />

            <g className="ca-nodegroup">
              <circle className="ca-node" cx="120" cy="78" r="20" />
              <circle className="ca-node-core" cx="120" cy="78" r="8" />
              <text className="ca-node-label" x="120" y="118">VENDOR</text>
            </g>
            <g className="ca-nodegroup">
              <circle className="ca-node" cx="300" cy="78" r="20" />
              <circle className="ca-node-core" cx="300" cy="78" r="8" />
              <text className="ca-node-label" x="300" y="118">BUYER</text>
            </g>
            <g className="ca-nodegroup">
              <circle className="ca-node" cx="480" cy="78" r="20" />
              <circle className="ca-node-core" cx="480" cy="78" r="8" />
              <text className="ca-node-label" x="480" y="118">LENDER POOL</text>
            </g>
            <g className="ca-nodegroup">
              <circle className="ca-node" cx="300" cy="232" r="30" />
              <circle className="ca-node-core" cx="300" cy="232" r="12" />
              <text className="ca-node-label" x="300" y="282">SMART ESCROW</text>
            </g>
          </svg>

          <div className="ca-stats">
            <div className="ca-stats__item">
              <dt>Capital extended</dt>
              <dd data-count="1482500" data-prefix="$">$0</dd>
            </div>
            <div className="ca-stats__item">
              <dt>Recovery rate</dt>
              <dd className="is-pos" data-count="99.42" data-dp="2" data-suffix="%">0%</dd>
            </div>
            <div className="ca-stats__item">
              <dt>Active escrows</dt>
              <dd data-count="128">0</dd>
            </div>
            <div className="ca-stats__item">
              <dt>Circuit breakers</dt>
              <dd className="is-accent" data-count="14">0</dd>
            </div>
            <div className="ca-stats__item">
              <dt>Collateral posted</dt>
              <dd className="is-accent">$0.00</dd>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 7. Tiers ---------------- */}
      <section className="ca-section ca-tiers">
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div className="ca-eyebrow">Underwriting output</div>
          <h2 className="ca-display">Five tiers. One score.</h2>
        </div>

        <div className="ca-tiers__list">
          {TIERS.map((t) => (
            <div className={`ca-tier${t.deny ? ' ca-tier--deny' : ''}`} key={t.rank}>
              <div className="ca-tier__rank">{t.rank}</div>
              <div>
                <div className="ca-tier__name">{t.name}</div>
                <div className="ca-row__desc">{t.sub}</div>
              </div>
              <div className="ca-tier__cell"><small>SCORE</small>{t.score}</div>
              <div className="ca-tier__cell"><small>APR</small>{t.apr}</div>
              <div className="ca-tier__cell"><small>CEILING</small>{t.limit}</div>
              <div className="ca-tier__bar" />
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 8. Close ---------------- */}
      <section className="ca-close">
        <div className="ca-focal" />
        <div className="ca-close__inner">
          <div className="ca-eyebrow" style={{ marginBottom: 30 }}>Zero collateral · Guaranteed interception</div>
          <h2 className="ca-close__title">
            Give your agent
            <br />
            a <b>credit line.</b>
          </h2>
          <div className="ca-close__actions">
            <button className="ca-btn ca-btn--solid" onClick={onEnter}>
              Enter protocol <Arrow />
            </button>
            <button className="ca-btn" onClick={onEnter}>
              Run the simulator <Arrow />
            </button>
          </div>
        </div>
      </section>

      <footer className="ca-footer">
        <div>CREDAGENT PROTOCOL — AUTONOMOUS AGENT UNDERWRITING</div>
        {/* <div>ARBITRUM SEPOLIA · TESTNET</div> */}
      </footer>
    </div>
  );
}

export default Landing;
