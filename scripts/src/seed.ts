import { Client } from 'pg'

const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

const sampleProducts = [
  // ── GAMES ─────────────────────────────────────────────────────────────
  {
    slug: 'astro-bot',
    name: 'Astro Bot',
    type: 'game',
    shortDescription: 'Join ASTRO in a brand-new supersized space adventure across 50+ diverse planets packed with iconic PlayStation cameos.',
    description: 'The PS5 mothership has been wrecked, leaving ASTRO and the bot crew scattered across galaxies. Ride your trusty DualSpeeder across more than 50 planets full of fun, danger, and surprises. On your journey, make the most of ASTRO new powers and reunite with dozens of iconic heroes from the PlayStation universe!',
    brand: 'Sony Interactive Entertainment',
    platform: 'PlayStation 5',
    category: 'Platformer',
    imageUrl: '/covers/astro-bot.jpg',
    galleryImages: ['/covers/astro-bot.jpg', '/banner-games-1.jpg'],
    tags: ['Exclusive', 'Platformer', 'Family', 'GOTY 2024'],
    features: [
      'Over 50 vibrant galaxies featuring volcanic planets, lush jungles, and cosmic void zones',
      '15+ new abilities taking full advantage of the DualSense adaptive triggers and haptics',
      'Rescue over 300 VIP bots styled as legendary PlayStation characters',
      'Flawless native 4K presentation running locked at 60 frames per second',
      'Tempest 3D Audio immersion lets you hear every rustle, splash, and robotic footstep',
    ],
    specs: {
      Platform: 'PlayStation 5 (PS5 Pro Enhanced)',
      Resolution: 'Dynamic 4K @ 60 FPS',
      'DualSense Support': 'Full Haptic Feedback & Adaptive Triggers',
      Audio: 'Tempest 3D AudioTech Supported',
      Storage: '66 GB Ultra-Fast SSD',
    },
    rating: 4.98,
    reviewCount: 4150,
    status: 'active',
    featured: true,
    sortOrder: 1,
    variants: [
      {
        title: 'Standard Edition',
        sku: 'GAME-ASTRO-STD',
        price: 599900, // ৳5,999
        compareAtPrice: 650000,
        stockQuantity: 25,
      },
      {
        title: 'Digital Deluxe Edition',
        sku: 'GAME-ASTRO-DLX',
        price: 699900, // ৳6,999
        compareAtPrice: 750000,
        stockQuantity: 15,
      },
    ],
  },
  {
    slug: 'elden-ring',
    name: 'Elden Ring: Shadow of the Erdtree',
    type: 'game',
    shortDescription: 'Guided by Empyrean Miquella, players are summoned to the Land of Shadow, a place obscured by the Erdtree where the goddess Marika first set foot.',
    description: 'Winner of hundreds of accolades including The Game Awards Game of the Year and Golden Joystick Awards Ultimate Game of the Year, Elden Ring is the acclaimed action-RPG epic set in a vast, dark fantasy world. The Shadow of the Erdtree expansion adds a completely new land, formidable bosses, weapons, and arcane mysteries.',
    brand: 'Bandai Namco',
    platform: 'PC / PS5 / Xbox',
    category: 'Action RPG',
    imageUrl: '/covers/elden-ring.jpg',
    galleryImages: ['/covers/elden-ring.jpg', '/banner-elden-ring.jpg'],
    tags: ['Soulsborne', 'Open World', 'Dark Fantasy', 'Masterpiece'],
    features: [
      'A new story uncovering the dark history of Queen Marika and Miquella the Kind',
      'Over 10 brand-new weapon categories with fresh movesets and sorceries',
      'Staggering, challenging boss encounters tuned for veteran players',
      'Vast interconnected map filled with treacherous dungeons and forgotten ruins',
    ],
    specs: {
      Platforms: 'PS5, Xbox Series X|S, PC Windows',
      Resolution: '4K with High Frame Rate Performance Mode',
      Multiplayer: '1-4 Online Co-op and PvP Invasions',
      Developer: 'FromSoftware Inc.',
    },
    rating: 4.96,
    reviewCount: 9800,
    status: 'active',
    featured: true,
    sortOrder: 2,
    variants: [
      {
        title: 'Standard Edition',
        sku: 'GAME-ELDEN-STD',
        price: 499900, // ৳4,999
        compareAtPrice: 550000,
        stockQuantity: 30,
      },
      {
        title: 'Collector Edition',
        sku: 'GAME-ELDEN-COL',
        price: 949900, // ৳9,499
        compareAtPrice: 1050000,
        stockQuantity: 8,
      },
    ],
  },
  {
    slug: 'cyberpunk',
    name: 'Cyberpunk 2077: Phantom Liberty',
    type: 'game',
    shortDescription: 'Freedom Always Comes At A Price. As cyber-enhanced mercenary V, dive deep into the treacherous district of Dogtown in an espionage-thriller expansion.',
    description: 'Phantom Liberty is a spy-thriller adventure for Cyberpunk 2077. When the orbital shuttle of the President of the New United States of America is shot down over the deadliest district of Night City, there is only one person who can save her — you. Become V, a cyberpunk for hire, and dive deep into a tangled web of espionage and political intrigue.',
    brand: 'CD Projekt Red',
    platform: 'PC / PS5 / Xbox',
    category: 'Open World RPG',
    imageUrl: '/covers/cyberpunk.jpg',
    galleryImages: ['/covers/cyberpunk.jpg'],
    tags: ['Sci-Fi', 'Ray Tracing', 'Story Rich', 'Open World'],
    features: [
      'Starring Idris Elba as veteran secret agent Solomon Reed',
      'Completely overhauled perk tree, vehicle combat, and dynamic police system',
      'Unforgiving new combat zone Dogtown ruled by trigger-happy militia',
      'Multiple gripping story endings with deep consequences for Night City',
    ],
    specs: {
      Platforms: 'PS5, Xbox Series X, PC',
      Graphics: 'Full Path Tracing (Ray Tracing Overdrive) supported',
      Audio: 'Dolby Atmos & Spatial 3D Audio',
      Storage: '70 GB High Speed NVMe SSD',
    },
    rating: 4.88,
    reviewCount: 6200,
    status: 'active',
    featured: true,
    sortOrder: 3,
    variants: [
      {
        title: 'Ultimate Edition',
        sku: 'GAME-CYBER-ULT',
        price: 449900, // ৳4,499
        compareAtPrice: 520000,
        stockQuantity: 20,
      },
    ],
  },
  {
    slug: 'wukong',
    name: 'Black Myth: Wukong',
    type: 'game',
    shortDescription: 'An action RPG rooted in Chinese mythology. You shall set out as the Destined One to venture into the challenges and marvels ahead.',
    description: 'Black Myth: Wukong is an action RPG rooted in Chinese mythology. The story is based on Journey to the West, one of the Four Great Classical Novels of Chinese literature. You shall set out as the Destined One to venture into the challenges and marvels ahead, to uncover the obscured truth beneath the veil of a glorious legend from the past.',
    brand: 'Game Science',
    platform: 'PC / PS5',
    category: 'Action RPG',
    imageUrl: '/covers/wukong.jpg',
    galleryImages: ['/covers/wukong.jpg'],
    tags: ['Mythology', 'Action', 'Souls-like', 'Unreal Engine 5'],
    features: [
      'Breathtaking Unreal Engine 5 visuals bringing ancient folklore to life',
      'Master the staff techniques and transform into defeated beasts',
      'Dozens of cinematic multi-phase boss battles with intense choreography',
      'Rich exploration with hidden spells, vessels, and secret regions',
    ],
    specs: {
      Platforms: 'PlayStation 5, PC Windows',
      Engine: 'Unreal Engine 5 with Nanite and Lumen',
      Language: 'Original Mandarin voiceover with English subtitles',
      Storage: '130 GB SSD Required',
    },
    rating: 4.94,
    reviewCount: 11400,
    status: 'active',
    featured: true,
    sortOrder: 4,
    variants: [
      {
        title: 'Standard Edition',
        sku: 'GAME-WUKONG-STD',
        price: 549900, // ৳5,499
        compareAtPrice: 599900,
        stockQuantity: 40,
      },
      {
        title: 'Deluxe Edition',
        sku: 'GAME-WUKONG-DLX',
        price: 649900, // ৳6,499
        compareAtPrice: 720000,
        stockQuantity: 20,
      },
    ],
  },
  {
    slug: 'spider-man',
    name: "Marvel's Spider-Man 2",
    type: 'game',
    shortDescription: 'Spider-Men Peter Parker and Miles Morales face the ultimate test of strength inside and outside the mask against the monstrous Venom.',
    description: 'Spider-Men, Peter Parker and Miles Morales, return for an exciting new adventure in the critically acclaimed Marvel\'s Spider-Man franchise for PS5. Swing, jump and utilize the new Web Wings to travel across Marvel\'s New York, quickly switching between Peter Parker and Miles Morales to experience different stories and epic new powers.',
    brand: 'PlayStation Studios',
    platform: 'PlayStation 5',
    category: 'Action Adventure',
    imageUrl: '/covers/spider-man.jpg',
    galleryImages: ['/covers/spider-man.jpg'],
    tags: ['Superhero', 'Action', 'Story Rich', 'PS5 Exclusive'],
    features: [
      'Instantly switch between Peter Parker and Miles Morales across expanded NYC',
      'Unleash Peter symbiote abilities and Miles bio-electric venom attacks',
      'Face iconic Marvel villains including Venom, Kraven the Hunter, and Lizard',
      'Near-instant fast travel powered by the PS5 ultra-fast SSD',
    ],
    specs: {
      Platform: 'PlayStation 5',
      Resolution: 'Ray-traced 4K fidelity / 60 FPS performance',
      Audio: 'Tempest 3D Audio',
      Storage: '98 GB SSD',
    },
    rating: 4.92,
    reviewCount: 7800,
    status: 'active',
    featured: true,
    sortOrder: 5,
    variants: [
      {
        title: 'Standard Edition',
        sku: 'GAME-SM2-STD',
        price: 599900, // ৳5,999
        compareAtPrice: 650000,
        stockQuantity: 18,
      },
    ],
  },
  {
    slug: 'gow-ragnarok',
    name: 'God of War Ragnarök',
    type: 'game',
    shortDescription: 'Embark on an epic and heartfelt journey as Kratos and Atreus struggle with holding on and letting go against the forces of Asgard.',
    description: 'From Santa Monica Studio comes the sequel to the critically acclaimed God of War (2018). Fimbulwinter is well underway. Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world.',
    brand: 'PlayStation Studios',
    platform: 'PC / PS5',
    category: 'Action Adventure',
    imageUrl: '/covers/gow-ragnarok.jpg',
    galleryImages: ['/covers/gow-ragnarok.jpg'],
    tags: ['Norse Mythology', 'Action', 'Cinematic', 'Story Masterpiece'],
    features: [
      'Master the Leviathan Axe, Blades of Chaos, and the new Draupnir Spear',
      'Explore all Nine Realms with breath-taking mythical vistas',
      'Emotional character-driven story expanding Atreus and Kratos bond',
      'Valhalla Roguelite DLC included for free',
    ],
    specs: {
      Platforms: 'PS5, PC',
      Resolution: 'Up to Native 4K @ 60-120 FPS with VRR',
      Audio: '3D Spatial Audio',
      Storage: '84 GB',
    },
    rating: 4.97,
    reviewCount: 8900,
    status: 'active',
    featured: false,
    sortOrder: 6,
    variants: [
      {
        title: 'Standard Edition',
        sku: 'GAME-GOW-STD',
        price: 489900, // ৳4,899
        compareAtPrice: 550000,
        stockQuantity: 22,
      },
    ],
  },

  // ── ACCESSORIES ───────────────────────────────────────────────────────
  {
    slug: 'dualsense-edge',
    name: 'DualSense Edge™ Wireless Controller',
    type: 'accessory',
    shortDescription: 'Ultra-customizable pro controller built for high-performance esports with remappable back buttons and swappable modules.',
    description: 'Gain an edge in gameplay by crafting your own custom controls to fit your playstyle. Built with high performance and personalization in mind, the DualSense Edge wireless controller invites you to craft your own unique gaming experience so you can play your way. Includes customizable controls, swappable stick caps, remappable back buttons, and tuned trigger travel distances.',
    brand: 'PlayStation',
    platform: 'PS5 / PC',
    category: 'Controllers',
    imageUrl: '/accessories/dualsense-edge.jpg',
    galleryImages: ['/accessories/dualsense-edge.jpg'],
    tags: ['Pro Hardware', 'Esports', 'Customizable', 'Wireless'],
    features: [
      'Ultra-customizable controls with dedicated Fn buttons to quickly swap profiles',
      'Changeable stick caps and replaceable stick modules for longevity',
      'Configurable back buttons (half-dome and lever options included)',
      'Adjustable trigger stops and deadzone tuning via PS5 system menu',
      'DualSense core features: Haptic feedback, adaptive triggers, and motion sensors',
      'Braided USB-C cable with lockable connector housing and premium carrying case',
    ],
    specs: {
      Connectivity: 'Bluetooth 5.1 & Low-Latency USB-C',
      'Battery Life': 'Up to 8-10 Hours Continuous Play',
      Weight: '325g (Optimized Counter-Weighted)',
      Haptics: 'Dual Voice-Coil Actuators',
      Triggers: 'Adaptive Hall-Effect with Mechanical Stops',
      Audio: '3.5mm Hi-Res Audio Jack & Built-in Mic Array',
    },
    rating: 4.95,
    reviewCount: 2450,
    status: 'active',
    featured: true,
    sortOrder: 1,
    variants: [
      {
        title: 'White & Obsidian',
        sku: 'ACC-DSE-WHT',
        price: 2450000, // ৳24,500
        compareAtPrice: 2600000,
        stockQuantity: 12,
      },
    ],
  },
  {
    slug: 'pulse-elite',
    name: 'PULSE Elite™ Wireless Headset',
    type: 'accessory',
    shortDescription: 'Next-generation planar magnetic drivers deliver studio-grade acoustics and ultra-low latency PlayStation Link wireless audio.',
    description: 'Experience extraordinarily lifelike audio in your favorite games with planar magnetic drivers, and hear every sound with lightning-fast PlayStation Link lossless wireless connectivity. Enjoy up to 30 hours of battery life with quick charging, a fully retractable microphone with AI-enhanced noise rejection, and convenient charging hanger included.',
    brand: 'PlayStation',
    platform: 'PS5 / PC / Mobile',
    category: 'Headsets',
    imageUrl: '/accessories/pulse-elite.jpg',
    galleryImages: ['/accessories/pulse-elite.jpg'],
    tags: ['Planar Magnetic', 'Audiophile', 'Lossless Wireless', 'PS Link'],
    features: [
      'Studio-inspired Planar Magnetic Drivers reproducing acoustic soundscapes with ultra-low distortion',
      'PlayStation Link ultra-low latency lossless audio technology',
      'AI-enhanced microphone noise rejection trained to isolate human voice',
      'Multi-device connectivity: Listen to PS Link and Bluetooth audio simultaneously',
      'Up to 30 hours battery life with rapid 10-minute charge giving 2 hours play',
    ],
    specs: {
      Driver: 'Custom Planar Magnetic 40mm Transducers',
      Frequency: '10Hz – 48,000Hz Ultra-Wide Response',
      Wireless: 'PlayStation Link 2.4GHz + Bluetooth 5.3 Dual-Band',
      Microphone: 'Retractable Boom with AI Noise Cancellation',
      'Battery Life': 'Up to 30 Hours (Quick Charge Capable)',
    },
    rating: 4.92,
    reviewCount: 1280,
    status: 'active',
    featured: true,
    sortOrder: 2,
    variants: [
      {
        title: 'Standard White',
        sku: 'ACC-PULSE-ELT',
        price: 1799900, // ৳17,999
        compareAtPrice: 1950000,
        stockQuantity: 16,
      },
    ],
  },
  {
    slug: 'dualsense-cosmic',
    name: 'DualSense Wireless Controller - Cosmic Red',
    type: 'accessory',
    shortDescription: 'Ignite your gaming nights with the striking Cosmic Red design featuring immersive haptic feedback and dynamic triggers.',
    description: 'Discover a deeper, highly immersive gaming experience that brings the action to life in the palms of your hands. The DualSense wireless controller offers immersive haptic feedback, dynamic adaptive triggers, and a built-in microphone, all integrated into an iconic comfortable design inspired by galactic nebulas.',
    brand: 'PlayStation',
    platform: 'PS5 / PC',
    category: 'Controllers',
    imageUrl: '/accessories/dualsense-cosmic.jpg',
    galleryImages: ['/accessories/dualsense-cosmic.jpg'],
    tags: ['Galaxy Collection', 'Wireless', 'Adaptive Triggers'],
    features: [
      'Dynamic resistance mimicking tension of interactions with in-game gear and environments',
      'Feel physically responsive feedback to your in-game actions with dual actuators',
      'Chat online using the built-in microphone or connect a headset via 3.5mm jack',
    ],
    specs: {
      Color: 'Cosmic Red (Galaxy Collection)',
      Connection: 'Bluetooth 5.1 & Type-C',
      Weight: '280g',
    },
    rating: 4.89,
    reviewCount: 3100,
    status: 'active',
    featured: true,
    sortOrder: 3,
    variants: [
      {
        title: 'Cosmic Red',
        sku: 'ACC-DS-RED',
        price: 849900, // ৳8,499
        compareAtPrice: 920000,
        stockQuantity: 28,
      },
    ],
  },
  {
    slug: 'charging-station',
    name: 'DualSense Charging Station',
    type: 'accessory',
    shortDescription: 'Click-in charging dock for up to two DualSense wireless controllers simultaneously without occupying PS5 USB ports.',
    description: 'Charge up to two DualSense wireless controllers simultaneously without having to connect them to your PlayStation 5 console. Your controllers charge as quickly as when connected to your PS5 console, so you can free up USB ports without sacrificing performance.',
    brand: 'PlayStation',
    platform: 'PS5',
    category: 'Docks & Chargers',
    imageUrl: '/accessories/charging-station.jpg',
    galleryImages: ['/accessories/charging-station.jpg'],
    tags: ['Charging Dock', 'Dual Port', 'Fast Charge'],
    features: [
      'Click-in design docks quickly and easily without fussing with cables',
      'Frees up front USB ports on your PlayStation 5 console',
      'Charges two controllers as fast as direct console connection',
    ],
    specs: {
      Input: 'AC Adapter included',
      Capacity: '2 DualSense or DualSense Edge controllers',
    },
    rating: 4.93,
    reviewCount: 4200,
    status: 'active',
    featured: false,
    sortOrder: 4,
    variants: [
      {
        title: 'Official Dock',
        sku: 'ACC-DS-DOCK',
        price: 380000, // ৳3,800
        compareAtPrice: 420000,
        stockQuantity: 30,
      },
    ],
  },
  {
    slug: 'playstation-vr2',
    name: 'PlayStation®VR2 Horizon Call of the Mountain™ Bundle',
    type: 'accessory',
    shortDescription: 'Conquer colossal peaks and overcome terrifying machines in the groundbreaking Horizon Call of the Mountain bundle for PSVR2.',
    description: 'Escape into worlds that feel truly real with PlayStation VR2. Jump into next-generation virtual reality with stunning 4K HDR visuals, genre-defining games, and unique sensations from the groundbreaking PlayStation VR2 headset and PlayStation VR2 Sense controller.',
    brand: 'PlayStation',
    platform: 'PS5 / PC',
    category: 'VR Systems',
    imageUrl: '/accessories/playstation-vr2.jpg',
    galleryImages: ['/accessories/playstation-vr2.jpg'],
    tags: ['Virtual Reality', '4K HDR', 'OLED', 'Eye Tracking'],
    features: [
      'Dual 2000x2040 OLED displays delivering breathtaking 4K HDR visuals at up to 120Hz',
      'Intelligent eye tracking enabling foveated rendering and heightened emotional expression',
      'Headset feedback subtle vibrations providing tactile sensory cues',
      '3D audio immersion pinpointing spatial sound accurately in 360 degrees',
    ],
    specs: {
      Display: 'OLED (2000 x 2040 per eye)',
      'Refresh Rate': '90Hz, 120Hz',
      'Field of View': 'Approx. 110 degrees',
      Sensors: '6-axis motion sensing system, 4 cameras for headset tracking, IR camera for eye tracking',
    },
    rating: 4.87,
    reviewCount: 1650,
    status: 'active',
    featured: true,
    sortOrder: 5,
    variants: [
      {
        title: 'Horizon Call of the Mountain Bundle',
        sku: 'ACC-PSVR2-BND',
        price: 6890000, // ৳68,900
        compareAtPrice: 7500000,
        stockQuantity: 6,
      },
    ],
  },
  {
    slug: 'xbox-elite-2',
    name: 'Xbox Elite Wireless Controller Series 2',
    type: 'accessory',
    shortDescription: 'Pro-tier wireless controller featuring adjustable-tension thumbsticks, wrap-around rubberized grip, and shorter hair trigger locks.',
    description: 'Play like a pro with the Xbox Elite Wireless Controller Series 2. Tailor the controller to your preferred gaming style with new interchangeable thumbstick and paddle shapes. Save up to 3 custom profiles and 1 default profile on the controller and switch between them on the fly.',
    brand: 'Xbox',
    platform: 'Xbox / PC',
    category: 'Controllers',
    imageUrl: '/accessories/xbox-elite-2.jpg',
    galleryImages: ['/accessories/xbox-elite-2.jpg'],
    tags: ['Pro Controller', 'Adjustable Tension', 'Bluetooth'],
    features: [
      'Adjustable-tension thumbsticks for pinpoint accuracy',
      'Shorter hair trigger locks to fire faster than ever',
      'Wrap-around rubberized grip and up to 40 hours of rechargeable battery life',
    ],
    specs: {
      Compatibility: 'Xbox Series X|S, Xbox One, Windows 10/11, Android, iOS',
      'Battery Life': 'Up to 40 Hours per Charge',
      Weight: '345g',
    },
    rating: 4.84,
    reviewCount: 2900,
    status: 'active',
    featured: true,
    sortOrder: 6,
    variants: [
      {
        title: 'Core Black',
        sku: 'ACC-XB-ELT2',
        price: 1950000, // ৳19,500
        compareAtPrice: 2200000,
        stockQuantity: 10,
      },
    ],
  },
]

async function seed() {
  await client.connect()
  console.log('Connected to Neon Database...')

  for (const item of sampleProducts) {
    const { variants, ...prod } = item

    // Upsert product by slug
    const prodRes = await client.query(
      `INSERT INTO products (
        slug, name, type, short_description, description, brand, platform, category,
        image_url, gallery_images, tags, features, specs, rating, review_count,
        status, featured, sort_order
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        brand = EXCLUDED.brand,
        platform = EXCLUDED.platform,
        category = EXCLUDED.category,
        image_url = EXCLUDED.image_url,
        gallery_images = EXCLUDED.gallery_images,
        tags = EXCLUDED.tags,
        features = EXCLUDED.features,
        specs = EXCLUDED.specs,
        rating = EXCLUDED.rating,
        review_count = EXCLUDED.review_count,
        status = EXCLUDED.status,
        featured = EXCLUDED.featured,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
      RETURNING id, name;`,
      [
        prod.slug,
        prod.name,
        prod.type,
        prod.shortDescription,
        prod.description,
        prod.brand,
        prod.platform,
        prod.category,
        prod.imageUrl,
        JSON.stringify(prod.galleryImages),
        JSON.stringify(prod.tags),
        JSON.stringify(prod.features),
        JSON.stringify(prod.specs),
        prod.rating,
        prod.reviewCount,
        prod.status,
        prod.featured,
        prod.sortOrder,
      ]
    )

    const productId = prodRes.rows[0].id
    console.log(`✓ Product [${prod.type}]: ${prodRes.rows[0].name} (${productId})`)

    for (const v of variants) {
      await client.query(
        `INSERT INTO product_variants (
          product_id, title, sku, price, compare_at_price, stock_quantity, active
        ) VALUES (
          $1, $2, $3, $4, $5, $6, true
        ) ON CONFLICT (sku) DO UPDATE SET
          title = EXCLUDED.title,
          price = EXCLUDED.price,
          compare_at_price = EXCLUDED.compare_at_price,
          stock_quantity = EXCLUDED.stock_quantity,
          updated_at = NOW();`,
        [productId, v.title, v.sku, v.price, v.compareAtPrice, v.stockQuantity]
      )
      console.log(`    ↳ Variant: ${v.title} — ৳${(v.price / 100).toLocaleString('en-BD')} (Stock: ${v.stockQuantity})`)
    }
  }

  const prodCount = await client.query('SELECT count(*) FROM products;')
  const varCount = await client.query('SELECT count(*) FROM product_variants;')
  console.log(`\n🎉 Seed finished! Products in DB: ${prodCount.rows[0].count}, Variants in DB: ${varCount.rows[0].count}`)
  await client.end()
}

seed().catch((err) => {
  console.error('Seed error:', err)
  client.end()
  process.exit(1)
})
