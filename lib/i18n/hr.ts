/**
 * Croatian (hr) translation dictionary.
 * To add a new language, create a sibling file (e.g. en.ts) with the same shape.
 */

const hr = {
  // ─── Site metadata ────────────────────────────────────────────────────────
  site: {
    tagline: "AI sustavi koji povećavaju profit.",
    description:
      "Aiva gradi produkcijsko-spremne AI sustave — automatizacije, pipeline-ove za sadržaj, prilagođene LLM aplikacije — koji se besprijekorno integriraju u vaše poslovanje i donose mjerljive rezultate.",
  },

  // ─── Navigation ───────────────────────────────────────────────────────────
  nav: {
    services: "Usluge",
    work: "Radovi",
    about: "O nama",
    contact: "Kontakt",
    bookCall: "Rezerviraj poziv",
    skipToContent: "Prijeđi na sadržaj",
    openMenu: "Otvori izbornik navigacije",
    closeMenu: "Zatvori izbornik navigacije",
    lightMode: "Svijetli način",
    darkMode: "Tamni način",
    switchTo: "Prebaci na",
  },

  // ─── Footer ───────────────────────────────────────────────────────────────
  footer: {
    company: "Tvrtka",
    social: "Društvene mreže",
    legal: "Pravno",
    builtWith: "Made with ❤️ by Aiva",
    rights: "Sva prava pridržana.",
  },

  // ─── Hero section ─────────────────────────────────────────────────────────
  hero: {
    eyebrow: "AI automatizacija za moderne tvrtke",
    headlinePrefix: "AI sustavi koji",
    words: ["povećavaju profit.", "optimiziraju.", "štede vrijeme.", "skaliraju."],
    description:
      "Pomažemo tvrtkama da uvedu AI u svakodnevno poslovanje kroz automatizaciju marketinga, sadržaja i prodajnih procesa.",
    cta1: "Rezerviraj besplatan poziv",
    cta2: "Naši projekti",
    trustedBy: "Više od 40 timova nam vjeruje",
    sectors: "iz financija, prava, e-trgovine i SaaS-a",
    avgRating: "dostava usluga",
    scroll: "skrolaj",
  },

  // ─── Clients strip ────────────────────────────────────────────────────────
  clients: {
    label: "Tvrtke koje nam vjeruju",
  },

  // ─── Services section (homepage) ─────────────────────────────────────────
  services: {
    label: "Što radimo",
    title: "Inteligencija izgrađena za integraciju.",
    description:
      "Gradimo AI sustave koji odgovaraju vašem stogu, timu i ciljevima — a ne obrnuto.",
    seeAll: "Pogledaj sve usluge",
    outcomesLabel: "Ishodi",
    deliverablesLabel: "Isporuke",
    timelineLabel: "Trajanje",
  },

  // ─── Services page ────────────────────────────────────────────────────────
  servicesPage: {
    badge: "Što radimo",
    title: "AI koji se prilagođava vašem poslovanju.",
    titleAccent: "A ne obrnuto.",
    description:
      "Dizajniramo prilagođene AI sustave za automatizaciju, sadržaj, prilagođene LLM aplikacije i integracije podataka — sve utemeljeno na strateškom sloju koji osigurava da gradite pravu stvar.",
    cta: "Rezerviraj besplatan uvodni poziv",
    packagesLabel: "Paketi",
    packagesTitle: "Počnite tamo gdje ima smisla.",
    packagesDescription:
      "Odaberite razinu koja odgovara vašem trenutnom stadiju. Svaki angažman može rasti.",
  },

  // ─── Capabilities section ────────────────────────────────────────────────
  capabilities: {
    label: "",
    title: "Zašto ",
    titleAccent: "Aiva?",
    cards: [
      {
        number: "01",
        title: "Razumijemo vaše poslovanje",
        subtitle: "Duboko poznavanje domene",
        description:
          "Prije nego što implementiramo AI, analiziramo vaše procese i ciljeve kako bismo izgradili rješenje koje donosi stvarnu vrijednost.",
        accent: "from-violet-500 to-indigo-500",
      },
      {
        number: "02",
        title: "Razvijamo pouzdana AI rješenja",
        subtitle: "Arhitektura produkcijske kvalitete",
        description:
          "Gradimo stabilne i pouzdane AI sustave koji se integriraju u vaše poslovanje i rade bez prekida.",
        accent: "from-cyan-500 to-blue-500",
      },
      {
        number: "03",
        title: "Kontinuirano poboljšavamo",
        subtitle: "Kontinuirano poboljšanje",
        description:
          "Nakon implementacije pratimo rezultate i optimiziramo sustav kako bi donosio još bolje performanse.",
        accent: "from-green-500 to-teal-500",
      },
      {
        number: "04",
        title: "Implementiramo rješenja koja rastu s vašim poslovanjem",
        subtitle: "Izgrađeno za rast",
        description:
          "Naši AI sustavi fleksibilni su i omogućuju jednostavno proširenje funkcionalnosti kako se vaše potrebe razvijaju.",
        accent: "from-orange-500 to-amber-500",
      },
    ],
    stats: [
      { value: "74%", label: "Prosj. ušteda vremena" },
      { value: "40+", label: "Isporučenih sustava" },
      { value: "9 tj.", label: "Prosj. do lansiranja" },
      { value: "12M+ €", label: "Vrijednost za klijente" },
    ],
  },

  // ─── Process section ─────────────────────────────────────────────────────
  process: {
    label: "Kako radimo",
    title: "Od otkrića do isporuke — brzo, jasno, mjerljivo.",
  },

  // ─── Work section (homepage) ─────────────────────────────────────────────
  work: {
    label: "Studije slučaja",
    title: "Radovi koji govore.",
    seeAll: "Sve studije slučaja",
    keyResult: "Ključni rezultat",
    category: "Kategorija",
    client: "Klijent",
    tags: "Oznake",
    year: "Godina",
    readStudy: "Pročitaj studiju slučaja:",
  },

  // ─── Work page ────────────────────────────────────────────────────────────
  workPage: {
    badge: "Studije slučaja",
    title: "Radovi koji",
    titleAccent: "govore sami za sebe.",
    description:
      "Pravi problemi, prava implementacija, pravi rezultati. Svaka studija slučaja prikazuje cijelo putovanje — problem, pristup, izradu i ishode.",
  },

  // ─── Case study detail page ───────────────────────────────────────────────
  caseStudy: {
    backToWork: "Sve studije slučaja",
    problemLabel: "Problem",
    approachLabel: "Naš pristup",
    resultsLabel: "Rezultati",
    moreWork: "Više radova",
    readMore: "Pročitaj studiju slučaja:",
  },

  // ─── Testimonials section ────────────────────────────────────────────────
  testimonials: {
    label: "Što klijenti kažu",
    title: "Rezultati o kojima ne prestaju pričati.",
  },

  // ─── FAQ section ────────────────────────────────────────────────────────
  faq: {
    label: "Često postavljena pitanja",
    title: "Uobičajena pitanja, iskreni odgovori.",
    description:
      "Ako nešto nije ovdje, javite nam se — odgovaramo u roku od jednog radnog dana.",
  },

  // ─── CTA section ─────────────────────────────────────────────────────────
  cta: {
    label: "Spremi za početak?",
    title: "Gradimo nešto",
    titleAccent: "što zaista funkcionira.",
    description:
      "Recite nam koji je vaš najveći operativni uski grlo. Reći ćemo vam može li AI riješiti problem — i točno kako. Bez prezentacija. Bez obveza.",
    primaryCta: "Rezerviraj uvodni poziv",
    secondaryCta: "Pošalji nam poruku",
    note: "Tipično odgovaramo unutar 1 radnog dana",
  },

  // ─── About page ──────────────────────────────────────────────────────────
  about: {
    badge: "Naša priča",
    title: "Izgrađeno od inženjera koji su se umorili od promatranja propasti AI-ja.",
    description1:
      "Aivu su osnovali inženjeri i graditelji proizvoda koji su godinama bili na sjecištu AI istraživanja i stvarnog softvera — i gledali previše AI projekata koji su propali, ne zato što tehnologija nije bila spremna, već zato što implementacija nije bila.",
    description2:
      "Pokrenuli smo Aivu s jednim uvjerenjem: AI sustavi produkcijske kvalitete trebaju biti norma, a ne iznimka. Postojimo kako bismo zatvorili jaz između onoga što AI može učiniti i onoga što tvrtke zapravo imaju implementirano i u radu.",
    cta: "Započni razgovor",
    principlesLabel: "Naša načela",
    principlesTitle: "Kako razmišljamo, kako radimo.",
    principles: [
      {
        number: "01",
        title: "Rezultati iznad demonstracija",
        description:
          "Uspjeh mjerimo u uštedi vremena, generiranom prihodu i eliminiranim greškama — ne impresivnim videozapisima prototipova.",
      },
      {
        number: "02",
        title: "Iskrenost iznad hype-a",
        description:
          "Reći ćemo vam kada AI nije pravi odgovor. Naša reputacija vrednija je od jednog preprodanog angažmana.",
      },
      {
        number: "03",
        title: "Majstorstvo na svakom sloju",
        description:
          "Od arhitekture sustava do korisničkog sučelja, držimo se standarda koji nas čini istinski ponosnim na naš rad.",
      },
      {
        number: "04",
        title: "Dugoročna partnerstva",
        description:
          "Dizajniramo svaki sustav tako da ga vi možete posjedovati. Naš cilj je biti posljednji AI partner koji vam je potreban — ne stvarati ovisnost.",
      },
    ],
    teamLabel: "Tim",
    teamTitle: "Mali namjerno. Opsesivni po prirodi.",
    teamDescription:
      "Tim držimo kompaktnim kako bi svaki projekt dobio pozornost na senior razini. Nema juniors kojima se vaš rad predaje na kraju sprinta.",
    toolingLabel: "Alati",
    toolingTitle: "Alati kojima vjerujemo.",
    toolingDescription: "Neutralni po modelu. Pragmatični. Uvijek pravo sredstvo za posao.",
    linkedin: "LinkedIn",
  },

  // ─── Contact page ────────────────────────────────────────────────────────
  contact: {
    badge: "Kontakt",
    title: "Razgovarajmo o vašem",
    titleAccent: "problemu.",
    description:
      "Recite nam na čemu radite i reći ćemo vam može li AI pomoći — i kako. Bez prodajnog govora. Bez pritiska. Samo iskren razgovor.",
    details: [
      {
        label: "E-pošta",
        value: "inquiry@aiva.hr",
        href: "mailto:inquiry@aiva.hr",
      },
      {
        label: "Uvodni poziv",
        value: "Zakažite na Calendly",
        href: "#calendly",
      },
      {
        label: "Lokacija",
        value: "Na daljinu, globalno",
        href: null,
      },
      {
        label: "Vrijeme odgovora",
        value: "Unutar 1 radnog dana",
        href: null,
      },
    ],
    calendlyTitle: "Preferirate direktno zakazivanje?",
    calendlyDesc:
      "Zakažite 30-minutni uvodni razgovor u terminu koji vam odgovara.",
    calendlyBtn: "Otvori Calendly",
    calendlyAriaLabel: "Zakažite uvodni poziv na Calendly (otvara se u novoj kartici)",
  },

  // ─── Contact form ────────────────────────────────────────────────────────
  form: {
    title: "Pošaljite nam poruku",
    subtitle: "Odgovaramo unutar jednog radnog dana.",
    namePlaceholder: "Ana Horvat",
    nameLabel: "Ime i prezime",
    emailLabel: "Poslovni e-mail",
    emailPlaceholder: "ana@tvrtka.hr",
    companyLabel: "Tvrtka (nije obavezno)",
    companyPlaceholder: "Acme d.o.o.",
    budgetLabel: "Procijenjeni proračun (nije obavezno)",
    budgetOptions: {
      placeholder: "Odaberite raspon",
      under10k: "Manje od 10.000 €",
      "10_25k": "10.000 – 25.000 €",
      "25_50k": "25.000 – 50.000 €",
      over50k: "Više od 50.000 €",
      notSure: "Još nisam siguran/na",
    },
    messageLabel: "Opišite nam vaš projekt",
    messagePlaceholder:
      "Opišite problem koji pokušavate riješiti ili rezultat koji tražite...",
    submit: "Pošalji poruku",
    submitting: "Šaljem…",
    successTitle: "Poruka poslana!",
    successDesc:
      "Hvala na javljanju. Javit ćemo se unutar jednog radnog dana.",
    sendAnother: "Pošalji drugu poruku",
    privacy:
      "Slanjem prihvaćate našu",
    privacyLink: "Politiku privatnosti",
    privacyNote: ". Bez spama, nikad.",
    required: "Obavezno",
    errorGeneric: "Nešto je pošlo po krivu. Molimo pokušajte ponovo.",
    errorRateLimit:
      "Previše zahtjeva. Pričekajte minutu i pokušajte ponovo.",
    errorSend:
      "Slanje poruke nije uspjelo. Molimo kontaktirajte nas direktno na inquiry@aiva.hr.",
    errorInvalid: "Neispravni podaci u obrascu. Provjerite unos.",
    validation: {
      nameMin: "Ime mora imati najmanje 2 znaka",
      emailInvalid: "Molimo unesite valjanu e-mail adresu",
      messageMin: "Poruka mora imati najmanje 20 znakova",
      messageMax: "Poruka mora imati manje od 2000 znakova",
    },
  },

  // ─── Privacy page ────────────────────────────────────────────────────────
  privacy: {
    badge: "Pravno",
    title: "Politika privatnosti",
    updated: "Zadnja izmjena: siječanj 2025.",
    s1Title: "1. Tko smo",
    s1Body:
      'Aiva ("Aiva", "mi", "nas" ili "naš") upravlja web-stranicom {url}. Ova politika privatnosti objašnjava kako postupamo s informacijama koje nam pružate ili koje prikupljamo korištenjem ove web-stranice.',
    s1Contact: "Za pitanja kontaktirajte nas na",
    s2Title: "2. Informacije koje prikupljamo",
    s2Form:
      "Podaci obrasca za kontakt: Kada pošaljete naš obrazac za kontakt, prikupljamo vaše ime, e-mail adresu, naziv tvrtke (nije obavezno) i poruku. Koristi se isključivo za odgovaranje na vaš upit.",
    s2Analytics:
      "Analitika: Ako je konfigurirana analitika (Plausible), prikupljamo anonimizirane podatke o posjetima stranice. Plausible ne koristi kolačiće i usklađen je s GDPR-om. Ne prikupljaju se osobni podaci.",
    s2Cookies:
      "Kolačići: Ova web-stranica ne koristi kolačiće za praćenje ili oglašavanje. Možemo postaviti kolačić sesije za preferencije teme (tamni/svijetli način).",
    s3Title: "3. Kako koristimo vaše informacije",
    s3List: [
      "Za odgovaranje na upite poslane putem našeg obrasca za kontakt",
      "Za razumijevanje ukupne upotrebe web-stranice i poboljšanje performansi",
      "Za usklađivanje s pravnim obvezama",
    ],
    s3NoBuy:
      "Ne prodajemo, iznajmljujemo niti trgujemo vašim osobnim podacima trećim stranama.",
    s4Title: "4. Čuvanje podataka",
    s4Body:
      "Podaci obrasca za kontakt čuvaju se do 12 mjeseci, nakon čega se brišu osim ako imamo tekući ugovorni odnos. Možete zahtijevati brisanje u bilo trenutku.",
    s5Title: "5. Vaša prava",
    s5Body:
      "Prema GDPR-u i primjenjivim zakonima o zaštiti podataka, imate pravo: pristupiti osobnim podacima, ispraviti netočnosti, zahtijevati brisanje, povući pristanak i podnijeti pritužbu nadzornom tijelu.",
    s5Contact: "Za ostvarivanje bilo kojeg od ovih prava, pišite nam na",
    s6Title: "6. Usluge trećih strana",
    s6Body:
      "Možemo koristiti sljedeće usluge trećih strana, svaka s vlastitim politikama privatnosti:",
    s6List: [
      { name: "Resend", desc: "— dostava e-pošte" },
      {
        name: "Plausible Analytics",
        desc: "— web analitika koja čuva privatnost (nije obavezno)",
      },
      { name: "Vercel", desc: "— hosting web-stranice" },
    ],
    s7Title: "7. Sigurnost",
    s7Body:
      "Implementiramo odgovarajuće tehničke i organizacijske mjere za zaštitu vaših osobnih podataka od neovlaštenog pristupa, gubitka ili otkrivanja. Svi podaci prenose se putem HTTPS-a.",
    s8Title: "8. Izmjene ove politike",
    s8Body:
      'Ovu politiku možemo ažurirati s vremena na vrijeme. Datum "Zadnja izmjena" na vrhu odražava najnoviju reviziju. Nastavak korištenja web-stranice podrazumijeva prihvaćanje ažurirane politike.',
    s9Title: "9. Uvjeti korištenja",
    s9Body1:
      "Pristupom ovoj web-stranici pristajete na zakonito i savjesno korištenje. Nije dopušteno koristiti je za prijenos štetnog, nezakonitog ili uvredljivog sadržaja. Zadržavamo pravo ograničenja pristupa prema vlastitoj prosudbi.",
    s9Body2:
      "Sav sadržaj na ovoj web-stranici vlasništvo je tvrtke Aiva i zaštićen je primjenjivim zakonima o intelektualnom vlasništvu.",
  },

  // ─── 404 page ─────────────────────────────────────────────────────────────
  notFound: {
    label: "404",
    title: "Stranica nije pronađena",
    description:
      "Stranica koju tražite ne postoji ili je premještena.",
    cta: "Povratak na početnu",
  },

  // ─── Common labels ────────────────────────────────────────────────────────
  common: {
    learnMore: "Saznaj više",
    viewAll: "Pogledaj sve",
    backTo: "Natrag na",
    openInNewTab: "(otvara se u novoj kartici)",
    moreFrom: "Više od",
    allRightsReserved: "Sva prava pridržana.",
  },

  // ─── Aria / accessibility labels ─────────────────────────────────────────
  a11y: {
    homeLink: "Aiva — početna",
    themeToggle: "Prebaci na {mode} način",
    linkedInLink: "{name} na LinkedIn-u",
    openCalendly: "Zakažite uvodni poziv na Calendly (otvara se u novoj kartici)",
  },
} as const;

export default hr;
export type Dictionary = typeof hr;
