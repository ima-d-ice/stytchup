const IMG = (name) => `/demo/${name}.jpg`;

export const demoImage = IMG;

export const demoDesigners = [
  {
    id: 'demo-designer-meera',
    name: 'Meera Kapoor',
    email: 'designer@stytchup.com',
    role: 'DESIGNER',
    profile: {
      bio: 'Meera trained in couture tailoring in Delhi and works with a small atelier of six artisans. Her pieces begin with hand-drawn patterns and end with a final fitting — never a ready-made size.',
      avatarUrl: IMG('designer-01'),
      location: 'New Delhi, India',
      website: 'https://stytchup.example/meera',
      skills: ['Couture tailoring', 'Suede', 'Silk', 'Hand embroidery'],
      socialLinks: { instagram: '@meerakapoor.atelier', behance: '' },
    },
  },
  {
    id: 'demo-designer-elias',
    name: 'Elias Moreau',
    email: 'elias@stytchup.com',
    role: 'DESIGNER',
    profile: {
      bio: 'A Paris-based outerwear designer obsessed with structure. Elias cuts wool and leather into quiet, architectural shapes that are made once, for one person.',
      avatarUrl: IMG('designer-02'),
      location: 'Paris, France',
      website: 'https://stytchup.example/elias',
      skills: ['Outerwear', 'Wool', 'Leather', 'Tailoring'],
      socialLinks: { instagram: '@elias.moreau', behance: '' },
    },
  },
  {
    id: 'demo-designer-anika',
    name: 'Anika Rao',
    email: 'anika@stytchup.com',
    role: 'DESIGNER',
    profile: {
      bio: 'Anika works between Bengaluru and Goa, draping linen, silk, and hand-crocheted cotton into pieces that move with the body. Every order is cut to measurement in her studio.',
      avatarUrl: IMG('designer-03'),
      location: 'Bengaluru, India',
      website: 'https://stytchup.example/anika',
      skills: ['Draping', 'Linen', 'Resort', 'Crochet'],
      socialLinks: { instagram: '@anikarao.studio', behance: '' },
    },
  },
  {
    id: 'demo-designer-noah',
    name: 'Noah Bennett',
    email: 'noah@stytchup.com',
    role: 'DESIGNER',
    profile: {
      bio: 'Noah reworks leather, denim, and knitwear from a railway arch in East London. Small runs, repaired seams, and a preference for things that get better with wear.',
      avatarUrl: IMG('designer-04'),
      location: 'London, United Kingdom',
      website: 'https://stytchup.example/noah',
      skills: ['Leather', 'Knitwear', 'Streetwear', 'Repair'],
      socialLinks: { instagram: '@noahbennett', behance: '' },
    },
  },
];

const designerOf = (id) => demoDesigners.find((designer) => designer.id === id);

const designSeeds = [
  {
    id: 'demo-design-01',
    title: 'Sculpted Wool Overcoat',
    description:
      'A double-faced wool overcoat in a clear, cool blue, with a hand-padded shoulder and a single concealed closure. Cut to your measurements, finished with a cupro lining and horn buttons.',
    price: 1899900,
    imageUrl: IMG('design-01'),
    gallery: [IMG('design-01')],
    category: 'Outerwear',
    type: 'CATALOG',
    material: 'Italian double-faced wool, cupro lining',
    sizeGuide: 'Made to measure. Allow 3–4 weeks.',
    designerId: 'demo-designer-elias',
  },
  {
    id: 'demo-design-02',
    title: 'Leather Moto Jacket',
    description:
      'A close-cut moto jacket in vegetable-tanned lambskin, with an asymmetric zip and a softly worn collar. The leather is cut around your shoulders, then finished by hand.',
    price: 1599900,
    imageUrl: IMG('design-02'),
    gallery: [IMG('design-02')],
    category: 'Menswear',
    type: 'CATALOG',
    material: 'Vegetable-tanned lambskin, cotton lining',
    sizeGuide: 'Close fit. Made to measure available.',
    designerId: 'demo-designer-elias',
  },
  {
    id: 'demo-design-03',
    title: 'Heavyweight Cotton Tee',
    description:
      'A clean, weighty tee in organic cotton jersey, with a reinforced ribbed collar and a straight body. The kind of piece that holds its shape after a hundred washes.',
    price: 349900,
    imageUrl: IMG('design-03'),
    gallery: [IMG('design-03')],
    category: 'Menswear',
    type: 'CATALOG',
    material: '260gsm organic cotton jersey',
    sizeGuide: 'Relaxed fit. Made to measure available.',
    designerId: 'demo-designer-noah',
  },
  {
    id: 'demo-design-04',
    title: 'Oversized Suede Jacket',
    description:
      'A private commission: a soft, oversized suede jacket with a drop shoulder and a clean, collarless neckline. Designed with you over a video consultation, then cut in the atelier.',
    price: 2499900,
    imageUrl: IMG('design-04'),
    gallery: [IMG('design-04')],
    category: 'Womenswear',
    type: 'CUSTOM',
    material: 'Italian suede, cupro lining',
    sizeGuide: 'Fully bespoke. 4–6 weeks with one fitting.',
    designerId: 'demo-designer-meera',
  },
  {
    id: 'demo-design-05',
    title: 'Striped Wide-Leg Trouser',
    description:
      'A high-rise trouser with a single forward pleat and a clean, floor-skimming line. Cut in a dry-handle wool blend that holds its shape and falls straight from the hip.',
    price: 1099900,
    imageUrl: IMG('design-05'),
    gallery: [IMG('design-05')],
    category: 'Womenswear',
    type: 'CATALOG',
    material: 'Wool-blend suiting',
    sizeGuide: 'Made to measure. Inseam adjusted to your height.',
    designerId: 'demo-designer-anika',
  },
  {
    id: 'demo-design-06',
    title: 'Vintage Leather Biker',
    description:
      'A boxy biker built from repurposed lambskin, with an exposed zip, snap-down lapels, and a cotton twill lining. No two jackets are the same.',
    price: 1499900,
    imageUrl: IMG('design-06'),
    gallery: [IMG('design-06')],
    category: 'Menswear',
    type: 'CATALOG',
    material: 'Repurposed lambskin, cotton twill',
    sizeGuide: 'Boxy fit. Made to measure available.',
    designerId: 'demo-designer-noah',
  },
  {
    id: 'demo-design-07',
    title: 'Open-Knit Poncho',
    description:
      'A weightless poncho hand-crocheted in undyed organic cotton, with a deep V and a soft fringe. It layers over everything and folds into nothing.',
    price: 899900,
    imageUrl: IMG('design-07'),
    gallery: [IMG('design-07')],
    category: 'Womenswear',
    type: 'CATALOG',
    material: 'Hand-crocheted organic cotton',
    sizeGuide: 'One size, made to measure on request.',
    designerId: 'demo-designer-anika',
  },
  {
    id: 'demo-design-08',
    title: 'Hand-Crocheted Bralette',
    description:
      'A made-to-order crochet bralette in forest green cotton, with adjustable ties and a soft, unlined cup. Designed for resort dressing and made to your measurements.',
    price: 799900,
    imageUrl: IMG('design-08'),
    gallery: [IMG('design-08')],
    category: 'Resort',
    type: 'CUSTOM',
    material: 'Hand-crocheted cotton',
    sizeGuide: 'Made to measure. 2–3 weeks.',
    designerId: 'demo-designer-anika',
  },
  {
    id: 'demo-design-09',
    title: 'Cropped Bomber Jacket',
    description:
      'A short, clean bomber in a dry technical cotton, with a ribbed collar and a single zip. Cut just below the waist and finished with a soft, washed hand.',
    price: 999900,
    imageUrl: IMG('design-09'),
    gallery: [IMG('design-09')],
    category: 'Menswear',
    type: 'CATALOG',
    material: 'Technical cotton twill',
    sizeGuide: 'Regular fit. Made to measure available.',
    designerId: 'demo-designer-noah',
  },
  {
    id: 'demo-design-10',
    title: 'Sheer Silk Blouse',
    description:
      'A bias-cut blouse in black silk chiffon, with a soft neckline and a sleeve that skims the wrist. Designed with you, then cut and finished in the atelier.',
    price: 1299900,
    imageUrl: IMG('design-10'),
    gallery: [IMG('design-10')],
    category: 'Womenswear',
    type: 'CUSTOM',
    material: 'Silk chiffon, hand-finished seams',
    sizeGuide: 'Bespoke commission. 3–4 weeks.',
    designerId: 'demo-designer-meera',
  },
];

export const demoDesigns = designSeeds.map((design) => ({
  ...design,
  designer: designerOf(design.designerId),
}));

export const demoCategories = [...new Set(demoDesigns.map((design) => design.category))].sort();

export function getDemoDesign(id) {
  return demoDesigns.find((design) => design.id === id) || null;
}

export function getDemoDesigner(id) {
  const designer = demoDesigners.find((entry) => entry.id === id);
  if (!designer) return null;
  return {
    ...designer,
    designs: demoDesigns.filter((design) => design.designerId === designer.id),
  };
}

const customer = {
  id: 'demo-customer-aarav',
  name: 'Aarav Mehta',
  email: 'customer@stytchup.com',
  role: 'CUSTOMER',
};

const customerProfile = {
  bio: 'Collector of quiet clothes and good tailoring.',
  avatarUrl: IMG('customer'),
  location: 'Mumbai, India',
  website: '',
  skills: [],
  socialLinks: { instagram: '' },
};

const meera = demoDesigners[0];

export const demoAccounts = {
  customer: {
    password: 'customer1234',
    user: customer,
    profile: customerProfile,
  },
  designer: {
    password: 'designer1234',
    user: {
      id: meera.id,
      name: meera.name,
      email: meera.email,
      role: 'DESIGNER',
    },
    profile: meera.profile,
  },
  admin: {
    password: 'admin1234',
    user: {
      id: 'demo-admin-imad',
      name: 'Imad Siddiqui',
      email: 'admin@stytchup.com',
      role: 'ADMIN',
    },
    profile: {
      bio: 'Studio operations.',
      avatarUrl: IMG('designer-02'),
      location: 'Bengaluru, India',
      website: '',
      skills: [],
      socialLinks: {},
    },
  },
};

export const demoCustomerOrders = [
  {
    id: 'demo-order-1001',
    status: 'IN_PROGRESS',
    totalAmount: 1899900,
    createdAt: '2026-10-18T10:00:00.000Z',
    designId: 'demo-design-01',
    designSnapshot: {
      title: 'Sculpted Wool Overcoat',
      image: IMG('design-01'),
      price: 1899900,
    },
    design: { title: 'Sculpted Wool Overcoat', imageUrl: IMG('design-01'), type: 'CATALOG' },
    buyer: { name: 'Aarav Mehta', email: 'customer@stytchup.com' },
    customerMeasurements: {
      chest: '96',
      waist: '78',
      hips: '99',
      height: '178',
      unit: 'cm',
      notes: 'Prefer a slightly longer sleeve.',
    },
    shippingCarrier: null,
    trackingNumber: null,
  },
  {
    id: 'demo-order-1002',
    status: 'SHIPPED',
    totalAmount: 999900,
    createdAt: '2026-10-06T09:30:00.000Z',
    designId: 'demo-design-09',
    designSnapshot: {
      title: 'Cropped Bomber Jacket',
      image: IMG('design-09'),
      price: 999900,
    },
    design: { title: 'Cropped Bomber Jacket', imageUrl: IMG('design-09'), type: 'CATALOG' },
    buyer: { name: 'Aarav Mehta', email: 'customer@stytchup.com' },
    customerMeasurements: {
      chest: '96',
      waist: '78',
      hips: '99',
      height: '178',
      unit: 'cm',
      notes: '',
    },
    shippingCarrier: 'Blue Dart',
    trackingNumber: 'BD-4471-2098',
  },
  {
    id: 'demo-order-1003',
    status: 'COMPLETED',
    totalAmount: 1099900,
    createdAt: '2026-08-22T12:00:00.000Z',
    designId: 'demo-design-05',
    designSnapshot: {
      title: 'Striped Wide-Leg Trouser',
      image: IMG('design-05'),
      price: 1099900,
    },
    design: { title: 'Striped Wide-Leg Trouser', imageUrl: IMG('design-05'), type: 'CATALOG' },
    buyer: { name: 'Aarav Mehta', email: 'customer@stytchup.com' },
    customerMeasurements: {
      chest: '96',
      waist: '78',
      hips: '99',
      height: '178',
      unit: 'cm',
      notes: '',
    },
    shippingCarrier: 'Delhivery',
    trackingNumber: 'DL-9981-4410',
  },
];

export const demoDesignerOrders = [
  {
    id: 'demo-order-2001',
    status: 'AWAITING_REQUIREMENTS',
    totalAmount: 2499900,
    createdAt: '2026-10-21T08:00:00.000Z',
    designId: 'demo-design-04',
    designSnapshot: {
      title: 'Oversized Suede Jacket',
      image: IMG('design-04'),
      price: 2499900,
    },
    design: { title: 'Oversized Suede Jacket', imageUrl: IMG('design-04') },
    buyer: {
      name: 'Aarav Mehta',
      email: 'customer@stytchup.com',
      profile: { avatarUrl: IMG('customer') },
    },
    customerMeasurements: null,
    shippingCarrier: null,
    trackingNumber: null,
  },
  {
    id: 'demo-order-2002',
    status: 'IN_PROGRESS',
    totalAmount: 1299900,
    createdAt: '2026-10-18T10:00:00.000Z',
    designId: 'demo-design-10',
    designSnapshot: {
      title: 'Sheer Silk Blouse',
      image: IMG('design-10'),
      price: 1299900,
    },
    design: { title: 'Sheer Silk Blouse', imageUrl: IMG('design-10') },
    buyer: {
      name: 'Aarav Mehta',
      email: 'customer@stytchup.com',
      profile: { avatarUrl: IMG('customer') },
    },
    customerMeasurements: {
      chest: '96',
      waist: '78',
      hips: '99',
      height: '178',
      unit: 'cm',
      notes: 'Prefer a slightly longer sleeve.',
    },
    shippingCarrier: null,
    trackingNumber: null,
  },
  {
    id: 'demo-order-2003',
    status: 'SHIPPED',
    totalAmount: 799900,
    createdAt: '2026-09-30T13:15:00.000Z',
    designId: 'demo-design-08',
    designSnapshot: {
      title: 'Hand-Crocheted Bralette',
      image: IMG('design-08'),
      price: 799900,
    },
    design: { title: 'Hand-Crocheted Bralette', imageUrl: IMG('design-08') },
    buyer: {
      name: 'Nina Shah',
      email: 'nina@example.com',
      profile: { avatarUrl: IMG('designer-03') },
    },
    customerMeasurements: {
      chest: '88',
      waist: '70',
      hips: '94',
      height: '165',
      unit: 'cm',
      notes: '',
    },
    shippingCarrier: 'Delhivery',
    trackingNumber: 'DL-2204-8812',
  },
];

export const demoConversations = [
  {
    id: 'demo-conversation-1',
    updatedAt: '2026-10-21T09:42:00.000Z',
    user1: {
      id: customer.id,
      name: customer.name,
      profile: { avatarUrl: customerProfile.avatarUrl },
    },
    user2: {
      id: meera.id,
      name: meera.name,
      profile: { avatarUrl: meera.profile.avatarUrl },
    },
    messages: [
      {
        id: 'demo-message-4',
        senderId: meera.id,
        isOffer: true,
        offerTitle: 'Bespoke silk blouse, higher neckline',
        offerPrice: 1299900,
        offerStatus: 'PENDING',
        createdAt: '2026-10-21T09:42:00.000Z',
      },
    ],
  },
];

export const demoMessages = [
  {
    id: 'demo-message-1',
    senderId: customer.id,
    text: 'Hi Meera — I saw the sheer silk blouse. Could we make a version with a higher neckline?',
    createdAt: '2026-10-20T14:10:00.000Z',
  },
  {
    id: 'demo-message-2',
    senderId: meera.id,
    text: 'Of course. I would keep the bias cut and soften the sleeve. Are you thinking black or ivory?',
    createdAt: '2026-10-20T14:18:00.000Z',
  },
  {
    id: 'demo-message-3',
    senderId: customer.id,
    text: 'Black. The wedding is in February — is that enough time?',
    createdAt: '2026-10-20T14:22:00.000Z',
  },
  {
    id: 'demo-message-4',
    senderId: meera.id,
    isOffer: true,
    offerTitle: 'Bespoke silk blouse, higher neckline',
    offerPrice: 1299900,
    offerStatus: 'PENDING',
    createdAt: '2026-10-21T09:40:00.000Z',
  },
];

export const demoAdminData = {
  orders: demoCustomerOrders,
  users: [
    customer,
    ...demoDesigners.map(({ id, name, email, role }) => ({ id, name, email, role })),
    demoAccounts.admin.user,
  ],
  designs: demoDesigns.map((design) => ({
    ...design,
    isActive: true,
    designer: { email: design.designer?.email },
  })),
};

export function getDemoAccountByEmail(email) {
  return Object.values(demoAccounts).find(
    (account) => account.user.email.toLowerCase() === String(email || '').toLowerCase()
  );
}

export function getDemoAccountByToken(token) {
  const role = String(token || '').replace('demo-token-', '').toLowerCase();
  return demoAccounts[role] || demoAccounts.customer;
}
