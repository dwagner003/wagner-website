import { GitHubIcon, LinkedInIcon } from '../ui';
import { socialLinks } from '../../data/content';

export function ContactSection() {
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="font-mono text-sm sm:text-base text-[var(--color-terminal-prompt)] mb-6 sm:mb-8">
          // get_in_touch
        </div>

        <p className="font-mono text-sm sm:text-base text-[var(--color-text-secondary)] mb-8 sm:mb-10 leading-relaxed">
          Interested in working together? I'm always open to discussing new projects, opportunities,
          and ideas.
        </p>

        <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-neon-cyan)]/20 p-6 sm:p-8 mb-8">
          <div className="font-mono text-sm text-[var(--color-text-muted)] mb-3">
            <span className="text-[var(--color-terminal-prompt)]">$</span> echo $EMAIL
          </div>
          <a
            href={`mailto:${socialLinks.email}`}
            className="font-mono text-base sm:text-lg text-[var(--color-neon-cyan)] hover:text-[var(--color-neon-green)] transition-colors break-all"
          >
            {socialLinks.email}
          </a>
        </div>

        <div className="flex justify-center gap-4 sm:gap-6">
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-sm px-4 py-2 border border-[var(--color-neon-cyan)]/30 text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] hover:border-[var(--color-neon-cyan)] rounded transition-colors"
            aria-label="GitHub"
          >
            <GitHubIcon />
            <span>GitHub</span>
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-sm px-4 py-2 border border-[var(--color-neon-cyan)]/30 text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] hover:border-[var(--color-neon-cyan)] rounded transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </section>
  );
}
