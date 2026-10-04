import type { ReactNode } from "react";
import { Document } from "@/components/Document";
import { en } from "@/content/en";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(en);

export default function Layout({ children }: { children: ReactNode }) {
  return <Document lang="en">{children}</Document>;
}
