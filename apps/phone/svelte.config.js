import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: "index.html",
      precompress: false,
    }),
    alias: {
      "@field-os/kernel": "../../packages/kernel/src/index.ts",
    },
    prerender: {
      entries: [
        "/",
        "/today",
        "/door",
        "/inspect",
        "/plan",
        "/you",
        "/settings",
        "/reference",
        "/office",
      ],
    },
    serviceWorker: {
      register: false,
    },
  },
};

export default config;
