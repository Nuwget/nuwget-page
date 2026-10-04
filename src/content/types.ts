export type Lang = "pt" | "en";

export type Role = {
  title: string;
  company: string;
  type: string;
  period: string;
  place: string;
  summary?: string;
  bullets: string[];
  skills: string[];
  moreSkills?: string;
};

export type Certificate = {
  name: string;
  issuer: string;
  date: string | null;
  credential: string | null;
};

export type Project = {
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  highlights?: string[];
};

export type Content = {
  lang: Lang;
  htmlLang: string;
  meta: { title: string; description: string };
  ui: {
    skip: string;
    nav: { id: string; label: string }[];
    switchTo: { label: string; href: string; aria: string };
    scrollHint: string;
    showAll: string;
    hideAll: string;
    credential: string;
    expires: string;
    projectLinksPending: string;
    heroAlt: string;
    closingAlt: string;
  };
  hero: {
    name: string;
    handle: string;
    headline: string[];
    location: string;
    school: string;
    profileLang: string;
    linkedin: string;
    followers: string;
    network: string;
  };
  about: {
    title: string;
    intro: string;
    quote: string;
    paragraphs: string[];
    tags: string[];
  };
  manifesto: { lead: string; body: string; ai: string; closing: string };
  availability: {
    title: string;
    status: string;
    interestIntro: string;
    interests: { icon: string; text: string }[];
  };
  stack: {
    title: string;
    rows: { area: string; items: string[] }[];
    studying: string;
    rolesTitle: string;
    roleSkills: string[];
  };
  services: { title: string; items: string[] };
  experience: { title: string; roles: Role[] };
  education: {
    title: string;
    school: string;
    degree: string;
    period: string;
    introList: string;
    items: string[];
    skills: string[];
    moreSkills: string;
    projectsLabel: string;
    projects: { name: string; href: string }[];
  };
  certificates: {
    title: string;
    list: Certificate[];
    intermediateTitle: string;
    intermediate: string;
  };
  projects: { title: string; list: Project[] };
  publications: { title: string; list: { title: string; text: string }[] };
  interests: { title: string; label: string; people: { name: string; role: string }[] };
  contact: {
    title: string;
    links: { label: string; href: string }[];
  };
  footer: string;
};
