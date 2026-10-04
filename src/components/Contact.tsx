import type { Content } from "@/content/types";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Contact({ c }: { c: Content }) {
  const { contact, interests } = c;
  return (
    <Section id="contato" index="09" title={contact.title} className="pb-16 sm:pb-24">
      <Reveal className="flex flex-wrap gap-4">
        {contact.links.map((l, i) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn !px-8 !py-4 !text-base ${i === 0 ? "btn-solid" : ""}`}
          >
            {l.label}
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </Reveal>

      <Reveal className="mt-20">
        <h3 className="eyebrow mb-5">
          {interests.title} · {interests.label}
        </h3>
        <ul className="grid gap-4 sm:grid-cols-2">
          {interests.people.map((p) => (
            <li key={p.name} className="glass rounded-2xl px-6 py-5">
              <p className="font-display text-2xl">{p.name}</p>
              <p className="mt-1 text-sm text-muted">{p.role}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
