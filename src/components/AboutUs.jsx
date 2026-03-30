/**
 * AboutUs — Optimized
 * - Shared section (mobile + tablet + desktop)
 * - GSAP clip-reveal: no rotation, smooth opacity+y, play-once (premium)
 * - Fully responsive: mobile/tablet/desktop + safe-area
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const sectionRef   = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = containerRef.current.querySelectorAll('.reveal-text');

      gsap.fromTo(
        elements,
        {
          y: '100%',
          opacity: 0,
        },
        {
          y: '0%',
          opacity: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            // play-once for a premium feel — text stays revealed
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="about-section"
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        backgroundColor: '#FAF8F5',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        /* clamp padding — side padding only */
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1.2rem, 5vw, 2rem)',
        boxSizing: 'border-box',
      }}
    >
      <div
        ref={containerRef}
        style={{
          textAlign: 'center',
          maxWidth: '660px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* ── Label ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(1.5rem, 4vw, 3rem)' }}>
          <div style={{ overflow: 'hidden' }}>
            <span
              className="reveal-text"
              style={{
                display: 'inline-block',
                fontFamily: "'Urbanist', sans-serif",
                color: '#2b2b2b',
                fontSize: '0.80rem',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                paddingBottom: '4px',
                borderBottom: '1px solid #e2d8d8',
              }}
            >
              About Us
            </span>
          </div>
        </div>

        {/* ── Main Heading ── */}
        <h2
          style={{
            fontFamily: "'Lacroom', serif",
            color: '#2b2b2b',
            fontWeight: 200,
            lineHeight: 1.05,
            /* clamp handles mobile → desktop smoothly */
            fontSize: 'clamp(2.4rem, 6vw, 4.4rem)',
            marginBottom: 'clamp(1.2rem, 3vw, 2rem)',
            margin: '0 0 clamp(1.2rem, 3vw, 2rem)',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <span className="reveal-text" style={{ display: 'block' }}>
              America's Top Interior
            </span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span className="reveal-text" style={{ display: 'block' }}>
              Design Expertise,
            </span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span className="reveal-text" style={{ display: 'block' }}>
              <span style={{ color: '#b2000a' }}>Now In India</span>
            </span>
          </div>
        </h2>

        {/* ── Subtext ── */}
        <div style={{ overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <p
            className="reveal-text"
            style={{
              fontFamily: "'Urbanist', sans-serif",
              color: '#6b6b6b',
              fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
              lineHeight: 1.7,
              fontWeight: 400,
              margin: 0,
            }}
          >
            Bringing globally recognised design standards, craftsmanship,
            and perspective to contemporary Indian homes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
