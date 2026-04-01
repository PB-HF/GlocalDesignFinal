/**
 * BeforeAfter — Optimized
 * GSAP ScrollTrigger horizontal wipe reveal
 * Desktop: pinned scroll animation | Mobile: unpinned scrub
 * Exact same text, sizes, animation — only perf & stability improved
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Props default outside component ──
const DEFAULT_BEFORE = './images/Modern.webp';
const DEFAULT_AFTER  = './images/Modern 1.webp';

const BeforeAfter = ({
  beforeImage = DEFAULT_BEFORE,
  afterImage  = DEFAULT_AFTER,
  beforeLabel = 'Before',
  afterLabel  = 'After',
}) => {
  const sectionRef  = useRef(null);
  const afterDivRef = useRef(null);
  const afterImgRef = useRef(null);

  useEffect(() => {
    const section  = sectionRef.current;
    const afterDiv = afterDivRef.current;
    const afterImg = afterImgRef.current;
    if (!section || !afterDiv || !afterImg) return;

    // GSAP owns the initial state — no CSS transform clash
    gsap.set(afterDiv, { xPercent: 100 });
    gsap.set(afterImg, { xPercent: -100 });

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── Desktop: pinned wipe ──
      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + section.offsetWidth * 0.5,
            scrub: 1.5,        // slightly smoother than 1
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(afterDiv, { xPercent: 0 }, 0)
          .to(afterImg, { xPercent: 0 }, 0);
      });

      // ── Mobile: lightweight scrub, no pin (no extra whitespace gap) ──
      mm.add('(max-width: 767px)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 70%',
            scrub: 1,
            pin: false,
            invalidateOnRefresh: true,
          },
        });
        tl.to(afterDiv, { xPercent: 0 }, 0)
          .to(afterImg, { xPercent: 0 }, 0);
      });
    }, section);

    // One RAF tick so layout is settled before ScrollTrigger measures
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert(); // kills only this component's triggers
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        backgroundColor: '#111',
        overflow: 'hidden',
        // Promote to GPU layer — prevents paint flicker during pin/scrub
        willChange: 'transform',
      }}
    >
      {/* ── Before image (static, behind) ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={beforeImage}
          alt={beforeLabel}
          // Explicit size avoids layout shift; object-fit fills the slot
          width={1920}
          height={1080}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* ── After image (slides in from right via GSAP) ── */}
      <div
        ref={afterDivRef}
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          willChange: 'transform',
        }}
      >
        <div
          ref={afterImgRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            willChange: 'transform',
          }}
        >
          <img
            src={afterImage}
            alt={afterLabel}
            width={1920}
            height={1080}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* ── Centre text overlay ── */}
          <div style={{
            position: 'absolute',
            top: '43%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            <h2 style={{
              fontFamily: "'Lacroom', serif",
              fontSize: 'clamp(3.5rem, 10vw, 8.5rem)',
              color: '#ffffff',
              margin: 0,
              fontWeight: 400,
              letterSpacing: '0.05em',
              lineHeight: 1,
              textShadow: '0 2px 24px rgba(0,0,0,0.35)',
            }}>
              MODERN
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfter;
