export interface Link {
  url: string;
  label?: string;
}

export interface CustomField {
  icon: string;
  text: string;
  link?: string;
}

export interface Basics {
  name: string;
  headline: string;
  email: string;
  location: string;
  website?: Link;
  customFields: CustomField[];
}

export interface ExperienceItem {
  company: string;
  position: string;
  location: string;
  period: string;
  website?: Link;
  /** HTML string with simple <p>/<ul>/<li>/<strong> markup */
  description: string;
}

export interface ProjectItem {
  name: string;
  period: string;
  website?: Link;
  description: string;
}

export interface SkillGroup {
  name: string;
  keywords: string[];
}

export interface LanguageItem {
  language: string;
  fluency: string;
}

export interface Resume {
  basics: Basics;
  summary: string;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
  languages: LanguageItem[];
}

export const resume: Resume = {
  basics: {
    name: "Pablo Vallejo",
    headline: "Senior Backend Engineer · Node.js · TypeScript · Big Data",
    email: "pablo@pablovallejo.dev",
    location: "Bangkok, Thailand",
    customFields: [
      {
        icon: "linkedin",
        text: "pablovallejodev",
        link: "https://linkedin.com/in/pablovallejodev/",
      },
      { icon: "id", text: "Spanish · EU Citizen" },
    ],
  },
  summary:
    "<p>Spanish Senior Backend Engineer, 28 years old, with <strong>8+ years of experience</strong> " +
    "specializing in high-performance microservices and monoliths with real-time Big Data processing. " +
    "Expert in <strong>Node.js and TypeScript/JavaScript</strong>. Proven experience working in " +
    "high-throughput environments (+10M users). Open to permanent and freelance opportunities. " +
    "Clear Thai immigration history with previous student visa.</p>",
  experience: [
    {
      company: "Rrverse Consulting — Telecommunications Company",
      position: "Senior Backend Developer",
      location: "Madrid, ES",
      period: "Nov 2022 — Dec 2025",
      website: { url: "https://rrverse.com/" },
      description:
        "<ul>" +
        "<li>Engineered the <strong>core network anomaly detection back-end</strong> for a +10M client telecommunications network.</li>" +
        "<li>Optimized microservices under a <strong>300ms SLA</strong>, achieving an estimated <strong>60% reduction</strong> in average response time.</li>" +
        "<li>Architected and implemented a real-time Big Data pipeline processing <strong>millions of network events daily</strong>. Integrated <strong>Elastic Machine Learning</strong> for predictive anomaly detection.</li>" +
        "<li>Redesigned complex queries in <strong>ClickHouse, BigQuery, and MariaDB</strong>, cutting data retrieval latency by 30% and ensuring stability during national peak traffic.</li>" +
        "<li>Managed and deployed containerized services using <strong>Kubernetes (Rancher / OpenShift)</strong>, ensuring high availability for critical telecom services.</li>" +
        "<li>Built a real-time client status backend that drastically reduced incident resolution time for the customer support department.</li>" +
        "</ul>",
    },
    {
      company: "Deepfriend LLC",
      position: "Founder & CTO",
      location: "United States (Remote)",
      period: "Apr 2024 — Present",
      website: { url: "https://dfbubbles.com/" },
      description:
        "<p>Side-project turned product: a science-first AI mental health platform based on Cognitive Behavioral Therapy (CBT).</p>" +
        "<ul>" +
        "<li>Designed and deployed a scalable backend for real-time AI-driven conversations using <strong>LLMs</strong>, featuring an advanced memory system and <strong>voice chat under 1s SLA</strong>.</li>" +
        "<li>Architected a sustainable Big Data system on <strong>Google Cloud Platform</strong> to manage sensitive user data with high availability.</li>" +
        "<li>Launched on the <strong>Google Play Store</strong>, reaching <strong>+1k downloads</strong> with a <strong>30% 7-day retention rate</strong> through continuous iteration on user feedback.</li>" +
        "<li>Handled the legal incorporation of the company in Delaware and ensured all data handling met strict privacy requirements.</li>" +
        "</ul>",
    },
    {
      company: "Aszendit Consulting — Renewable Energy Company",
      position: "Backend Developer",
      location: "Madrid, ES",
      period: "Sep 2021 — Nov 2022",
      website: { url: "https://aszendit.com/" },
      description:
        "<ul>" +
        "<li>Designed and implemented a backend to process real-time solar panel generation data.</li>" +
        "<li>Created high-performance microservices serving generation metrics to the client-facing application.</li>" +
        "<li>Contributed actively to the mobile app interface (<strong>Expo / React Native</strong>) and ensured seamless integration with the backend.</li>" +
        "<li>Stepped up to lead the app's final development phase, working in fast-paced 1-week <strong>SCRUM cycles</strong>.</li>" +
        "</ul>",
    },
    {
      company: "Freelance",
      position: "Full-stack Web Developer",
      location: "Barcelona, ES",
      period: "Mar 2018 — Nov 2022",
      description:
        "<p>Designed digital presence and SEO strategies for <strong>10+ SMEs</strong> in retail and services, " +
        "handling everything from domain management to full-stack deployment.</p>",
    },
  ],
  projects: [
    {
      name: "Open Source · Solidity educational examples",
      period: "2021",
      website: { url: "https://github.com/PabloVallejoCrypto/SmartContracts" },
      description:
        "<p>Created and deployed 6 educational smart contracts in Solidity, illustrating different " +
        "blockchain-based DeFi solutions: ERC20 / ERC721 tokens, connecting contracts to exchanges, " +
        "atomic loans and complex encryption patterns for security.</p>" +
        "<p>The same GitHub account also hosts front-end and back-end implementations consuming these " +
        "contracts to showcase real use cases.</p>",
    },
  ],
  skills: [
    {
      name: "Backend & Architecture",
      keywords: [
        "Node.js",
        "TypeScript",
        "JavaScript",
        "Nest.js (microservices & monoliths)",
        "Express.js",
      ],
    },
    {
      name: "Big Data & Observability",
      keywords: [
        "ElasticSearch",
        "RabbitMQ",
        "Kafka",
        "Redis",
        "MQTT",
        "Grafana",
        "Python",
        "NumPy",
        "Pandas",
      ],
    },
    {
      name: "Database Management",
      keywords: [
        "Neo4j (Graph)",
        "PostgreSQL",
        "MariaDB",
        "SQL",
        "Google BigQuery",
        "ClickHouse",
        "InfluxDB",
      ],
    },
    {
      name: "DevOps & Cloud",
      keywords: [
        "Kubernetes (Rancher / OpenShift)",
        "Docker",
        "Google Cloud Platform",
      ],
    },
    {
      name: "Other",
      keywords: [
        "MikroORM / TypeORM / Prisma",
        "Jira",
        "Agile / Scrum",
        "Solidity (Smart Contracts)",
        "Web3",
        "GraphQL",
        "Zod",
      ],
    },
  ],
  languages: [
    { language: "Spanish", fluency: "Native" },
    { language: "Catalan", fluency: "Native" },
    { language: "English", fluency: "Fluent · Full Professional Proficiency" },
    { language: "Thai", fluency: "Beginner" },
  ],
};
