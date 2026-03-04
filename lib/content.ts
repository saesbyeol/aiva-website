// ─── Site Content Data ─────────────────────────────────────────────────────

export const services = [
  {
    id: "ai-automation",
    icon: "Zap",
    title: "AI Automatizacija",
    shortDescription:
      "Eliminira repetitivan rad. Gradi inteligentne radne tokove koji rade 24/7 bez ručnog nadzora.",
    description:
      "Dizajniramo i implementiramo inteligentne sustave automatizacije koji se izravno integriraju u vaš postojeći tech stack — CRM-ove, ERP-ove, komunikacijske alate i više. Od kvalifikacije potencijalnih klijenata do obrade faktura, naši pipeline-ovi preuzimaju rutinske zadatke kako bi se vaš tim mogao usredotočiti na ono što je bitno.",
    outcomes: [
      "60–80% smanjenje vremena ručne obrade",
      "Prijenos podataka bez pogrešaka između sustava",
      "Upozorenja u stvarnom vremenu i logika eskalacije",
      "Potpuna revizijska staza i observabilnost",
    ],
    deliverables: [
      "Prilagođeni planovi automatizacije",
      "Integracijsk konektori (Zapier, Make, prilagođeni API-ji)",
      "Nadzorne ploče za praćenje",
      "Priručnici i dokumentacija",
    ],
    timeline: "4–8 tjedana",
    color: "from-violet-500 to-indigo-600",
  },
  {
    id: "content-pipelines",
    icon: "FileText",
    title: "AI Pipeline-ovi za Sadržaj",
    shortDescription:
      "Skalirajte produkciju sadržaja bez povećanja broja zaposlenika. AI-pogonjeni pipeline-ovi prilagođeni vašem glasu branda.",
    description:
      "Gradimo end-to-end pipeline-ove za sadržaj koji generiraju, recenziraju i objavljuju konzistentan sadržaj usklađen s brandom kroz sve kanale. Fino podešeni prema vašem glasu, utemeljeni u vašoj bazi znanja i isporučeni s radnim tokovima za pregled uz ljudski nadzor.",
    outcomes: [
      "10x više sadržaja uz konzistentan glas branda",
      "SEO-optimizirani nacrti za nekoliko minuta, ne dana",
      "Automatizirana distribucija kroz više kanala",
      "Kontinuirano poboljšanje kvalitete putem petlji povratnih informacija",
    ],
    deliverables: [
      "Fino podešena arhitektura promptova",
      "API za generiranje sadržaja",
      "Radni tok pregleda i odobravanja",
      "Sustav za ocjenjivanje kvalitete",
    ],
    timeline: "3–6 tjedana",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "custom-llm-apps",
    icon: "BrainCircuit",
    title: "Prilagođene LLM Aplikacije",
    shortDescription:
      "Namjenska AI rješenja — interni alati, agenti za korisnike, ko-piloti — isporučeni produkcijski spremni.",
    description:
      "Od internih asistenata za znanje do chatbotova okrenutih klijentima i inteligentnih ko-pilota, gradimo prilagođene LLM aplikacije za vaš specifični slučaj upotrebe. RAG arhitekture, upotreba alata i multi-agentni okviri su uključeni.",
    outcomes: [
      "Vlastiti AI produkt isporučen za tjedne",
      "Kontekstualno svjesni odgovori iz vaših podataka",
      "Sigurnost i kontrola pristupa na razini poduzeća",
      "Skalabilna arhitektura koja raste s vama",
    ],
    deliverables: [
      "Full-stack LLM aplikacija",
      "RAG pipeline s vektorskom pohranom",
      "Administrativna ploča i analitika",
      "Postavljanje i konfiguracija infrastrukture",
    ],
    timeline: "6–12 tjedana",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "data-integrations",
    icon: "Database",
    title: "Podaci i Integracije",
    shortDescription:
      "Povežite vaš podatkovni ekosustav. ETL pipeline-ovi, API integracije i podatkovne osnove za AI-spremnost.",
    description:
      "AI je samo toliko dobar koliko su dobri njegovi podaci. Pregledavamo, čistimo i strukturiramo vaš podatkovni ekosustav — gradeći robusne pipeline-ove, API-je i integracijske slojeve koji čine vašu organizaciju AI-spremnom i otključavaju analitiku kakvu dosad niste imali.",
    outcomes: [
      "Jedinstveni izvor istine kroz sve sustave",
      "Sinkronizacija i transformacija podataka u stvarnom vremenu",
      "Strukturirani podatkovni sloj spreman za AI",
      "Smanjenje troškova upravljanja podacima za 70%+",
    ],
    deliverables: [
      "Plan arhitekture podataka",
      "ETL/ELT pipeline-ovi",
      "Integracijski sloj API-ja",
      "Praćenje kvalitete podataka",
    ],
    timeline: "4–10 tjedana",
    color: "from-green-500 to-teal-600",
  },
  {
    id: "ai-strategy",
    icon: "Compass",
    title: "AI Strategija",
    shortDescription:
      "Jasan plan za uvođenje AI-ja — prioritiziran prema ROI-u, utemeljen u stvarnosti i izgrađen za izvršenje.",
    description:
      "Prije izgradnje, pomažemo vam otkriti gdje AI stvara najveću polugu u vašem poslovanju. Naši strateški angažmani kombiniraju tehničku procjenu s poslovnom analizom kako bi proizveli konkretan, prioritiziran plan — ne samo prezentaciju.",
    outcomes: [
      "Rangirani popis AI prilika prema ROI-u",
      "Jasan okvir odluke graditi/kupiti/partnerirati",
      "Procjena rizika i usklađenosti",
      "Plan provedbe na 12 mjeseci",
    ],
    deliverables: [
      "Revizija AI-spremnosti",
      "Matrica mogućnosti",
      "Preporuke tehničke arhitekture",
      "Plan implementacije",
    ],
    timeline: "2–3 tjedna",
    color: "from-orange-500 to-amber-600",
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
      "Primarno surađujemo s poduzećima u fazi rasta (5–200 milijuna $ ARR) i podjelima velikih poduzeća gdje AI može stvoriti mjerljivu operativnu polugu. Isporučivali smo za klijente u financijama, pravu, e-commerceu, zdravstvu i SaaS sektoru. Zajednička nit je stvarni problem koji treba riješiti i otvorenost za iterativan rad.",
  },
  {
    id: 2,
    question: "Kako postupate s privatnošću i sigurnošću podataka?",
    answer:
      "Sigurnost podataka je apsolutni prioritet. Poslujemo pod strogim ugovorima o tajnosti, podržavamo lokalne ili privatne cloud implementacije i osiguravamo da svi AI pipeline-ovi budu usklađeni s relevantnim propisima o zaštiti podataka (GDPR, HIPAA, SOC 2). Nikada ne koristimo podatke klijenata za treniranje modela trećih strana.",
  },
  {
    id: 3,
    question: "Radite li s OpenAI / Anthropic / open source modelima?",
    answer:
      "Agnostični smo prema modelu i biramo pravi alat za svaki zadatak. Radimo s vodećim pružateljima (OpenAI, Anthropic, Google, Mistral) kao i s open-source alternativama iz razloga troška ili suvereniteta podataka. Naša arhitektura je dizajnirana za zamjenu modela bez prearchitekturiranja vašeg sustava.",
  },
  {
    id: 4,
    question: "Kakva je vaša tipična struktura angažmana?",
    answer:
      "Većina projekata počinje s 2-tjednim discovery sprintom (fiksna naknada) koji proizvodi detaljan prijedlog. Angažmani za izgradnju su na bazi vremena i materijala s opcijom mjesečnog retainera za tekuće radove. Transparentni smo oko troškova unaprijed i ne naplaćujemo iznenađenja.",
  },
  {
    id: 5,
    question: "Možete li raditi s našim postojećim tech stackom?",
    answer:
      "Da. Integrirali smo se sa svime, od starih SAP sustava do modernih Notion radnih prostora. Naš pristup je integracija na prvom mjestu — proširujemo ono što već imate, umjesto da forsiramo potpunu zamjenu.",
  },
  {
    id: 6,
    question: "Kako izgleda uspjeh nakon završetka angažmana?",
    answer:
      "Uspjeh mjerimo prema ishodima: ušteda vremena, generirani prihod, smanjene pogreške. Svaki angažman završava s potpunom dokumentacijom, obukom tima i 90-dnevnim prozorom podrške. Mnogi klijenti nas zadržavaju za tekuću optimizaciju — ali nikad niste ovisni o nama da bi sustav radio.",
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
