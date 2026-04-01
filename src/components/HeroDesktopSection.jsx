/**
 * HeroDesktopSection — DESKTOP + TABLET ONLY
 * Left: Heading + stats count-up + sofa decoration
 * Right: Inline contact form (EmailJS)
 */

import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';

const IMAGEKIT_URL = import.meta.env.VITE_IMAGEKIT_URL || '';

// ── Constants outside component (no recreation on re-render) ──
const STATS = [
  { target: 200, suffix: '+', label: 'Projects' },
  { target: 15,  suffix: '+', label: 'Years'    },
  { target: 50,  suffix: '+', label: 'Designers' },
];

const INITIAL_COUNTS = STATS.map(() => 0);

const FORM_FIELDS = [
  { name: 'name',  placeholder: 'Name*',     type: 'text'  },
  { name: 'phone', placeholder: 'Phone No.*', type: 'tel'   },
  { name: 'email', placeholder: 'Email*',     type: 'email' },
  { name: 'city',  placeholder: 'City*',      type: 'text'  },
];

const easeOut = t => 1 - Math.pow(1 - t, 3);

const validate = (name, value) => {
  if (!value.trim()) return 'Required';
  if (name === 'phone' && !/^[0-9]{10}$/.test(value)) return 'Valid 10-digit number';
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Valid email';
  if (name === 'description' && value.length < 10) return 'Min 10 chars';
  return '';
};

const HeroDesktopSection = () => {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', city: '', description: '', hp_field: '',
  });
  const [errors,    setErrors]    = useState({});
  const [isSending, setIsSending] = useState(false);
  const [counts,    setCounts]    = useState(INITIAL_COUNTS);
  const [isTablet,  setIsTablet]  = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1100 : false
  );
  const sectionRef = useRef(null);
  const rafRef     = useRef(null);

  // ── Tablet breakpoint ──
  useEffect(() => {
    const onResize = () => setIsTablet(window.innerWidth < 1100);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Count-up: fires when section enters viewport ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 2000;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased    = easeOut(progress);
          setCounts(STATS.map(s => Math.floor(eased * s.target)));
          if (progress < 1) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            setCounts(STATS.map(s => s.target));
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Form handlers ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.hp_field) return; // honeypot

    const newErrors = {};
    ['name', 'phone', 'email', 'city', 'description'].forEach(k => {
      const err = validate(k, formData[k]);
      if (err) newErrors[k] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setIsSending(true);
    emailjs
      .send('service_5ukbpwr', 'template_6vphkp9', formData, 'iaQXY9VcI_ev3jcNL')
      .then(() => { window.location.href = 'https://glocaldesign.in/thank-you/'; })
      .catch(() => {
        setErrors({ submit: 'Failed. Please try again.' });
        setIsSending(false);
      });
  };

  // ── Shared input style ──
  const inputStyle = (hasError) => ({
    width: '100%',
    border: 'none',
    borderBottom: hasError ? '1.5px solid #ff4d4d' : '1.5px solid #d4c9be',
    padding: '1rem 0',
    fontFamily: "'Urbanist', sans-serif",
    fontSize: '1rem',
    color: '#2b2b2b',
    backgroundColor: 'transparent',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
  });

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#FAF8F5',
        overflow: 'hidden',
      }}
    >
      {/* ── Left Panel (45%) ── */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: isTablet ? '48%' : '45%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingTop: '20vh',
        padding: isTablet ? '20vh 2vw 0 4vw' : '20vh 2vw 0 5vw',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        {/* Main heading */}
        <h1 style={{
          fontFamily: "'Lacroom', serif",
          fontWeight: 400,
          fontSize: isTablet ? 'clamp(2rem, 3.8vw, 3.2rem)' : 'clamp(2.5rem, 4.2vw, 4.5rem)',
          lineHeight: 1.0,
          color: '#323232',
          textTransform: 'uppercase',
          margin: 0,
          letterSpacing: '-0.02em',
          position: 'relative',
          zIndex: 2,
        }}>
          CREATE YOUR <span style={{ color: '#B2000A' }}>DREAM SPACE</span>
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: "'Urbanist', sans-serif",
          fontSize: isTablet ? 'clamp(0.85rem, 1.1vw, 1.1rem)' : 'clamp(1rem, 1.3vw, 1.25rem)',
          lineHeight: 1.6,
          color: '#5a5a5a',
          maxWidth: '480px',
          marginTop: '1.5rem',
          marginBottom: '2rem',
          fontWeight: 400,
          position: 'relative',
          zIndex: 2,
        }}>
          Crafted interiors that turn spaces into homes that feel yours unmistakably.
        </p>

        {/* Decorative line */}
        <div style={{
          width: '60px',
          height: '1px',
          backgroundColor: '#B2000A',
          marginBottom: '1.8rem',
          position: 'relative',
          zIndex: 2,
        }} />

        {/* Stats row */}
        <div style={{
          display: 'flex',
          gap: isTablet ? '1.8rem' : '2.5rem',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 2,
        }}>
          {STATS.map((stat, i) => (
            <div key={stat.label}>
              <p style={{
                fontFamily: "'Lacroom', serif",
                fontSize: isTablet ? '1.6rem' : '2rem',
                color: '#2b2b2b',
                margin: 0,
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                minWidth: '3rem',
              }}>
                {counts[i]}{stat.suffix}
              </p>
              <p style={{
                fontFamily: "'Urbanist', sans-serif",
                fontSize: '0.7rem',
                color: '#9a9080',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                margin: '4px 0 0',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Chair — decorative image next to title - Desktop only */}
        {!isTablet && (
          <img
            src="./images/chair.png"
            alt=""
            loading="lazy"
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.4';
              e.currentTarget.style.filter = 'drop-shadow(0 0 28px rgba(178,120,60,0.65))';
              e.currentTarget.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '0.18';
              e.currentTarget.style.filter = 'drop-shadow(0 8px 20px rgba(0,0,0,0.08))';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            style={{
              position: 'absolute',
              top: '18%',
              right: isTablet ? '1%' : '3%',
              width: '22%',
              height: 'auto',
              objectFit: 'contain',
              opacity: 0.18,
              zIndex: 3,
              userSelect: 'none',
              filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.08))',
              transition: 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease',
            }}
          />
        )}

        {/* Glass Bubble — decorative BG image (middle-left) - Desktop only */}
        {/* {!isTablet && (
          <img
            src="/images/glassbubble.png"
            alt=""
            loading="lazy"
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.35';
              e.currentTarget.style.filter = 'drop-shadow(0 0 28px rgba(178,120,60,0.65))';
              e.currentTarget.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '0.12';
              e.currentTarget.style.filter = 'drop-shadow(0 8px 20px rgba(0,0,0,0.08))';
              e.currentTarget.style.transform = 'none';
            }}
            style={{
              position: 'absolute',
              top: '35%',
              left: '-5%',
              width: '32%',
              height: 'auto',
              objectFit: 'contain',
              opacity: 0.12,
              zIndex: 1,
              userSelect: 'none',
              filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.08))',
              transition: 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease',
            }}
          />
        )} */}

        {/* Table — decorative BG image (bottom-left) - Desktop only */}
        {!isTablet && (
          <img
            src="./images/table.png"
            alt=""
            loading="lazy"
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.45';
              e.currentTarget.style.filter = 'drop-shadow(0 0 28px rgba(178,120,60,0.65))';
              e.currentTarget.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '0.24';
              e.currentTarget.style.filter = 'drop-shadow(0 8px 20px rgba(0,0,0,0.08))';
              e.currentTarget.style.transform = 'none';
            }}
            style={{
              position: 'absolute',
              bottom: '-2%',
              left: '-12%',
              width: '40%',
              height: 'auto',
              objectFit: 'contain',
              opacity: 0.24,
              zIndex: 1,
              userSelect: 'none',
              filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.08))',
              transition: 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease',
            }}
          />
        )}

        {/* Sofa — decorative BG image */}
        <img
          src="./images/sofa.png"
          alt=""
          loading="lazy"
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '0.45';
            e.currentTarget.style.filter  = 'drop-shadow(0 0 28px rgba(178,120,60,0.65))';
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '0.24';
            e.currentTarget.style.filter  = 'drop-shadow(0 8px 20px rgba(0,0,0,0.08))';
            e.currentTarget.style.transform = 'none';
          }}
          style={{
            position: 'absolute',
            bottom: '-6%',
            right: 0,
            width: '58%',
            height: 'auto',
            objectFit: 'contain',
            opacity: 0.24,
            zIndex: 1,
            userSelect: 'none',
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.08))',
            transition: 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease',
          }}
        />
      </div>

      {/* ── Vertical Divider ── */}
      <div style={{
        position: 'absolute',
        left: isTablet ? '48%' : '45%',
        top: '10%',
        height: '80%',
        width: '1px',
        backgroundColor: '#e8e2dc',
      }} />

      {/* ── Right Panel (55%) — Form ── */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: isTablet ? '52%' : '55%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingTop: '20vh',
        padding: isTablet ? '20vh 4vw 0 3vw' : '20vh 5vw 0 4vw',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}>
        <p style={{
          fontFamily: "'Urbanist', sans-serif",
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#9a9080',
          marginBottom: '1.2rem',
          fontWeight: 600,
        }}>
          Book A Consultation
        </p>

        <h2 style={{
          fontFamily: "'Lacroom', serif",
          fontWeight: 400,
          fontSize: isTablet ? 'clamp(1.4rem, 2vw, 2rem)' : 'clamp(1.6rem, 2.2vw, 2.5rem)',
          color: '#2b2b2b',
          lineHeight: 1.1,
          marginBottom: isTablet ? '1.8rem' : '2.5rem',
        }}>
          Design The Home<br />You've Always Imagined
        </h2>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Honeypot */}
          <input
            type="text" name="hp_field" value={formData.hp_field}
            onChange={handleChange} style={{ display: 'none' }}
            tabIndex="-1" autoComplete="off"
          />

          {/* 2-col grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: isTablet ? '1.4rem 1.8rem' : '1.8rem 2.5rem',
            marginBottom: isTablet ? '1.4rem' : '1.8rem',
          }}>
            {FORM_FIELDS.map(f => (
              <div key={f.name} style={{ position: 'relative' }}>
                <input
                  name={f.name} type={f.type} placeholder={f.placeholder}
                  value={formData[f.name]} onChange={handleChange}
                  style={inputStyle(!!errors[f.name])}
                />
                {errors[f.name] && (
                  <span style={{
                    position: 'absolute', bottom: '-14px', left: 0,
                    fontSize: '0.6rem', color: '#ff4d4d',
                  }}>
                    {errors[f.name]}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Description — full width */}
          <div style={{ position: 'relative', marginBottom: isTablet ? '2rem' : '2.5rem' }}>
            <input
              name="description" type="text"
              placeholder="Tell us about your space*"
              value={formData.description} onChange={handleChange}
              style={inputStyle(!!errors.description)}
            />
            {errors.description && (
              <span style={{
                position: 'absolute', bottom: '-14px', left: 0,
                fontSize: '0.6rem', color: '#ff4d4d',
              }}>
                {errors.description}
              </span>
            )}
          </div>

          {errors.submit && (
            <p style={{ color: '#ff4d4d', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
              {errors.submit}
            </p>
          )}

          {/* Submit button — Premium */}
          <button
            type="submit"
            disabled={isSending}
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: isSending
                ? 'rgba(178,0,10,0.55)'
                : 'linear-gradient(135deg, #B2000A 0%, #8B0012 60%, #B2000A 100%)',
              backgroundSize: '200% 200%',
              color: '#fff',
              fontFamily: "'Urbanist', sans-serif",
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              padding: '1.15rem 0',
              width: '100%',
              borderRadius: '60px',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: isSending ? 'not-allowed' : 'pointer',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease, opacity 0.3s ease',
              opacity: isSending ? 0.65 : 1,
              textTransform: 'uppercase',
              boxShadow: '0 4px 24px rgba(178,0,10,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
            onMouseEnter={e => {
              if (!isSending) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(178,0,10,0.5), inset 0 1px 0 rgba(255,255,255,0.12)';
              }
            }}
            onMouseLeave={e => {
              if (!isSending) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(178,0,10,0.35), inset 0 1px 0 rgba(255,255,255,0.12)';
              }
            }}
          >
            <span>{isSending ? 'Sending…' : 'BOOK CONSULTATION'}</span>
            {!isSending && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default HeroDesktopSection;
