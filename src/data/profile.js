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
    demo: 'voluntapp',
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

// Interactive VoluntApp demo (volunteer flow). Everything here is made-up sample data,
// and the screens say so. No BAMX logos, no real people, dates or places.
export const voluntappDemo = {
  groupLabel: 'VoluntApp volunteer flow, interactive demo with sample data',
  caption: 'Interactive demo with sample data. Tap through the volunteer flow.',
  badge: 'Sample data',
  back: 'Back',
  stepsLabel: 'Demo steps',
  steps: ['Offers', 'Details', 'Sign up', 'Check-in'],
  offers: { title: 'Activities', hint: 'Choose an activity', spotsLeft: 'spots left' },
  activities: [
    {
      id: 'sorting',
      title: 'Food sorting',
      when: 'Sat · 9:00 am',
      place: 'Main warehouse',
      spots: 12,
      hours: 4,
      description: 'Sort and check donated food before it is packed.',
    },
    {
      id: 'packing',
      title: 'Pantry packing',
      when: 'Sun · 10:00 am',
      place: 'Main warehouse',
      spots: 5,
      hours: 3,
      description: 'Pack pantry boxes for delivery to partner communities.',
    },
    {
      id: 'drive',
      title: 'Collection drive',
      when: 'Next Sat · 8:00 am',
      place: 'Partner site',
      spots: 20,
      hours: 5,
      description: 'Help receive and register donations at a collection point.',
    },
  ],
  detail: { when: 'When', where: 'Where', hours: 'Hours', spots: 'Spots', cta: 'Sign up' },
  signup: {
    title: 'Confirm sign-up',
    volunteerLabel: 'Volunteer',
    volunteer: 'Sample Volunteer',
    cta: 'Confirm',
  },
  checkin: {
    title: 'You’re signed up',
    hint: 'Show this code at check-in.',
    qrLabel: 'Sample QR code, not scannable',
    qrCaption: 'Sample code',
    done: 'Done',
  },
};

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

// Section "tracklist": the one musical motif on the site.
export const tracks = {
  work: { number: '01', label: 'Work' },
  why: { number: '02', label: 'Why I build' },
  places: { number: '03', label: 'Built for Guadalajara' },
  experience: { number: '04', label: 'Experience' },
  about: { number: '05', label: 'About' },
  contact: { number: '06', label: 'Contact' },
};

// Community section: my motivation plus the three places it shows up.
// No names or places of the homes WeCareClub visits, and no people from them.
export const why = {
  title: 'Why I build.',
  statement: 'Building isn’t something one person does alone. It’s something we do together, as a team.',
  body: 'I want what I make to have an impact on other people. The world gives us so much that we still need to give back far more.',
  items: [
    {
      name: 'VoluntApp',
      text: 'An Android app for Banco de Alimentos (BAMX) Guadalajara to manage volunteers, activities, attendance and hours. I built the volunteer screens.',
    },
    {
      name: 'WeCareClub',
      text: 'A student group I co-founded, convinced that we can build a better community through human companionship and social service. Our first visit to a casa hogar was in May 2026.',
    },
    {
      name: 'FETEC',
      text: 'As Vice President, I represent 5,000+ students at Campus Guadalajara.',
    },
  ],
};

export const footer = {
  owner: 'Carlos de Anda',
  made: 'Made in Guadalajara, Jalisco.',
  // Guadalajara has no daylight saving time; the zone is America/Mexico_City.
  time: { locale: 'en-US', timeZone: 'America/Mexico_City', suffix: 'in Guadalajara' },
  piano: {
    title: 'Psst. Try the keys.',
    hint: 'Click, tap, or focus a key and play with A to K.',
    groupLabel: 'Piano keyboard, one octave from C4 to C5',
    keyLabel: 'Piano key',
  },
};

// Scroll scene between the stats and the work. Same words as `about`, split into three beats.
export const leap = {
  eyebrow: 'Leap of faith',
  sectionLabel: 'How I got here',
  steps: [
    {
      label: 'Music',
      text: 'At 17, I had to choose between studying music production and engineering.',
    },
    {
      label: 'The decision',
      text: 'A leap of faith doesn’t mean having all the answers. It means believing enough in what you want to build to take the first step, even when you don’t yet know where it will lead.',
    },
    {
      label: 'Engineering',
      text: 'I chose Computer Technologies Engineering. I still play piano and ukulele, but computing is my passion, and combining both is my dream.',
    },
  ],
};

// Each place has real coordinates; the map (src/data/guadalajaraMap.js, generated from
// OpenStreetMap data) and the pins use the same projection. `labelSide` is only layout.
// Never pin the homes WeCareClub visits.
// Sources: Tec Campus Guadalajara (Av. General Ramón Corona 2514, Zapopan), two sources agree.
// BAMX Guadalajara: the town center of Santa María Tequepexpan, Tlaquepaque (OpenStreetMap);
// the building is in that locality (Hacienda de la Calerilla), but its exact point is not pinned.
export const places = {
  title: 'Built for Guadalajara.',
  hint: 'Select a point to see what I did there.',
  mapNote: 'Simplified map; positions are approximate.',
  mapCredit: { text: '© OpenStreetMap contributors', href: 'https://www.openstreetmap.org/copyright' },
  closeLabel: 'Close',
  listLabel: 'Places in Guadalajara',
  items: [
    {
      id: 'tec',
      short: 'Tec Campus GDL',
      name: 'Tecnológico de Monterrey, Campus Guadalajara',
      area: 'Zapopan',
      summary: 'Where I study Computer Science and where I do most of my projects right now.',
      points: [
        'FETEC Vice President: representing 5,000+ students.',
        'Tec Ambassador: representing Campus Guadalajara at institutional events.',
        'Smart Mirror System: 1st place at Expo Ingenierías 2026.',
      ],
      coords: { lat: 20.735, lng: -103.455 },
      labelSide: 'left',
    },
    {
      id: 'bamx',
      short: 'BAMX GDL',
      name: 'Banco de Alimentos (BAMX) Guadalajara',
      area: 'Tlaquepaque',
      summary: 'VoluntApp, the Android app for BAMX Guadalajara’s volunteers.',
      points: [
        'I built the volunteer screens: activity offers, sign-up, QR check-in and profile.',
        'The app manages volunteers, activities, attendance and hours.',
      ],
      coords: { lat: 20.5972, lng: -103.3927 },
      labelSide: 'right',
    },
  ],
};

export const about = {
  question: 'What is a leap of faith?',
  paragraphs: [
    'It’s daring to move forward even when you don’t have the whole path figured out. The bigger the challenge, the more confidence in yourself it takes.',
    'A leap of faith doesn’t mean having all the answers. It means believing enough in what you want to build to take the first step, even when you don’t yet know where it will lead. Some things you simply can’t understand until you decide to live them.',
    'At 17, I had to choose between studying music production and engineering. I chose Computer Technologies Engineering. I still play piano and ukulele, but computing is my passion, and combining both is my dream.',
  ],
};

export const skills = {
  languages: ['Python', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'MATLAB', 'R'],
  tools: ['React', 'Node.js', 'Express', 'Tailwind', 'OpenCV', 'MongoDB', 'MySQL', 'Cisco IOS', 'Linux', 'Git'],
  spoken: 'Spanish (native) · English (C1) · German (B1)',
};
