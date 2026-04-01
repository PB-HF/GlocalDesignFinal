/**
 * MobileVideoSection — MOBILE ONLY
 * 100dvh full-screen autoplay video (hero-mobile.mp4)
 * ImageKit CDN with /public fallback
 */

import React from 'react';

const IMAGEKIT_URL = import.meta.env.VITE_IMAGEKIT_URL || '';
// const VIDEO_SRC    = IMAGEKIT_URL? `${IMAGEKIT_URL}/hero-mobile.mp4` : '/hero-mobile.mp4';
const CB = '?v=20260401'; // cache-buster — update this string when you replace the video
const VIDEO_SRC = IMAGEKIT_URL ? `${IMAGEKIT_URL}/hero-mobile.mp4${CB}` : '/hero-mobile.mp4';

const MobileVideoSection = () => (
  <section
    style={{
      position: 'relative',
      width: '100%',
      height: '100dvh',
      overflow: 'hidden',
      backgroundColor: '#000',
    }}
  >
    <video
      src={VIDEO_SRC}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      onLoadedMetadata={e => { e.currentTarget.playbackRate = 1.2; }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '100%',
        minHeight: '100%',
        width: 'auto',
        height: 'auto',
        objectFit: 'cover',
      }}
    />

    {/* Subtle gradient overlay */}
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 100%)',
      pointerEvents: 'none',
    }} />
  </section>
);

export default MobileVideoSection;
