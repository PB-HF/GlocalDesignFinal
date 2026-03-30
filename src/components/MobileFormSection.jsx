/**
 * MobileFormSection — MOBILE ONLY (<768px)
 * Red bg (#B2000A) + white form card — EmailJS integration
 * Optimized: constants outside, safe-area insets, iOS keyboard fix
 */

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

// ── Constants outside component ──
const FIELDS = [
  { name: 'name',        placeholder: 'Name*',        type: 'text'  },
  { name: 'phone',       placeholder: 'Phone No.*',   type: 'tel'   },
  { name: 'city',        placeholder: 'City*',        type: 'text'  },
  { name: 'email',       placeholder: 'Email*',       type: 'email' },
  { name: 'description', placeholder: 'Description*', type: 'text'  },
];

const validate = (name, value) => {
  if (!value.trim()) return 'Required';
  if (name === 'phone' && !/^[0-9]{10}$/.test(value)) return 'Valid 10-digit number';
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Valid email';
  if (name === 'description' && value.length < 10) return 'Min 10 chars';
  return '';
};

const INITIAL_FORM = {
  name: '', phone: '', email: '', city: '', description: '', hp_field: '',
};

const MobileFormSection = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors,    setErrors]    = useState({});
  const [isSending, setIsSending] = useState(false);

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
        setErrors({ submit: 'Failed. Try again.' });
        setIsSending(false);
      });
  };

  const inputStyle = (hasErr) => ({
    width: '100%',
    border: 'none',
    borderBottom: `1px solid ${hasErr ? '#ff4d4d' : '#d0c8c2'}`,
    padding: '0.9rem 0',
    fontFamily: "'Urbanist', sans-serif",
    fontSize: '16px', /* 16px prevents iOS auto-zoom on focus */
    color: '#2b2b2b',
    backgroundColor: 'transparent',
    outline: 'none',
    boxSizing: 'border-box',
    borderRadius: 0, /* iOS adds border-radius on inputs */
    WebkitAppearance: 'none',
  });

  return (
    <section
      id="mobile-form-section"
      className="contact-form-section"
      style={{
        width: '100%',
        minHeight: '100dvh',
        backgroundColor: '#B2000A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        /* safe-area for iPhone home bar / notch */
        padding: 'env(safe-area-inset-top, 2rem) 1.2rem env(safe-area-inset-bottom, 2rem)',
        boxSizing: 'border-box',
      }}
    >
      {/* ── White form card ── */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        /* clamp padding: tighter on small phones, roomier on larger */
        padding: 'clamp(1.8rem, 6vw, 2.5rem) clamp(1.4rem, 5vw, 2rem)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        boxSizing: 'border-box',
      }}>
        <h2 style={{
          fontFamily: "'Lacroom', serif",
          fontWeight: 400,
          fontSize: 'clamp(1.5rem, 5.5vw, 2rem)',
          color: '#2b2b2b',
          lineHeight: 1.15,
          textAlign: 'center',
          marginBottom: '1.8rem',
          marginTop: 0,
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
            <div key={f.name} style={{ position: 'relative', marginBottom: '0.6rem' }}>
              <input
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                value={formData[f.name]}
                onChange={handleChange}
                autoComplete={f.name === 'email' ? 'email' : f.name === 'name' ? 'name' : 'off'}
                inputMode={f.type === 'tel' ? 'numeric' : 'text'}
                style={inputStyle(!!errors[f.name])}
              />
              {errors[f.name] && (
                <span style={{
                  fontSize: '0.6rem',
                  color: '#ff4d4d',
                  position: 'absolute',
                  bottom: '-12px',
                  left: 0,
                }}>
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

          {/* Submit button — matches desktop premium style */}
          <button
            type="submit"
            disabled={isSending}
            style={{
              width: '100%',
              marginTop: '2rem',
              background: isSending
                ? 'rgba(178,0,10,0.55)'
                : 'linear-gradient(135deg, #B2000A 0%, #8B0012 60%, #B2000A 100%)',
              color: '#fff',
              fontFamily: "'Urbanist', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '1rem 0',
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: isSending ? 'not-allowed' : 'pointer',
              opacity: isSending ? 0.65 : 1,
              boxShadow: '0 4px 20px rgba(178,0,10,0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              touchAction: 'manipulation',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>{isSending ? 'Sending…' : 'Submit'}</span>
            {!isSending && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true">
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

export default MobileFormSection;
