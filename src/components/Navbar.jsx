/**
 * Navbar — Optimized
 * - Scroll DOWN → slides up/hides
 * - Scroll UP   → slides back in
 * - At top      → transparent bg
 * - Scrolled    → frosted dark bg
 * - Section-aware logo color (dark/light)
 * - Menu open   → always visible, white logo
 * - Responsive: mobile / tablet / desktop
 */

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Inject global menu styles once ──
if (typeof document !== 'undefined' && !document.getElementById('navbar-styles')) {
  const style = document.createElement('style');
  style.id = 'navbar-styles';
  style.innerHTML = `
    .menu-link {
      font-family: 'Lacroom', serif;
      color: #fff;
      text-decoration: none;
      line-height: 1;
      text-transform: uppercase;
      display: inline-block;
      will-change: transform, opacity;
      transition: color 0.35s ease, transform 0.35s ease;
    }
    .menu-link:hover {
      color: transparent;
      -webkit-text-stroke: 1px #ffffff;
      font-style: italic;
      transform: skewX(-10deg) scale(1.05);
    }
    @media (max-width: 767px) {
      .menu-link { font-size: clamp(2.2rem, 11vw, 3.5rem); }
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      .menu-link { font-size: clamp(3rem, 7vw, 5rem); }
    }
    @media (min-width: 1024px) {
      .menu-link { font-size: clamp(3.5rem, 6vw, 6rem); }
    }
  `;
  document.head.appendChild(style);
}

const NAV_LINKS = [
  { name: 'PROJECTS', href: '#projects' },
  { name: 'SERVICES', href: '#services' },
  { name: 'STYLING',  href: '#styling'  },
  { name: 'OUR STORY',href: '#story'    },
  { name: 'CONTACT',  href: '#contact'  },
];

// Section → logo theme map
const SECTION_THEMES = [
  { selector: '.hero-section',         theme: 'dark'  },
  { selector: '.portfolio-section',    theme: 'dark'  },
  { selector: '.about-section',        theme: 'dark'  },
  { selector: '.design-styles-section',theme: 'light' },
  { selector: '.contact-form-section', theme: 'light' },
];

const Navbar = () => {
  const [isOpen,     setIsOpen]     = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [logoTheme,  setLogoTheme]  = useState('dark');
  const [isMobile,   setIsMobile]   = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const navRef   = useRef(null);
  const menuRef  = useRef(null);
  const linksRef = useRef([]);
  const lastScrollY = useRef(0);
  const ticking    = useRef(false);

  // ── Resize handler ──
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Scroll: frosted bg + hide/show ──
  useEffect(() => {
    const HIDE_THRESHOLD = 80;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 20);

        if (!isOpen) {
          if (y > HIDE_THRESHOLD) {
            setNavVisible(y < lastScrollY.current);
          } else {
            setNavVisible(true);
          }
        }

        lastScrollY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isOpen]);

  // ── GSAP: slide nav in/out ──
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    if (isOpen) {
      gsap.to(el, { y: 0, duration: 0.4, ease: 'power3.out' });
      return;
    }

    gsap.to(el, {
      y: navVisible ? 0 : '-110%',
      duration: navVisible ? 0.45 : 0.3,
      ease: navVisible ? 'power3.out' : 'power3.in',
    });
  }, [navVisible, isOpen]);

  // ── GSAP: menu open/close ──
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    if (isOpen) {
      gsap.to(menu, {
        clipPath: 'circle(150% at 100% 0%)',
        duration: 0.75,
        ease: 'power3.inOut',
      });
      gsap.fromTo(
        linksRef.current.filter(Boolean),
        { y: 80, opacity: 0, rotate: 4 },
        { y: 0, opacity: 1, rotate: 0, duration: 0.7, stagger: 0.08,
          ease: 'power3.out', delay: 0.25 }
      );
    } else {
      gsap.to(menu, {
        clipPath: 'circle(0% at 100% 0%)',
        duration: 0.7,
        ease: 'power3.inOut',
      });
    }
  }, [isOpen]);

  // ── Section-aware logo color via ScrollTrigger ──
  useEffect(() => {
    const triggers = SECTION_THEMES
      .filter(({ selector }) => document.querySelector(selector))
      .map(({ selector, theme }) =>
        ScrollTrigger.create({
          trigger: selector,
          start: 'top 60px',
          end:   'bottom 60px',
          onEnter:     () => setLogoTheme(theme),
          onEnterBack: () => setLogoTheme(theme),
          onLeave:     () => setLogoTheme('dark'),
          onLeaveBack: () => setLogoTheme('dark'),
        })
      );

    return () => triggers.forEach(t => t.kill());
  }, []);

  // ── Lock body scroll when menu open ──
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  // ── Logo filter ──
  const logoFilter =
    isOpen || logoTheme === 'light' || scrolled
      ? 'brightness(0) invert(1)'
      : 'none';



  return (
    <>
      {/* ──────────────────── NAV BAR ──────────────────── */}
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          padding: isMobile ? '0.9rem 5vw' : '1.2rem 6vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          willChange: 'transform',
          background: scrolled && !isOpen
            ? 'rgba(10,10,10,0.6)'
            : 'transparent',
          backdropFilter:       scrolled && !isOpen ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: scrolled && !isOpen ? 'blur(14px)' : 'none',
          transition: 'background 0.45s ease, backdrop-filter 0.45s ease',
        }}
      >
        {/* Logo */}
        <a href="/" style={{ pointerEvents: 'auto', lineHeight: 0 }}>
          <img
            src="/images/logo.png"
            alt="Glocal Design"
            width={isMobile ? 80 : 110}
            height={isMobile ? 26 : 38}
            style={{
              objectFit: 'contain',
              filter: logoFilter,
              transition: 'filter 0.35s ease',
            }}
          />
        </a>

        {/* Right side: Phone CTA */}
        <div style={{
          pointerEvents: 'auto',
        }}>
          {/* Call CTA */}
          <a
            href="tel:+918860870874"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '5px' : '8px',
              backgroundColor: '#323232',
              color: '#ffffff',
              padding: isMobile ? '0.45rem 0.85rem' : '0.6rem 1.3rem',
              borderRadius: '9999px',
              fontFamily: "'Urbanist', sans-serif",
              fontSize: isMobile ? '0.7rem' : '0.82rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'transform 0.25s ease, background-color 0.25s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={isMobile ? 13 : 15}
              height={isMobile ? 13 : 15}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 
              1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 
              0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 
              3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <span>{isMobile ? '+91 88608 70874' : '+91 88608 70874'}</span>
          </a>
        </div>
      </nav>

      {/* ──────────────────── FULL-SCREEN MENU ──────────────────── */}
      <div
        ref={menuRef}
        aria-hidden={!isOpen}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#8B0012',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          clipPath: 'circle(0% at 100% 0%)',
          willChange: 'clip-path',
          visibility: isOpen ? 'visible' : 'hidden',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: isOpen ? 'none' : 'visibility 0s linear 0.75s',
        }}
      >
        {/* Nav Links */}
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isMobile ? '0.6rem' : '0.9rem',
        }}>
          {NAV_LINKS.map((link, idx) => (
            <a
              key={link.name}
              href={link.href}
              ref={el => (linksRef.current[idx] = el)}
              onClick={closeMenu}
              className="menu-link"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Bottom info bar */}
        <div style={{
          position: 'absolute',
          bottom: isMobile ? '1.5rem' : '2.5rem',
          left: 0, right: 0,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'center' : 'space-between',
          alignItems: 'center',
          gap: isMobile ? '4px' : '0',
          padding: isMobile ? '0 1.5rem' : '0 4rem',
          boxSizing: 'border-box',
          fontFamily: "'Urbanist', sans-serif",
          color: 'rgba(255,255,255,0.55)',
          fontSize: isMobile ? '0.72rem' : '0.82rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          <span>Info@Glocaldesign.Com</span>
          <span>+91 88608 70874</span>
        </div>
      </div>
    </>
  );
};

export default Navbar;
