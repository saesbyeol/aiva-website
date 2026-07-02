// ─── Site Content Data (English) ───────────────────────────────────────────

export const services = [
  {
    id: "audit",
    icon: "Search",
    title: "AI Audit",
    shortDescription:
      "We analyze your existing processes, tools, and digital ecosystem to identify concrete opportunities for AI automation.",
    description:
      "Before any implementation, we check where time and money are actually being lost. We analyze your business processes, current tools, workflows, and digital channels, then put together a clear report with prioritized recommendations. You get a concrete action plan, no jargon, just what's worth implementing.",
    outcomes: [
      "Clear visibility into every process that can be automated",
      "A prioritized list of AI opportunities ranked by ROI",
      "A review of your current tools and where the gaps are",
      "Recommendations tailored to your team and budget",
    ],
    deliverables: [
      "A written report with findings and recommendations",
      "A map of automation opportunities",
      "A proposed implementation plan",
      "A video call to walk through the results",
    ],
    timeline: "2–5 business days",
    color: "from-amber-500 to-orange-600",
    image: "/images/services/audit.png",
  },
  {
    id: "ai-automation",
    icon: "Zap",
    title: "AI Automation",
    shortDescription:
      "We automate repetitive tasks and processes so your team can work faster and focus on what matters.",
    description:
      "We help companies automate repetitive processes using AI systems that integrate into their existing tools and workflows. This lets your team spend less time on manual work and more time on things that drive growth.",
    outcomes: [
      "Less manual work",
      "Faster and more accurate data transfer between systems",
      "Automated processes that run 24/7",
      "Better control and visibility over business processes",
    ],
    deliverables: [
      "An automation plan tailored to your business",
      "Integration with your existing tools and systems",
      "A dashboard for monitoring automations",
      "Documentation and support",
    ],
    timeline: "1–2 weeks",
    color: "from-violet-500 to-indigo-600",
    image: "/images/services/n8n-workflow.gif",
  },
  {
    id: "content-pipelines",
    icon: "FileText",
    title: "AI Content Production",
    shortDescription:
      "We automate content production for marketing, social media, and campaigns without adding costs or headcount.",
    description:
      "We create AI content for fast, scalable production of marketing materials: from social media ads to product videos and visuals. We automate content production so you can consistently publish quality materials tailored to your brand and audience. From promotional videos and product reviews to campaign visuals, AI tools enable faster production, testing, and optimization of content across channels and social platforms.",
    outcomes: [
      "More content with a consistent brand visual identity",
      "Faster production of social media ads",
      "AI-generated video and product visuals",
      "Scalable content production across multiple platforms",
    ],
    deliverables: [
      "AI-generated promotional video content",
      "Product review videos and demonstrations",
      "Marketing visuals and product images",
      "Ads optimized for social media",
    ],
    timeline: "1 business day",
    color: "from-cyan-500 to-blue-600",
    image: "/images/services/ai_sadrzaj.png",
  },
  {
    id: "custom-llm-apps",
    icon: "BrainCircuit",
    title: "AI Chatbots 24/7",
    shortDescription:
      "We implement smart chatbots that answer customer questions, support sales, and automate customer support.",
    description:
      "We implement smart AI chatbots that answer customer questions, automate support, and support sales. The chatbot can run on your website, WhatsApp, or social media, and uses your data to provide accurate answers.",
    outcomes: [
      "24/7 responses to customers with no waiting",
      "Automation of up to 80% of customer inquiries",
      "Faster support and a better customer experience",
      "Increased conversion on your website",
      "Responses to customers within seconds",
    ],
    deliverables: [
      "An AI chatbot integrated into your website",
      "Integration with your systems and databases",
      "Conversation analytics and response optimization",
    ],
    timeline: "1 business day",
    color: "from-purple-500 to-pink-600",
    image: "/images/services/chatbot.png",
  },
  {
    id: "data-integrations",
    icon: "Globe",
    title: "AI Websites",
    shortDescription:
      "We build modern websites with the help of AI tools, optimized for speed and conversions.",
    description:
      "We build modern websites (like this one) with the help of AI tools that speed up development, optimize design, and increase conversions. The sites are fast, SEO-optimized, and ready for marketing campaigns.",
    outcomes: [
      "A professional website tailored to your brand",
      "A website built within a few days",
      "Better conversion of visitors into clients",
      "Modern, fast web infrastructure",
    ],
    deliverables: [
      "Design and development of a modern website",
      "Search engine optimization (SEO) and performance tuning",
      "Ready for advertising and scaling",
    ],
    timeline: "2–3 business days",
    color: "from-green-500 to-teal-600",
    image: "/images/services/web-stranice.png",
  },
];

export const process = [
  {
    step: "01",
    title: "Discover",
    description:
      "We run a focused discovery sprint: stakeholder interviews, process mapping, data review, to understand your business and identify the AI opportunities with the biggest leverage.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "We architect the solution: data flows, models, integrations, UX. You review and approve everything before a single line of production code is written.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Fast, iterative development with weekly demos. We ship to staging early so you can validate against real usage, no big-bang launches.",
  },
  {
    step: "04",
    title: "Scale",
    description:
      "Rollout, monitoring, optimization. We stay by your side to ensure a smooth handover, train your team, and remain available as a strategic partner as you grow.",
  },
];

export const testimonials = [
  {
    id: 1,
    quote:
      "Aiva didn't just build us a tool: they fundamentally changed how our operations team works. The ROI was visible within 60 days of launch.",
    author: "Sarah Chen",
    role: "COO, ClearPath Finance",
    avatar: "/images/avatars/sarah.jpg",
  },
  {
    id: 2,
    quote:
      "I've worked with AI vendors who overpromise and underdeliver. Aiva was the opposite: conservative estimates, outstanding execution.",
    author: "Marcus Webb",
    role: "Head of Digital, Nova Commerce",
    avatar: "/images/avatars/marcus.jpg",
  },
  {
    id: 3,
    quote:
      "The legal assistant they built has become truly indispensable. Our attorneys refuse to work without it. It's the best recommendation I can give.",
    author: "Dr. Priya Nair",
    role: "Managing Partner, Atlas Legal Group",
    avatar: "/images/avatars/priya.jpg",
  },
];

export const faqs = [
  {
    id: 1,
    question: "What kinds of businesses do you work with?",
    answer:
      "We work with small and medium-sized companies, startups, and digital brands that want to automate processes and boost efficiency with AI.",
  },
  {
    id: 2,
    question: "How long does implementing an AI solution take?",
    answer:
      "Depending on the complexity of the project, implementation can take anywhere from a few days.",
  },
  {
    id: 3,
    question: "Do we need a technical team to use AI solutions?",
    answer:
      "No. Our solutions are designed to be simple to use and integrate into your existing tools and processes.",
  },
  {
    id: 4,
    question: "Can AI be integrated into our existing systems?",
    answer:
      "Yes. The AI systems we develop can be integrated with your existing tools, such as CRMs, websites, marketing platforms, and other business systems.",
  },
  {
    id: 5,
    question: "How much does implementing an AI system cost?",
    answer:
      "The price depends on the complexity of the project and your business needs. After an initial call, we can give you a clear estimate.",
  },
  {
    id: 6,
    question: "How do we get started?",
    answer:
      "The easiest way is to book an intro call where we'll review your needs and propose concrete AI solutions.",
  },
  {
    id: 7,
    question: "Is the AI solution tailored to our business?",
    answer:
      "Yes. We design every solution around your processes, goals, and existing tools to deliver maximum value.",
  },
];

export const teamMembers = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Founder & CEO",
    bio: "Former Head of ML at a Series C fintech company. Spent 8 years building AI systems at scale before founding Aiva.",
    avatar: "/images/team/alex.jpg",
    linkedin: "#",
  },
  {
    id: 2,
    name: "Jordan Kim",
    role: "Head of Engineering",
    bio: "Former Google infrastructure engineer. Obsessed with systems that never go down and code that's a pleasure to maintain.",
    avatar: "/images/team/jordan.jpg",
    linkedin: "#",
  },
  {
    id: 3,
    name: "Maya Osei",
    role: "AI Research Lead",
    bio: "PhD in NLP, former researcher at a leading AI research lab. Turns cutting-edge research into production-ready solutions.",
    avatar: "/images/team/maya.jpg",
    linkedin: "#",
  },
  {
    id: 4,
    name: "Tom Lawson",
    role: "Head of Design & DX",
    bio: "A designer obsessed with craft who believes great AI tools should be just as beautiful as they are powerful.",
    avatar: "/images/team/tom.jpg",
    linkedin: "#",
  },
];

export const toolingStack = [
  { category: "AI / LLM", items: ["OpenAI GPT-4o", "Anthropic Claude", "Mistral", "LangChain", "LlamaIndex"] },
  { category: "Vector Stores", items: ["Pinecone", "Weaviate", "pgvector", "Qdrant"] },
  { category: "Automation", items: ["n8n", "Make", "Zapier", "Custom Python agents"] },
  { category: "Backend", items: ["Python", "FastAPI", "Node.js", "PostgreSQL", "Redis"] },
  { category: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { category: "Infrastructure", items: ["AWS", "GCP", "Vercel", "Docker", "Terraform"] },
  { category: "Observability", items: ["LangSmith", "Helicone", "Sentry", "Grafana"] },
];

export const clients = [
  { name: "ClearPath Finance", logo: "/images/clients/clearpath.svg" },
  { name: "Nova Commerce", logo: "/images/clients/nova.svg" },
  { name: "Atlas Legal Group", logo: "/images/clients/atlas.svg" },
  { name: "Meridian Health", logo: "/images/clients/meridian.svg" },
  { name: "Vantage SaaS", logo: "/images/clients/vantage.svg" },
  { name: "Apex Logistics", logo: "/images/clients/apex.svg" },
];

// Out of scope for Phase 2 Task 3 — left in Croatian, re-exported unchanged.
export { caseStudies, adShowcase, packages } from "./content";
