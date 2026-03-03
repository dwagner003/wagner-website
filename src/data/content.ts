export interface TerminalLine {
  command: string;
  output: string;
  delay?: number;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  highlights: string[];
  tech: string[];
}

export const terminalLines: TerminalLine[] = [
  { command: 'whoami', output: 'Devin Wagner' },
  { command: 'cat role.txt', output: 'Full Stack Software Engineer' },
  { command: 'ls skills/', output: 'C#  .NET  Angular  React  MongoDB  AWS' },
  { command: 'cat status.txt', output: 'Building great software in Denver, CO' },
];

export const skills = [
  { name: 'C#', category: 'backend' as const },
  { name: '.NET', category: 'backend' as const },
  { name: 'Angular', category: 'frontend' as const },
  { name: 'React', category: 'frontend' as const },
  { name: 'MongoDB', category: 'backend' as const },
  { name: 'AWS', category: 'cloud' as const },
  { name: 'TypeScript', category: 'frontend' as const },
];

export const experiences: Experience[] = [
  {
    title: 'Senior Software Engineer',
    company: 'AbsenceSoft',
    period: 'Jun 2024 - Present',
    highlights: [],
    tech: ['C#', '.NET', 'Angular', 'DataDog', 'AWS'],
  },
  {
    title: 'Software Engineer',
    company: 'AbsenceSoft',
    period: 'Mar 2021 - Jun 2024',
    highlights: [
      "Contribute to the full SDLC to ensure AbsenceSoft meets legislative compliance standards, bolstering the company's reputation for regulatory adherence",
      'Demonstrate leadership by mastering DataDog and Sumo, constructing dashboards and monitors, and presenting findings at engineering team sessions, fostering knowledge sharing and development',
      'Play a pivotal role in designing and developing new APIs using the ONION architecture, ensuring alignment with organizational goals and best practices',
      'Spearhead documentation of technical support processes and streamline DataDog dashboards, enhancing efficiency in release validations and showcasing a commitment to operational excellence',
      'Refactor existing functionality in Angular, C#, JavaScript, and Razor to prioritize scalability and sustainability delivering high-quality code within designated timelines for long-term project success',
    ],
    tech: ['C#', '.NET', 'Angular', 'JavaScript', 'Razor', 'DataDog', 'Sumo'],
  },
  {
    title: 'Integration Engineer',
    company: 'AbsenceSoft',
    period: 'Aug 2020 - Mar 2021',
    highlights: [
      'Led collaborative efforts to gather, analyze, and refine detailed requirements for data feeds, orchestrated timelines for their development, internal testing, and delivery to external customers, ensured seamless alignment with organizational goals and priorities',
      'Established comprehensive processes and development standards for the integration team, while mentoring and guiding the onboarding process for five new team members, accelerating their contributions to organizational success',
    ],
    tech: ['C#', '.NET', 'SQL'],
  },
  {
    title: 'Associate Software Developer',
    company: 'Billtrust',
    period: 'Jun 2018 - Aug 2020',
    highlights: [
      'Collaborated within a fast-paced Agile/Scrum team to deliver new and refactored features for a SaaS application, ensuring alignment with security, performance, and scalability standards',
      'Mentored and supported development interns in the Denver and Boulder office to help provide an enjoyable learning experience',
    ],
    tech: ['C#', '.NET', 'Angular', 'JavaScript'],
  },
];

export const socialLinks = {
  github: 'https://github.com/dwagner003',
  linkedin: 'https://www.linkedin.com/in/dtwagner55/',
  email: 'devinwagner003@gmail.com',
};
