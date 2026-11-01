import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tanstackStart({
      // Use src/server.ts (our friendly error page wrapper) as the server entry.
      server: { entry: "server" },
    }),
    // Builds the site for Netlify: pages are made on Netlify's servers, so
    // direct links such as /donate work.
    // The site has no edge functions, so don't start their local helper.
    netlify({ dev: { edgeFunctions: { enabled: false } } }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
});
