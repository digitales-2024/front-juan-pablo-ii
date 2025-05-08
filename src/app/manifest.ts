import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "#8936FF",
    background_color: "#2EC6FE",
    start_url: "/",
    scope: "/",
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "icon512_maskable.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "512x512",
        src: "icon512_rounded.png",
        type: "image/png",
      },
      {
        purpose: "any",
        sizes: "192x192",
        src: "icon192.png",
        type: "image/png",
      },
    ],
    orientation: "any",
    display: "standalone",
    dir: "auto",
    lang: "es-419",
    name: "Juan Pablo II",
    short_name: "Juan Pablo II",
    description: "Sistema administrativo",
  }
}
