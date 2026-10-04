import type { Metadata } from "next";
import type { Content } from "@/content/types";
import { asset } from "./asset";

// Used to resolve the Open Graph image to an absolute URL; override at build time.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuwget.github.io";

export function buildMetadata(c: Content): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: c.meta.title,
    description: c.meta.description,
    icons: { icon: asset("/icon.svg") },
    openGraph: {
      title: c.meta.title,
      description: c.meta.description,
      images: [asset("/images/dudu-hero-1600.webp")],
      locale: c.htmlLang.replace("-", "_"),
    },
  };
}
