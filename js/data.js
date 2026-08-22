/**
 * Quad Find — Seed Data and Campus Definitions
 * Realistic mock data ready for hackathon presentation and live testing.
 */

export const CAMPUS_LOCATIONS = [
  { id: 'library', name: 'Main Campus Library', zone: 'Central Quad', lat: 37.4275, lng: -122.1697, floors: ['1st Floor Lobby & Cafe', '2nd Floor Quiet Study', '3rd Floor Stacks', 'Basement Media Lab'] },
  { id: 'science_quad', name: 'Science & Engineering Atrium', zone: 'North Campus', lat: 37.4290, lng: -122.1710, floors: ['Ground Floor Cafe', '1st Floor MakerSpace', '2nd Floor Labs', '3rd Floor Lecture Halls'] },
  { id: 'student_union', name: 'Student Union & Dining Hall', zone: 'Central Quad', lat: 37.4265, lng: -122.1680, floors: ['Food Court (Ground)', '1st Floor Info Desk & Lounge', '2nd Floor Club Rooms', 'Bookstore'] },
  { id: 'rec_center', name: 'Recreation & Fitness Center', zone: 'South Campus', lat: 37.4240, lng: -122.1720, floors: ['Weight Room', 'Basketball Courts', 'Locker Rooms', 'Cardio Deck'] },
  { id: 'engineering_hall', name: 'Gates Engineering Hall', zone: 'North Campus', lat: 37.4298, lng: -122.1735, floors: ['Auditorium Hallway', 'Computer Lab 102', 'Robotics Wing'] },
  { id: 'quad_lawns', name: 'Memorial Quad Lawns & Courtyard', zone: 'Central Quad', lat: 37.4270, lng: -122.1690, floors: ['Main Lawn Benches', 'North Arcade', 'Memorial Church Steps'] },
  { id: 'parking_structure', name: 'North Campus Parking Structure', zone: 'North Campus', lat: 37.4315, lng: -122.1705, floors: ['Level 1 Visitor', 'Level 2 Permit A', 'Level 3 Rooftop'] }
];

export const SAFE_EXCHANGE_HUBS = [
  { id: 'police_desk', name: 'Campus Safety & Police Department', location: 'Public Safety Building (24/7 Monitored)', verified: true },
  { id: 'library_desk', name: 'Main Library Circulation Desk', location: 'Library 1st Floor Entry (8am - 10pm)', verified: true },
  { id: 'student_union_info', name: 'Student Union Information Hub', location: 'Student Union Main Lobby (8am - 8pm)', verified: true },
  { id: 'rec_front_desk', name: 'Rec Center Welcome Desk', location: 'Recreation Center Entrance', verified: true }
];

export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics & Gadgets', icon: 'laptop', color: 'indigo' },
  { id: 'wallets_cards', name: 'Wallets, IDs & Cards', icon: 'credit-card', color: 'blue' },
  { id: 'keys', name: 'Keys & Keychains', icon: 'key', color: 'amber' },
  { id: 'bags', name: 'Bags & Backpacks', icon: 'shopping-bag', color: 'purple' },
  { id: 'apparel', name: 'Clothing & Apparel', icon: 'shirt', color: 'rose' },
  { id: 'bottles_accessories', name: 'Bottles & Accessories', icon: 'coffee', color: 'emerald' },
  { id: 'books_stationery', name: 'Books & Supplies', icon: 'book-open', color: 'cyan' },
  { id: 'other', name: 'Other Items', icon: 'tag', color: 'slate' }
];

// Helper to calculate relative timestamps
const now = new Date();
const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d, h = 0) => new Date(now.getTime() - (d * 24 + h) * 60 * 60 * 1000).toISOString();

export const INITIAL_ITEMS = [
  // Pair 1: AirPods Pro (Very High Match: ~94%)
  {
    id: 'item-1',
    type: 'lost',
    title: 'Apple AirPods Pro (2nd Gen) with Green Clip',
    category: 'electronics',
    brand: 'Apple',
    primaryColor: 'White',
    description: 'Lost my AirPods Pro 2 in a white charging case. Has a small metallic green carabiner clip attached and a tiny scuff near the right speaker.',
    tags: ['airpods', 'apple', 'headphones', 'white', 'case', 'carabiner'],
    locationId: 'library',
    locationDetail: '2nd Floor Quiet Study Area, Desk #14 near east window',
    dateTime: hoursAgo(3.5),
    photo: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    contactName: 'Alex Rivera',
    contactEmail: 'alex.rivera@campus.edu',
    contactPhone: '(555) 234-8901',
    reward: '$20 Finder Reward',
    status: 'open',
    views: 42
  },
  {
    id: 'item-2',
    type: 'found',
    title: 'White Apple AirPods Charging Case with Carabiner',
    category: 'electronics',
    brand: 'Apple',
    primaryColor: 'White',
    description: 'Found an Apple AirPods Pro case on the wooden desk table in the quiet section. Has a green ring clip on it. Turned into the staff desk or can hand over.',
    tags: ['airpods', 'apple', 'earbuds', 'white', 'green clip', 'study desk'],
    locationId: 'library',
    locationDetail: '2nd Floor Quiet Reading Section',
    dateTime: hoursAgo(1.5),
    photo: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=80',
    contactName: 'Jordan Chen (Library Staff)',
    contactEmail: 'jordan.c@campus.edu',
    contactPhone: '(555) 789-0123',
    status: 'open',
    views: 31
  },

  // Pair 2: Matte Black Hydro Flask (Very High Match: ~95%)
  {
    id: 'item-3',
    type: 'lost',
    title: 'Matte Black Hydro Flask 32oz with Yosemite Sticker',
    category: 'bottles_accessories',
    brand: 'Hydro Flask',
    primaryColor: 'Black',
    description: 'Lost my 32oz wide mouth black Hydro Flask water bottle. Has a colorful Yosemite National Park sticker and a small dent on the bottom rim.',
    tags: ['hydro flask', 'water bottle', 'black', 'yosemite', 'stickers'],
    locationId: 'rec_center',
    locationDetail: 'Cardio Deck near treadmill #8',
    dateTime: hoursAgo(5),
    photo: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    contactName: 'Samira Patel',
    contactEmail: 'samira.p@campus.edu',
    contactPhone: '(555) 456-1122',
    status: 'open',
    views: 19
  },
  {
    id: 'item-4',
    type: 'found',
    title: 'Black Insulated Flask Bottle with Outdoor Stickers',
    category: 'bottles_accessories',
    brand: 'Hydro Flask',
    primaryColor: 'Black',
    description: 'Found a black metal water bottle left behind by the cardio machines. Has national park stickers on the side and a slight dent.',
    tags: ['bottle', 'flask', 'black', 'stickers', 'gym', 'metal'],
    locationId: 'rec_center',
    locationDetail: 'Rec Center Cardio Area / Front Lost Bin',
    dateTime: hoursAgo(4),
    photo: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80',
    contactName: 'Marcus Wright (Gym Attendant)',
    contactEmail: 'marcus.w@campus.edu',
    contactPhone: '(555) 901-4433',
    status: 'open',
    views: 24
  },

  // Pair 3: 14" Space Grey MacBook Pro (High Match: ~92%)
  {
    id: 'item-5',
    type: 'lost',
    title: 'Apple MacBook Pro 14" Space Grey (M2 Pro)',
    category: 'electronics',
    brand: 'Apple',
    primaryColor: 'Grey',
    description: 'Left my 14-inch Space Grey MacBook Pro on a round couch table. It has a black matte protective hardshell with an Octocat GitHub sticker on the top lid.',
    tags: ['macbook', 'laptop', 'apple', 'space grey', 'github sticker'],
    locationId: 'science_quad',
    locationDetail: 'Ground Floor Atrium lounge area near the coffee bar',
    dateTime: daysAgo(1, 2),
    photo: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    contactName: 'David Kim',
    contactEmail: 'dkim99@campus.edu',
    contactPhone: '(555) 678-3344',
    reward: '$50 Finder Reward',
    status: 'open',
    views: 89
  },
  {
    id: 'item-6',
    type: 'found',
    title: '14-inch Space Grey Apple Laptop with Stickers',
    category: 'electronics',
    brand: 'Apple',
    primaryColor: 'Grey',
    description: 'Found a Space Grey MacBook in a dark shell casing with developer stickers. Found on the sofas near the Science Atrium cafe.',
    tags: ['macbook', 'laptop', 'grey', 'apple', 'stickers', 'atrium'],
    locationId: 'science_quad',
    locationDetail: 'Science & Engineering Atrium Info Desk',
    dateTime: daysAgo(1, 0.5),
    photo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    contactName: 'Prof. Helen Vance',
    contactEmail: 'hvance@campus.edu',
    contactPhone: '(555) 321-7788',
    status: 'open',
    views: 65
  },

  // Pair 4: Leather Bellroy Wallet (High Match: ~89%)
  {
    id: 'item-7',
    type: 'lost',
    title: 'Brown Leather Bellroy Slim Wallet with Student ID',
    category: 'wallets_cards',
    brand: 'Bellroy',
    primaryColor: 'Brown',
    description: 'Lost my brown bifold leather wallet containing my Campus Student Card (Tyler Brooks), driver license, and blue transit pass.',
    tags: ['wallet', 'leather', 'brown', 'bellroy', 'id card', 'cards'],
    locationId: 'student_union',
    locationDetail: 'Dining Hall food court seating near Mexican Grill',
    dateTime: daysAgo(2, 3),
    photo: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    contactName: 'Tyler Brooks',
    contactEmail: 'tbrooks@campus.edu',
    contactPhone: '(555) 888-2910',
    status: 'open',
    views: 38
  },
  {
    id: 'item-8',
    type: 'found',
    title: 'Brown Mens Leather Wallet with Cards & ID',
    category: 'wallets_cards',
    brand: 'Bellroy',
    primaryColor: 'Brown',
    description: 'Found a brown slim leather wallet on a dining chair. Has student cards and ID inside. Kept safe at Student Union Info Desk.',
    tags: ['wallet', 'brown', 'leather', 'student id', 'cards'],
    locationId: 'student_union',
    locationDetail: 'Student Union 1st Floor Info Desk',
    dateTime: daysAgo(2, 1),
    photo: 'https://images.unsplash.com/photo-1606503829057-0130e9d690a2?auto=format&fit=crop&w=800&q=80',
    contactName: 'Student Union Staff',
    contactEmail: 'union-frontdesk@campus.edu',
    contactPhone: '(555) 000-1122',
    status: 'open',
    views: 45
  },

  // Pair 5: North Face Backpack (Moderate Match: ~78%)
  {
    id: 'item-9',
    type: 'lost',
    title: 'Black North Face Borealis Backpack with Water Bottle Pocket',
    category: 'bags',
    brand: 'The North Face',
    primaryColor: 'Black',
    description: 'Left my black backpack with bungee cords on front in the Memorial Quad. Contains spiral notebooks and stationery.',
    tags: ['backpack', 'north face', 'black', 'bag', 'notebooks'],
    locationId: 'quad_lawns',
    locationDetail: 'Bench near North Arcade pillars',
    dateTime: daysAgo(1, 4),
    photo: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    contactName: 'Chloe Davis',
    contactEmail: 'cdavis@campus.edu',
    contactPhone: '(555) 345-6789',
    status: 'open',
    views: 29
  },
  {
    id: 'item-10',
    type: 'found',
    title: 'Black School Backpack with Elastic Cords',
    category: 'bags',
    brand: 'The North Face',
    primaryColor: 'Black',
    description: 'Found a black outdoor backpack on a courtyard bench. Contains college notebooks and pencil pouch.',
    tags: ['backpack', 'black', 'bag', 'quad', 'bungee'],
    locationId: 'quad_lawns',
    locationDetail: 'Courtyard Benches / Library Lost Desk',
    dateTime: daysAgo(1, 2),
    photo: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80',
    contactName: 'Campus Security',
    contactEmail: 'security@campus.edu',
    contactPhone: '(555) 123-4567',
    status: 'open',
    views: 33
  },

  // Single Item: Toyota Keys
  {
    id: 'item-11',
    type: 'lost',
    title: 'Toyota Smart Car Key Fob on Red Climbing Lanyard',
    category: 'keys',
    brand: 'Toyota',
    primaryColor: 'Black',
    description: 'Lost a black Toyota key fob with two silver house keys attached to a red woven nylon lanyard.',
    tags: ['keys', 'toyota', 'fob', 'car keys', 'red lanyard'],
    locationId: 'parking_structure',
    locationDetail: 'Level 2 near North Stairwell exit',
    dateTime: daysAgo(3),
    photo: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    contactName: 'Maya Lin',
    contactEmail: 'mlin@campus.edu',
    contactPhone: '(555) 998-3311',
    status: 'open',
    views: 15
  },

  // Resolved Item Pair: Navy Patagonia Fleece
  {
    id: 'item-12',
    type: 'lost',
    title: 'Navy Blue Patagonia Synchilla Fleece Snap-T (Size M)',
    category: 'apparel',
    brand: 'Patagonia',
    primaryColor: 'Blue',
    description: 'Navy blue pullover fleece with red trim on the chest pocket. Left behind on the bench in the engineering hallway.',
    tags: ['fleece', 'patagonia', 'jacket', 'navy', 'blue', 'sweater'],
    locationId: 'engineering_hall',
    locationDetail: 'Ground floor benches outside Room 104',
    dateTime: daysAgo(4),
    photo: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    contactName: 'Lucas Grey',
    contactEmail: 'lgrey@campus.edu',
    contactPhone: '(555) 443-2211',
    status: 'resolved',
    resolvedWithId: 'item-13',
    resolvedAt: daysAgo(3, 12),
    views: 52
  },
  {
    id: 'item-13',
    type: 'found',
    title: 'Patagonia Navy Blue Pullover Jacket',
    category: 'apparel',
    brand: 'Patagonia',
    primaryColor: 'Blue',
    description: 'Found a medium size navy Patagonia fleece jacket draped over the bench near Engineering lecture hall.',
    tags: ['fleece', 'patagonia', 'navy', 'apparel', 'bench'],
    locationId: 'engineering_hall',
    locationDetail: 'Engineering Hall Info Counter',
    dateTime: daysAgo(4, 2),
    photo: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    contactName: 'Building Security',
    contactEmail: 'eng-sec@campus.edu',
    contactPhone: '(555) 222-3344',
    status: 'resolved',
    resolvedWithId: 'item-12',
    resolvedAt: daysAgo(3, 12),
    views: 48
  }
];

// Presets for quick 1-click test reporting in demo
export const DEMO_PRESETS = [
  {
    title: 'Apple AirPods Pro 2 with Teal Silicon Case',
    type: 'lost',
    category: 'electronics',
    brand: 'Apple',
    primaryColor: 'White',
    description: 'Lost my AirPods Pro 2 in a soft teal silicone cover with a silver carabiner. Left somewhere in the Main Library quiet floor.',
    locationId: 'library',
    locationDetail: '2nd Floor Quiet Study Tables',
    photo: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    tags: ['airpods', 'apple', 'headphones', 'teal', 'white']
  },
  {
    title: 'Space Grey MacBook Pro 14" with Tech Stickers',
    type: 'lost',
    category: 'electronics',
    brand: 'Apple',
    primaryColor: 'Grey',
    description: 'Left my M2 MacBook Pro on a sofa table in the Science Atrium lounge while working on homework.',
    locationId: 'science_quad',
    locationDetail: 'Ground Floor Atrium Cafe area',
    photo: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    tags: ['macbook', 'laptop', 'apple', 'space grey', 'stickers']
  },
  {
    title: 'Matte Black Hydro Flask 32oz with Yosemite Decal',
    type: 'lost',
    category: 'bottles_accessories',
    brand: 'Hydro Flask',
    primaryColor: 'Black',
    description: 'Black insulated Hydro Flask water bottle with colorful outdoor stickers and a dented base.',
    locationId: 'rec_center',
    locationDetail: 'Near treadmill row in gym',
    photo: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    tags: ['hydro flask', 'water bottle', 'black', 'yosemite']
  },
  {
    title: 'Brown Leather Bellroy Bifold Wallet',
    type: 'found',
    category: 'wallets_cards',
    brand: 'Bellroy',
    primaryColor: 'Brown',
    description: 'Found a brown slim leather wallet on dining chair with student card and ID inside.',
    locationId: 'student_union',
    locationDetail: 'Student Union Food Court',
    photo: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    tags: ['wallet', 'leather', 'brown', 'bellroy', 'cards']
  },
  {
    title: 'North Face Black Daypack with Bungee Net',
    type: 'lost',
    category: 'bags',
    brand: 'The North Face',
    primaryColor: 'Black',
    description: 'Black backpack with laptop sleeve and water bottle pocket. Left on courtyard bench.',
    locationId: 'quad_lawns',
    locationDetail: 'Main Memorial Quad grassy lawn bench',
    photo: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    tags: ['backpack', 'north face', 'black', 'bag']
  }
];
