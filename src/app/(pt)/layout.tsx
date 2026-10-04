import type { ReactNode } from "react";
import { Document } from "@/components/Document";
import { pt } from "@/content/pt";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(pt);

export default function Layout({ children }: { children: ReactNode }) {
  return <Document lang="pt">{children}</Document>;
}
