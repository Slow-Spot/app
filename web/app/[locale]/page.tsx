'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import HeaderWithControls from './components/HeaderWithControls';
import { appConfig } from '../config/app.config';

// Breathing Animation Component with 4-4-4 cycle
const BreathingCircle = () => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
  const t = useTranslations('appPreview');

  const breathingTexts = {
    in: t('breathingTexts.in'),
    hold: t('breathingTexts.hold'),
    out: t('breathingTexts.out'),
  };

  useEffect(() => {
    const phases: ('in' | 'hold' | 'out')[] = ['in', 'hold', 'out'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % 3;
      setPhase(phases[currentIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="breathing-circle-wrapper">
      <div className={`breathing-circle-outer breathing-phase-${phase}`} />
      <div className={`breathing-circle-middle breathing-phase-${phase}`} />
      <div className={`breathing-circle-inner breathing-phase-${phase}`}>
        <span className="breathing-text">{breathingTexts[phase]}</span>
      </div>
    </div>
  );
};

// SVG Icons
const Icons = {
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  music: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 3v18h18" />
      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  ),
  play: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  download: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  apple: (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z" />
      <path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  ),
  playStore: (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35z" />
      <path d="M16.81 15.12L6.05 21.34l8.49-8.49 2.27 2.27z" />
      <path d="M20.16 10.81c.5.38.84.97.84 1.69s-.34 1.31-.84 1.69l-2.27 1.31-2.5-2.5 2.5-2.5 2.27 1.31z" />
      <path d="M6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
    </svg>
  ),
};

type FeatureKey = 'progressive' | 'audio' | 'tracking' | 'wisdom' | 'cultural' | 'theme';

export default function HomePage() {
  const t = useTranslations();

  const features: {
    key: FeatureKey;
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
  }[] = [
    { key: 'progressive', icon: Icons.target, bgColor: 'bg-violet-100', iconColor: 'text-violet-600' },
    { key: 'audio', icon: Icons.music, bgColor: 'bg-sky-100', iconColor: 'text-sky-600' },
    { key: 'tracking', icon: Icons.chart, bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { key: 'wisdom', icon: Icons.sparkles, bgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
    { key: 'cultural', icon: Icons.globe, bgColor: 'bg-rose-100', iconColor: 'text-rose-600' },
    { key: 'theme', icon: Icons.moon, bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  ];

  const appPreviewFeatures = ['instant', 'language', 'offline'] as const;

  return (
    <>
      <HeaderWithControls />

      {/* Hero Section */}
      <section className="hero-bg noise-overlay min-h-screen flex items-center relative">
        {/* Animated Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="animate-fade-up flex justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-violet-300">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  {t('hero.badge')}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] animate-fade-up delay-100">
                <span className="text-white">
                  {t('hero.title').split(' ').slice(0, -1).join(' ')}{' '}
                </span>
                <span className="text-gradient">{t('hero.title').split(' ').slice(-1)}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed animate-fade-up delay-200 mx-auto lg:mx-0">
                {t('hero.subtitle')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 animate-fade-up delay-300 justify-center lg:justify-start">
                <a
                  href="#download"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5"
                >
                  {Icons.download}
                  {t('hero.ctaPrimary')}
                </a>
                <a
                  href="#features"
                  className="group inline-flex items-center gap-3 px-8 py-4 glass rounded-2xl font-semibold text-white transition-all duration-300 hover:bg-white/10"
                >
                  {Icons.play}
                  {t('hero.ctaSecondary')}
                </a>
              </div>
            </div>

            {/* Right - Phone Mockup with Breathing Circle */}
            <div className="flex justify-center lg:justify-end animate-slide-right delay-200">
              <div className="phone-mockup-container">
                <div className="phone-mockup">
                  <div className="phone-screen">
                    <div className="phone-notch" />
                    {/* App Screen Content */}
                    <div className="flex flex-col items-center justify-center h-full p-6">
                      <BreathingCircle />
                      <div className="mt-8 text-center">
                        <p className="phone-brand-text text-sm">Slow Spot</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Preview Features */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-white">{t('appPreview.title')}</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-md">{t('appPreview.subtitle')}</p>
              </div>

              <div className="space-y-6">
                {appPreviewFeatures.map((key, index) => (
                  <div
                    key={key}
                    className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/5"
                  >
                    <div
                      className={`
                      w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center
                      bg-gradient-to-br ${index === 0 ? 'from-violet-500/20 to-purple-500/20 text-violet-400' : index === 1 ? 'from-blue-500/20 to-cyan-500/20 text-blue-400' : 'from-emerald-500/20 to-teal-500/20 text-emerald-400'}
                    `}
                    >
                      {index === 0 ? (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                      ) : index === 1 ? (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M2 12h20" />
                          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                        </svg>
                      ) : (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        {t(`appPreview.features.${key}.title`)}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {t(`appPreview.features.${key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-3xl blur-3xl" />
              <div className="relative glass rounded-3xl p-8 w-full max-w-md">
                <div className="aspect-square rounded-2xl breathing-preview-bg flex items-center justify-center">
                  <div className="scale-75">
                    <BreathingCircle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        {/* Additional decorative orb */}
        <div className="features-orb-center" />
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="features-title">{t('features.sectionTitle')}</h2>
            <p className="features-subtitle">{t('features.sectionSubtitle')}</p>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={feature.key}
                className={`feature-card ${index === 0 ? 'feature-card-large' : ''}`}
              >
                <div className={`feature-icon-new ${feature.bgColor} ${feature.iconColor}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-card-title">{t(`features.cards.${feature.key}.title`)}</h3>
                <p className="feature-card-description">
                  {t(`features.cards.${feature.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Slow Spot Section */}
      <section className="relative py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/5 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              {t('whySlowSpot.sectionTitle')}
            </h2>
            <p className="text-gray-400 text-lg">{t('whySlowSpot.sectionSubtitle')}</p>
          </div>

          {/* Why Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="glass rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300"
              >
                <div
                  className={`
                  w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center
                  ${index === 0 ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400' : index === 1 ? 'bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-400' : 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400'}
                `}
                >
                  {index === 0 ? (
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  ) : index === 1 ? (
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  ) : (
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {t(`whySlowSpot.items.${index}.title`)}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {t(`whySlowSpot.items.${index}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA Section */}
      <section id="download" className="cta-section py-32">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold cta-title">
              {t('download.sectionTitle')}
            </h2>
            <p className="cta-subtitle text-lg">{t('download.sectionSubtitle')}</p>

            {/* Store Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a href="#" className="store-btn cta-store-btn">
                {Icons.apple}
                <div className="text-left">
                  <div className="text-xs cta-label">{t('download.appStore.label')}</div>
                  <div className="font-semibold">{t('download.appStore.name')}</div>
                </div>
              </a>
              <a href="#" className="store-btn cta-store-btn">
                {Icons.playStore}
                <div className="text-left">
                  <div className="text-xs cta-label">{t('download.googlePlay.label')}</div>
                  <div className="font-semibold">{t('download.googlePlay.name')}</div>
                </div>
              </a>
            </div>

            <p className="cta-note text-sm">{t('download.note')}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-gradient py-16 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1 space-y-4">
              <h3 className="text-2xl font-bold text-gradient">{t('footer.brand.name')}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t('footer.brand.tagline')}</p>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">{t('footer.columns.product.title')}</h4>
              <div className="space-y-2">
                <a
                  href="#features"
                  className="block text-gray-500 hover:text-violet-400 transition-colors text-sm"
                >
                  {t('footer.columns.product.links.features')}
                </a>
                <Link
                  href="/support"
                  className="block text-gray-500 hover:text-violet-400 transition-colors text-sm"
                >
                  {t('footer.columns.support.links.help')}
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">{t('footer.columns.legal.title')}</h4>
              <div className="space-y-2">
                <Link
                  href="/privacy"
                  className="block text-gray-500 hover:text-violet-400 transition-colors text-sm"
                >
                  {t('footer.columns.legal.links.privacy')}
                </Link>
                <Link
                  href="/terms"
                  className="block text-gray-500 hover:text-violet-400 transition-colors text-sm"
                >
                  {t('footer.columns.legal.links.terms')}
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              {t('footer.bottom.copyright', { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-xs">v{appConfig.version}</span>
              <p className="text-gray-600 text-sm">{t('footer.bottom.tagline')}</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
