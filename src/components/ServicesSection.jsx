/**
 * ServicesSection — Merged (SectionHeader + ServicesSection)
 * Desktop/Tablet: GSAP pinned stacked card animation
 * Mobile: Scrollable cards with fade+slide (no pin — Android safe)
 * Header: Letter-by-letter rotateY reveal (scoped correctly)
 */

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Constants outside component ──
const SERVICES = [
  {
    id: '01',
    title: 'Design\n Consultation',
    desc: 'Thoughtful direction to help you shape spaces that feel personal and intentional.',
    image: '/images/service1.webp',
  },
  {
    id: '02',
    title: 'Luxury\n Projects',
    desc: 'Delivering high-value projects with careful planning, precision, and superior finishes.',
    image: '/images/service2.webp',
  },
  {
    id: '03',
    title: 'Consultation\n + Execution',
    desc: 'End-to-end execution, from concept development to the final handover.',
    image: '/images/service3.webp',
  },
];

const N = SERVICES.length;

// ── Split text into animatable letter spans ──
const splitLetters = (text) =>
  text.split('').map((char, i) => (
    <span
      key={i}
      className="hdr-letter"
      style={{
        display: 'inline-block',
        lineHeight: '1.2em',
        transformOrigin: '50% 50%',
        backfaceVisibility: 'hidden',
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

// ── Section Header ──────────────────────────────────────────────
const SectionHeader = ({ subtitle = 'Services', title = 'Where Ideas Become', titleAccent = 'Beautiful Spaces' }) => {
  const headerRef = useRef(null);
  // Tablet (<1024) gets mobile card layout — pinned desktop anim too cramped on tablet
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    // Scope to THIS header only — not page-global
    const letters = el.querySelectorAll('.hdr-letter');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        letters,
        { rotateY: -90, opacity: 0, scale: 0.8 },
        {
          rotateY: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.03,
          ease: 'power2.out',
          duration: 1.1,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={headerRef}
      style={{
        padding: '4rem 2rem 1rem',
        textAlign: 'center',
        backgroundColor: '#FAF8F5',
        width: '100%',
        position: 'relative',
        zIndex: 10,
        perspective: '1000px',
        boxSizing: 'border-box',
      }}
    >
      <p style={{
        fontFamily: "'Urbanist', sans-serif",
        fontSize: '0.75rem',
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        color: '#8b8b8b',
        marginBottom: '1.2rem',
        fontWeight: 600,
        borderBottom: '1px solid #e2d8d8',
        paddingBottom: '2px',
        display: 'inline-block',
      }}>
        {splitLetters(subtitle)}
      </p>

      <h2 style={{
        fontFamily: "'Lacroom', serif",
        fontWeight: 400,
        fontSize: isMobile ? 'clamp(1.8rem, 6vw, 2.5rem)' : 'clamp(2.5rem, 6vw, 4.2rem)',
        color: '#2b2b2b',
        lineHeight: 1.05,
        margin: 0,
      }}>
        {splitLetters(title)}
        <br />
        <span style={{ color: '#b2000a' }}>{splitLetters(titleAccent)}</span>
      </h2>
    </div>
  );
};

// ── Mobile Card ─────────────────────────────────────────────────
const MobileServiceCard = ({ service }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 70, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        }
      );
    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        width: '100%',
        height: '85dvh',
        borderRadius: '28px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        willChange: 'transform, opacity',
      }}
    >
      {/* Blurred BG */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src={service.image}
          alt=""
          loading="lazy"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'blur(1px) brightness(0.75)',
            transform: 'scale(1.08)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)',
        }} />
      </div>

      {/* Inner clear image */}
      <div style={{
        position: 'relative', zIndex: 1,
        margin: '1.5rem auto 0',
        width: '88%', height: '52%',
        borderRadius: '20px', overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
      }}>
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Text block */}
      <div style={{
        position: 'relative', zIndex: 2,
        flex: 1,
        padding: '1.5rem 1.8rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: '#fff',
      }}>
        <span style={{
          fontFamily: "'Lacroom', serif",
          fontSize: '1.4rem',
          color: 'rgba(255,255,255,0.22)',
          marginBottom: '0.4rem',
        }}>
          {service.id}
        </span>
        <h3 style={{
          fontFamily: "'Lacroom', serif",
          fontSize: 'clamp(2rem, 7vw, 2.6rem)',
          lineHeight: 1.05,
          marginBottom: '0.8rem',
          whiteSpace: 'pre-line',
        }}>
          {service.title}
        </h3>
        <p style={{
          fontFamily: "'Urbanist', sans-serif",
          fontSize: '0.92rem',
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.6,
          maxWidth: '85%',
          fontWeight: 300,
        }}>
          {service.desc}
        </p>
      </div>
    </div>
  );
};

// ── Desktop Section ─────────────────────────────────────────────
const DesktopServicesSection = () => {
  const containerRef = useRef(null);
  const triggerRef   = useRef(null);

  useEffect(() => {
    if (!triggerRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Scope to THIS component only — not page-global
      const cards = Array.from(
        triggerRef.current.querySelectorAll('.service-card-desktop')
      );

      // Fix z-index: last card on top
      cards.forEach((card, i) => {
        gsap.set(card, { zIndex: i + 1 });
        if (i > 0) gsap.set(card, { y: '110%', opacity: 0 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 1.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const cardDuration = 100 / (N * 2); // Equal duration per card for equal scroll speed
      let t = 0;
      cards.forEach((card, i) => {
        if (i === 0) {
          // Ken-burns on first card's inner image — no y shift to keep image fitted
          const img = card.querySelector('.inner-img');
          if (img) tl.fromTo(img, { scale: 1.08 }, { scale: 1, ease: 'none', duration: cardDuration }, t);
          t += cardDuration;
          return;
        }

        const prevCard = cards[i - 1];
        // Push prev card back
        tl.to(prevCard, { scale: 0.88, opacity: 0, filter: 'blur(8px)', duration: cardDuration, ease: 'power3.inOut' }, t);
        // Bring current card in
        tl.to(card, { y: '0%', opacity: 1, duration: cardDuration, ease: 'power3.inOut' }, t);
        // Ken-burns on this card's inner image — no y shift to keep image fitted
        const img = card.querySelector('.inner-img');
        if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, ease: 'none', duration: cardDuration }, t);

        t += cardDuration;
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={triggerRef}
      style={{ position: 'relative', zIndex: 10, backgroundColor: '#FAF8F5' }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100dvh',
          position: 'relative',
          zIndex: 10,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2rem',
          boxSizing: 'border-box',
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1600px',
          height: '80dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="service-card-desktop"
              style={{
                position: 'absolute',
                /* Use inset:0 instead of top/left 50% + translate(-50%,-50%)
                   — GSAP takes transform ownership when it animates y,
                     which would overwrite the centering transform and misplace card 3 */
                inset: 0,
                backgroundColor: '#fff',
                borderRadius: '40px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                willChange: 'transform, opacity, filter',
              }}
            >
              {/* Blur BG */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <img
                  src={service.image}
                  alt=""
                  loading="lazy"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    filter: 'blur(1px) brightness(0.80)',
                    transform: 'scale(1.4)',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
                }} />
              </div>

              {/* Inner clear image */}
              <div style={{
                position: 'relative',
                marginLeft: '3.5rem',
                width: '42%', height: '95%',
                borderRadius: '30px', overflow: 'hidden',
                zIndex: 1,
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              }}>
                <img
                  className="inner-img"
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Content */}
              <div style={{
                position: 'relative', zIndex: 2,
                flex: 1,
                padding: '0 4rem 0 3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-end',
                textAlign: 'right',
                color: '#fff',
              }}>
                <span style={{
                  fontFamily: "'Lacroom', serif",
                  fontSize: '2rem',
                  color: 'rgba(255,255,255,0.25)',
                  marginBottom: '1rem',
                  letterSpacing: '0.05em',
                }}>
                  {service.id}
                </span>
                <h3 style={{
                  fontFamily: "'Lacroom', serif",
                  fontSize: 'clamp(2.5rem, 3.3vw, 2.7rem)',
                  lineHeight: 1.0,
                  marginBottom: '1.25rem',
                  whiteSpace: 'pre-line',
                  maxWidth: '650px',
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontFamily: "'Urbanist', sans-serif",
                  fontSize: '1.05rem',
                  color: '#fff',
                  lineHeight: 1.6,
                  maxWidth: '300px',
                  fontWeight: 300,
                }}>
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Main Export ─────────────────────────────────────────────────
const ServicesSection = () => {
  // Tablet (<1024) gets mobile layout
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <SectionHeader />

      {isMobile ? (
        <section style={{
          backgroundColor: '#FAF8F5',
          padding: '2rem 1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxSizing: 'border-box',
        }}>
          {SERVICES.map(service => (
            <MobileServiceCard key={service.id} service={service} />
          ))}
        </section>
      ) : (
        <DesktopServicesSection />
      )}
    </>
  );
};

export default ServicesSection;
