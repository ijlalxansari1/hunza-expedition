import { Destination } from "@/types";

export const initialDestinations: Destination[] = [
  {
    _id: "dest-hunza-valley",
    name: "Hunza Valley",
    slug: "hunza-valley",
    region: "Gilgit-Baltistan",
    shortDescription: "A historic high-altitude valley renowned for ancient terraced orchards, fortified villages, and panoramic views of Rakaposhi and Ultar Sar.",
    overview: "Hunza is a storied alpine valley situated along the historic Silk Route in northern Gilgit-Baltistan. Flanked by majestic 7,000-metre peaks including Rakaposhi (7,788m), Diran, and Ultar Sar, the valley has preserved distinct cultural traditions, Burushaski and Wakhi linguistic heritage, and ancestral water-channel irrigation systems. Hunza offers a balanced journey connecting living heritage in Karimabad and Ganish with dramatic high-altitude landscapes up towards Gojal.",
    heroImageUrl: "/images/hunza-hero.jpg",
    galleryUrls: [
      "/images/baltit-fort.jpg",
      "/images/attabad-lake.jpg",
      "/images/passu-cones.jpg",
    ],
    coordinates: {
      lat: 36.3167,
      lng: 74.65,
    },
    placesOfInterest: [
      {
        name: "Baltit Fort",
        summary: "700-year-old former seat of the Mirs of Hunza overlooking Karimabad.",
        description: "Perched dramatically above Karimabad bazaar, Baltit Fort served as the fortified residence of the Mirs of Hunza for over seven centuries. Built on Tibetan-influenced timber and stone architectural traditions, it was meticulously restored by the Aga Khan Trust for Culture (AKTC) and holds an official spot on Pakistan's UNESCO World Heritage Tentative List.",
        imageUrl: "/images/baltit-fort.jpg",
        verifiedHeritageStatus: "Pakistan UNESCO Tentative List (Restoration Awarded UNESCO Asia-Pacific Award of Excellence)",
      },
      {
        name: "Altit Fort",
        summary: "Hunza's oldest surviving fortified settlement, dating back over 900 years.",
        description: "Older than Baltit Fort, Altit Fort stands atop a sheer 300-metre cliff face plunging into the Hunza River gorge. Its ancient Shikari watchtower once guarded the valley entrance. Surrounding the fort is Altit Khun, a revitalized historic village with stone paved alleys and heritage fruit orchards.",
        imageUrl: "/images/hunza-hero.jpg",
        verifiedHeritageStatus: "Recipient of UNESCO Asia-Pacific Award of Distinction (2011)",
      },
      {
        name: "Attabad Lake",
        summary: "Spectacular turquoise glacial lake formed in the upper valley in 2010.",
        description: "Created after a massive landslide in 2010 blocked the Hunza River, Attabad Lake is renowned for its vivid crystalline blue water set against sheer granite walls. Today it serves as a scenic boat transit point and landmark along the newly realigned Karakoram Highway tunnels.",
        imageUrl: "/images/attabad-lake.jpg",
      },
      {
        name: "Passu Cones & Passu Glacier",
        summary: "The iconic serrated cathedral spires of Upper Hunza (Gojal).",
        description: "Passu Cathedral (Tupopdan) rises as a jagged, serrated mountain ridge above the wide braided riverbed of the Shisper and Hunza rivers. Passu village is also the gateway to the Passu Glacier, the Borith bird sanctuary lake, and traditional suspension footbridges.",
        imageUrl: "/images/passu-cones.jpg",
      },
    ],
    bestTimeToVisit: {
      summary: "April to October offers accessible mountain roads and distinct seasonal character.",
      seasons: [
        {
          season: "Spring Blossom",
          months: "Late March – April",
          description: "Apricot, cherry, and almond trees blossom across terraced stone orchards while snowy peaks provide a brilliant backdrop. Cool temperatures and fewer crowds.",
        },
        {
          season: "Summer High Season",
          months: "May – August",
          description: "Warm sunny days, green terraced fields, and open mountain passes for high-altitude trekking and village excursions. Ideal for families and outdoor explorers.",
        },
        {
          season: "Golden Autumn",
          months: "Late September – October",
          description: "Poplar and fruit trees transform into striking gold, copper, and amber hues. Crisp clear mountain skies offer some of the year's sharpest photography conditions.",
        },
        {
          season: "Winter Quiet",
          months: "November – February",
          description: "Cold temperatures and snow in the upper valleys. A tranquil time for cultural immersion in lower settlements, but some mountain passes and hotels operate on limited schedules.",
        },
      ],
    },
    transportNotes: "Accessible via the paved Karakoram Highway (N-35) from Gilgit (approx. 2 to 3 hours drive under normal conditions). Flights connect Islamabad to Gilgit Airport subject to clear weather. Mountain roads require defensive driving, and itineraries should include buffer time for seasonal maintenance.",
    practicalInfo: [
      "Respect local conservative customs: dress modestly when walking through residential villages and religious sites.",
      "Cash is strongly advised: ATM availability is concentrated in Aliabad and Karimabad, and connectivity can be intermittent.",
      "Stay hydrated and allow time to acclimatise to the altitude (Karimabad sits at approximately 2,400 metres).",
      "Support local community cooperatives, fruit drying associations, and local village guides.",
    ],
    safetyNotes: "Northern Pakistan mountain regions experience variable weather. Karakoram Highway travel can encounter occasional temporary delays from rockfall or landslide clearing. Travel insurance covering mountain areas is recommended.",
    publicationStatus: "published",
    seoTitle: "Hunza Valley Travel & Destination Guide | Hunza Expeditions",
    metaDescription: "Discover Hunza Valley: Karimabad, Baltit Fort, Altit Fort, Attabad Lake, and Passu. Plan a well-organized journey through northern Gilgit-Baltistan with Hunza Expeditions.",
  },
  {
    _id: "dest-nagar-valley",
    name: "Nagar Valley",
    slug: "nagar-valley",
    region: "Gilgit-Baltistan",
    shortDescription: "A tranquil valley directly across from Hunza, home to Hopar Glacier, Spantik peak, and rich gemstone mining traditions.",
    overview: "Nagar Valley lies directly south and east across the Hunza River gorge, historically an independent principality with deep traditions. Nagar is distinguished by its close proximity to colossal glaciers, including Hopar (Bualtar) Glacier, which descends directly into the valley farmland. The valley also serves as the traditional trekking approach for Rush Lake (one of the world's highest alpine lakes) and Spantik (Golden Peak, 7,027m).",
    heroImageUrl: "/images/nagar.jpg",
    placesOfInterest: [
      {
        name: "Hopar Valley & Hopar Glacier",
        summary: "An accessible black and white glacier flowing alongside alpine farmland.",
        description: "Located approximately 45 minutes drive from Karimabad, Hopar provides a breathtaking rim viewpoint where visitors can look directly down upon the moving ice seracs of the Bualtar Glacier.",
        imageUrl: "/images/nagar.jpg",
      },
      {
        name: "Minapin & Diran Base Camp Approach",
        summary: "Gateway to the north face of Rakaposhi and Diran Glacier.",
        description: "The village of Minapin is celebrated for its serene apple orchards and as the trailhead for day hikes to Tagaphari and Rakaposhi base camp.",
        imageUrl: "/images/hunza-hero.jpg",
      },
    ],
    bestTimeToVisit: {
      summary: "May to October offers optimal conditions for glacier exploration and valley walks.",
      seasons: [
        {
          season: "Summer & Trekking",
          months: "June – September",
          description: "Trails to Rush Lake and Diran base camp are open with snow-free passes.",
        },
      ],
    },
    transportNotes: "Branch road off the Karakoram Highway near Ganesh bridge leads into Nagar settlements. Paved to major villages, with unpaved jeep tracks to upper trekking trailheads.",
    practicalInfo: [
      "Hire local guides from Nagar for glacier rim walks to ensure safe footing on loose moraine.",
      "Traditional agriculture is the heartbeat of Nagar; stick strictly to marked walking paths around irrigated crops.",
    ],
    publicationStatus: "published",
    seoTitle: "Nagar Valley Guide | Glaciers & Spantik | Hunza Expeditions",
    metaDescription: "Explore Nagar Valley in Gilgit-Baltistan: Hopar Glacier, Minapin, and Rakaposhi viewpoints. Plan your authentic journey with Hunza Expeditions.",
  },
  {
    _id: "dest-skardu-baltistan",
    name: "Skardu & Baltistan",
    slug: "skardu-baltistan",
    region: "Gilgit-Baltistan",
    shortDescription: "The gateway to the high Karakorams, Concordia, Shangrila, cold desert dunes, and Tibetan-influenced Balti heritage.",
    overview: "Skardu is the historic capital of Baltistan, situated at the confluence of the Indus and Shigar rivers. Surrounded by towering peaks and high cold deserts, Baltistan is culturally distinct, characterized by Tibetan architectural traditions, Balti language, and apricot groves. It is world-renowned as the starting point for expeditions to K2, Broad Peak, and the Gasherbrums, as well as heritage journeys to Shigar and Khaplu royal forts.",
    heroImageUrl: "/images/skardu.jpg",
    placesOfInterest: [
      {
        name: "Katpana & Sarfaranga Cold Deserts",
        summary: "High-altitude sand dunes that receive winter snowfall at 2,200 metres.",
        description: "One of the rarest geological landscapes in the world, the cold desert features rolling white sand dunes set against sharp snow-dusted Karakoram peaks.",
        imageUrl: "/images/skardu.jpg",
      },
      {
        name: "Shigar Fort (Fong-Khar)",
        summary: "400-year-old palace of the Raja of Shigar, restored as a living museum.",
        description: "An authentic architectural treasure crafted from stone, cedar timber, and mud mortar, restored by AKTC and set within peaceful Mughal-style royal gardens.",
        imageUrl: "/images/baltit-fort.jpg",
        verifiedHeritageStatus: "Recipient of UNESCO Asia-Pacific Heritage Award",
      },
      {
        name: "Lower & Upper Kachura Lakes",
        summary: "Mirror-clear alpine lakes surrounded by wild fruit orchards.",
        description: "Upper Kachura offers quiet boat trips surrounded by granite peaks and apricot trees, while Lower Kachura (Shangrila) is famous for its heart-shaped shoreline.",
        imageUrl: "/images/attabad-lake.jpg",
      },
    ],
    bestTimeToVisit: {
      summary: "April through October for pleasant touring weather and fruit harvests.",
      seasons: [
        {
          season: "Spring & Cherry Blossoms",
          months: "April – Early May",
          description: "Baltistan's valleys burst with pink cherry and white apricot blossoms.",
        },
        {
          season: "Summer Karakoram Season",
          months: "June – August",
          description: "All major high-altitude routes and Deosai National Park plateau are open.",
        },
      ],
    },
    transportNotes: "Skardu International Airport operates direct flights from Islamabad, Karachi, and Lahore (weather-permitting). Road access via the newly upgraded Jaglot-Skardu highway connects to the KKH in approx. 4 to 5 hours.",
    practicalInfo: [
      "Always allow at least one contingency travel day if flying into Skardu due to visual flight rules in mountain corridors.",
      "Visit local Balti handicraft workshops in Khaplu and Skardu bazaar.",
    ],
    publicationStatus: "published",
    seoTitle: "Skardu & Baltistan Travel Planning | Hunza Expeditions",
    metaDescription: "Plan your trip to Skardu, Shigar, Khaplu, and the Cold Deserts of Baltistan. Curated itineraries and local arrangements by Hunza Expeditions.",
  },
  {
    _id: "dest-passu-gojal",
    name: "Passu & Gojal (Upper Hunza)",
    slug: "passu-gojal",
    region: "Gilgit-Baltistan",
    shortDescription: "The high frontier of Upper Hunza featuring Wakhi mountain culture, rugged suspension bridges, and the road to Khunjerab Pass.",
    overview: "Gojal comprises Upper Hunza, stretching from Attabad Lake to the Khunjerab Pass at the border with China. Populated predominantly by the hospitable Wakhi community, Gojal is characterized by vast wide valleys, glacial tongues terminating near the road, and alpine pastoral pastures. Highlights include Passu village, the tranquil waters of Borith Lake, and traditional suspension footbridges over the roaring Hunza River.",
    heroImageUrl: "/images/passu-cones.jpg",
    placesOfInterest: [
      {
        name: "Passu Suspension Bridges",
        summary: "Historic wooden cable footbridges spanning the river gorge.",
        description: "Constructed by local villagers with spaced wooden planks and steel cables, the Passu and Hussaini suspension bridges test nerve and offer unmatched views of Passu Cones.",
        imageUrl: "/images/passu-cones.jpg",
      },
      {
        name: "Borith Lake & Wildlife Sanctuary",
        summary: "Saline high-altitude wetland and stopover for migratory birds.",
        description: "Located above Gulkin village at 2,600 metres, Borith Lake offers peaceful day walks, rustic local guesthouses, and access to the White Glacier trail.",
        imageUrl: "/images/attabad-lake.jpg",
      },
      {
        name: "Khunjerab Pass (4,693m)",
        summary: "The highest paved international border crossing in the world.",
        description: "Situated within Khunjerab National Park, home to Himalayan ibex, golden marmots, and snow leopards. The pass connects Pakistan with Xinjiang, China.",
        imageUrl: "/images/passu-cones.jpg",
      },
    ],
    bestTimeToVisit: {
      summary: "May to October. Khunjerab Pass operates seasonally and can experience snow flurries even in summer.",
      seasons: [
        {
          season: "High Summer",
          months: "June – September",
          description: "Comfortable temperatures and optimal road conditions to the high pass.",
        },
      ],
    },
    transportNotes: "Smooth driving along the newly engineered Karakoram Highway through the Attabad tunnels. National park entry fees apply at Dhee checkpost before Khunjerab Pass.",
    practicalInfo: [
      "Bring warm layers regardless of season when traveling to Khunjerab Pass (over 4,600 metres).",
      "Do not disturb wildlife inside Khunjerab National Park; keep strictly to the roadway and viewpoints.",
    ],
    publicationStatus: "published",
    seoTitle: "Passu & Gojal Travel Guide | Upper Hunza | Hunza Expeditions",
    metaDescription: "Discover Upper Hunza and Gojal: Passu Cones, Borith Lake, Hussaini Bridge, and Khunjerab Pass. Book your journey with Hunza Expeditions.",
  },
];
