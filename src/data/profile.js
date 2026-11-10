// Everything on the site that isn't layout lives here.
// To add a project, add an object to `projects`; it shows up in its group automatically.
// Projects without `image` show as text-only cards. To add a screenshot later, import it like
// the photos above and set `image` and `imageAlt`. `wide: true` makes a card take a full row.

import smartMirrorTeam from '../assets/smart-mirror-team.webp';
import smartMirrorTeam700 from '../assets/smart-mirror-team-700.webp';
import voluntappCreate from '../assets/voluntapp/1-create.webp';
import voluntappCreateSmall from '../assets/voluntapp/1-create-250.webp';
import voluntappPublish from '../assets/voluntapp/2-publish.webp';
import voluntappPublishSmall from '../assets/voluntapp/2-publish-250.webp';
import voluntappAssign from '../assets/voluntapp/3-assign.webp';
import voluntappAssignSmall from '../assets/voluntapp/3-assign-250.webp';
import voluntappAttendance from '../assets/voluntapp/4-attendance.webp';
import voluntappAttendanceSmall from '../assets/voluntapp/4-attendance-250.webp';
import voluntappFinish from '../assets/voluntapp/5-finish.webp';
import voluntappFinishSmall from '../assets/voluntapp/5-finish-250.webp';

export const contact = {
  email: 'carlosfelipedeanda@gmail.com',
  github: 'https://github.com/carlos-deanda',
  linkedin: 'https://www.linkedin.com/in/carlos-de-anda/',
  resume: '/Carlos_de_Anda_Resume.pdf',
};

// Shown at the top of the hero, so recruiters see it in the first seconds.
// Two parts: one line each on phones, joined with " · " on wider screens.
export const availability = [
  'Seeking a Summer 2027 software engineering internship',
  'Graduating June 2028',
];

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
  // Phones get the 700px copy; wide screens the full 1100px photo.
  imageSrcSet: `${smartMirrorTeam700} 700w, ${smartMirrorTeam} 1100w`,
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
    links: [{ label: 'GitHub', href: 'https://github.com/carlos-deanda/widget-kueski' }],
  },
  {
    group: 'software',
    eyebrow: 'Mobile · Social impact · Fall 2026',
    title: 'VoluntApp',
    description:
      'An Android app for the staff of Banco de Alimentos (BAMX) Guadalajara. They register volunteers, create activities, assign people, take attendance and get hour reports.',
    myPart: 'helped build different parts of the app, including its screens.',
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
    wide: true,
    // Simplified, from the project's real figures. It shows the layers, not the exact topology.
    diagram: {
      label: 'Network layers, from the internet connection down to the users',
      layers: [
        { label: 'WAN', detail: '1.5 Gbps (estimated)' },
        { label: 'Core router', detail: 'Cisco Catalyst C8300' },
        { label: 'Core switch', detail: 'Catalyst C9500' },
        { label: 'Access switches', detail: 'Catalyst C9300 · UPOE / mGig' },
      ],
      vlans: {
        label: '13 VLANs · 172.24.0.0/18 (VLSM)',
        services: ['Wi-Fi', 'IoT', 'Security', 'BMS', 'VoIP'],
      },
      edge: [
        { label: 'Access points', detail: '150+ Wi-Fi 6' },
        { label: 'Users', detail: '3,200+ concurrent' },
      ],
      caption: 'Simplified diagram.',
    },
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
    wide: true,
    links: [{ label: 'GitHub', href: 'https://github.com/Sesgaro/Robert_RoboTec' }],
  },
];

// VoluntApp: the five steps of an activity, shown with the app's real screens (cut from the
// team's final presentation). The data on them is test data. The app is for BAMX staff:
// volunteers do not sign in, the staff registers and assigns them.
export const voluntappFlow = {
  groupLabel: 'VoluntApp: the five steps of an activity, shown with screens from the app',
  caption: 'Real screens from the final app, with test data.',
  stepsLabel: 'Steps of an activity',
  back: 'Back',
  next: 'Next',
  restart: 'Start over',
  steps: [
    {
      label: 'Create',
      title: 'Create the activity',
      text: 'Staff save it as a draft: name, place, capacity and schedule.',
      image: voluntappCreate,
      imageSmall: voluntappCreateSmall,
      alt: 'VoluntApp screen "Nueva actividad": a form with the activity name, place, capacity and schedule.',
    },
    {
      label: 'Publish',
      title: 'Publish it and follow it',
      text: 'Once published it can receive people. The activity page shows its details and its stage: draft, published, attendance or finished.',
      image: voluntappPublish,
      imageSmall: voluntappPublishSmall,
      alt: 'VoluntApp screen of the activity "Colecta en supermercados", with its progress bar from draft to finished, its schedule, place and a "Finalizar asistencia" button.',
    },
    {
      label: 'Assign',
      title: 'Assign volunteers',
      text: 'Staff assign people to the activity. The app does not let the capacity be exceeded or one person be in two activities at the same time.',
      image: voluntappAssign,
      imageSmall: voluntappAssignSmall,
      alt: 'VoluntApp screen "Asignar voluntario": a searchable list of active volunteers, with those already assigned marked.',
    },
    {
      label: 'Attendance',
      title: 'Take attendance',
      text: 'One tap per person: present, late or absent, or everyone present at once. By hand or by scanning the volunteer’s QR card.',
      image: voluntappAttendance,
      imageSmall: voluntappAttendanceSmall,
      alt: 'VoluntApp attendance screen with a Present, Late and Absent choice per volunteer, a scan button and a "Finalizar asistencia" button.',
    },
    {
      label: 'Finish',
      title: 'Finish the activity',
      text: 'When attendance is closed, the hours count in each volunteer’s profile and in the reports.',
      image: voluntappFinish,
      imageSmall: voluntappFinishSmall,
      alt: 'VoluntApp screen of a finished activity: "Asistencia finalizada, 20 h contadas" with the list of volunteers marked present.',
    },
  ],
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
      text: 'An Android app for the staff of Banco de Alimentos (BAMX) Guadalajara. I helped build it; you can see it in Work.',
    },
    {
      name: 'WeCareClub',
      text: 'A student group I co-founded, convinced that we can build a better community through human companionship and social service. Our first visit to a casa hogar was in May 2026.',
    },
    {
      name: 'FETEC',
      text: 'As Vice President, I represent the students of Campus Guadalajara.',
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

// Scroll scene after the work: the story in three beats. `about` keeps only the lines not shown here.
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
        'FETEC Vice President.',
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
      summary: 'VoluntApp, an Android app built for BAMX Guadalajara’s staff to manage volunteers.',
      points: [
        'I helped build different parts of the app, including its screens.',
      ],
      coords: { lat: 20.5972, lng: -103.3927 },
      labelSide: 'right',
    },
  ],
};

// Climax after the "leap of faith" scene: music and engineering mixing (visual first, then sound).
// Tempo, chords and colors live here so they can be changed without touching the components.
export const climax = {
  sectionLabel: 'Music and engineering mixing together',
  line: 'Combining both is my dream.',
  bpm: 124,
  progression: ['F', 'G', 'Em', 'Am'], // one chord per bar
  // "Sunset neon": coral (tint of the wine accent), orange, yellow, aqua. One color per chord.
  // Alternative "Aurora": ['#e8607f', '#8a5cff', '#3da5ff', '#3ef0b0'].
  palette: ['#ff4d6d', '#ff9f1c', '#ffd23f', '#2ec4b6'],
  // Optional sound. It never starts on its own; the button starts it.
  sound: {
    play: 'Play with sound',
    loading: 'Loading sound…',
    mute: 'Mute',
    unmute: 'Unmute',
    hint: 'Optional. Music made in your browser, only if you press play.',
    statusOn: 'Sound on',
    statusMuted: 'Sound muted',
  },
};

export const about = {
  question: 'What is a leap of faith?',
  paragraphs: [
    'It’s daring to move forward even when you don’t have the whole path figured out. The bigger the challenge, the more confidence in yourself it takes.',
    'Some things you simply can’t understand until you decide to live them.',
  ],
};

export const skills = {
  languages: ['Python', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'MATLAB', 'R'],
  tools: ['React', 'Node.js', 'Express', 'Tailwind', 'OpenCV', 'MongoDB', 'MySQL', 'Cisco IOS', 'Linux', 'Git'],
  spoken: 'Spanish (native) · English (C1) · German (B1)',
};
