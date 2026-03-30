/**
 * ContactPopup — Mobile-only modal (optimized)
 * Shows 800ms after mount unless already submitted (localStorage)
 * GSAP fade/slide open animation, body scroll lock while open
 */

import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { gsap } from 'gsap';

// Inline X icon — no lucide-react dependency needed
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);


// ── Constants outside component ──
const INITIAL_FORM = {
  name: '', phone: '', email: '', city: '', description: '', hp_field: '',
};

const FIELDS = [
  { name: 'name',        placeholder: 'Name*',        type: 'text'  },
  { name: 'phone',       placeholder: 'Phone No.*',   type: 'tel'   },
  { name: 'city',        placeholder: 'City*',        type: 'text'  },
  { name: 'email',       placeholder: 'Email*',       type: 'email' },
  { name: 'description', placeholder: 'Description*', type: 'text'  },
];

const getInputStyle = (hasErr) => ({
  width: '100%',
  border: 'none',
  borderBottom: `1px solid ${hasErr ? '#ff4d4d' : '#d0c8c2'}`,
  padding: '0.9rem 0',
  fontFamily: "'Urbanist', sans-serif",
  fontSize: '16px', // prevents iOS auto-zoom
  color: '#2b2b2b',
  backgroundColor: 'transparent',
  outline: 'none',
  borderRadius: 0,
  WebkitAppearance: 'none',
  boxSizing: 'border-box',
});

const validate = (name, value) => {
  if (!value.trim()) return 'Required';
  if (name === 'phone' && !/^[0-9]{10}$/.test(value)) return 'Valid 10-digit number';
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Valid email';
  if (name === 'description' && value.length < 10) return 'Min 10 chars';
  return '';
};

// ─────────────────────────────────────────────────────────────────────
const ContactPopup = ({ onClose }) => {
  const [isOpen,    setIsOpen]    = useState(false);
  const [formData,  setFormData]  = useState(INITIAL_FORM);
  const [errors,    setErrors]    = useState({});
  const [isSending, setIsSending] = useState(false);

  const modalRef   = useRef(null);
  const overlayRef = useRef(null);

  // ── Show after 800ms (skip if already submitted) ──
  useEffect(() => {
    if (localStorage.getItem('contactFormSubmitted')) return;
    const timer = setTimeout(() => setIsOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // ── Animate open / body scroll lock ──
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(
      modalRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 }
    );
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

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
      const err = validate(name, formData[name]);
      if (err) newErrors[name] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setIsSending(true);
    emailjs
      .send('service_5ukbpwr', 'template_6vphkp9', formData, 'iaQXY9VcI_ev3jcNL')
      .then(() => {
        localStorage.setItem('contactFormSubmitted', 'true');
        setIsOpen(false);
        onClose?.();
        window.location.href = 'https://glocaldesign.in/thank-you/';
      })
      .catch(err => {
        console.error('EmailJS Error:', err);
        setErrors({ submit: 'Failed. Try again.' });
        setIsSending(false);
      });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.2rem',
      }}
    >
      <div
        ref={modalRef}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '2.5rem 1.8rem',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '0.8rem', right: '0.8rem',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0.5rem', color: '#2b2b2b', touchAction: 'manipulation',
          }}
        >
          <XIcon />
        </button>

        <h2 style={{
          fontFamily: "'Lacroom', serif",
          fontWeight: 400,
          fontSize: '1.8rem',
          color: '#2b2b2b',
          lineHeight: 1.15,
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}>
          Design The Home You've<br />Always Imagined
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Honeypot */}
          <input
            type="text" name="hp_field" value={formData.hp_field}
            onChange={handleChange} style={{ display: 'none' }}
            tabIndex="-1" autoComplete="off"
          />

          {FIELDS.map(f => (
            <div key={f.name} style={{ position: 'relative', marginBottom: '0.4rem' }}>
              <input
                name={f.name} type={f.type} placeholder={f.placeholder}
                value={formData[f.name]} onChange={handleChange}
                inputMode={f.type === 'tel' ? 'numeric' : 'text'}
                style={getInputStyle(!!errors[f.name])}
              />
              {errors[f.name] && (
                <span style={{ fontSize: '0.6rem', color: '#ff4d4d', position: 'absolute', bottom: '-12px', left: 0 }}>
                  {errors[f.name]}
                </span>
              )}
            </div>
          ))}

          {errors.submit && (
            <p style={{ color: '#ff4d4d', fontSize: '0.75rem', marginTop: '0.5rem' }}>
              {errors.submit}
            </p>
          )}

          <button
            type="submit"
            disabled={isSending}
            style={{
              width: '100%',
              marginTop: '2rem',
              backgroundColor: '#B2000A',
              border: 'none',
              borderRadius: '4px',
              fontFamily: "'Urbanist', sans-serif",
              fontSize: '1rem',
              color: '#fff',
              cursor: isSending ? 'not-allowed' : 'pointer',
              padding: '0.8rem 0',
              textAlign: 'center',
              letterSpacing: '0.05em',
              opacity: isSending ? 0.6 : 1,
              fontWeight: 600,
              textTransform: 'uppercase',
              touchAction: 'manipulation',
            }}
          >
            {isSending ? 'Sending…' : 'Submit'}
          </button>

          <p
            onClick={handleClose}
            style={{
              color: '#666', fontSize: '0.8rem', textAlign: 'center',
              marginTop: '1.2rem', cursor: 'pointer', textDecoration: 'underline',
              fontFamily: "'Urbanist', sans-serif", touchAction: 'manipulation',
            }}
          >
            Skip for now
          </p>
        </form>
      </div>
    </div>
  );
};

export default ContactPopup;
