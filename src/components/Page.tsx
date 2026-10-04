import type { Content } from "@/content/types";
import { About } from "./About";
import { Availability } from "./Availability";
import { BubuEgg } from "./BubuEgg";
import { Contact } from "./Contact";
import { Education } from "./Education";
import { Experience } from "./Experience";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Manifesto } from "./Manifesto";
import { Nav } from "./Nav";
import { Projects } from "./Projects";
import { Publications } from "./Publications";
import { Skills } from "./Skills";

export function Page({ c }: { c: Content }) {
  return (
    <>
      <Nav c={c} />
      <main id="conteudo">
        <Hero c={c} />
        <About c={c} />
        <Manifesto c={c} />
        <Skills c={c} />
        <Experience c={c} />
        <Projects c={c} />
        <Education c={c} />
        <Publications c={c} />
        <Availability c={c} />
        <Contact c={c} />
      </main>
      <Footer c={c} />
      <BubuEgg c={c} />
    </>
  );
}
