import type { Content } from "./types";
import { pt } from "./pt";

// English version: a faithful translation of the Portuguese README content.
// Proper nouns, links, technologies, credentials and dates are shared with `pt`.
export const en: Content = {
  ...pt,
  lang: "en",
  htmlLang: "en",
  meta: {
    title: "Nuwget · César Rodrigues Ribeiro",
    description:
      "Full-Stack Dev | Developer | FastAPI | Python | Node | React | React Native | Mobile | SQL | Firebase | Cybersecurity",
  },
  ui: {
    skip: "Skip to content",
    nav: [
      { id: "sobre", label: "About" },
      { id: "stack", label: "Stack" },
      { id: "experiencia", label: "Experience" },
      { id: "projetos", label: "Projects" },
      { id: "contato", label: "Contact" },
    ],
    switchTo: { label: "PT", href: "/", aria: "Ler esta página em português" },
    scrollHint: "Scroll",
    showAll: "Show all",
    hideAll: "Collapse",
    credential: "Credential",
    expires: "expires",
    projectLinksPending: "",
    heroAlt:
      "Dudu wearing headphones in front of a laptop, with Bubu sleeping on the sofa in the background and the moonlit city in the window",
    closingAlt:
      "Dudu, a purple pixel-art bear, coding late at night in a cozy home office",
  },
  hero: {
    ...pt.hero,
    headline: [
      "Full-Stack Dev",
      "Developer",
      "FastAPI",
      "Python",
      "Node",
      "React",
      "React Native",
      "Mobile",
      "SQL",
      "Firebase",
      "Cybersecurity",
    ],
    location: "Praia Grande, São Paulo, Brazil",
    school: "Praia Grande College of Technology (Fatec)",
    profileLang: "Profile in Portuguese",
    network: "500+ connections and 2,376 followers on LinkedIn",
  },
  about: {
    title: "About",
    intro:
      "I'm Dudu, a bear developer who codes while the city sleeps, while Bubu rests in the background.",
    quote: "Working hard to give the world to my Bubu. 💜",
    paragraphs: [
      "I'm César Rodrigues Ribeiro, a Full Stack Developer with a degree in Multiplatform Software Development from FATEC Praia Grande.",
      "My path in technology has taken me through Web, Mobile and API development, across backend, frontend, databases, integrations, testing, security, CI/CD and observability.",
      "My experience is mainly with Python, FastAPI, Django, PostgreSQL, SQL, JavaScript, TypeScript, React and REST APIs, plus tools and practices such as Docker, Git/GitHub, GitHub Actions, pytest, Playwright and Linux.",
      "Along the way, I have also dealt with problems that go beyond code: complex business rules, root-cause investigation, data inconsistencies, integrations with external APIs, webhooks, retries, idempotency, reconciliation, performance and production systems.",
      "I keep deepening my view of software engineering, especially in architecture, quality, observability and reliability. I have experience with tools such as Grafana, Prometheus, Loki, Tempo and Datadog, understanding logs, metrics and traces not only as monitoring, but as tools to investigate and understand systems.",
      "Today, I want to keep growing as a developer, broadening my view of architecture, systems, data, observability and product, while building solutions that solve real problems.",
    ],
    tags: pt.about.tags,
  },
  manifesto: {
    lead: "I also believe that building software is much more than writing code.",
    body: "I like to understand the problem before implementing, question decisions, think about the impact of a change, write tests and look for solutions that keep making sense after they stop being “new code” and become part of a real system.",
    ai: "I use artificial intelligence as a development tool while keeping control over technical decisions: I give context, question, review, test and validate what is produced.",
    closing:
      "Technology is my field. Software engineering is the path I am building.",
  },
  availability: {
    title: "Availability",
    status:
      "Looking for work · Praia Grande, SP · On-site, hybrid or remote (preference for working from home).",
    interestIntro: "Interested in Software Developer opportunities with:",
    interests: [
      { icon: "⚙️", text: "Software architecture" },
      { icon: "📈", text: "Horizontal scaling" },
      { icon: "🧩", text: "Distributed systems and service integration" },
      { icon: "🚀", text: "Performance, reliability and system evolution" },
      { icon: "🧠", text: "Clean, maintainable, long-term code" },
      { icon: "🔍", text: "Good development and engineering practices" },
      { icon: "🏗️", text: "Solutions that truly solve business problems" },
    ],
  },
  stack: {
    title: "Stack",
    rows: [
      { area: "Core skills", items: pt.stack.rows[0].items },
      { area: "Languages", items: pt.stack.rows[1].items },
      { area: "Backend", items: ["FastAPI", "Django", "Node.js", "REST APIs", "Swagger API"] },
      { area: "Frontend and Mobile", items: pt.stack.rows[3].items },
      { area: "Data", items: pt.stack.rows[4].items },
      { area: "Quality", items: pt.stack.rows[5].items },
      { area: "Infra and DevOps", items: pt.stack.rows[6].items },
      { area: "Observability", items: pt.stack.rows[7].items },
      {
        area: "Other",
        items: [
          "Process scheduling",
          "Linear Programming",
          "Business analysis",
          "System architecture",
          "Slack",
        ],
      },
    ],
    studying: "Studying: Ruby and Ruby on Rails.",
    rolesTitle: "Skills for the role at Engenharia de Ecommerce (28)",
    roleSkills: [
      "Python",
      "FastAPI",
      "JavaScript",
      "CSS",
      "BackEnd",
      "Back-end development",
      "Software development",
      "Front-end development",
      "Full-stack development",
      "Web development",
      "Full-Stack Development",
      "Databases",
      "PostgreSQL",
      "Process scheduling",
      "Datadog",
      "Swagger API",
      "Business analysis",
      "System architecture",
      "Slack",
      "SQL",
      "Git",
      "Information technology",
      "HTML",
      "Vite",
      "Makefile",
      "Redis",
      "Linear Programming",
      "QA Engineering",
    ],
  },
  services: {
    title: "Services",
    items: [
      "Application development",
      "Database development",
      "Web development",
      "Software testing",
      "Information security",
      "IT consulting",
      "Cybersecurity",
    ],
  },
  experience: {
    title: "Experience",
    roles: [
      {
        title: "Full-Stack Developer Jr.",
        company: "Engenharia de Ecommerce",
        type: "Full-time",
        period: "Jan 2026 – Aug 2026 (8 months)",
        place: "Praia Grande, SP · On-site",
        summary:
          "I worked on the development and evolution of a Business Intelligence platform for e-commerce, building solutions for sales, inventory, catalog, operations, indicators and financial results analysis. During this time, I dealt with real product and business problems, working mainly on:",
        bullets: [
          "Development and maintenance of complex backend business rules;",
          "Building and evolving REST APIs and integrations with external services, including marketplaces such as Mercado Livre;",
          "Implementing webhooks, events, retries, idempotency and notification recovery mechanisms;",
          "Investigating and fixing discrepancies between APIs, the database and the information shown to users;",
          "Developing backfill, reconciliation and data processing routines;",
          "Working with revenue, margin, taxes, promotions, coupons, costs, shipping, inventory and sales;",
          "Creating and maintaining migrations and automated tests, reducing regression risk;",
          "Refactoring code for readability, organization, performance and maintainability;",
          "Implementing and maintaining features related to authentication, authorization/RBAC and rate limiting;",
          "Taking part in code review, Git/GitHub, Pull Requests and CI/CD processes;",
          "Building responsive interfaces and dashboards with JavaScript, HTML and CSS;",
          "Investigating problems using logs, metrics and traces, with tools such as Datadog, Grafana, Prometheus, Loki and Tempo.",
        ],
        skills: ["Python", "FastAPI"],
        moreSkills: "and 26 more skills",
      },
      {
        title: "Software Developer (Internship)",
        company: "MundoFit",
        type: "Part-time",
        period: "Jan 2025 – Jun 2025 (6 months)",
        place: "São Vicente, SP · Remote",
        bullets: [
          "Development of the mobile app for student management.",
          "Workout, nutrition and authentication screens, and Firebase integration.",
          "React Native on the front end and REST APIs in Node.js.",
          "Software Project Management.",
        ],
        skills: ["CSS", "Customer service"],
        moreSkills: "and 11 more skills",
      },
    ],
  },
  education: {
    ...pt.education,
    title: "Education",
    school: "Praia Grande College of Technology (Fatec)",
    degree: "Technologist in Multiplatform Software Development",
    period: "Jan 2023 – Dec 2025",
    introList: "Covered at FATEC:",
    items: [
      "Systems using Java, C#, Kotlin, Django, Python, HTML, CSS, SQL and noSQL;",
      "Databases using SQL and NoSQL;",
      "Coding basic websites in HTML, CSS, React and XML;",
      "FastAPI;",
      "PSL;",
      "Git and GitHub;",
      "Agile methodologies (Scrum / Kanban) and collaborative development.",
    ],
    skills: ["Information technology", "Java"],
    moreSkills: "and 22 more skills",
    projectsLabel: "College projects:",
  },
  certificates: {
    title: "Licenses and certifications",
    list: pt.certificates.list.map((c) => ({
      ...c,
      date: c.date
        ?.replace("fev.", "Feb")
        .replace("dez.", "Dec")
        .replace("expira", "expires") ?? null,
      name: translateCertificate(c.name),
    })),
    intermediateTitle: "Intermediate Certification, Back-End Developer",
    intermediate:
      "Technology qualification that validates skills in deploying systems on different infrastructures (cloud, VPS, dedicated), database modeling and development, application of software methodologies and programming logic, as well as project management (scope, costs, deadlines and risks) and an entrepreneurial, solution-oriented vision in IT.",
  },
  projects: {
    title: "Projects",
    list: [
      {
        name: "FlowGet",
        tagline: "Task manager rebuilt in Ruby on Rails",
        description:
          "Task manager rebuilt in Ruby on Rails as a learning lab.",
        tech: pt.projects.list[0].tech,
        highlights: [
          "Authentication and authorization",
          "Different access levels",
          "Per-user task isolation",
          "Per-task permissions",
          "Requests to take over responsibilities",
          "Notifications",
          "Activity history",
          "Comments and attachments",
          "Kanban",
          "Admin area",
          "Integration tests",
        ],
      },
      {
        name: "Cluwt",
        tagline: "Featured project on LinkedIn",
        description: "Featured project on LinkedIn (“Cluwt - Overview”, GitHub).",
        tech: [],
      },
      {
        name: "MundoFit",
        tagline: "Mobile app",
        description:
          "Mobile app with HomePage, LoginPage, Progress and DashBoard, TreinoPage and TreinosProgramadosPage screens.",
        tech: pt.projects.list[2].tech,
        highlights: pt.projects.list[2].highlights,
      },
    ],
  },
  publications: {
    title: "LinkedIn posts",
    list: [
      {
        title: "Java 26 is here",
        text: "HTTP/3 in HttpClient, G1 GC improvements, a more “final” `final` via Reflection, the end of Applets, AOT Object Caching, Structured Concurrency, Lazy Constants, Primitive Types in patterns, the Vector API and APIs for cryptographic objects in PEM.",
      },
      {
        title: "FlowGet and the Ruby on Rails journey",
        text: "Rebuilding an old project by applying concepts of architecture, security and code organization.",
      },
      {
        title: "Open to new opportunities",
        text: "Focus on architecture, distributed systems, performance and maintainable code, no “vibe coding”.",
      },
      {
        title: "What Cristiano Ronaldo taught me about being a Software Developer",
        text: "Train, fail, adjust, repeat, evolve.",
      },
      {
        title: "Dev humor",
        text: "“I'm going to bed early today” vs. 02:47 “I just need to figure out why it works on my machine”. 🐈‍⬛💻",
      },
      {
        title: "Code Slop exists",
        text: "AI-generated code that looks like a solution but only masks the problem (fallbacks, wrappers, helpers and `try/except` with no root cause resolved).",
      },
      {
        title: "Writing code is the easy part",
        text: "The challenge is understanding the right problem; quality software impresses by what it leaves uncomplicated.",
      },
      {
        title: "Your AI agent probably writes too much code",
        text: "Ponytail and the rule “before creating, search; before duplicating, reuse; before abstracting, simplify”.",
      },
    ],
  },
  interests: {
    ...pt.interests,
    title: "Interests",
    people: [
      { name: "Elisa Terumi, PhD", role: "AI researcher and engineer" },
      { name: "Alexandre Maioral", role: "President, Oracle Brazil" },
    ],
  },
  contact: { ...pt.contact, title: "Contact" },
  footer:
    "Dudu on the code, Bubu on the sofa. The night is long and the coffee is still warm.",
};

function translateCertificate(name: string): string {
  const map: Record<string, string> = {
    "Inteligência Artificial Básico": "Artificial Intelligence Basics",
    "UX Básico": "UX Basics",
    "Design Patterns Básico": "Design Patterns Basics",
    "DevOps Básico": "DevOps Basics",
    "Computação em Nuvem Básico": "Cloud Computing Basics",
    "Front-End Básico": "Front-End Basics",
    "Desenvolvedor para Dispositivos Móveis": "Mobile Devices Developer",
    "Desenvolvedor Back-End": "Back-End Developer",
    "Certificação Intermediária, Desenvolvedor Back-End":
      "Intermediate Certification, Back-End Developer",
  };
  return map[name] ?? name;
}
