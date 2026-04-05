import type { Asset, NewsItem } from "../types";

export const INITIAL_ASSETS: Asset[] = [
  // ── US Stocks (existing) ────────────────────────────────────────────────
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "stock",
    basePrice: 182,
    category: "us",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    type: "stock",
    basePrice: 245,
    category: "us",
  },
  {
    symbol: "GOOG",
    name: "Alphabet Inc.",
    type: "stock",
    basePrice: 141,
    category: "us",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    type: "stock",
    basePrice: 485,
    category: "us",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    type: "stock",
    basePrice: 378,
    category: "us",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    type: "stock",
    basePrice: 179,
    category: "us",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase",
    type: "stock",
    basePrice: 198,
    category: "us",
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    type: "stock",
    basePrice: 630,
    category: "us",
  },
  // ── Commodities (existing) ───────────────────────────────────────────────
  {
    symbol: "XAU",
    name: "Gold (Spot)",
    type: "commodity",
    basePrice: 2035,
    category: "commodity",
  },
  {
    symbol: "XAG",
    name: "Silver (Spot)",
    type: "commodity",
    basePrice: 24.5,
    category: "commodity",
  },
  {
    symbol: "WTI",
    name: "Crude Oil (WTI)",
    type: "commodity",
    basePrice: 78.5,
    category: "commodity",
  },
  // ── Indian Stocks ───────────────────────────────────────────────────────
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    type: "stock",
    basePrice: 38,
    category: "indian",
  },
  {
    symbol: "RELI",
    name: "Reliance Industries",
    type: "stock",
    basePrice: 28,
    category: "indian",
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd.",
    type: "stock",
    basePrice: 18,
    category: "indian",
  },
  {
    symbol: "WIPRO",
    name: "Wipro Ltd.",
    type: "stock",
    basePrice: 5.8,
    category: "indian",
  },
  {
    symbol: "HDFC",
    name: "HDFC Bank",
    type: "stock",
    basePrice: 16,
    category: "indian",
  },
  // ── European Stocks ─────────────────────────────────────────────────────
  {
    symbol: "BMW",
    name: "BMW Group",
    type: "stock",
    basePrice: 95,
    category: "european",
  },
  {
    symbol: "SIEM",
    name: "Siemens AG",
    type: "stock",
    basePrice: 178,
    category: "european",
  },
  {
    symbol: "LVMH",
    name: "LVMH Moët Hennessy",
    type: "stock",
    basePrice: 742,
    category: "european",
  },
  {
    symbol: "SAP",
    name: "SAP SE",
    type: "stock",
    basePrice: 198,
    category: "european",
  },
  {
    symbol: "NESN",
    name: "Nestlé S.A.",
    type: "stock",
    basePrice: 102,
    category: "european",
  },
  // ── Asian Stocks ─────────────────────────────────────────────────────────
  {
    symbol: "SAMS",
    name: "Samsung Electronics",
    type: "stock",
    basePrice: 71,
    category: "asian",
  },
  {
    symbol: "TOYT",
    name: "Toyota Motor Corp.",
    type: "stock",
    basePrice: 188,
    category: "asian",
  },
  {
    symbol: "SONY",
    name: "Sony Group Corp.",
    type: "stock",
    basePrice: 92,
    category: "asian",
  },
  {
    symbol: "BABA",
    name: "Alibaba Group",
    type: "stock",
    basePrice: 82,
    category: "asian",
  },
  {
    symbol: "BIDU",
    name: "Baidu Inc.",
    type: "stock",
    basePrice: 115,
    category: "asian",
  },
  // ── US Extras ────────────────────────────────────────────────────────────
  {
    symbol: "META",
    name: "Meta Platforms",
    type: "stock",
    basePrice: 505,
    category: "us",
  },
  {
    symbol: "DIS",
    name: "Walt Disney Co.",
    type: "stock",
    basePrice: 112,
    category: "us",
  },
  {
    symbol: "SBUX",
    name: "Starbucks Corp.",
    type: "stock",
    basePrice: 87,
    category: "us",
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    type: "stock",
    basePrice: 275,
    category: "us",
  },
  {
    symbol: "WMT",
    name: "Walmart Inc.",
    type: "stock",
    basePrice: 67,
    category: "us",
  },
  // ── Crypto ───────────────────────────────────────────────────────────────
  {
    symbol: "BTC",
    name: "Bitcoin",
    type: "crypto",
    basePrice: 67000,
    category: "crypto",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    type: "crypto",
    basePrice: 3500,
    category: "crypto",
  },
  {
    symbol: "BNB",
    name: "Binance Coin",
    type: "crypto",
    basePrice: 580,
    category: "crypto",
  },
  {
    symbol: "SOL",
    name: "Solana",
    type: "crypto",
    basePrice: 168,
    category: "crypto",
  },
  // ── More Commodities ─────────────────────────────────────────────────────
  {
    symbol: "NGAS",
    name: "Natural Gas",
    type: "commodity",
    basePrice: 2.8,
    category: "commodity",
  },
  {
    symbol: "CORN",
    name: "Corn Futures",
    type: "commodity",
    basePrice: 4.5,
    category: "commodity",
  },
  {
    symbol: "COPR",
    name: "Copper",
    type: "commodity",
    basePrice: 4.2,
    category: "commodity",
  },
];

export const NEWS_POOL: Omit<NewsItem, "id" | "timestamp" | "read">[] = [
  // ── Tech / Company Earnings ──────────────────────────────────────────────
  {
    headline:
      "Apple announces record-breaking iPhone sales in Q4, beating analyst expectations by wide margin",
    symbol: "AAPL",
    impact: 0.032,
  },
  {
    headline:
      "Tesla Full Self-Driving achieves Level 4 autonomy certification from US regulators",
    symbol: "TSLA",
    impact: 0.045,
  },
  {
    headline:
      "Google unveils Gemini Ultra 2.0 with unprecedented reasoning capabilities",
    symbol: "GOOG",
    impact: 0.028,
  },
  {
    headline:
      "NVIDIA H200 chip demand surges 300% as AI training costs plummet",
    symbol: "NVDA",
    impact: 0.052,
  },
  {
    headline:
      "Microsoft Azure revenue grows 42% YoY, cloud dominance accelerates",
    symbol: "MSFT",
    impact: 0.025,
  },
  {
    headline:
      "Amazon Prime membership crosses 250 million; AWS profitability hits new record",
    symbol: "AMZN",
    impact: 0.03,
  },
  {
    headline:
      "JPMorgan reports unexpected credit losses as consumer debt delinquencies rise",
    symbol: "JPM",
    impact: -0.038,
  },
  {
    headline:
      "Netflix subscriber count drops 3.2M in Q1 amid password-sharing crackdown fallout",
    symbol: "NFLX",
    impact: -0.042,
  },
  {
    headline:
      "Netflix acquires major Hollywood studio in $8B deal to bolster content library",
    symbol: "NFLX",
    impact: 0.038,
  },
  {
    headline:
      "Google DeepMind drug discovery breakthrough could generate $50B in licensing revenue",
    symbol: "GOOG",
    impact: 0.041,
  },
  {
    headline:
      "Apple faces €2.1B EU antitrust fine over App Store monopoly practices",
    symbol: "AAPL",
    impact: -0.022,
  },
  {
    headline: "Tesla recalls 140,000 vehicles over Autopilot software defect",
    symbol: "TSLA",
    impact: -0.055,
  },
  {
    headline:
      "NVIDIA data center revenue misses estimates as China export restrictions bite",
    symbol: "NVDA",
    impact: -0.035,
  },
  {
    headline:
      "Federal Reserve signals three rate cuts in 2025, boosting tech sector outlook",
    symbol: "MSFT",
    impact: 0.02,
  },
  {
    headline:
      "Amazon to lay off 18,000 workers in largest tech industry cutback this year",
    symbol: "AMZN",
    impact: -0.028,
  },

  // ── Oil / Energy Crisis Events ────────────────────────────────────────────
  {
    headline: "OPEC cuts oil production by 2M barrels/day, crude prices surge",
    symbol: "WTI",
    impact: 0.048,
  },
  {
    headline:
      "Oil prices plunge as US shale output hits record 14M barrels/day",
    symbol: "WTI",
    impact: -0.052,
  },
  {
    headline:
      "Strait of Hormuz tensions escalate — 30% of global oil supply at risk, crude spikes",
    symbol: "WTI",
    impact: 0.065,
  },
  {
    headline:
      "Major pipeline cyberattack halts fuel supply across East Coast; oil futures jump 6%",
    symbol: "WTI",
    impact: 0.06,
  },
  {
    headline:
      "Saudi Arabia and Russia announce surprise joint oil output cut of 1.5M barrels/day",
    symbol: "WTI",
    impact: 0.055,
  },
  {
    headline:
      "US lifts Iran sanctions — Iranian oil floods market, crude oil falls sharply",
    symbol: "WTI",
    impact: -0.06,
  },
  {
    headline:
      "Global crude oil shortage declared as strategic reserves hit 40-year low",
    symbol: "WTI",
    impact: 0.07,
  },
  {
    headline:
      "Libya civil war shuts down 1.2M barrel/day oil export terminal; energy markets panic",
    symbol: "WTI",
    impact: 0.058,
  },
  {
    headline:
      "IEA emergency oil release: member nations tap 60M barrels from strategic reserves",
    symbol: "WTI",
    impact: -0.045,
  },
  {
    headline:
      "Hurricane devastates Gulf of Mexico oil rigs — 800,000 barrels/day offline",
    symbol: "WTI",
    impact: 0.05,
  },
  {
    headline:
      "Natural gas pipeline explosion cuts European supply by 35%; energy crisis feared",
    symbol: "NGAS",
    impact: 0.075,
  },
  {
    headline:
      "US natural gas storage hits record high — prices collapse on oversupply",
    symbol: "NGAS",
    impact: -0.06,
  },
  {
    headline:
      "Russian natural gas export ban triggers European energy emergency",
    symbol: "NGAS",
    impact: 0.085,
  },

  // ── Gold / Precious Metals ────────────────────────────────────────────────
  {
    headline:
      "Gold prices spike as central banks increase reserves amid geopolitical tensions",
    symbol: "XAU",
    impact: 0.018,
  },
  {
    headline:
      "Gold hits 10-year low as dollar strengthens on surprise jobs data",
    symbol: "XAU",
    impact: -0.025,
  },
  {
    headline:
      "Gold surges to all-time high $2,800/oz as investors flee to safe havens amid global war fears",
    symbol: "XAU",
    impact: 0.055,
  },
  {
    headline:
      "China triples gold reserve purchases — largest central bank gold buy in 50 years",
    symbol: "XAU",
    impact: 0.042,
  },
  {
    headline:
      "IMF proposes new gold-backed reserve currency, sparking massive gold rally",
    symbol: "XAU",
    impact: 0.038,
  },
  {
    headline:
      "Gold drops 4% as US dollar index surges after Fed Chair hawkish testimony",
    symbol: "XAU",
    impact: -0.04,
  },
  {
    headline:
      "Silver industrial demand soars as EV manufacturers switch to silver-based batteries",
    symbol: "XAG",
    impact: 0.035,
  },
  {
    headline:
      "Copper demand explodes as global EV adoption accelerates — prices hit 5-year high",
    symbol: "COPR",
    impact: 0.065,
  },
  {
    headline: "Major Chilean copper mine strike halts 8% of global supply",
    symbol: "COPR",
    impact: 0.055,
  },
  {
    headline:
      "China copper stockpiles at record high — oversupply fears crash copper prices",
    symbol: "COPR",
    impact: -0.052,
  },
  {
    headline:
      "Corn futures surge as drought destroys 30% of US midwest harvest",
    symbol: "CORN",
    impact: 0.07,
  },
  {
    headline:
      "Record corn harvest in Brazil floods global market; futures plunge",
    symbol: "CORN",
    impact: -0.055,
  },

  // ── War / Geopolitical Conflict ───────────────────────────────────────────
  {
    headline:
      "Russia-Ukraine ceasefire collapses — NATO troops mobilise at eastern border; markets rattle",
    symbol: "XAU",
    impact: 0.06,
  },
  {
    headline:
      "North Korea launches ICBM over Japan; Asia-Pacific markets crash on war fears",
    symbol: "JPM",
    impact: -0.065,
  },
  {
    headline:
      "Israel-Hamas conflict widens — Hezbollah opens second front; oil and gold surge",
    symbol: "WTI",
    impact: 0.058,
  },
  {
    headline:
      "China military exercises encircle Taiwan; semiconductor supply chain fears hit NVDA hard",
    symbol: "NVDA",
    impact: -0.072,
  },
  {
    headline:
      "US-China trade war reignites: 145% tariffs on $350B in goods announced overnight",
    symbol: "AAPL",
    impact: -0.058,
  },
  {
    headline:
      "NATO invokes Article 5 for first time — European defence stocks surge; broad markets fall",
    symbol: "JPM",
    impact: -0.045,
  },
  {
    headline:
      "India-Pakistan border skirmish escalates; emerging market ETFs tumble 8%",
    symbol: "XAU",
    impact: 0.048,
  },
  {
    headline:
      "Sudan civil war spreads to neighbouring Chad — African commodity exports halted",
    symbol: "XAG",
    impact: 0.032,
  },
  {
    headline:
      "Yemen Houthi drone strikes cripple Saudi Aramco facility; 5% of world oil supply offline",
    symbol: "WTI",
    impact: 0.068,
  },
  {
    headline:
      "Peace deal signed in Eastern Europe — sanctions lifted, markets rally on stability hopes",
    symbol: "MSFT",
    impact: 0.03,
  },

  // ── Political Leadership / Elections ──────────────────────────────────────
  {
    headline:
      "UK Prime Minister resigns after no-confidence vote — pound crashes, FTSE sells off",
    symbol: "JPM",
    impact: -0.042,
  },
  {
    headline:
      "US Presidential election result disputed — Congress deadlocked, markets swing wildly",
    symbol: "MSFT",
    impact: -0.035,
  },
  {
    headline:
      "New US President announces $2T infrastructure spending bill — construction and tech stocks soar",
    symbol: "MSFT",
    impact: 0.04,
  },
  {
    headline:
      "France snap election delivers hung parliament — euro weakens, European banks slide",
    symbol: "JPM",
    impact: -0.032,
  },
  {
    headline:
      "India Prime Minister wins landslide re-election on pro-business platform; emerging markets rally",
    symbol: "AMZN",
    impact: 0.028,
  },
  {
    headline:
      "Brazilian President impeached on corruption charges — commodity exports disrupted",
    symbol: "XAG",
    impact: -0.038,
  },
  {
    headline:
      "Germany's ruling coalition collapses — early elections called; DAX falls 3.5%",
    symbol: "JPM",
    impact: -0.03,
  },
  {
    headline:
      "Japan Prime Minister announces $500B stimulus package targeting AI and semiconductors",
    symbol: "NVDA",
    impact: 0.045,
  },
  {
    headline:
      "South Korea president declares martial law before reversing — won collapses 9%",
    symbol: "XAU",
    impact: 0.04,
  },
  {
    headline:
      "Saudi Arabia Crown Prince announces Vision 2030 tech megaproject — $1T investment pledge",
    symbol: "GOOG",
    impact: 0.035,
  },

  // ── Central Banks / Macro / Inflation ─────────────────────────────────────
  {
    headline:
      "Federal Reserve surprises with emergency 75bp rate hike as inflation hits 9.2%",
    symbol: "JPM",
    impact: -0.05,
  },
  {
    headline:
      "ECB cuts interest rates to zero for first time since 2022 — European stocks surge",
    symbol: "AMZN",
    impact: 0.025,
  },
  {
    headline:
      "US national debt crosses $38 trillion — credit rating downgraded by Fitch to AA-",
    symbol: "JPM",
    impact: -0.048,
  },
  {
    headline:
      "Japan yen hits 30-year low against USD — Bank of Japan intervenes with $50B currency defence",
    symbol: "XAU",
    impact: 0.03,
  },
  {
    headline:
      "Argentina hyperinflation hits 400% — government freezes bank withdrawals, peso collapses",
    symbol: "XAU",
    impact: 0.045,
  },
  {
    headline:
      "Global recession officially declared by IMF — all major indices drop; gold safe-haven demand soars",
    symbol: "XAU",
    impact: 0.07,
  },
  {
    headline:
      "US inflation falls to 2.1% — Fed signals end of tightening cycle; tech stocks rally hard",
    symbol: "NVDA",
    impact: 0.042,
  },

  // ── Natural Disasters / Pandemics ─────────────────────────────────────────
  {
    headline:
      "WHO declares new Disease X pandemic — global travel bans imposed; supply chains disrupted",
    symbol: "AMZN",
    impact: 0.055,
  },
  {
    headline:
      "7.8 magnitude earthquake hits Tokyo — Japanese manufacturing halts; global supply chain fears",
    symbol: "NVDA",
    impact: -0.048,
  },
  {
    headline:
      "Massive flooding in Southeast Asia destroys semiconductor fabs — chip shortage fears resurface",
    symbol: "NVDA",
    impact: 0.062,
  },
  {
    headline:
      "Drought across US corn belt worst in 60 years — agricultural commodity prices skyrocket",
    symbol: "XAG",
    impact: 0.03,
  },
  {
    headline:
      "Category 5 hurricane obliterates Houston port — US energy exports crippled for months",
    symbol: "WTI",
    impact: 0.055,
  },
  {
    headline:
      "Bird flu spreads to 40 countries — poultry industry collapses; food inflation fears spike",
    symbol: "JPM",
    impact: -0.028,
  },

  // ── Technology / Regulation / Cybersecurity ───────────────────────────────
  {
    headline:
      "EU passes landmark AI Act banning GPT-class models in consumer apps — Big Tech lobbies hard",
    symbol: "MSFT",
    impact: -0.038,
  },
  {
    headline:
      "Massive global cyberattack takes down 40% of internet infrastructure for 12 hours",
    symbol: "MSFT",
    impact: -0.045,
  },
  {
    headline:
      "Apple Vision Pro 2 sells 5M units in launch weekend — wearables become $200B market",
    symbol: "AAPL",
    impact: 0.048,
  },
  {
    headline:
      "Tesla Cybertruck production halted after battery fire recalls — EV trust hits new low",
    symbol: "TSLA",
    impact: -0.06,
  },
  {
    headline:
      "OpenAI goes public at $300B valuation — AI sector stocks surge across the board",
    symbol: "NVDA",
    impact: 0.058,
  },
  {
    headline:
      "US bans TikTok, WeChat and Temu — Chinese tech stocks crater, US rivals benefit",
    symbol: "GOOG",
    impact: 0.032,
  },

  // ── Banking / Financial Crisis ─────────────────────────────────────────────
  {
    headline:
      "Major US regional banks collapse in 48 hours — FDIC emergency takeover; deposit panic spreads",
    symbol: "JPM",
    impact: -0.075,
  },
  {
    headline:
      "Credit Suisse successor bank collapses — European banking contagion fears trigger market rout",
    symbol: "JPM",
    impact: -0.065,
  },
  {
    headline:
      "JPMorgan passes $500B market cap as it absorbs three failed regional banks",
    symbol: "JPM",
    impact: 0.045,
  },
  {
    headline:
      "Crypto exchange FTX 2.0 hacked — $4B stolen; crypto contagion hits fintech stocks",
    symbol: "JPM",
    impact: -0.032,
  },

  // ── Indian Stocks ─────────────────────────────────────────────────────────
  {
    headline:
      "Tata Consultancy wins $2.5B US government IT contract — biggest TCS deal in history",
    symbol: "TCS",
    impact: 0.04,
  },
  {
    headline:
      "TCS faces mass wage hike protests across 6 major cities; attrition hits 22%",
    symbol: "TCS",
    impact: -0.025,
  },
  {
    headline:
      "TCS lands $1.8B deal with UK NHS for digital transformation overhaul",
    symbol: "TCS",
    impact: 0.035,
  },
  {
    headline:
      "Reliance Jio announces 5G rollout to 200 more cities, adding 40M new subscribers",
    symbol: "RELI",
    impact: 0.035,
  },
  {
    headline:
      "Reliance refinery shutdown after fire cuts India's fuel supply by 15%",
    symbol: "RELI",
    impact: -0.04,
  },
  {
    headline:
      "Reliance retail expansion crushes competition — 500 new stores, 12% market share gain",
    symbol: "RELI",
    impact: 0.038,
  },
  {
    headline:
      "Infosys wins landmark AI outsourcing contract worth $3.2B over 5 years",
    symbol: "INFY",
    impact: 0.042,
  },
  {
    headline:
      "Infosys misses Q2 revenue estimates; cuts full-year guidance amid weak demand",
    symbol: "INFY",
    impact: -0.038,
  },
  {
    headline:
      "Wipro acquires US cloud firm for $1.4B, expanding North America footprint",
    symbol: "WIPRO",
    impact: 0.032,
  },
  {
    headline:
      "Wipro CEO resignation shocks investors; shares fall on succession uncertainty",
    symbol: "WIPRO",
    impact: -0.045,
  },
  {
    headline:
      "HDFC Bank posts record profit of ₹16,000 crore — NPA ratio at historic low",
    symbol: "HDFC",
    impact: 0.036,
  },
  {
    headline:
      "RBI tightens norms on HDFC Bank loan disbursements; growth outlook clouded",
    symbol: "HDFC",
    impact: -0.03,
  },

  // ── European Stocks ───────────────────────────────────────────────────────
  {
    headline:
      "BMW unveils new all-electric M3 — EV division revenue doubles year-on-year",
    symbol: "BMW",
    impact: 0.038,
  },
  {
    headline:
      "BMW recalls 500,000 vehicles over critical brake defect — safety scandal widens",
    symbol: "BMW",
    impact: -0.045,
  },
  {
    headline:
      "BMW partners with CATL for next-gen solid-state batteries — production by 2027",
    symbol: "BMW",
    impact: 0.032,
  },
  {
    headline:
      "Siemens wins $4B smart grid contract across 12 EU nations — energy transition windfall",
    symbol: "SIEM",
    impact: 0.042,
  },
  {
    headline:
      "Siemens Energy division scandal — fraud allegations trigger executive resignations",
    symbol: "SIEM",
    impact: -0.05,
  },
  {
    headline:
      "LVMH reports record luxury goods demand from Asia — revenue up 28% YoY",
    symbol: "LVMH",
    impact: 0.035,
  },
  {
    headline:
      "Chinese luxury spending collapses — LVMH Asia revenue drops 22%; shares tumble",
    symbol: "LVMH",
    impact: -0.048,
  },
  {
    headline:
      "SAP enterprise AI suite adopted by 10,000 companies in 90 days — cloud ARR surges",
    symbol: "SAP",
    impact: 0.04,
  },
  {
    headline: "SAP faces €1.5B data privacy lawsuit across EU jurisdictions",
    symbol: "SAP",
    impact: -0.032,
  },
  {
    headline:
      "Nestlé launches premium health-nutrition line in India, targeting 500M consumers",
    symbol: "NESN",
    impact: 0.03,
  },
  {
    headline:
      "Nestlé faces global boycott over infant formula mislabeling scandal",
    symbol: "NESN",
    impact: -0.038,
  },

  // ── Asian Stocks ──────────────────────────────────────────────────────────
  {
    headline:
      "Samsung wins Apple chip order worth $15B annually — foundry business transforms",
    symbol: "SAMS",
    impact: 0.055,
  },
  {
    headline:
      "Samsung foundry yield issues delay major chip orders — TSMC gains market share",
    symbol: "SAMS",
    impact: -0.04,
  },
  {
    headline: "Samsung Galaxy S25 Ultra breaks pre-order records in 48 hours",
    symbol: "SAMS",
    impact: 0.03,
  },
  {
    headline:
      "Toyota unveils solid-state EV battery achieving 1,200km range per charge",
    symbol: "TOYT",
    impact: 0.062,
  },
  {
    headline:
      "Toyota faces massive recall — 800,000 vehicles with faulty airbag sensors worldwide",
    symbol: "TOYT",
    impact: -0.042,
  },
  {
    headline:
      "Sony PlayStation 6 pre-orders crash servers — 10M units reserved in first hour",
    symbol: "SONY",
    impact: 0.05,
  },
  {
    headline:
      "Sony Pictures faces $2B write-down after three blockbuster flops in a row",
    symbol: "SONY",
    impact: -0.038,
  },
  {
    headline:
      "Alibaba splits into 6 independent companies — unlock of hidden value triggers rally",
    symbol: "BABA",
    impact: 0.065,
  },
  {
    headline:
      "China regulators impose new $3B fine on Alibaba — crackdown escalates",
    symbol: "BABA",
    impact: -0.055,
  },
  {
    headline:
      "Baidu's ERNIE AI bot surpasses 300M monthly active users — monetisation begins",
    symbol: "BIDU",
    impact: 0.048,
  },
  {
    headline:
      "Baidu faces US export controls on AI chips — cloud growth stalls",
    symbol: "BIDU",
    impact: -0.042,
  },

  // ── US Extras ─────────────────────────────────────────────────────────────
  {
    headline:
      "Meta's AI assistant surpasses 1B users in 6 months — ad revenue up 40%",
    symbol: "META",
    impact: 0.042,
  },
  {
    headline:
      "Meta faces $10B antitrust breakup lawsuit from DOJ — Facebook, Instagram at risk",
    symbol: "META",
    impact: -0.05,
  },
  {
    headline:
      "Meta Reality Labs AR glasses launch — pre-orders hit 5M in first week",
    symbol: "META",
    impact: 0.038,
  },
  {
    headline:
      "Disney+ reaches 200M subscribers — streaming profitability achieved for first time",
    symbol: "DIS",
    impact: 0.04,
  },
  {
    headline:
      "Disney theme park revenue collapses after Hurricane season destroys Florida season",
    symbol: "DIS",
    impact: -0.045,
  },
  {
    headline:
      "Starbucks launches AI-powered personalization — 30% increase in mobile order sales",
    symbol: "SBUX",
    impact: 0.032,
  },
  {
    headline:
      "Starbucks faces union strikes in 400 stores — holiday season sales at risk",
    symbol: "SBUX",
    impact: -0.035,
  },
  {
    headline:
      "Visa wins exclusive payment rights for 2028 Olympics — $800M revenue boost expected",
    symbol: "V",
    impact: 0.028,
  },
  {
    headline: "Visa faces EU antitrust probe over payment processing monopoly",
    symbol: "V",
    impact: -0.032,
  },
  {
    headline:
      "Walmart acquires leading Indian e-commerce platform for $4.5B — Flipkart expansion",
    symbol: "WMT",
    impact: 0.035,
  },
  {
    headline:
      "Walmart US same-store sales miss estimates as consumer spending weakens",
    symbol: "WMT",
    impact: -0.028,
  },

  // ── Crypto Events ─────────────────────────────────────────────────────────
  {
    headline:
      "Bitcoin ETF approvals in 5 new countries spark massive global crypto rally",
    symbol: "BTC",
    impact: 0.08,
  },
  {
    headline:
      "Major crypto exchange hacked — $2B in Bitcoin stolen; prices crash on panic selling",
    symbol: "BTC",
    impact: -0.09,
  },
  {
    headline:
      "El Salvador adopts Bitcoin as legal tender — 12 nations expected to follow",
    symbol: "BTC",
    impact: 0.065,
  },
  {
    headline:
      "US Congress passes Bitcoin Strategic Reserve Act — government to hold 1M BTC",
    symbol: "BTC",
    impact: 0.1,
  },
  {
    headline:
      "China bans Bitcoin mining again — 25% of global hashrate goes dark overnight",
    symbol: "BTC",
    impact: -0.075,
  },
  {
    headline:
      "Ethereum network upgrade reduces gas fees by 90% — DeFi TVL triples in 48 hours",
    symbol: "ETH",
    impact: 0.065,
  },
  {
    headline:
      "SEC targets Ethereum as unregistered security — exchange delistings feared",
    symbol: "ETH",
    impact: -0.07,
  },
  {
    headline:
      "Ethereum Layer 2 adoption explodes — 10M new wallets created in single month",
    symbol: "ETH",
    impact: 0.055,
  },
  {
    headline:
      "Binance receives $4.3B DOJ settlement approval — regulatory cloud lifts, BNB surges",
    symbol: "BNB",
    impact: 0.06,
  },
  {
    headline:
      "Binance CEO arrested at international airport — exchange withdrawals suspended",
    symbol: "BNB",
    impact: -0.085,
  },
  {
    headline:
      "Solana network processes 1M transactions per second — Ethereum killer narrative returns",
    symbol: "SOL",
    impact: 0.07,
  },
  {
    headline:
      "Solana suffers 18-hour network outage — DeFi ecosystem confidence shattered",
    symbol: "SOL",
    impact: -0.065,
  },
];
