export type ReleasedApp = {
  id: string
  name: string
  tagline: string
  description: string
  version?: string
  platforms: string[]
  icon: string
  tags: string[]
  downloads: { label: string; href: string }[]
  /** When true, the card is blurred behind an 18+ age gate until the visitor confirms. */
  mature?: boolean
  /** When set, the card's primary action links to this internal page instead of listing external downloads. */
  detailHref?: string
  /** When set, the card's primary action links to the beta application page anchored to this app instead of an external launch link. */
  betaHref?: string
  /** Real app URL, used only server-side (e.g. approval emails) — not rendered publicly while the app is beta-gated. */
  appUrl?: string
  /** Optional screenshot paths shown on the Beta page. */
  screenshots?: string[]
}

export type UpcomingApp = {
  id: string
  name: string
  tagline: string
  description: string
  /** Longer-form copy shown only on the full /coming-soon page. Falls back to `description` when omitted. */
  longDescription?: string
  status: string
  progress: number
  eta: string
  tags: string[]
  icon: string
  /** Optional screenshot paths shown on the Coming Soon page. */
  screenshots?: string[]
  /** Slightly narrower card, meant to sit beside a related app (e.g. xForge Jr next to xForge). */
  companionSlot?: boolean
}

export type Release = {
  id: string
  title: string
  artist: string
  type: 'Album' | 'EP' | 'Single'
  year: string
  runtime: string
  art: string
  links: { label: string; href: string }[]
}

// Real entries only — add new apps here as they ship.
export const releasedApps: ReleasedApp[] = [
  {
    id: 'studyhive',
    name: 'StudyHive',
    tagline: 'Learn Together. Grow Together.',
    description:
      'A collaborative study space that brings people together to learn, share, and level up — built for the web, works everywhere.',
    platforms: ['Designed for Mobile — Works Everywhere'],
    icon: '/apps/studyhive.png',
    tags: ['Social Networking', 'Productivity', 'Self-Improvement'],
    downloads: [
      { label: 'Launch App', href: 'https://studyhive-a-psi.vercel.app/' },
    ],
    detailHref: '/studyhive',
  },
  {
    id: 'bdxm',
    name: 'bdXm: eXplore Each Other',
    tagline: 'BDSM for Couples, or Get Matched with Someone Nearby',
    description:
      'A private space to explore intimacy — deepen things with your partner, or get matched with like-minded people nearby.',
    platforms: ['Designed for Mobile — Works Everywhere'],
    icon: '/apps/bdxm.png',
    tags: ['Relationship', 'Networking', 'Self-Improvement'],
    downloads: [],
    betaHref: '/beta#bdxm',
    appUrl: 'https://bdxm-beta.vercel.app/',
    mature: true,
  },
  {
    id: 'cortex',
    name: 'CorteX',
    tagline: 'Your life, remembered intelligently.',
    description:
      'CorteX goes far beyond journaling. It captures the moments of your life, understands the context around them, connects the people, places, ideas, sounds, images, and experiences inside them, and turns all of that information into something you can actually explore. Relive your day. Turn memories into stories. Explore your personal neural map. Ask your history questions. Rediscover moments you didn\'t realize you had captured.',
    platforms: ['Designed for Mobile — Works Everywhere'],
    icon: '/apps/cortex.png',
    tags: ['Productivity', 'AI'],
    downloads: [],
    betaHref: '/beta#cortex',
    appUrl: 'https://cortex-ecru-mu.vercel.app/',
  },
]

// Extended detail content for StudyHive's dedicated page.
export const studyHiveDetail = {
  name: 'StudyHive',
  tagline: 'Learn Together. Grow Together.',
  description:
    'A collaborative study space that brings people together to learn, share, and level up — built for the web, works everywhere.',
  icon: '/apps/studyhive.png',
  tags: ['Social Networking', 'Productivity', 'Self-Improvement'],
  downloads: [
    { label: 'Launch App', href: 'https://studyhive-a-psi.vercel.app/' },
  ],
  // TODO: fill in with real feature copy
  features: [
    {
      title: 'Study together',
      body: 'Placeholder — describe the collaborative study tools here.',
    },
    {
      title: 'Track progress',
      body: 'Placeholder — describe progress tracking / rewards here.',
    },
    {
      title: 'Stay motivated',
      body: 'Placeholder — describe the social/community hooks here.',
    },
  ],
}

export const upcomingApps: UpcomingApp[] = [
  {
    id: 'xos',
    name: 'xOS',
    tagline: 'Your digital world, built around you.',
    description:
      "xOS is a different way of thinking about what an operating system can be. Instead of making you adapt to your computer, we're exploring a system that adapts to you, your projects, your tools, your ideas, and the way you actually work. It's part operating system, part intelligent workspace, and part digital universe. We're still figuring out exactly where the boundaries are, which is probably a good sign.",
    longDescription:
      "xOS started with a simple question: what if an operating system didn't have to feel like an operating system? Instead of building another collection of windows, folders, menus, and applications, xOS explores a more connected digital environment where your work, information, tools, AI, and creative projects can exist together as parts of one larger system.\n\nThe idea is to make the computer feel less like a machine you operate and more like an environment you inhabit. Your projects become places. Your information becomes connected. Your tools become part of a larger workflow. And the system itself becomes something that can understand context rather than simply waiting for you to tell it exactly what to do.\n\nxOS is ambitious by design. Some of its ideas are experimental, some are still being figured out, and some may completely change before we get there. But that's what makes building it interesting. We're not trying to make a slightly prettier version of something that already exists.\n\nWe're asking what comes after the desktop.",
    status: 'In development',
    progress: 78,
    eta: 'TBA',
    tags: ['Systems', 'Platform'],
    icon: '/apps/xos.png',
  },
  {
    id: 'xide',
    name: 'xIDE',
    tagline: 'A full development environment. In your pocket.',
    description:
      "xIDE is a mobile development environment built for people who don't want to wait until they're sitting at a computer to build something. It gives you a real coding workspace, terminal, project tools, previews, and the power to actually develop on your phone. And we're trying something most people will tell you can't be done: one mobile IDE that can handle multiple modern app stacks instead of locking you into one ecosystem.",
    longDescription:
      "xIDE is a mobile IDE built around a pretty straightforward idea: your phone is already a computer, so why shouldn't you be able to actually develop on it? We're bringing together a serious code editor, project management, terminal, build tools, previews, and development workflows into a workspace designed specifically for mobile.\n\nBut the really ambitious part is what happens underneath. xIDE isn't being built just to support one particular kind of project. We're pushing toward an environment capable of working across different modern development stacks, including Capacitor-based applications, Expo projects, Vite applications, and more, all from the same IDE. That's a deceptively difficult problem, which is precisely why we're interested in it.\n\nThe goal isn't to recreate a desktop IDE on a tiny screen with fourteen panels squeezed into oblivion. It's to take the power of a serious development environment and rethink the experience so it's lighter, cleaner, less confusing, and actually pleasant to use on a phone.\n\nBecause sometimes the best place to build something isn't your desk. It's wherever the idea happens.",
    status: 'In development',
    progress: 60,
    eta: 'TBA',
    tags: ['Developer Tools', 'Productivity'],
    icon: '/apps/xide.png',
  },
  {
    id: 'xforge',
    name: 'xForge',
    tagline: "Make the game you couldn't stop thinking about.",
    description:
      "xForge is a lightweight game creation environment built to get you from idea to playable world without burying you under an ocean of tools. Build scenes, create characters, animate them, rig them, design mechanics, and bring everything together in one place. It's not trying to be Unreal. It's trying to be xForge: simpler, faster, more approachable, and focused on actually making games.",
    longDescription:
      'xForge is our attempt to take the enormous toolbox of modern game development and turn it into something that doesn\'t require a map, compass, and three years of training to navigate. It\'s a PC-first game creation environment designed around the parts of game development creators actually need: worlds, scenes, characters, animation, rigging, gameplay systems, assets, testing, and iteration.\n\nOne of the big pieces is the Character Factory, where a character can move through the creation process from concept to something actually usable in a game. Create the character, build its structure, rig it, animate it, and bring it into your world. Around that sits a growing collection of tools designed to cover the rest of the game-making process without turning the application into a giant wall of buttons.\n\nxForge deliberately lives in the space between "toy" and "professional monster." It should have enough power to make something real, while staying lightweight enough that you can open it, understand it, and start building.\n\nBuild. Play. Break something. Build it better. Repeat.',
    status: 'In development',
    progress: 45,
    eta: 'TBA',
    tags: ['Developer Tools', 'Build System'],
    icon: '/apps/xforge.png',
  },
  {
    id: 'xforge-jr',
    name: 'xForge Jr',
    tagline: 'Learn how games work by making them.',
    description:
      'xForge Jr. began with a very simple experiment: show a kid a game-making tool and see what happens. The answer was basically, "Wait... I can make this?" Built for younger creators, xForge Jr. turns game development into a hands-on learning experience with playable projects, guided lessons, visual tools, characters, and experiments that teach concepts like gravity, variables, logic, and game mechanics by letting kids actually mess with them.',
    longDescription:
      'xForge Jr. exists because of a nine-year-old who saw what we were building with xForge and immediately started getting involved. Instead of simply telling her how it worked, we wondered what would happen if we made something specifically for her. So we built a different experience.\n\nxForge Jr. keeps many of the underlying ideas that make xForge fun, including character creation and game systems, but wraps them in a much more approachable, colorful, kid-focused environment. Rather than dropping a giant empty editor in front of a child and saying "good luck," Jr. comes with games already inside it. Players can jump into experiences such as arcade-style games and then start changing things themselves.\n\nThat\'s where the learning happens.\n\nChange the gravity. See what happens. Adjust a variable. Break the game. Fix it. Change something else. Suddenly concepts like physics, logic, systems, variables, and cause-and-effect aren\'t abstract computer science vocabulary anymore. They\'re things you can touch.\n\nxForge Jr. isn\'t designed to turn kids into miniature software engineers. It\'s designed to let them discover that they can build things.',
    status: 'Planned',
    progress: 0,
    eta: 'TBA',
    tags: ['Developer Tools'],
    icon: '/apps/xforge-jr.png',
  },
  {
    id: 'voice-studio-x',
    name: 'Voice Studio X',
    tagline: 'Give your words a voice.',
    description:
      'Voice Studio X is a streamlined AI voice creation studio for generating, cloning, customizing, and working with synthetic voices without turning the experience into a maze of menus and subscriptions. Create voices, experiment with them, and put them to work in everything from narration and characters to music and creative projects. And yes, there will even be an xFactor voice in the studio for you to play with.',
    longDescription:
      "Voice Studio X is an AI voice studio built around a simple philosophy: the technology should get out of your way. We're focusing on voice creation, cloning, generation, manipulation, and practical creative workflows without loading the experience down with every feature imaginable just because we technically can.\n\nThat means familiar tools, but with a cleaner workflow. Create or clone a voice. Generate speech. Experiment with it. Use it in your projects. And when you want to do something more involved, we're looking at ways to collapse multi-step processes into something much simpler. Instead of taking several separate tools and workflows to accomplish one creative task, Voice Studio X is designed to bring those steps together.\n\nWe're also aiming to make the service substantially more approachable from a pricing standpoint. You'll be able to explore and use a meaningful portion of the experience before the paywall becomes the main character.\n\nAnd because apparently one human voice wasn't enough, xFactor himself is getting a voice. You'll be able to play with it, manipulate it, and make it say things that probably should have remained unsaid.",
    status: 'In development',
    progress: 95,
    eta: 'TBA',
    tags: ['Audio', 'Creative Tools'],
    icon: '/apps/voice-studio-x.png',
  },
  {
    id: 'xmemoirs',
    name: 'xMemoirs',
    tagline: 'Keep the moments that would otherwise disappear.',
    description:
      "xMemoirs is a lightweight personal memory space for capturing the little pieces of your life as they happen. Notes, photos, videos, audio, thoughts, moments, and memories can all become part of a personal archive that you can search, explore, and revisit. It's intentionally simple. No giant learning curve. No digital filing cabinet from hell. Just a fast, intelligent place to keep your life.",
    longDescription:
      "Most of life isn't made up of major events. It's made up of tiny moments you don't think you'll forget until, eventually, you do. A conversation. Something your kid said. A random Tuesday afternoon. A ten-second video. A thought you had while driving. A voice you haven't heard in years.\n\nxMemoirs is designed to give those moments somewhere to live. Capture them however feels natural, whether that's writing, audio, video, photos, or quick notes. The system can organize and categorize what you save so that later you can actually find it again. Instead of forcing you to maintain a complicated digital archive, the intelligence works quietly in the background.\n\nxMemoirs shares the same core philosophy as its bigger sibling, CorteX, but deliberately leaves out much of the machinery. It's faster, lighter, easier to understand, and designed for people who want the benefits of intelligent memory without needing to learn an entire system.\n\nCapture life. Keep it. Come back to it.",
    status: 'In development',
    progress: 85,
    eta: 'TBA',
    tags: ['Personal', 'Journaling'],
    icon: '/apps/xmemoirs-new.png',
  },
  {
    id: 'xfactor-os',
    name: 'xFactor.OS',
    tagline: 'The operating layer for everything xFactor builds.',
    description:
      'Placeholder description — details on xFactor.OS coming soon. Check back for updates as development progresses.',
    status: 'In development',
    progress: 20,
    eta: 'TBA',
    tags: ['Systems', 'Platform'],
    icon: '/apps/xfactor-os.png',
  },
  {
    id: 'project-x',
    name: 'project.X',
    tagline: 'Still under wraps.',
    description:
      'Placeholder description — details on project.X coming soon. Check back for updates as development progresses.',
    status: 'In development',
    progress: 15,
    eta: 'TBA',
    tags: ['Unannounced'],
    icon: '/placeholder.svg',
  },
  {
    id: 'x95',
    name: 'x95',
    tagline: 'Placeholder tagline — coming soon.',
    description:
      'Placeholder description — details on x95 coming soon. Check back for updates as development progresses.',
    status: 'In development',
    progress: 25,
    eta: 'TBA',
    tags: ['Unannounced'],
    icon: '/placeholder.svg',
  },
  {
    id: 'xdash',
    name: 'xDash',
    tagline: 'Your entire digital operation. One dashboard.',
    description:
      'xDash started as a personal dashboard and turned into something much bigger. It pulls the services, projects, deployments, analytics, repositories, and development activity you care about into one futuristic command center. Monitor what\'s happening. Jump into your projects. Check the numbers. Manage your services. And when supported, deploy or redeploy directly from the dashboard instead of opening another dozen tabs.',
    longDescription:
      "xDash started because I wanted something that didn't exist: one place to see what the hell was happening across everything I was building. It began as a personal dashboard for my own projects and deployments, but the more it grew, the more obvious it became that other people building things could use the same thing.\n\nInstead of jumping between hosting dashboards, analytics pages, repositories, deployment consoles, project management tools, and whatever other tab you've accumulated today, xDash brings those pieces into one streamlined command center. Connect the services you actually use and get a consolidated view of your projects, activity, deployments, performance, analytics, and other useful information.\n\nAnd it isn't meant to be another boring spreadsheet wearing a dark theme. xDash is deliberately futuristic. Think live gauges, visual analytics, status indicators, graphs, project cards, deployment controls, and a command-center interface that makes your digital infrastructure feel like something you're actually operating. The goal is dense information without visual chaos.\n\nThe really useful part is that xDash isn't necessarily just watching what's happening. Where integrations support it, you can do things directly from the dashboard. Deploy a new build. Redeploy a project. Manage a deployment. Jump into a repository. Check your analytics. Move from monitoring to actually doing without leaving the cockpit.\n\nIt started as a tool I wanted for myself. Then it became one of those projects where I realized: \"Wait... other people probably want this too.\" So we're building it.\n\nYour projects. Your data. Your deployments. One cockpit.",
    status: 'In development',
    progress: 30,
    eta: 'TBA',
    tags: ['Productivity'],
    icon: '/apps/xdash.png',
  },
  {
    id: 'xworld',
    name: 'xWorld',
    tagline: 'A game. Still taking shape.',
    description:
      'Placeholder description — xWorld is early and still being defined. Check back for updates as development progresses.',
    status: 'Concept',
    progress: 5,
    eta: 'TBA',
    tags: ['Game'],
    icon: '/placeholder.svg',
  },
  {
    id: 'commonx',
    name: 'commonX',
    tagline: 'Placeholder tagline — coming soon.',
    description:
      'Placeholder description — details on commonX coming soon. Check back for updates as development progresses.',
    status: 'In development',
    progress: 15,
    eta: 'TBA',
    tags: ['Unannounced'],
    icon: '/placeholder.svg',
  },
  {
    id: 'prixm',
    name: 'priXm',
    tagline: 'Placeholder tagline — coming soon.',
    description:
      'Placeholder description — details on priXm coming soon. Check back for updates as development progresses.',
    status: 'In development',
    progress: 10,
    eta: 'TBA',
    tags: ['Unannounced'],
    icon: '/placeholder.svg',
  },
  {
    id: 'context-key',
    name: 'conteXt Key',
    tagline: 'Placeholder tagline — coming soon.',
    description:
      'Placeholder description — details on conteXt Key coming soon. Check back for updates as development progresses.',
    status: 'In development',
    progress: 10,
    eta: 'TBA',
    tags: ['Unannounced'],
    icon: '/placeholder.svg',
  },
]

export const releases: Release[] = []
