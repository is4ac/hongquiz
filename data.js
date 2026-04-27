/**
 * data.js
 * Static content for the quiz — policies and questions.
 * Edit this file to update copy, add/remove options, or change policy mappings.
 * Rendering logic lives in quiz.js
 */

// ─────────────────────────────────────────
// POLICIES
// Each key is a result bucket. The quiz tallies answers and picks the winner.
// ─────────────────────────────────────────
const POLICIES = {
  childcare: {
    emoji: '🧸',
    image: 'imgs/childcare.jpg',
    name: 'Universal Childcare',
    tagline: "You believe it takes a village, and Fran's building one.",
    desc: "You're the person who remembers everyone's kids' names, brings snacks without being asked, and genuinely believes we're all in this together. Fran's universal childcare plan would guarantee high-quality care at little or no cost for every Wisconsin family. Because nobody should have to choose between working and raising their kids.",
    link: 'https://francescahong.com/policy/#education',
  },
  leave: {
    emoji: '💸',
    image: 'imgs/leave.jpg',
    name: 'Paid Leave For All',
    tagline: "You know rest isn't a luxury. It's a right.",
    desc: "You're the one who actually logs off when you're sick and will politely-but-firmly tell anyone that \"hustle culture\" is a scam. Fran's universal paid leave bill covers every Wisconsin worker, including freelancers and the self-employed, because caring for yourself or a sick loved one shouldn't cost you your paycheck.",
    link: 'https://francescahong.com/policy/#workers',
  },
  schools: {
    emoji: '📚',
    image: 'imgs/schools.jpg',
    name: 'Fully Funded Public Schools',
    tagline: "You're investing in Wisconsin's future, one classroom at a time.",
    desc: "You're curious, you ask questions, and you believe deeply that a great education shouldn't depend on your ZIP code. Wisconsin's public schools used to be among the best in the country, but 15 years of Republican cuts changed that. Fran wants to fully restore funding to K-12, the UW system, and technical colleges, because the next generation deserves better.",
    link: 'https://francescahong.com/policy/#education',
  },
  healthcare: {
    emoji: '🩺',
    image: 'imgs/healthcare.jpg',
    name: 'Healthcare For All',
    tagline: "You think healthcare is a right, not a bill.",
    desc: "You've probably had to fight with an insurance company at least once, and it was exhausting. Wisconsin is one of a shrinking number of states that still hasn't expanded Medicaid. Fran wants to fix that. She will expand BadgerCare to cover more Wisconsinites and add a public option to bring premiums down for everyone.",
    link: 'https://francescahong.com/policy/#healthcare',
  },
  repro: {
    emoji: '💚',
    image: 'imgs/repro.jpg',
    name: 'Reproductive Rights',
    tagline: "You believe bodily autonomy isn't up for debate.",
    desc: "You don't shy away from hard fights and you know your rights. Wisconsin still has an 1849 abortion ban sitting on the books. Fran is clear: abortion is healthcare, and every Wisconsinite deserves the right to make decisions about their own body. Repealing that law is day one business.",
    link: 'https://francescahong.com/policy/#bodily-autonomy',
  },
  housing: {
    emoji: '🏡',
    image: 'imgs/housing.jpg',
    name: 'Housing Affordability',
    tagline: "You believe home should be within reach for everyone.",
    desc: "You've watched rents climb and starter homes disappear, and you know something structural has to change. Fran's housing plan tackles zoning reform, community land trusts, bolstering rental unit regulations, and building more affordable stock, because stable, affordable housing is the foundation for everything else in a person's life.",
    link: 'https://francescahong.com/policy/#housing',
  },
  environment: {
    emoji: '🌳',
    image: 'imgs/environment.jpg',
    name: "Protecting Wisconsin's Water & Land",
    tagline: "You're fighting for the Wisconsin your grandkids deserve.",
    desc: "You're the person who actually reads about what's in the water and gets mad about it. Fran is firmly against the Line 5 pipeline expansion and supports restoring the Wisconsin Department of Natural Resources (DNR). Clean water and public land are worth more than corporate extraction profits. Wisconsin's natural resources belong to everyone.",
    link: 'https://francescahong.com/policy/#environment',
  },
  business: {
    emoji: '🍜',
    image: 'imgs/business.jpg',
    name: 'Public Bank & Small Businesses',
    tagline: "You're rooting for the little guy, and so is Fran.",
    desc: "You'd rather eat at the family-owned restaurant than the chain, every single time. Wisconsin's small businesses, farms, and restaurants can't always access affordable capital from big banks. Fran wants to create a state public bank, modeled on North Dakota's, offering lower-interest loans to local businesses and affordable housing projects.",
    link: 'https://francescahong.com/policy/#business-and-government',
  },
};

// ─────────────────────────────────────────
// QUESTIONS
// Each option maps to a policy key via the `policy` field.
// Answer order is randomized at runtime.
// ─────────────────────────────────────────
const QUESTIONS = [
  {
    emoji: '☕',
    text: "It's Saturday morning. What are you actually doing?",
    options: [
      { text: 'Wrangling kids or helping a family member', em: '👶', policy: 'childcare' },
      { text: "Sleeping in: I genuinely earned it", em: '😴', policy: 'leave' },
      { text: 'At a farmers market or local coffee spot', em: '🧺', policy: 'business' },
      { text: 'Reading, watching a doc, or learning something', em: '📖', policy: 'schools'},
    ],
  },
  {
    emoji: '🧠',
    text: 'How would your friends describe you?',
    options: [
      { text: 'The stable, reliable one', em: '💪', policy: 'childcare' },
      { text: 'The chaotic, but fun one', em: '💃', policy: 'healthcare' },
      { text: 'The confident, outgoing one', em: '😎', policy: 'repro' },
      { text: 'The quiet, shy one', em: '🫣', policy: 'housing' },
    ],
  },
  {
    emoji: '🌟',
    text: 'Pick the value that drives you the most:',
    options: [
      { text: 'Community — we rise together or not at all', em: '🤝', policy: 'childcare' },
      { text: 'Fairness — everyone deserves a real shot', em: '⚖️', policy: 'leave' },
      { text: 'Autonomy — my body, my business', em: '🙌', policy: 'repro' },
      { text: 'Sustainability — protect what we have for who comes next', em: '🌱', policy: 'environment' },
    ],
  },
  {
    emoji: '🍽️',
    text: "You're going out to eat in Wisconsin. Where are you headed?",
    options: [
      { text: "The family-owned spot that's been there 30 years", em: '🍜', policy: 'business' },
      { text: 'Wherever my friend who works in restaurants recommends', em: '👩‍🍳', policy: 'leave' },
      { text: 'Somewhere near a lake or trail', em: '🏞️', policy: 'environment' },
      { text: 'Wherever the kids will actually eat something', em: '🧒', policy: 'childcare' },
    ],
  },
  {
    emoji: '🚗',
    text: 'The driver next to you is honking and yelling at you. What are they mad about?',
    options: [
      { text: 'You forgot to go on green because you were reading a book', em: '📚', policy: 'schools' },
      { text: 'You blew them a kiss', em: '💋', policy: 'repro' },
      { text: 'You drove exactly 25 MPH in a 25 MPH zone', em: '🚧', policy: 'healthcare' },
      { text: 'You accidentally cut them off with your Prius while merging', em: '🔋', policy: 'environment' },
    ],
  },
  {
    emoji: '🗞️',
    text: 'Which of these headlines would you actually click on?',
    options: [
      { text: "YOU WON'T BELIEVE WHAT THIS CHILD PRODIGY INVENTED", em: '🧠', policy: 'schools' },
      { text: 'TOP 10 DIY HACKS TO MAKE YOUR LIFE AMAZING', em: '🔧', policy: 'housing' },
      { text: 'YOU HAVE TO TRY THESE TOP 5 LOCAL RESTAURANTS', em: '🍽️', policy: 'business' },
      { text: 'THE 12 BEST NATURE HIKES IN YOUR AREA', em: '🥾', policy: 'environment' },
    ],
  },
  {
    emoji: '🔥',
    text: 'Your boss calls you in to fire you. What do you say?',
    options: [
      { text: '"You can\'t fire me. I quit!"', em: '😮‍💨', policy: 'leave' },
      { text: '"Sticks and stones may break my bones, but what you say can\'t hurt me!"', em: '🪵', policy: 'healthcare' },
      { text: '"Great, I can make it to my afternoon date, then!"', em: '🗓️', policy: 'repro' },
      { text: '"I needed to work on my woodworking skills anyway."', em: '🪓', policy: 'housing' },
    ],
  },
  {
    emoji: '🦸',
    text: 'If you could have one of these superpowers, which would you pick?',
    options: [
      { text: 'The ability to speak any language in the world', em: '🌍', policy: 'schools' },
      { text: 'The power to regenerate any wound', em: '🏥', policy: 'healthcare' },
      { text: 'The power to create delicious food out of nothing', em: '🍱', policy: 'business' },
      { text: 'The ability to repair any broken object', em: '🛠️', policy: 'housing' },
    ],
  },
];
