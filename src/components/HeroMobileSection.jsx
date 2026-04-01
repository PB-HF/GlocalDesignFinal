/**
 * HeroMobileSection — MOBILE ONLY (<768px)
 * Full 100dvh: heading + sofa image + tagline + CTA
 * Optimized for Android, iPhone (notch/home-bar), small & large screens
 */

import React from 'react';

const HeroMobileSection = () => {
  const scrollToForm = () => {
    const form = document.getElementById('mobile-form-section');
    if (form) form.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        /* 100dvh handles Android URL-bar collapse & iPhone home-bar correctly */
        height: '100dvh',
        minHeight: '-webkit-fill-available', /* iOS Safari fallback */
        backgroundColor: '#FAF8F5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        /* safe-area handles iPhone notch / Dynamic Island / home bar */
        paddingTop: 'calc(72px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxSizing: 'border-box',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* ── Heading ── */}
      <div style={{
        textAlign: 'center',
        padding: '1.2rem 1.5rem 0',
        zIndex: 2,
        position: 'relative',
        width: '100%',
      }}>
        <h1 style={{
          fontFamily: "'Lacroom', serif",
          fontWeight: 400,
          fontSize: 'clamp(2.8rem, 12vw, 5rem)',
          lineHeight: 1.0,
          color: '#2b2b2b',
          textTransform: 'uppercase',
          margin: 0,
          letterSpacing: '-0.01em',
        }}>
          CREATE YOUR<br />
          <span style={{ color: '#B2000A' }}>DREAM SPACE</span>
        </h1>
      </div>

      {/* ── Furniture Images Scattered (Funky & Overlapping) ── */}
      <style>
        {`
          @keyframes float1 {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(1deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          @keyframes float2 {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(10px) rotate(-1.5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          @keyframes float3 {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(-1deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
        `}
      </style>
      <div style={{
        flex: 1,
        width: '100%',
        position: 'relative',
        zIndex: 2,
        maxHeight: '42dvh',
      }}>
        <div style={{
          position: 'relative',
          width: '88%',
          maxWidth: '360px',
          height: '100%',
          margin: '0 auto',
        }}>
          {[
            { 
              src: './images/glassbuble.png', 
              alt: 'Glass bubble', 
              style: { top: '5%', left: '0%', width: '45%', height: 'auto', zIndex: 1, animation: 'float1 6s ease-in-out infinite' } 
            },
            { 
              src: './images/sofa.png', 
              alt: 'Luxury sofa', 
              style: { top: '15%', right: '5%', width: '65%', height: 'auto', zIndex: 2, animation: 'float2 7s ease-in-out infinite' } 
            },
            { 
              src: './images/chair.png', 
              alt: 'Designer chair', 
              style: { bottom: '15%', left: '5%', width: '45%', height: 'auto', zIndex: 3, animation: 'float3 5s ease-in-out infinite' } 
            },
            { 
              src: './images/table.png', 
              alt: 'Coffee table', 
              style: { bottom: '5%', right: '-5%', width: '45%', height: 'auto', zIndex: 4, animation: 'float1 8s ease-in-out infinite reverse' } 
            },
          ].map((item, index) => (
            <img
              key={index}
              src={item.src}
              alt={item.alt}
              style={{
                position: 'absolute',
                objectFit: 'contain',
                filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.15))',
                willChange: 'transform',
                ...item.style
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Tagline ── */}
      <p style={{
        fontFamily: "'Urbanist', sans-serif",
        fontSize: 'clamp(0.82rem, 3.4vw, 1rem)',
        lineHeight: 1.6,
        color: '#5a5a5a',
        textAlign: 'center',
        padding: '0 2rem',
        marginTop: '0.8rem',
        marginBottom: '1rem',
        fontWeight: 400,
        position: 'relative',
        zIndex: 2,
      }}>
        Crafted interiors that turn spaces into homes that feel yours unmistakably.
      </p>

      {/* ── CTA Button ── */}
      <button
        onClick={scrollToForm}
        aria-label="Scroll to consultation form"
        style={{
          backgroundColor: '#B2000A',
          color: '#fff',
          fontFamily: "'Urbanist', sans-serif",
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '0.85rem 2.4rem',
          borderRadius: '100px',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '2rem',
          position: 'relative',
          zIndex: 2,
          boxShadow: '0 8px 24px rgba(178,0,10,0.3)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          /* Prevents 300ms tap delay on mobile */
          touchAction: 'manipulation',
          /* Min touch-target size per WCAG (44px) */
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(178,0,10,0.4)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(178,0,10,0.3)';
        }}
      >
        <span>Start Your Journey</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </section>
  );
};

export default HeroMobileSection;
