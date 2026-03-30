import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroDesktopSection from './components/HeroDesktopSection';
import AutoplayVideoSection from './components/AutoplayVideoSection';
import HeroMobileSection from './components/HeroMobileSection';
import MobileFormSection from './components/MobileFormSection';
import MobileVideoSection from './components/MobileVideoSection';
import AboutUs from './components/AboutUs';
import BeforeAfter from './components/BeforeAfter';
import DesignStyles from './components/DesignStyles';
import ServicesSection from './components/ServicesSection';
import ProjectsCarousel from './components/ProjectsCarousel';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import ContactPopup from './components/ContactPopup';
import './index.css';

function App() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollBtn(window.scrollY > 2000);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>

      {/* ── Scroll-to-top button ── */}
      {showScrollBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 50,
            width: '2.8rem',
            height: '2.8rem',
            borderRadius: '50%',
            border: '1px solid #c4c4c4',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            transition: 'background 0.3s, color 0.3s, border-color 0.3s',
            touchAction: 'manipulation',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#000';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = '#000';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.color = 'inherit';
            e.currentTarget.style.borderColor = '#c4c4c4';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      )}

      <Navbar />

      {/* Mobile-only popup */}
      {isMobile && <ContactPopup />}

      {/* ── Desktop + Tablet ── */}
      {!isMobile && (
        <>
          <HeroDesktopSection />
          <AutoplayVideoSection />
        </>
      )}

      {/* ── Mobile ── */}
      {isMobile && (
        <>
          <HeroMobileSection />
          <MobileFormSection />
          <MobileVideoSection />
        </>
      )}

      {/* ── Shared sections (all devices) ── */}
      <div id="about-us">
        <AboutUs />
      </div>
      <BeforeAfter />
      <DesignStyles />
      <ServicesSection />
      <ProjectsCarousel />
      <ContactForm />
      <Footer />

    </div>
  );
}

export default App;
