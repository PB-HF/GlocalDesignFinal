/**
 * ProjectsCarousel — Optimized
 * 3D Coverflow carousel — cards rotate in perspective
 * Fixes: GSAP global selector→scoped, splitLetters/clamp outside component,
 *        useLayoutEffect→useEffect, passive resize, drag nav connected
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Constants outside component ──
const PROJECTS = [
  { id: 1,  title: "Bachelor's Pad",             location: 'Mumbai',        image: './projectcarousel/mumbai.webp'                      },
  { id: 2,  title: 'Builder Apartment',           location: 'Gurugram',      image: './projectcarousel/gurugram.webp'                    },
  { id: 3,  title: 'Classical House',             location: 'Anand Niketan', image: './projectcarousel/classical.webp'                   },
  { id: 4,  title: 'Jaipur Retreat',              location: 'Jaipur',        image: './projectcarousel/JAIPUR RETREAT.webp'              },
  { id: 5,  title: 'Kaveri House',                location: 'Chennai',       image: './projectcarousel/chennai.webp'                     },
  { id: 6,  title: 'Krishna Niwas',               location: 'Chhatarpur',    image: './projectcarousel/KRISHNA NIWAS, CHATTARPUR.webp'   },
  { id: 7,  title: 'Lake House',                  location: 'Kochi',         image: './projectcarousel/lake.webp'                        },
  { id: 8,  title: 'Modern House',                location: 'Lucknow',       image: './projectcarousel/modernhouse.webp'                 },
  { id: 9,  title: 'Modern Luxury Residence',     location: 'Vasant Vihar',  image: './projectcarousel/modernluxury.webp'                },
  { id: 10, title: 'Scandinavian Holiday Home',   location: 'Gurugram',      image: './projectcarousel/holidayhome.webp'                 },
];

const CARD_W   = 280;
const CARD_H   = 420;
const N        = PROJECTS.length;
const DRAG_THRESHOLD = 50;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));


const ProjectsCarousel = ({ subtitle }) => {
  const [activeIdx, setActiveIdx] = useState(2);
  const [isMobile, setIsMobile]   = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const sectionRef   = useRef(null);
  const isDragging   = useRef(false);
  const dragStartX   = useRef(0);

  // ── Resize ──
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Heading reveal — AboutUs style (clip y:100%→0%) ──
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const elements = el.querySelectorAll('.crsl-reveal');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  // ── Navigation ──
  const goTo = useCallback((idx) => {
    setActiveIdx(clamp(idx, 0, N - 1));
  }, []);

  // ── Keyboard ──
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(activeIdx + 1);
      if (e.key === 'ArrowLeft')  goTo(activeIdx - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx, goTo]);

  // ── Mouse drag ──
  const onMouseDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
  };

  const onMouseUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = e.clientX - dragStartX.current;
    if (delta < -DRAG_THRESHOLD) goTo(activeIdx + 1);
    else if (delta > DRAG_THRESHOLD) goTo(activeIdx - 1);
  };

  // ── Touch ──
  const onTouchStart = (e) => { dragStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    const delta = e.changedTouches[0].clientX - dragStartX.current;
    if (delta < -DRAG_THRESHOLD) goTo(activeIdx + 1);
    else if (delta > DRAG_THRESHOLD) goTo(activeIdx - 1);
  };

  // ── Per-card 3D transform ──
  const getCardStyle = (i) => {
    const offset = i - activeIdx;
    const absOff = Math.abs(offset);
    const rotateY = clamp(offset * -38, -80, 80);
    const scale   = offset === 0 ? 1 : Math.max(0.72, 1 - absOff * 0.1);
    const tx      = offset * (CARD_W * 0.58);
    const tz      = offset === 0 ? 0 : -absOff * 80;
    const opacity = Math.max(0, 1 - absOff * 0.22);
    const zIndex  = N - absOff;

    return {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: `${CARD_W}px`,
      height: `${CARD_H}px`,
      marginLeft: `-${CARD_W / 2}px`,
      marginTop: `-${CARD_H / 2}px`,
      borderRadius: '1.1rem',
      overflow: 'hidden',
      opacity,
      zIndex,
      transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${rotateY}deg) scale(${scale})`,
      transition: 'transform 0.65s cubic-bezier(0.34,1.1,0.64,1), opacity 0.5s ease',
      cursor: offset === 0 ? 'default' : 'pointer',
      boxShadow: offset === 0
        ? '0 32px 64px rgba(0,0,0,0.26)'
        : '0 12px 32px rgba(0,0,0,0.14)',
      willChange: 'transform',
    };
  };

  const active = PROJECTS[activeIdx];

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        zIndex: 5,
        width: '100%',
        backgroundColor: '#FAF8F5',
        paddingTop: '1rem',
        paddingBottom: '5rem',
        overflow: 'hidden',
        perspective: '1000px',
      }}
    >
      {/* ── Heading ── */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', padding: '0 2rem' }}>
        {/* Label */}
        <div style={{ overflow: 'hidden', marginBottom: '0.6rem' }}>
          <p
            className="crsl-reveal"
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontSize: isMobile ? '0.65rem' : '0.75rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#8b8b8b',
              fontWeight: 600,
              borderBottom: '1px solid #e2d8d8',
              paddingBottom: '2px',
              display: 'inline-block',
              margin: 0,
            }}
          >
            {subtitle || 'Projects'}
          </p>
        </div>

        {/* Heading */}
        <div style={{ overflow: 'hidden', marginBottom: '0.4rem' }}>
          <h2
            className="crsl-reveal"
            style={{
              fontFamily: "'Lacroom', serif",
              fontWeight: 400,
              fontSize: isMobile ? 'clamp(1.5rem, 5vw, 2.5rem)' : 'clamp(2.5rem, 6vw, 4.2rem)',
              color: '#2b2b2b',
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            A Testament To Excellence
          </h2>
        </div>

        {/* Subtext */}
        <div style={{ overflow: 'hidden', maxWidth: isMobile ? '90%' : '470px', margin: '0 auto 0' }}>
          <p
            className="crsl-reveal"
            style={{
              fontFamily: "'Urbanist', sans-serif",
              fontWeight: 300,
              fontSize: isMobile ? '0.9rem' : '1.3rem',
              color: '#6b6b6b',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            A curated collection of{' '}
            <span style={{ color: '#B2000A' }}>spaces we've designed</span>
            {' '}and brought to life with thoughtful detail.
          </p>
        </div>

        {/* View Projects CTA */}
        <a
          href="https://glocaldesign.in/projects/"
          style={{
            marginTop: '1.2rem',
            padding: '0.85rem 2.6rem',
            backgroundColor: '#B2000A',
            color: '#fff',
            borderRadius: '50px',
            border: 'none',
            fontFamily: "'Urbanist', sans-serif",
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease',
            boxShadow: '0 10px 30px rgba(178,0,10,0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            touchAction: 'manipulation',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(178,0,10,0.35)';
            e.currentTarget.style.backgroundColor = '#C7000B';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(178,0,10,0.25)';
            e.currentTarget.style.backgroundColor = '#B2000A';
          }}
        >
          View Projects
        </a>
      </div>

      {/* ── 3D Stage ── */}
      <div
        style={{
          position: 'relative',
          height: `${CARD_H + 60}px`,
          perspective: '1100px',
          perspectiveOrigin: '50% 50%',
          userSelect: 'none',
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={() => { isDragging.current = false; }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            style={getCardStyle(i)}
            onClick={() => i !== activeIdx && goTo(i)}
            onMouseEnter={() => goTo(i)}
          >
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                pointerEvents: 'none',
              }}
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)',
            }} />
            {/* Card info */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              padding: '1.1rem 1.3rem 1.4rem',
            }}>
              <h3 style={{
                fontFamily: "'Lacroom', serif",
                fontWeight: 400,
                fontSize: '1.15rem',
                color: '#fff',
                lineHeight: 1.2,
                marginBottom: '0.25rem',
              }}>
                {project.title}
              </h3>
              <p style={{
                fontFamily: "'Urbanist', sans-serif",
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.05em',
              }}>
                📍 {project.location}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Label + dots + arrows ── */}
      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <p style={{
          fontFamily: "'Urbanist', sans-serif",
          fontSize: '0.72rem',
          letterSpacing: '0.12em',
          color: '#9a9080',
          marginBottom: '1rem',
          textTransform: 'uppercase',
        }}>
          {activeIdx + 1} / {N} — {active.title}
        </p>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          {PROJECTS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to project ${i + 1}`}
              style={{
                width: i === activeIdx ? '1.8rem' : '0.45rem',
                height: '0.45rem',
                borderRadius: '100px',
                backgroundColor: i === activeIdx ? '#2b2b2b' : '#c8bfb5',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'width 0.4s cubic-bezier(0.34,1.1,0.64,1), background-color 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Arrow nav */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          {[{ dir: -1, label: '←' }, { dir: 1, label: '→' }].map(({ dir, label }) => {
            const disabled = activeIdx + dir < 0 || activeIdx + dir >= N;
            return (
              <button
                key={dir}
                onClick={() => goTo(activeIdx + dir)}
                disabled={disabled}
                aria-label={dir === -1 ? 'Previous project' : 'Next project'}
                style={{
                  width: '2.6rem',
                  height: '2.6rem',
                  borderRadius: '50%',
                  border: '1px solid #d4c9be',
                  background: 'transparent',
                  color: '#2b2b2b',
                  fontSize: '1.1rem',
                  cursor: disabled ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease, transform 0.2s ease',
                  opacity: disabled ? 0.3 : 1,
                  touchAction: 'manipulation',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsCarousel;
