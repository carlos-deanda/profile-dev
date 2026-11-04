// Everything on the site that isn't layout lives here.
// To add a project, add an object to `projects`; it shows up in its group automatically.

import smartMirrorTeam from '../assets/smart-mirror-team.webp';

export const contact = {
  email: 'carlosfelipedeanda@gmail.com',
  github: 'https://github.com/carlos-deanda',
  linkedin: '', // TODO: paste your LinkedIn URL
  resume: '', // TODO: put your CV in /public (e.g. /Carlos_de_Anda_Resume.pdf) and set the path here
};

export const stats = [
  { value: '1st', label: 'Place, Expo Ingenierías — Physical Prototype' },
  { value: '3rd', label: 'Nationwide, Mexican Robotics Tournament' },
  { value: '5,000+', label: 'Students represented as FETEC Vice President' },
  { value: '9.65', label: 'Cumulative GPA out of 10' },
];

export const featured = {
  eyebrow: '1st place · Expo Ingenierías 2026',
  title: 'Smart Mirror System',
  description:
    'A smart mirror that recognizes faces on a Raspberry Pi edge hub, reads motion and light sensors through NodeMCU, and drives PWM lighting, all in a live React dashboard. Built by a team of five.',
  myPart:
    'the physical build of the mirror, plus the dashboard widgets (weather, news, calendar, reminders, daily quote) and the news API behind them.',
  stack: ['Python', 'OpenCV', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'IoT'],
  image: smartMirrorTeam,
  imageAlt: 'The Smart Mirror team holding the first-place certificate at Tecnológico de Monterrey',
  links: [{ label: 'GitHub', href: 'https://github.com/danihdz11/Smart-Mirror' }],
};

export const projects = [
  {
    group: 'software',
    eyebrow: 'Full-stack · June 2026',
    title: 'Chefsito',
    description:
      'A real-time restaurant waitlist. Diners join from a QR code or a live map and get notified when their table is ready, while staff and managers run the line from their own dashboards.',
    myPart:
      'started the project and built the home, the live map, the queue system, notifications and the customer dashboard.',
    stack: ['React', 'Tailwind', 'Express', 'Socket.io', 'PostgreSQL', 'JWT'],
    imageLabel: 'Chefsito screenshot',
    links: [
      { label: 'Watch demo', href: 'https://www.youtube.com/watch?v=G8BBqBVzlAM' },
      { label: 'GitHub', href: 'https://github.com/carlos-deanda/chefsito' },
    ],
  },
  {
    group: 'software',
    eyebrow: 'Industry project with Kueski · Spring 2026',
    title: 'Kueski Widget',
    description:
      'A Chrome extension that detects product prices on Amazon and Bodega Aurrera, offers a Kueski checkout, tracks prices and emails users when they drop.',
    myPart:
      'the first working extension, price detection, the checkout flow and the notification system.',
    stack: ['React', 'Chrome Extensions (MV3)', 'Express', 'PostgreSQL'],
    imageLabel: 'Widget on Amazon screenshot',
    links: [{ label: 'GitHub', href: 'https://github.com/carlos-deanda/widget-kueski' }],
  },
  {
    group: 'software',
    eyebrow: 'Mobile · Social impact · Fall 2026',
    title: 'VoluntApp',
    description:
      'An Android app for Banco de Alimentos (BAMX) to manage volunteers, activities, attendance and hours.',
    myPart:
      'turned the Figma designs into the volunteer screens: activity offers, sign-up, QR check-in and profile.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Express', 'MongoDB'],
    imageLabel: 'VoluntApp phone screens',
    links: [{ label: 'GitHub', href: 'https://github.com/Guillermo-dlti/voluntapp' }],
  },
  {
    group: 'hardware',
    eyebrow: 'Networking · March 2026',
    title: 'Enterprise Campus Network',
    description:
      'End-to-end network for a 6-story building with 3,200+ concurrent users: 13 VLANs, a VLSM addressing plan, Cisco Catalyst hardware and 150+ Wi-Fi 6 APs, validated in Packet Tracer and a physical proof of concept.',
    stack: ['Cisco IOS', 'VLSM', 'VLANs', 'Wi-Fi 6'],
    imageLabel: 'Network topology diagram',
    links: [],
  },
  {
    group: 'hardware',
    eyebrow: 'Robotics · May 2025 · 3rd nationwide',
    title: 'TMR Lunar Rover',
    description:
      'Robotec’s lunar rover prototype, 3rd place nationally at the Mexican Robotics Tournament.',
    myPart: 'Bluetooth wheel control, PWM motor control and the AS5600 magnetic-encoder controller.',
    stack: ['Python', 'Arduino', 'PWM', 'AS5600 encoders', 'Bluetooth'],
    imageLabel: 'Rover photo',
    links: [{ label: 'GitHub', href: 'https://github.com/Sesgaro/Robert_RoboTec' }],
  },
];

export const projectGroups = [
  { id: 'software', title: 'Software.' },
  { id: 'hardware', title: 'Hardware & infrastructure.' },
];

export const experience = [
  {
    dates: 'Apr – Jun 2026',
    title: 'Software Developer, Industry Project · Kueski',
    description:
      'Built a Chrome checkout and price-tracking extension with Kueski, a fintech and Tec de Monterrey industry partner, on a team of four working against real product requirements.',
  },
  {
    dates: '2026 – Present',
    title: 'Vice President · FETEC Executive Committee',
    description:
      'Co-led the winning campaign (Planilla NOVA) for the 2026–2027 term. Now directing strategy, budget and representation for 5,000+ students at Campus Guadalajara.',
  },
  {
    dates: '2026 – Present',
    title: 'Tec Ambassador · 12th Generation',
    description:
      'Represent Campus Guadalajara at institutional events, guiding prospective engineering students and visiting delegations.',
  },
  {
    dates: '2025 – 2026',
    title: 'EGS Global Leadership Program · 5th Generation',
    description:
      'Golden Dandelion Certification (top 10%) and Don Eugenio’s Circle distinction for leadership and social impact.',
  },
  {
    dates: '2023 – 2024',
    title: 'FIRST Robotics · Daedalus 7102',
    description:
      'Mechanism assembly and drive-team strategy for a team that qualified for the FRC World Championship in Houston.',
  },
];

export const skills = {
  languages: ['Python', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'MATLAB', 'R'],
  tools: ['React', 'Node.js', 'Express', 'Tailwind', 'OpenCV', 'MongoDB', 'MySQL', 'Cisco IOS', 'Linux', 'Git'],
  spoken: 'Spanish (native) · English (C1) · German (B1)',
};
