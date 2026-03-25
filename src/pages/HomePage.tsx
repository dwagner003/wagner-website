import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AboutSection,
  HeroSection,
  SkillsSection,
  ExperienceSection,
  GitHubSection,
  ContactSection,
  Footer,
} from '../components/sections';

export default function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <GitHubSection />
      <ContactSection />
      <Footer />
    </>
  );
}
