# Poppys Palace

Build me a beautiful, animated, multi-page charity website called Poppy's Palace. It raises money for a charity supporting bereaved parents. It is a personal, heartfelt project, so the tone should be playful and magical like a little princess's palace, but always warm, gentle, hopeful and dignified, never cheesy or corporate.

TECH AND QUALITY
Mobile first, because most visitors will arrive from Facebook or WhatsApp on a phone. Fast and accessible: good contrast, alt text, keyboard friendly, and all motion switched off or reduced for prefers-reduced-motion. Use React Router for pages and Framer Motion for animation.

COLOURS (taken from a little girl's floral African-print dress)
Berry red #8E1B3A, royal blue #2F4FBF, bright orange #F26A1B, blush pink #F2A0B5, cream background #FFF8F2, charcoal text #2B2B33. Set these up as theme colours.

LOGO AND TITLE
- Make a flamboyant, princessy crown as an ornate SVG: jewelled gold band, tall curved points topped with pearls, small hearts and flowers between the points, and gems in the dress colours, with soft gradients and highlights so it looks luxurious. Add tiny twinkling stars around it and a gentle float.
- The words "Poppy's Palace" must be BIG and bold, especially in the hero, and still fit on a phone. Use an elegant, whimsical display font (try Playfair Display, Cinzel Decorative, Lobster Two or Pacifico and pick the best). Give the lettering a gradient through berry red, orange and pink with a soft shadow.
- Animation: the crown drops in first and settles with a little bounce, then the title springs in letter by letter, then a soft shimmer sweeps across the lettering every few seconds.
- Add small poppy flowers swaying around the title.

PHOTO
I will upload a photo of my granddaughter Poppy in the chat shortly. Until then, leave a clearly marked placeholder. When the photo is added, use it as a large, softly faded background on the left and right sides of the hero, with the logo and title centred between them, using a gradient mask so it fades smoothly into the cream background at around 30 to 40 percent opacity so the text stays readable. Add a subtle repeating tropical leaf and flower pattern in the dress colours as section dividers and backgrounds.

PAGES
1. Home: hero, a short "Our story" section (placeholder text), a fundraising progress bar (target and amount raised easy to change from one place), a preview of the next two upcoming events, and a final call to donate.
2. Donate: warm intro about where the money goes, a big Donate button, suggested amount buttons that all link to the same place, a line about what a donation could achieve, and a gentle note with the charity name and registered charity number (placeholders). The donate link is a PLACEHOLDER kept in one single place in the code (a DONATE_URL constant) so it can later point to JustGiving or a Stripe Payment Link. Do not build any card handling or take any payment details on the site.
3. Events: upcoming fundraising events as cards (title, date, time, location, description, optional link), with a friendly message when there are none, plus a past events section. Keep the events in one simple list that is easy to edit.
4. Gallery: a simple masonry photo grid with a lightbox.

MORE ANIMATION (tasteful, not overwhelming)
Gentle fade-and-rise on scroll, slowly floating petals in the dress colours in the hero, slight parallax on the hero photos, a donate button with a soft pulsing glow, animated count-up on the progress bar and amounts, smooth page transitions, and event cards that lift and tilt on hover.

EXTRAS
Sticky navigation with the logo, page links and a Donate button, collapsing to an animated mobile menu. Footer with charity detail placeholders, social media link placeholders and a short privacy note. Open Graph tags so it looks good when shared on Facebook and WhatsApp.

HOW TO WORK
Get the Home page looking great first, then build the other pages. Mark all placeholder text clearly so I can find and replace it. I am not a developer, so keep everything simple and explain changes in plain English.

## Where the site lives now

This site started in [Lovable](https://lovable.dev) and now runs on **Netlify**. It is edited here in code, not in the Lovable editor.

Live address, what changed from Lovable and what still needs filling in: see [SITE-NOTES.md](SITE-NOTES.md).

- Almost everything you'd want to change (donate link, fundraising figures, charity details, events, gallery photos) is in `src/config/site.ts`.
- Photos live in `public/images`.

### See the site on your computer

You need [Node.js](https://nodejs.org/) installed. In a terminal opened in this folder, run these once:

```sh
npm install
```

Then, every time you want to see it:

```sh
npm run dev
```

Open the address it prints (http://localhost:3000). Each time you save a file, the page updates by itself. Press Ctrl+C in the terminal to stop it.

### Put a change live

After saving your changes, run:

```sh
netlify deploy --build --prod
```

Then save your changes to GitHub:

```sh
git add -A
git commit -m "Say what you changed"
git push
```

Note: the folder this site sits in must not have an apostrophe (') in its name, or the build fails.
