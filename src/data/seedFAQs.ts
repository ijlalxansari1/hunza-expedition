export const initialFAQs = [
  {
    question: 'How does booking and payment work with Hunza Expeditions?',
    answer: 'We do not take immediate automated credit card payments online. You begin by submitting an enquiry with your dates, party size, and preferred valleys. Our operational team checks road access, vehicle availability, and hotel confirmations to send you an itemized quotation. Once you approve the itinerary, confirmed arrangements are locked with clear payment terms.',
    category: 'planning' as const,
    displayOrder: 1,
    publicationStatus: 'published' as const,
  },
  {
    question: 'Is traveling along the Karakoram Highway safe?',
    answer: 'The Karakoram Highway (N-35) is a marvel of engineering, paved and maintained year-round through Gilgit and Hunza. However, mountain roads are subject to variable weather and seasonal maintenance. We always allocate contingency buffers in our itineraries and use experienced, defensive mountain drivers.',
    category: 'practical' as const,
    displayOrder: 2,
    publicationStatus: 'published' as const,
  },
  {
    question: 'What is the best time of year to visit Hunza Valley?',
    answer: 'April is celebrated for apricot and cherry blossoms. June through August offers warm summer weather, open high passes, and accessible trekking trails. October is the world-renowned golden autumn season when poplar and apricot trees turn amber and copper. Winter (December to February) is quiet and cold, suitable for valley heritage visits but with some mountain passes closed.',
    category: 'seasons' as const,
    displayOrder: 3,
    publicationStatus: 'published' as const,
  },
  {
    question: 'What kind of clothing and cultural etiquette should we follow?',
    answer: 'Gilgit-Baltistan is culturally welcoming, yet traditional and conservative. Modest clothing that covers shoulders and knees is expected in residential villages and around historical shrines. For outdoor exploration, pack sturdy walking shoes, warm fleece layers for cool evenings, high-SPF sunblock, and UV sunglasses.',
    category: 'culture' as const,
    displayOrder: 4,
    publicationStatus: 'published' as const,
  },
  {
    question: 'How does mobile connectivity and cash access work?',
    answer: 'Special communications network (SCOM) provides reliable 4G mobile data across Hunza and Gilgit. International roaming often works intermittently, so local SIM cards are recommended for longer stays. ATMs are available in major towns (Gilgit, Aliabad, Skardu), but carrying sufficient cash in Pakistani Rupees (PKR) is essential for village purchases and rural guesthouses.',
    category: 'practical' as const,
    displayOrder: 5,
    publicationStatus: 'published' as const,
  },
];
