export const company = {
  name: 'Rayoni',
  founded: '2016',
  location: 'Westonaria, Johannesburg, South Africa',
  phone: null as string | null,
  email: null as string | null,
  address: null as string | null,
  hours: null as string | null,
  whatsapp: null as string | null,
};

export const services = [
  {
    id: 'construction',
    number: '01',
    title: 'Construction & property',
    short: 'Spaces built for what comes next.',
    description:
      'From essential improvements to building works, we bring planning, practical expertise and care to your property.',
    icon: 'building',
    items: [
      'Building',
      'Roofing',
      'Flooring',
      'Plumbing',
      'Painting and paint supply',
      'Electrical wiring',
      'Plastering',
      'Site clearing',
      'Project management',
      'Air-conditioning installation and repairs',
    ],
  },
  {
    id: 'corporate',
    number: '02',
    title: 'General & corporate supply',
    short: 'The essentials that keep business moving.',
    description:
      'Practical procurement support for the everyday needs of your office, organisation and workforce.',
    icon: 'package',
    items: [
      'Stationery',
      'Office equipment',
      'Office furniture',
      'Uniforms',
      'Books and diaries',
      'Pens and branded items',
      'Other general supply requirements',
    ],
  },
  {
    id: 'industrial',
    number: '03',
    title: 'Industrial, mining & technical',
    short: 'Equipping the work that matters.',
    description:
      'Tools, equipment and technical supplies for industrial operations, mining environments and demanding projects.',
    icon: 'factory',
    items: [
      'Hand tools',
      'Mining equipment',
      'Distometers',
      'Valves',
      'Pipes',
      'Lever hoists',
      'Slings',
      'Grinders',
      'Drills',
      'Chain saws',
      'Board signs',
    ],
  },
  {
    id: 'specialist',
    number: '04',
    title: 'Specialist services',
    short: 'The right expertise. A clear way forward.',
    description:
      'Surveying and borehole drilling services to support informed planning and practical site requirements.',
    icon: 'compass',
    items: ['Surveying', 'Borehole drilling'],
  },
  {
    id: 'events',
    number: '05',
    title: 'Events, print & promotions',
    short: 'Make your next impression count.',
    description:
      'Coordinated event essentials, print and promotional materials that help bring your brand and occasion to life.',
    icon: 'printer',
    items: [
      'Printing',
      'Banners',
      'Gift bags',
      'Sound',
      'DJ services',
      'Catering',
      'Cups and promotional items',
    ],
  },
];

export type Project = {
  id: string;
  name: string;
  industry: string;
  location: string;
  service: string;
  description: string;
  images: string[];
  completed: string;
};
// Add verified projects here. Empty data intentionally renders labelled placeholders.
export const projects: Project[] = [];
export const team = [
  {
    name: 'Victor Cunningham',
    role: 'Director & Project Manager',
    initials: 'VC',
    image: null as string | null,
    description:
      'Leading Rayoni’s project planning and delivery, with a focus on practical problem solving and customer satisfaction.',
  },
];
export const credentials: { title: string; description: string; status: string; url?: string }[] = [
  {
    title: 'CIDB registration',
    description: 'Registration number and grading to be confirmed.',
    status: 'Details pending',
  },
  {
    title: 'Company registration',
    description: 'Verified registration information to be supplied.',
    status: 'Details pending',
  },
  {
    title: 'Certificates & compliance',
    description: 'Verified supporting documents will be available here.',
    status: 'Documents pending',
  },
];
