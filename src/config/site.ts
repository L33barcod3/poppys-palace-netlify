import poppyPhoto from "../../public/images/poppy.jpg.asset.json";
import pinkBowsPhoto from "../assets/poppy-pink-bows.jpeg.asset.json";
import blowingKissPhoto from "../assets/poppy-blowing-kiss.jpeg.asset.json";
import balloons from "../assets/gallery-balloons.jpg";
import crownArt from "../assets/gallery-crown.jpg";
import poppyFlowers from "../assets/gallery-poppy-flowers.jpg";
import sunriseBird from "../assets/gallery-sunrise.jpg";

/* =====================================================================
   POPPY'S PALACE — EVERYTHING YOU MIGHT WANT TO CHANGE LIVES HERE
   Anything marked [PLACEHOLDER] should be replaced with real details.
   ===================================================================== */

// The ONE donate link used by every Donate button on the site.
// It opens the GoFundMe fundraiser in a new tab.
export const DONATE_URL = "https://www.gofundme.com/f/poppy-kay-clarke";

// Fundraising progress — UPDATED BY HAND. When the totals move, change
// these numbers; the bar, donation count and "as of" date update by themselves.
export const FUNDRAISING = {
  target: 2000,
  raised: 1801,
  donations: 33,
  asOf: "31 October 2026",
};

// Charity details. [PLACEHOLDER] — add the registered charity number when you have it.
export const CHARITY = {
  name: "In Your Shoes",
  number: "[PLACEHOLDER] registered charity number",
  email: "[PLACEHOLDER] hello@poppyspalace.org",
};

// [PLACEHOLDER] Social links
export const SOCIALS = {
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
};

// Suggested donation amounts (they all go to DONATE_URL)
export const SUGGESTED_AMOUNTS = [5, 10, 25, 50, 100];

export type PalaceEvent = {
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  link?: string;
};

// EVENTS — add, remove or edit entries. Past/upcoming is worked out from the date.
export const EVENTS: PalaceEvent[] = [
  {
    title: "[PLACEHOLDER] Princess Tea Party",
    date: "2026-12-05",
    time: "2pm – 5pm",
    location: "[PLACEHOLDER] Village Hall",
    description: "[PLACEHOLDER] Cakes, crowns and a little sparkle. Dress-up very welcome!",
    link: "https://example.com",
  },
  {
    title: "[PLACEHOLDER] Winter Lantern Walk",
    date: "2026-12-19",
    time: "4pm",
    location: "[PLACEHOLDER] The Park Gates",
    description: "[PLACEHOLDER] A gentle walk with lanterns to remember and to hope together.",
  },
  {
    title: "[PLACEHOLDER] Spring Bake Sale",
    date: "2027-03-14",
    time: "10am – 1pm",
    location: "[PLACEHOLDER] Market Square",
    description: "[PLACEHOLDER] Homemade treats, all proceeds to the charity.",
  },
  {
    title: "[PLACEHOLDER] Summer Fun Run",
    date: "2026-07-12",
    time: "9am",
    location: "[PLACEHOLDER] Riverside",
    description: "[PLACEHOLDER] Our very first event — thank you to everyone who ran!",
  },
];

// GALLERY — the pictures shown on the Gallery page.
// Three real photos of Poppy, followed by four gentle illustration stand-ins.
// Uploaded photos stay unchanged and use CDN asset pointers in src/assets.
// Add the pointer import above, then use its .url as the picture's "src".
// "tall: true" makes a picture stand upright; leave it out for a wide one.
// "w" and "h" are the picture's own width and height — they stop the page
// jumping about while the pictures load.
export const GALLERY: { src?: string; alt: string; tall?: boolean; w?: number; h?: number }[] = [
  {
    src: poppyPhoto.url,
    alt: "Poppy smiling in her colourful floral dress, holding pink flowers",
    tall: true,
    w: 762,
    h: 1163,
  },
  { src: pinkBowsPhoto.url, alt: "Poppy smiling with pink bows in her hair, sitting on a blue seat", tall: true, w: 1014, h: 1413 },
  { src: blowingKissPhoto.url, alt: "Poppy blowing a kiss in a pink gingham dress and cardigan", tall: true, w: 720, h: 960 },
  { src: poppyFlowers, alt: "Illustration of red poppy flowers swaying in a meadow", tall: true, w: 768, h: 1024 },
  { src: crownArt, alt: "Illustration of a jewelled golden crown resting on cream satin", w: 1024, h: 768 },
  { src: sunriseBird, alt: "Illustration of a small bird flying at sunrise among pink petals", tall: true, w: 768, h: 1024 },
  { src: balloons, alt: "Illustration of red, blue, orange and pink balloons on a grassy riverbank", w: 1024, h: 768 },
];

// Poppy's original photo, shared by the hero and Our story.
export const POPPY_PHOTO = poppyPhoto.url;

export function splitEvents(today = new Date()) {
  const t = new Date(today.toDateString()).getTime();
  const sorted = [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));
  return {
    upcoming: sorted.filter((e) => new Date(e.date).getTime() >= t),
    past: sorted.filter((e) => new Date(e.date).getTime() < t).reverse(),
  };
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function formatDate(d: string) {
  const [y = 0, m = 1, day = 1] = d.split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, day)).getUTCDay();
  return `${DAYS[dow]} ${day} ${MONTHS[m - 1]} ${y}`;
}
