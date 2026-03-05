// ─── Site Content Data ─────────────────────────────────────────────────────

export const services = [
  {
    id: "ai-automation",
    icon: "Zap",
    title: "AI Automatizacija",
    shortDescription:
      "Automatiziramo ponavljajuće zadatke i procese kako bi vaš tim mogao raditi brže i fokusirati se na važnije stvari.",
    description:
      "Pomažemo tvrtkama automatizirati ponavljajuće procese pomoću AI sustava koji se integriraju u postojeće alate i poslovne procese. Na taj način vaš tim može trošiti manje vremena na ručni rad, a više na stvari koje donose rast.",
    outcomes: [
      "Manje ručnog rada",
      "Brži i točniji prijenos podataka između sustava",
      "Automatizirani procesi koji rade 24/7",
      "Bolja kontrola i pregled poslovnih procesa",
    ],
    deliverables: [
      "Plan automatizacije prilagođen vašem poslovanju",
      "Integracija s postojećim alatima i sustavima",
      "Dashboard za praćenje automatizacija",
      "Dokumentacija i podrška",
    ],
    timeline: "1–2 tjedna",
    color: "from-violet-500 to-indigo-600",
  },
  {
    id: "content-pipelines",
    icon: "FileText",
    title: "AI izrada sadržaja",
    shortDescription:
      "Automatiziramo produkciju sadržaja za marketing, društvene mreže i kampanje bez povećanja troškova i broja zaposlenih.",
    description:
      "Kreiramo AI sadržaj za brzu i skalabilnu izradu marketinškog sadržaja — od reklama za društvene mreže do videa i vizuala proizvoda. Automatiziramo produkciju sadržaja kako biste mogli kontinuirano objavljivati kvalitetne materijale prilagođene vašem brendu i publici. Od promotivnih videa i recenzija proizvoda do vizuala za kampanje, AI alati omogućuju bržu produkciju, testiranje i optimizaciju sadržaja za različite kanale i društvene mreže.",
    outcomes: [
      "Više sadržaja uz dosljedan vizualni identitet brenda",
      "Brža izrada reklama za društvene mreže",
      "AI generirani video i vizuali proizvoda",
      "Skalabilna produkcija sadržaja za više platformi",
    ],
    deliverables: [
      "AI generirani promotivni video sadržaj",
      "Video recenzije proizvoda i demonstracije",
      "Vizuali i slike proizvoda za marketing",
      "Reklame optimizirane za društvene mreže",
    ],
    timeline: "1 radni dan",
    color: "from-cyan-500 to-blue-600",
    image: "/images/services/ai_sadrzaj.png",
  },
  {
    id: "custom-llm-apps",
    icon: "BrainCircuit",
    title: "AI chatbotovi 24/7",
    shortDescription:
      "Implementiramo pametne chatbotove koji odgovaraju na upite korisnika, pomažu u prodaji i automatiziraju korisničku podršku.",
    description:
      "Implementiramo pametne AI chatbotove koji odgovaraju na pitanja kupaca, automatiziraju podršku i pomažu u prodaji. Chatbot može raditi na vašoj web stranici, WhatsAppu ili društvenim mrežama te koristiti vaše podatke kako bi davao točne odgovore.",
    outcomes: [
      "Odgovori kupcima 24/7 bez čekanja",
      "Automatizacija do 80% korisničkih upita",
      "Brža podrška i bolji korisnički doživljaj",
      "Povećanje konverzije na web stranici",
      "Odgovori korisnicima unutar nekoliko sekundi",
    ],
    deliverables: [
      "AI chatbot integriran u web stranicu",
      "Integracija s vašim sustavima i bazama podataka",
      "Analitika razgovora i optimizacija odgovora",
    ],
    timeline: "1 radni dan",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "data-integrations",
    icon: "Globe",
    title: "AI Web Stranice",
    shortDescription:
      "Izrađujemo moderne web stranice uz pomoć AI alata koje su optimizirane za brzinu i konverzije.",
    description:
      "Izrađujemo moderne web stranice (poput naše) uz pomoć AI alata koji ubrzavaju razvoj, optimiziraju dizajn i povećavaju konverzije. Stranice su brze, optimizirane za SEO i spremne za marketing kampanje.",
    outcomes: [
      "Profesionalna web stranica prilagođena vašem brendu",
      "Web stranica izrađena unutar nekoliko dana",
      "Bolja konverzija posjetitelja u klijente",
      "Moderna i brza web infrastruktura",
    ],
    deliverables: [
      "Dizajn i razvoj moderne web stranice",
      "Optimizacija za tražilice (SEO) i performanse",
      "Spremno za oglašavanje i skaliranje",
    ],
    timeline: "2–3 radna dana",
    color: "from-green-500 to-teal-600",
    image: "/images/services/web-stranice.png",
  },
];

export const process = [
  {
    step: "01",
    title: "Otkrijemo",
    description:
      "Provodimo fokusirani discovery sprint — intervjui sa dionicima, mapiranje procesa, revizija podataka — kako bismo razumjeli vaše poslovanje i identificirali AI prilike s najvećom polugom.",
  },
  {
    step: "02",
    title: "Dizajniramo",
    description:
      "Arhitekturiramo rješenje: tokovi podataka, modeli, integracije, UX. Vi pregledate i odobravate sve prije nego što se napiše ijedna linija produkcijskog koda.",
  },
  {
    step: "03",
    title: "Izgradimo",
    description:
      "Brzi, iterativni razvoj s tjednim demonstracijama. Isporučujemo na staging rano kako biste mogli validirati nasuprot stvarnoj upotrebi — bez velikih lansiranja odjednom.",
  },
  {
    step: "04",
    title: "Skaliramo",
    description:
      "Puštanje u rad, praćenje, optimizacija. Ostajemo uz vas kako bismo osigurali glatku predaju, obučimo vaš tim i ostajemo dostupni kao strateški partner dok rastete.",
  },
];

export const caseStudies = [
  {
    id: "clearpath-finance",
    slug: "clearpath-finance",
    client: "ClearPath Finance",
    title: "Automatizacija Obrade Kredita od 40 milijuna $ uz Pomoć AI-ja",
    category: "AI Automatizacija",
    tags: ["Automatizacija", "LLM", "Financije"],
    description:
      "Kako smo pomogli zajmodavcu srednje veličine smanjiti vrijeme obrade kredita za 74% bez doticanja njihovog temeljnog bankarskog sustava.",
    problem:
      "Tim za kreditno poslovanje ClearPatha bio je preplavljen ručnim pregledom dokumenata — u prosjeku 11 dana po zahtjevu, s visokim stopama pogrešaka i rastućim rizikom usklađenosti.",
    approach:
      "Dizajnirali smo pipeline za inteligenciju dokumenata koristeći fino podešeni model klasifikacije, sloj OCR ekstrakcije i automatizaciju stabla odlučivanja koja se integrirala putem API-ja s njihovim postojećim LOS-om.",
    results: [
      "74% smanjenje vremena obrade (11 dana → 2,8 dana)",
      "91% stopa automatizacije za standardne zahtjeve",
      "2,3 milijuna $ godišnje uštede u operativnim troškovima",
      "Nula incidenata usklađenosti u prvih 12 mjeseci",
    ],
    year: "2024",
    coverImage: "/images/work/clearpath.jpg",
    featured: true,
  },
  {
    id: "nova-ecommerce",
    slug: "nova-ecommerce",
    client: "Nova Commerce",
    title: "AI Sustav za Sadržaj koji Generira 4.000 SKU-ova Mjesečno",
    category: "AI Pipeline-ovi za Sadržaj",
    tags: ["Sadržaj", "E-commerce", "Skaliranje"],
    description:
      "Izgradnja pipeline-a za sadržaj konzistentnog s brandom koji je šesteročlani tim za sadržaj pretvorio u operaciju od 40 ljudi — uz djelić troška.",
    problem:
      "Nova je trebala opise proizvoda, e-mail kopije i sadržaj za društvene mreže za 4.000+ novih SKU-ova mjesečno. Njihov tim imao je 6 ljudi. Kvaliteta je bila nekonzistentna, rokovi su propuštani.",
    approach:
      "Izgradili smo višestupanjski pipeline za sadržaj s fino podešavanjem glasa branda, automatiziranim QA ocjenjivanjem i slojem ljudskog pregleda za rubne slučajeve — sve integrirano u njihov PIM sustav.",
    results: [
      "4.000 opisa proizvoda generiranih mjesečno",
      "98,2% ocjena konzistentnosti branda (poraslo s 71%)",
      "Troškovi upravljanja sadržajem smanjeni za 62%",
      "Vrijeme do objave skraćeno s 3 tjedna na 48 sati",
    ],
    year: "2024",
    coverImage: "/images/work/nova.jpg",
    featured: true,
  },
  {
    id: "atlas-legal",
    slug: "atlas-legal",
    client: "Atlas Legal Group",
    title: "Interni LLM koji Poznaje Svaki Slučaj, Klauzulu i Presedan",
    category: "Prilagođene LLM Aplikacije",
    tags: ["LLM", "Pravo", "RAG"],
    description:
      "Prilagođeni asistent za znanje koji 120 odvjetnika ima trenutačan pristup 15 godišnjoj internoj povijesti predmeta, ugovorima i istraživanjima.",
    problem:
      "Stariji suradnici trošili su 30% naplatnih sati na interno dohvaćanje znanja — pretražujući nestrukturirane Sharepoint dokumente, e-mail niti i stare spise predmeta.",
    approach:
      "Izgradili smo RAG-temeljenog LLM asistenta s kontrolama sigurnog pristupa, preciznim citiranjem izvora i slojem ocjenjivanja pouzdanosti kako bi se spriječile halucinacije u pravnom kontekstu.",
    results: [
      "30% smanjenje vremena dohvaćanja znanja",
      "4,1 milijun $ povraćenih naplatnih sati godišnje",
      "100% odgovora s citiranim izvorima",
      "Implementiran u 3 ureda za 9 tjedana",
    ],
    year: "2023",
    coverImage: "/images/work/atlas.jpg",
    featured: true,
  },
];

export const testimonials = [
  {
    id: 1,
    quote:
      "Aiva nam nije samo izgradila alat — temeljito su promijenili način na koji naš operativni tim radi. ROI je bio vidljiv unutar 60 dana od lansiranja.",
    author: "Sarah Chen",
    role: "COO, ClearPath Finance",
    avatar: "/images/avatars/sarah.jpg",
  },
  {
    id: 2,
    quote:
      "Radio sam s AI dobavljačima koji previše obećavaju, a premalo isporučuju. Aiva je bila suprotnost — konzervativne procjene, iznimno izvršenje.",
    author: "Marcus Webb",
    role: "Head of Digital, Nova Commerce",
    avatar: "/images/avatars/marcus.jpg",
  },
  {
    id: 3,
    quote:
      "Pravni asistent koji su izgradili postao je istinski nezamjenljiv. Naši odvjetnici odbijaju raditi bez njega. To je najbolja preporuka koju mogu dati.",
    author: "Dr. Priya Nair",
    role: "Managing Partner, Atlas Legal Group",
    avatar: "/images/avatars/priya.jpg",
  },
];

export const faqs = [
  {
    id: 1,
    question: "S kojim vrstama poduzeća surađujete?",
    answer:
      "Radimo s malim i srednjim tvrtkama, startupima i digitalnim brendovima koji žele automatizirati procese i povećati učinkovitost uz AI.",
  },
  {
    id: 2,
    question: "Koliko traje implementacija AI rješenja?",
    answer:
      "Ovisno o kompleksnosti projekta, implementacija može trajati do nekoliko dana.",
  },
  {
    id: 3,
    question: "Trebamo li tehnički tim da koristimo AI rješenja?",
    answer:
      "Ne. Naša rješenja su dizajnirana da budu jednostavna za korištenje i integriraju se u vaše postojeće alate i procese.",
  },
  {
    id: 4,
    question: "Može li se AI integrirati u naše postojeće sustave?",
    answer:
      "Da. AI sustavi koje razvijamo mogu se integrirati s vašim postojećim alatima poput CRM-a, web stranica, marketing platformi i drugih poslovnih sustava.",
  },
  {
    id: 5,
    question: "Koliko košta implementacija AI sustava?",
    answer:
      "Cijena ovisi o kompleksnosti projekta i potrebama vašeg poslovanja. Nakon uvodnog razgovora možemo vam dati jasnu procjenu.",
  },
  {
    id: 6,
    question: "Kako započeti suradnju?",
    answer:
      "Najjednostavnije je rezervirati uvodni poziv gdje ćemo analizirati vaše potrebe i predložiti konkretna AI rješenja.",
  },
  {
    id: 7,
    question: "Je li AI rješenje prilagođeno našem poslovanju?",
    answer:
      "Da. Svako rješenje dizajniramo prema vašim procesima, ciljevima i postojećim alatima kako bi donijelo maksimalnu vrijednost.",
  },
];

export const teamMembers = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Founder & CEO",
    bio: "Bivši voditelj ML-a u fintech kompaniji serije C. Gradi AI sustave u velikom obimu 8 godina prije osnivanja Aive.",
    avatar: "/images/team/alex.jpg",
    linkedin: "#",
  },
  {
    id: 2,
    name: "Jordan Kim",
    role: "Head of Engineering",
    bio: "Bivši Google inženjer infrastrukture. Opsjednut sustavima koji nikad ne padaju i kodom koji je zadovoljstvo održavati.",
    avatar: "/images/team/jordan.jpg",
    linkedin: "#",
  },
  {
    id: 3,
    name: "Maya Osei",
    role: "AI Research Lead",
    bio: "Doktorat iz NLP-a, bivša istraživačica u vodećem AI istraživačkom laboratoriju. Pretvara vrhunska istraživanja u produkcijski spreman rješenja.",
    avatar: "/images/team/maya.jpg",
    linkedin: "#",
  },
  {
    id: 4,
    name: "Tom Lawson",
    role: "Head of Design & DX",
    bio: "Dizajner opsjednut zanatom koji vjeruje da sjajni AI alati trebaju biti jednako lijepi koliko i moćni.",
    avatar: "/images/team/tom.jpg",
    linkedin: "#",
  },
];

export const packages = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Dokaži koncept",
    price: "Od 8.000 $",
    description: "Savršeno za tvrtke koje prvi put istražuju AI ili validiraju specifičan slučaj upotrebe prije skaliranja.",
    features: [
      "2-tjedni discovery sprint",
      "1 automatizacija ili MVP izgradnja",
      "Integracija s do 3 sustava",
      "30-dnevni prozor podrške",
      "Dokumentacija i priručnici",
    ],
    cta: "Započnite",
    highlighted: false,
  },
  {
    id: "growth",
    name: "Rast",
    tagline: "Skalirajte ono što funkcionira",
    price: "Od 24.000 $",
    description: "Za tvrtke spremne prijeći s pilota na produkciju s robusnim, skalabilnim AI sustavom.",
    features: [
      "Sve iz Startera",
      "Potpuna produkcijska izgradnja (6–10 tjedana)",
      "Neograničene integracije",
      "Radni tokovi s ljudskim nadzorom",
      "90 dana podrške i optimizacije",
      "Sesije obuke tima",
      "Mjesečni izvještaji o učinkovitosti",
    ],
    cta: "Najpopularnije",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Transformirajte u velikom obimu",
    price: "Po dogovoru",
    description: "Sveobuhvatna AI transformacija kroz više poslovnih jedinica s namjenskom podrškom.",
    features: [
      "Sve iz paketa Rast",
      "AI arhitektura za više sustava",
      "Namjenski Aiva inženjer",
      "Prioritetni SLA (<4 sata odgovora)",
      "Pregled usklađenosti i sigurnosti",
      "Tromjesečni strateški pregledi",
      "Fleksibilni retainer model",
    ],
    cta: "Dogovorite poziv",
    highlighted: false,
  },
];

export const toolingStack = [
  { category: "AI / LLM", items: ["OpenAI GPT-4o", "Anthropic Claude", "Mistral", "LangChain", "LlamaIndex"] },
  { category: "Vector Stores", items: ["Pinecone", "Weaviate", "pgvector", "Qdrant"] },
  { category: "Automatizacija", items: ["n8n", "Make", "Zapier", "Custom Python agents"] },
  { category: "Backend", items: ["Python", "FastAPI", "Node.js", "PostgreSQL", "Redis"] },
  { category: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { category: "Infrastruktura", items: ["AWS", "GCP", "Vercel", "Docker", "Terraform"] },
  { category: "Observabilnost", items: ["LangSmith", "Helicone", "Sentry", "Grafana"] },
];

export const clients = [
  { name: "ClearPath Finance", logo: "/images/clients/clearpath.svg" },
  { name: "Nova Commerce", logo: "/images/clients/nova.svg" },
  { name: "Atlas Legal Group", logo: "/images/clients/atlas.svg" },
  { name: "Meridian Health", logo: "/images/clients/meridian.svg" },
  { name: "Vantage SaaS", logo: "/images/clients/vantage.svg" },
  { name: "Apex Logistics", logo: "/images/clients/apex.svg" },
];
