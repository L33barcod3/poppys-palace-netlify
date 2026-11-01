# Poppy's Palace: site notes

Plain-English notes on where the site lives and how to look after it.

## The live site

- **Address:** https://poppys-palace.netlify.app
- **Netlify dashboard:** https://app.netlify.com/projects/poppys-palace
- **Code on GitHub:** https://github.com/L33barcod3/poppys-palace-netlify
- **Folder on this computer:** `A:\poppys-palace-site`

The folder name must never contain an apostrophe ('), or the site won't build.

The older test version is still online at https://poppys-palace-old.netlify.app. You can delete it in Netlify if you no longer need it.

The Lovable version and its GitHub repository (`L33barcod3/poppys-palace`) were left exactly as they were.

## See the site on your computer

Open a terminal in `A:\poppys-palace-site` and run:

```sh
npm run dev
```

Open http://localhost:3000. The page updates by itself every time you save a file. Press Ctrl+C in the terminal to stop it.

(Only on a new computer, run `npm install` once first.)

## Make a change and put it live

1. Make your change and save the file.
   - Donate link, fundraising figures, charity details, events, social links and gallery photos are all in `src/config/site.ts`.
   - Photos go in the `public/images` folder.
2. Put it live:

   ```sh
   netlify deploy --build --prod
   ```

3. Save a copy to GitHub:

   ```sh
   git add -A
   git commit -m "Say what you changed"
   git push
   ```

## What's different from the Lovable version

- **Photos** are now stored in the site itself (`public/images`) instead of on Lovable's servers. Poppy's photo still shows faded on both sides of the welcome section and softly behind "Our story".
- **The contact form** works the same as before: it opens the visitor's own email app with their message ready to send. Nothing is stored on the website.
- **The two AI helper boxes on the Contact page are switched off** ("Not sure where to start?" and "Ask the palace"). They only worked inside Lovable, using Lovable's paid AI service. Their wording is kept. Setting `SHOW_AI_HELPERS` to `true` in `src/config/site.ts` shows them again, but they would need a paid AI service to answer anything.
- **Removed:** error reporting that sent details to Lovable's editor, and Lovable's own project and build settings.
- **Unchanged:** all the text, the design, the GoFundMe link and the progress bar figures.

## Still to supply

Look for `[PLACEHOLDER]` in `src/config/site.ts` and the page files. Still needed:

- [ ] Registered charity number
- [ ] Charity email address. Contact form messages go here, so this matters most.
- [ ] Real events (title, date, time, place, description)
- [ ] Facebook and Instagram links
- [ ] Final "Our story" wording and the other text marked `[PLACEHOLDER]`
- [ ] More photos to replace the four illustrations in the gallery (optional)
