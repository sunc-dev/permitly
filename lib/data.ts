// ─────────────────────────────────────────────────────────────
// Static prototype data for the Permitly portal (fake data only)
// ─────────────────────────────────────────────────────────────

export type BadgeClass = "br" | "bp" | "bg" | "bd";
export type AppStatus = "in-review" | "info-needed" | "approved" | "draft";

export interface Comment {
  author: string;
  role: string;
  time: string;
  text: string;
  unread: boolean;
}

export interface AppRecord {
  title: string;
  type: string;
  ref: string;
  submitted: string | null;
  status: AppStatus;
  badge: string;
  badgeClass: BadgeClass;
  description: string;
  fee: number;
  paid: boolean;
  paidDate?: string;
  receiptRef?: string;
  outstanding: string[];
  comments: Comment[];
}

export const APP_DATA: Record<string, AppRecord> = {
  "BP-2024-0841": {
    title: "Residential addition — 42 Maple Ave",
    type: "Building permit",
    ref: "BP-2024-0841",
    submitted: "Apr 28, 2024",
    status: "in-review",
    badge: "In review",
    badgeClass: "br",
    description:
      "Two-storey rear addition to existing single-family dwelling at 42 Maple Avenue. Total new floor area approximately 400 sq ft. Includes structural modifications to existing foundation and new egress window installation.",
    fee: 635.0,
    paid: false,
    outstanding: [
      "Revised structural drawings required — original submission incomplete",
      "Site plan must show setback dimensions from all property lines",
      "Engineer stamp required on foundation plan",
    ],
    comments: [
      {
        author: "M. Chen",
        role: "Building Inspector",
        time: "2 hours ago",
        text: "Your structural drawings are missing the beam span calculations for the new load-bearing wall. Please resubmit with a stamped engineers letter.",
        unread: true,
      },
      {
        author: "M. Chen",
        role: "Building Inspector",
        time: "Apr 29",
        text: "Application received and assigned for review. Expect initial completeness check within 1 business day.",
        unread: false,
      },
    ],
  },
  "EP-2024-0219": {
    title: "Summer block party — Elm St",
    type: "Special event permit",
    ref: "EP-2024-0219",
    submitted: "Apr 22, 2024",
    status: "info-needed",
    badge: "Info needed",
    badgeClass: "bp",
    description:
      "Public block party on Elm Street between King and Queen. Estimated 200 attendees. Includes road closure, amplified music, and food vendors. Event date: July 12, 2024.",
    fee: 210.0,
    paid: false,
    outstanding: [
      "Revised site plan required showing vendor placement and emergency access routes",
      "Noise exemption application must be submitted separately",
      "Proof of $2M liability insurance not yet received",
    ],
    comments: [
      {
        author: "J. Park",
        role: "Events Coordinator",
        time: "Yesterday",
        text: "Please resubmit your site map. The current version does not show the required 6-metre emergency vehicle access lane along the north side of the road closure.",
        unread: true,
      },
      {
        author: "J. Park",
        role: "Events Coordinator",
        time: "Apr 23",
        text: "We also need your noise exemption application before we can proceed. You can file it online at toronto.ca/noiseexemption.",
        unread: true,
      },
    ],
  },
  "BL-2024-0073": {
    title: "Lee Corner Cafe — business license",
    type: "Business license",
    ref: "BL-2024-0073",
    submitted: "Mar 14, 2024",
    status: "approved",
    badge: "Approved",
    badgeClass: "bg",
    description:
      "Annual food service business license for Lees Corner Cafe, 88 Queen Street West. Licensed for 40 seats, table service and takeout.",
    fee: 567.0,
    paid: true,
    paidDate: "Mar 14, 2024",
    receiptRef: "PAY-2024-3312",
    outstanding: [],
    comments: [
      {
        author: "R. Singh",
        role: "Business Licensing",
        time: "Mar 14",
        text: "Your license has been approved and issued. You can download your certificate from the Records section.",
        unread: false,
      },
    ],
  },
  "VP-2024-0052": {
    title: "Food truck — King St West zone",
    type: "Street vendor permit",
    ref: "VP-2024-0052",
    submitted: null,
    status: "draft",
    badge: "Draft",
    badgeClass: "bd",
    description:
      "Street vending permit for food truck operation in the King Street West premium zone. Includes year-round operation licence.",
    fee: 1800.0,
    paid: false,
    outstanding: [],
    comments: [],
  },
  "DK-2024-0088": {
    title: "Backyard deck — 12 Birch Rd",
    type: "Building permit",
    ref: "DK-2024-0088",
    submitted: null,
    status: "draft",
    badge: "Draft",
    badgeClass: "bd",
    description:
      "New raised cedar deck (18 sq m) attached to the rear of the dwelling at 12 Birch Road, including stairs to grade and a privacy screen along the north edge.",
    fee: 420.0,
    paid: false,
    outstanding: [],
    comments: [],
  },
  "BP-2024-0912": {
    title: "Basement apartment — 42 Maple Ave",
    type: "Building permit",
    ref: "BP-2024-0912",
    submitted: "May 6, 2024",
    status: "in-review",
    badge: "In review",
    badgeClass: "br",
    description:
      "Conversion of an existing basement into a self-contained secondary suite at 42 Maple Avenue. Includes new egress windows, fire separation, and a separate side entrance.",
    fee: 980.0,
    paid: false,
    outstanding: [],
    comments: [
      {
        author: "M. Chen",
        role: "Building Inspector",
        time: "May 7",
        text: "Application received. Zoning review is underway to confirm secondary-suite eligibility for this lot.",
        unread: false,
      },
    ],
  },
  "EP-2024-0301": {
    title: "Farmers market — Dundas Sq",
    type: "Special event permit",
    ref: "EP-2024-0301",
    submitted: "May 2, 2024",
    status: "info-needed",
    badge: "Info needed",
    badgeClass: "bp",
    description:
      "Weekly Saturday farmers market at Dundas Square, June–September. Up to 30 vendors, amplified announcements, and partial pedestrian-zone use.",
    fee: 640.0,
    paid: false,
    outstanding: [
      "Vendor list with food-handler certifications required",
      "Site plan must show accessible routes and waste stations",
    ],
    comments: [
      {
        author: "J. Park",
        role: "Events Coordinator",
        time: "May 4",
        text: "Please provide your full vendor list so we can confirm each food vendor holds a valid permit.",
        unread: true,
      },
    ],
  },
  "SP-2023-0301": {
    title: "Storefront sign — Lee's Corner Café",
    type: "Sign permit",
    ref: "SP-2023-0301",
    submitted: "Oct 12, 2023",
    status: "approved",
    badge: "Approved",
    badgeClass: "bg",
    description:
      "Illuminated fascia sign (2.4 m × 0.6 m) mounted above the entrance at 88 Queen Street West for Lee's Corner Café.",
    fee: 240.0,
    paid: true,
    paidDate: "Oct 12, 2023",
    receiptRef: "PAY-2023-9077",
    outstanding: [],
    comments: [
      {
        author: "R. Singh",
        role: "Sign Bylaw Officer",
        time: "Oct 20",
        text: "Sign permit approved. Please ensure installation matches the submitted elevation drawing.",
        unread: false,
      },
    ],
  },
};

// ── Permit detail catalogue (used by chat cards + wizard) ──
export interface PermitDetail {
  fee: string;
  time: string;
  docs: string[];
  tip: string;
}

export const PD: Record<string, PermitDetail> = {
  deck: {
    fee: "$185 + ~0.6% of value",
    time: "8–12 business days",
    docs: ["Site plan with dimensions", "Floor plan", "Structural drawings (if elevated)"],
    tip: "Decks under 10 sq m that are freestanding and under 30cm high don't need a permit.",
  },
  building: {
    fee: "$185 + ~0.6% of value",
    time: "8–12 business days",
    docs: ["Site plan", "Architectural drawings", "Structural drawings", "Owner or contractor details"],
    tip: "A stamped drawing set from a designer or engineer speeds up review.",
  },
  cafe: {
    fee: "$567 / year",
    time: "3–5 business days",
    docs: ["Business registration", "Food handler certification", "Health inspection pass", "Floor plan"],
    tip: "Book your health inspection early — it's often the longest step.",
  },
  truck: {
    fee: "$1,200–$2,400 / year",
    time: "3–4 business days",
    docs: ["Vehicle registration", "Food handler cert", "$2M liability insurance", "Health inspection"],
    tip: "Permit zone determines your fee — King St West is a premium zone.",
  },
  event: {
    fee: "$210–$850+",
    time: "Apply 30+ days ahead",
    docs: ["Event site plan", "$2M liability insurance", "Noise exemption (if needed)"],
    tip: "Events over 1,000 people have additional requirements. Apply 6 weeks early.",
  },
  basement: {
    fee: "$550–$1,200",
    time: "10–15 business days",
    docs: ["Existing + proposed floor plans", "Egress window specs", "Fire separation details"],
    tip: "A separate entrance and fire separation between units is usually required.",
  },
  fence: {
    fee: "Not applicable",
    time: "No permit needed",
    docs: [],
    tip: "Pool enclosure fences always need a permit regardless of height.",
  },
  tree: {
    fee: "$310 + $105/tree",
    time: "7–10 business days",
    docs: ["Tree survey report", "Photos of tree"],
    tip: "Permit may be refused if the tree is healthy.",
  },
};

export const WZ_STEPS = ["Details", "Location", "Documents", "Review"];

// Required-document checklists per permit key (wizard step 3)
export interface DocReq {
  ok: boolean;
  name: string;
}
export const DOCS_MAP: Record<string, DocReq[]> = {
  deck: [
    { ok: true, name: "Site plan with deck dimensions" },
    { ok: true, name: "Floor plan" },
    { ok: false, name: "Structural drawings (if elevated)" },
    { ok: false, name: "Contractor details or owner declaration" },
  ],
  cafe: [
    { ok: true, name: "Business registration certificate" },
    { ok: true, name: "Government-issued ID" },
    { ok: false, name: "Food handler certification (all staff)" },
    { ok: false, name: "Signed lease agreement" },
    { ok: false, name: "Floor plan of the space" },
  ],
  truck: [
    { ok: true, name: "Vehicle registration" },
    { ok: true, name: "Food handler certification" },
    { ok: false, name: "$2M liability insurance certificate" },
    { ok: false, name: "Health inspection pass" },
  ],
  event: [
    { ok: true, name: "Event site plan / map" },
    { ok: false, name: "$2M liability insurance certificate" },
    { ok: false, name: "Noise exemption application" },
    { ok: false, name: "Road closure plan (if applicable)" },
  ],
  basement: [
    { ok: true, name: "Existing floor plans" },
    { ok: false, name: "Proposed floor plans" },
    { ok: false, name: "Egress window specifications" },
    { ok: false, name: "Fire separation details" },
  ],
  fence: [
    { ok: false, name: "Site survey or property plan" },
    { ok: false, name: "Fence design and height details" },
  ],
  tree: [
    { ok: true, name: "Arborist report" },
    { ok: false, name: "Photos of the tree" },
    { ok: false, name: "Site plan showing tree location" },
  ],
};

// ── Assistant fallback logic (fake, no backend) ──
export interface PermitReply {
  intro: string;
  key: string;
  type: string;
  outro: string;
}

export function detectP(t: string): { type: string; key: string } | null {
  t = t.toLowerCase();
  if (t.match(/deck|patio|porch/)) return { type: "Building permit — Deck", key: "deck" };
  if (t.match(/addition|renovation|extension|remodel/)) return { type: "Building permit", key: "building" };
  if (t.match(/cafe|café|restaurant|coffee|bakery/)) return { type: "Business license", key: "cafe" };
  if (t.match(/food truck|street vendor/)) return { type: "Street vendor permit", key: "truck" };
  if (t.match(/event|festival|block party|gathering/)) return { type: "Special event permit", key: "event" };
  if (t.match(/basement|secondary suite|apartment/)) return { type: "Building permit — Basement", key: "basement" };
  if (t.match(/fence/)) return { type: "Fence", key: "fence" };
  if (t.match(/tree/)) return { type: "Tree removal permit", key: "tree" };
  return null;
}

export function fallback(t: string): PermitReply | string {
  const l = t.toLowerCase();
  if (l.match(/deck|patio|porch/))
    return {
      intro: "A deck attached to your home, or any deck over 10 sq m, requires a **building permit** in Toronto.",
      key: "deck",
      type: "Building permit — Deck",
      outro:
        "Small freestanding decks under 10 sq m and under 30cm high usually don't need one. Want me to help you start an application?",
    };
  if (l.match(/addition|renovation|extension|remodel/))
    return {
      intro: "A home addition or major renovation that affects structure, plumbing, or electrical requires a **building permit** in Toronto.",
      key: "building",
      type: "Building permit",
      outro: "Timeline is roughly 8–12 business days once your drawings are complete. Want me to help you start the application?",
    };
  if (l.match(/cafe|café|restaurant|coffee|bakery/))
    return {
      intro: "Opening a café requires a **Business License** plus food handler certification for all staff.",
      key: "cafe",
      type: "Business license",
      outro: "A Toronto Public Health inspection is required before the license is issued. Ready to start?",
    };
  if (l.match(/food truck|street vendor/))
    return {
      intro: "A food truck needs a **Business License** plus a **Street Vending Permit** ($1,200–$2,400/year by zone).",
      key: "truck",
      type: "Street vendor permit",
      outro: "Timeline: about 3–4 business days. Want to get started?",
    };
  if (l.match(/event|festival|block party|gathering/))
    return {
      intro: "Any public gathering of 50+ people on public property needs a **Special Event Permit**.",
      key: "event",
      type: "Special event permit",
      outro:
        "Apply at least 30 days before your event. Road closure? Add a Road Occupancy Permit ($285). Want to start?",
    };
  if (l.match(/basement|secondary suite|apartment/))
    return {
      intro: "Creating a basement apartment requires a **building permit** plus a zoning review.",
      key: "basement",
      type: "Building permit — Basement",
      outro: "Want me to help you apply?",
    };
  if (l.match(/fence/))
    return "Most residential fences in Toronto **don't require a permit** as long as they're under 2m in the rear or side yard, or under 1m in the front yard.\n\nHowever, pool enclosure fences **always** require a permit.";
  if (l.match(/tree/))
    return {
      intro: "A **Tree Removal Permit** is required for any tree with a trunk circumference of 30cm or more.",
      key: "tree",
      type: "Tree removal permit",
      outro: "Note: removal may be refused if the tree is healthy. Would you like to start an application?",
    };
  if (l.match(/cost|fee|how much/))
    return "Fees vary by permit type:\n- Building permit: $185 + ~0.6% of project value\n- Business license: $160–$567/year\n- Event permit: $210–$850+\n- Street vending: $1,200–$2,400/year\n\nDescribe your project and I can give you a closer estimate.";
  return "Could you tell me more about your project? Is this a home renovation, a new business, a public event, or something else? The more detail you share, the more specific I can be.";
}

// Chat suggestion chips
export const CHIPS: { label: string; prompt: string }[] = [
  { label: "Build a backyard deck", prompt: "I want to add a deck to my backyard" },
  { label: "Open a café", prompt: "I want to open a small café" },
  { label: "Host a block party", prompt: "I want to host a block party on my street" },
  { label: "Basement apartment", prompt: "I want to renovate my basement into an apartment" },
  { label: "Put up a fence", prompt: "Do I need a permit to put up a fence?" },
  { label: "Food truck permit", prompt: "I want to operate a food truck on King Street" },
];
