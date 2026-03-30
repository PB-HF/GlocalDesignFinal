/**
 * ContactForm — Optimized
 * GSAP pin + scrub: zip-line reveal → horizontal expand → form fade in
 * Fixes: constants/styles outside component, passive resize, isMobile
 *        stale-closure fix via ref, FORBIDDEN_DOMAINS constant outside
 */

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';
import contactBg from '/images/contactbg.jpg';

gsap.registerPlugin(ScrollTrigger);

// ── Constants outside component ──────────────────────────────────────
const FORBIDDEN_DOMAINS = ['exahut','mailinator','yopmail','temp','disposable','dropmail','tmail','guerrilla'];

const INITIAL_FORM = {
  name: '', phone: '', email: '', city: '', description: '', hp_field: '',
};

const FIELDS = [
  { name: 'name',  placeholder: 'Name*',     type: 'text'  },
  { name: 'phone', placeholder: 'Phone No.*', type: 'tel'   },
  { name: 'email', placeholder: 'Email*',     type: 'email' },
  { name: 'city',  placeholder: 'City*',      type: 'text'  },
];

// Defined outside — NOT recreated on every render
const getInputStyle = (hasError) => ({
  width: '100%',
  border: 'none',
  borderBottom: `1px solid ${hasError ? '#ff4d4d' : '#dcdcdc'}`,
  padding: '0.75rem 0',
  fontFamily: "'Urbanist', sans-serif",
  fontSize: '16px', // prevents iOS auto-zoom
  color: '#2b2b2b',
  backgroundColor: 'transparent',
  outline: 'none',
  transition: 'border-color 0.3s',
  boxSizing: 'border-box',
  borderRadius: 0,
  WebkitAppearance: 'none',
});

const ERROR_STYLE = {
  position: 'absolute',
  bottom: '-15px',
  left: 0,
  fontSize: '0.6rem',
  color: '#ff4d4d',
  fontWeight: 500,
};

const SUBMIT_BTN_STYLE = {
  background: 'transparent',
  border: 'none',
  fontFamily: "'Urbanist', sans-serif",
  fontSize: '1rem',
  color: '#2b2b2b',
  cursor: 'pointer',
  textTransform: 'capitalize',
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  touchAction: 'manipulation',
};

const UNDERLINE_STYLE = {
  height: '1px',
  width: '100%',
  backgroundColor: '#2b2b2b',
  marginTop: '4px',
};

// ── Validation ────────────────────────────────────────────────────────
const validateField = (name, value) => {
  if (!value.trim()) return 'This field is required';
  if (name === 'phone' && !/^[0-9]{10}$/.test(value))
    return 'Enter a valid 10-digit number';
  if (name === 'email') {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const domain = value.toLowerCase().split('@')[1] || '';
    if (!re.test(value)) return 'Invalid email format';
    if (FORBIDDEN_DOMAINS.some(k => domain.includes(k))) return 'Temporary/Fake emails not allowed';
  }
  if (name === 'description' && value.length < 10) return 'Min 10 characters required';
  return '';
};

// ─────────────────────────────────────────────────────────────────────
const ContactForm = () => {
  const sectionRef  = useRef(null);
  const formBoxRef  = useRef(null);
  const labelRef    = useRef(null);
  const headingRef  = useRef(null);
  const formRef     = useRef(null);
  // Ref for isMobile so GSAP effect (runs once) reads live value
  const isMobileRef = useRef(false);

  const [isMobile,  setIsMobile]  = useState(() => {
    const m = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    isMobileRef.current = m;
    return m;
  });
  const [formData,  setFormData]  = useState(INITIAL_FORM);
  const [errors,    setErrors]    = useState({});
  const [isSending, setIsSending] = useState(false);

  // ── Resize ──
  useEffect(() => {
    const onResize = () => {
      const m = window.innerWidth < 768;
      isMobileRef.current = m;
      setIsMobile(m);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── GSAP animation (matchMedia: desktop=pin+scrub zip, mobile=fade+scale) ──
  useEffect(() => {
    const section = sectionRef.current;
    const box     = formBoxRef.current;
    const label   = labelRef.current;
    const heading = headingRef.current;
    const form    = formRef.current;
    if (!section || !box || !label || !heading || !form) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── Desktop + Tablet: pin + scrub zip reveal ──────────────────
      mm.add('(min-width: 768px)', () => {
        gsap.set(box,            { width: 2, height: 0, borderRadius: 2, opacity: 0 });
        gsap.set([heading, form],{ opacity: 0, y: 20 });
        gsap.set(label,          { opacity: 0, y: 0 });

        const targetH = Math.round(window.innerHeight * 0.82);
        const targetW = Math.min(Math.round(window.innerWidth * 0.88), 1000);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=120%',
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(box,    { opacity: 1, height: targetH, ease: 'none',        duration: 0.4  }, 0)
          .to(label,  { opacity: 1, y: targetH - 60, ease: 'none',        duration: 0.4  }, 0)
          .to(label,  { opacity: 0,                  ease: 'power1.in',   duration: 0.1  }, 0.4)
          .to(box,    { width: targetW, borderRadius: 0, ease: 'power2.inOut', duration: 0.35 }, 0.5)
          .to(heading,{ opacity: 1, y: 0,            ease: 'power2.out',  duration: 0.2  }, 0.8)
          .to(form,   { opacity: 1, y: 0,            ease: 'power2.out',  duration: 0.2  }, 0.87);
      });

      // ── Mobile: no pin — smooth fade + scale scroll animation ─────
      mm.add('(max-width: 767px)', () => {
        const targetW = Math.round(window.innerWidth * 0.94);
        const targetH = Math.round(window.innerHeight * 0.82);

        // Set initial state
        gsap.set(box,            { width: targetW, height: targetH, borderRadius: 16,
                                   opacity: 0, scale: 0.94, y: 40 });
        gsap.set([heading, form],{ opacity: 0, y: 16 });
        gsap.set(label,          { opacity: 0 });

        // Box reveal
        gsap.to(box, {
          opacity: 1, scale: 1, y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        });

        // Content stagger after box
        gsap.to([heading, form], {
          opacity: 1, y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.3,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        });
      });

    }, section);

    return () => ctx.revert();
  }, []); // intentionally once — matchMedia handles breakpoints internally

  // ── Form handlers ────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.hp_field) return;

    const newErrors = {};
    FIELDS.forEach(({ name }) => {
      const err = validateField(name, formData[name]);
      if (err) newErrors[name] = err;
    });
    const descErr = validateField('description', formData.description);
    if (descErr) newErrors.description = descErr;
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setIsSending(true);
    emailjs
      .send('service_5ukbpwr', 'template_6vphkp9', formData, 'iaQXY9VcI_ev3jcNL')
      .then(() => { window.location.href = 'https://glocaldesign.in/thank-you/'; })
      .catch(err => {
        console.error('EmailJS Error:', err);
        setErrors({ submit: 'Failed to send. Please try again.' });
        setIsSending(false);
      });
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-form-section"
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        backgroundImage: `url(${contactBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '9dvh',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      {/* Noise overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none', zIndex: 1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay',
      }} />

      {/* ── White Form Box ── */}
      <div
        ref={formBoxRef}
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 0 60px rgba(0,0,0,0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '1.5rem 1.2rem' : '2.5rem 2rem',
          overflow: 'hidden',
          willChange: 'width, height, opacity',
          zIndex: 5,
          position: 'relative',
          opacity: 0,
          width: 2,
          minWidth: 0,
          height: 0,
          boxSizing: 'border-box',
        }}
      >
        <h2
          ref={headingRef}
          style={{
            fontFamily: "'Lacroom', serif",
            fontWeight: 400,
            fontSize: isMobile ? 'clamp(1.6rem, 5vw, 2rem)' : 'clamp(2.2rem, 3.5vw, 2.8rem)',
            color: '#2b2b2b',
            lineHeight: 1.15,
            textAlign: 'center',
            marginBottom: '1.8rem',
          }}
        >
          Design The Home You've <br /> Always Imagined
        </h2>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          style={{
            width: '100%',
            maxWidth: '580px',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '1rem' : '1.4rem 3rem',
          }}
        >
          {/* Honeypot */}
          <input
            type="text" name="hp_field" value={formData.hp_field}
            onChange={handleChange} style={{ display: 'none' }}
            tabIndex="-1" autoComplete="off"
          />

          {FIELDS.map(f => (
            <div key={f.name} style={{ position: 'relative', width: '100%' }}>
              <input
                name={f.name} type={f.type} placeholder={f.placeholder}
                value={formData[f.name]} onChange={handleChange}
                autoComplete={f.name === 'email' ? 'email' : f.name === 'name' ? 'name' : 'off'}
                inputMode={f.type === 'tel' ? 'numeric' : 'text'}
                style={getInputStyle(!!errors[f.name])}
              />
              {errors[f.name] && <span style={ERROR_STYLE}>{errors[f.name]}</span>}
            </div>
          ))}

          {/* Description */}
          <div style={{ position: 'relative', width: '100%', gridColumn: isMobile ? 'auto' : '1 / -1' }}>
            <input
              name="description" type="text" placeholder="Description*"
              value={formData.description} onChange={handleChange}
              style={getInputStyle(!!errors.description)}
            />
            {errors.description && <span style={ERROR_STYLE}>{errors.description}</span>}
          </div>

          {/* Submit */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.8rem' }}>
            {errors.submit && (
              <p style={{ color: '#ff4d4d', fontSize: '0.8rem', marginBottom: '8px' }}>
                {errors.submit}
              </p>
            )}
            <button type="submit" disabled={isSending} style={SUBMIT_BTN_STYLE}>
              {isSending ? 'Sending...' : 'Submit'}
              <div style={UNDERLINE_STYLE} />
            </button>
          </div>
        </form>
      </div>

      {/* ── Scroll label (zip tip) ── */}
      <div
        ref={labelRef}
        style={{
          position: 'absolute',
          top: '18dvh',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          zIndex: 20,
        }}
      >
        <span style={{
          fontFamily: "'Urbanist', sans-serif",
          fontSize: '0.65rem',
          color: '#ffffff',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          Scroll to explore
        </span>
        <div style={{ width: '1px', height: '36px', backgroundColor: 'rgba(255,255,255,0.7)' }} />
      </div>
    </section>
  );
};

export default ContactForm;
