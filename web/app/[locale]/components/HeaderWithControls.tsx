'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname, Link } from '@/i18n/navigation';
import { locales, languageNames, flags, type Locale } from '@/i18n/routing';

// SVG Icons
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface HeaderWithControlsProps {
  variant?: 'transparent' | 'solid';
  showNav?: boolean;
}

export default function HeaderWithControls({
  variant = 'transparent',
  showNav = true,
}: HeaderWithControlsProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      const isDarkMode = stored === 'dark';
      setIsDark(isDarkMode);
      document.documentElement.classList.toggle('light', !isDarkMode);
      document.documentElement.classList.toggle('dark', isDarkMode);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle('light', !prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('light', !newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  const headerClass = variant === 'solid' || isScrolled ? 'header-solid' : 'header-transparent';

  return (
    <header className={`main-header ${headerClass}`}>
      <div className="header-inner container mx-auto px-6">
        {/* Brand */}
        <Link href="/" className="header-brand">
          <span className="font-light">Slow</span> <span className="header-brand-accent">Spot</span>
          <span className="header-brand-domain">.me</span>
        </Link>

        {/* Right side - Nav + Controls */}
        <div className="header-right">
          {/* Navigation */}
          {showNav && (
            <nav className="header-nav">
              <Link href="/privacy" className="header-nav-link">
                {t('footer.columns.legal.links.privacy')}
              </Link>
              <Link href="/terms" className="header-nav-link">
                {t('footer.columns.legal.links.terms')}
              </Link>
              <Link href="/support" className="header-nav-link">
                {t('footer.columns.support.links.help')}
              </Link>
            </nav>
          )}

          {/* Controls */}
          <div className="header-controls" ref={dropdownRef}>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="header-control-btn"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="header-icon-wrapper header-icon-theme">
                {isDark ? <SunIcon /> : <MoonIcon />}
              </div>
            </button>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`header-control-btn header-control-btn-wide ${isOpen ? 'header-control-active' : ''}`}
                aria-label={t('languageSwitcher.label')}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{flags[locale]}</span>
                  <span className="header-lang-code sm:hidden">{locale.toUpperCase()}</span>
                  <span className="header-lang-text hidden sm:inline">{languageNames[locale]}</span>
                </div>
                <div className="header-chevron">
                  <ChevronIcon isOpen={isOpen} />
                </div>
              </button>

              {/* Dropdown Menu */}
              <div
                className={`header-dropdown ${isOpen ? 'header-dropdown-open' : 'header-dropdown-closed'}`}
                role="listbox"
                aria-label={t('languageSwitcher.label')}
              >
                <div className="header-dropdown-header">
                  <p className="header-dropdown-title">{t('languageSwitcher.label')}</p>
                </div>
                <div className="py-1">
                  {locales.map((loc) => {
                    const isSelected = locale === loc;
                    return (
                      <button
                        key={loc}
                        onClick={() => handleLocaleChange(loc)}
                        className={`header-dropdown-item ${isSelected ? 'header-dropdown-item-selected' : ''}`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span className="text-xl">{flags[loc]}</span>
                        <span
                          className={`flex-1 text-left text-sm ${isSelected ? 'font-semibold' : 'font-medium'}`}
                        >
                          {languageNames[loc]}
                        </span>
                        {isSelected && (
                          <span className="header-check-icon">
                            <CheckIcon />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
