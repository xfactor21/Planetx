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
    tagline: 'Bee Yourself. Study With the Swarm.',
    description:
      "The social study app for your actual school — ask for help, share notes, keep up with what’s due, and learn with Buzz, an AI study companion that guides instead of just giving answers.",
    platforms: ['Designed for Mobile — Works Everywhere'],
    icon: '/apps/studyhive.png',
    tags: ['Social Networking', 'Productivity', 'Self-Improvement'],
    downloads: [
      { label: 'Launch App', href: 'https://studyhive-a-psi.vercel.app/' },
    ],
    detailHref: '/studyhive',
    screenshots: [
      '/screenshots/studyhive/studyhive-1.webp',
      '/screenshots/studyhive/studyhive-2.webp',
      '/screenshots/studyhive/studyhive-3.webp',
    ],
  },
  {
    id: 'xmemoirs',
    name: 'xMemoirs',
    tagline: 'Keep the moments that would otherwise disappear.',
    description:
      "xMemoirs is a lightweight memory space for capturing notes, photos, videos, audio, and moments as they happen. It keeps your life searchable, explorable, and easy to revisit without turning memory keeping into a chore.",
    platforms: ['Designed for Mobile — Works Everywhere'],
    icon: '/apps/xmemoirs-new.png',
    tags: ['Personal', 'Journaling', 'AI'],
    downloads: [],
    betaHref: '/beta#xmemoirs',
    appUrl: 'https://cortex-ecru-mu.vercel.app/',
    screenshots: [
      '/screenshots/xmemoirs/xmemoirs-1.webp',
      '/screenshots/xmemoirs/xmemoirs-2.webp',
      '/screenshots/xmemoirs/xmemoirs-3.webp',
    ],
  },
  {
    id: 'voice-studio-x',
    name: 'Voice Studio X',
    tagline: 'Give your words a voice.',
    description:
      'Voice Studio X is an AI voice studio for generating speech, changing voices, cloning your own voice, and experimenting with spoken and singing models.',
    platforms: ['Designed for Mobile — Works Everywhere'],
    icon: '/apps/voice-studio-x.png',
    tags: ['Audio', 'Creative Tools', 'AI'],
    downloads: [],
    betaHref: '/beta#voice-studio-x',
    appUrl: 'https://vsx-c6lez4c4v-xfactor21s-projects.vercel.app/',
    screenshots: [
      '/screenshots/voice-studio-x/voice-studio-x-1.webp',
      '/screenshots/voice-studio-x/voice-studio-x-2.webp',
      '/screenshots/voice-studio-x/voice-studio-x-3.webp',
    ],
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
    screenshots: [
      '/screenshots/bdxm/bdxm-1.webp',
      '/screenshots/bdxm/bdxm-2.webp',
      '/screenshots/bdxm/bdxm-3.webp',
    ],
  },
]

// Extended detail content for StudyHive's dedicated page.
export const studyHiveDetail = {
  name: 'StudyHive',
  tagline: 'Bee Yourself. Study With the Swarm.',
  description:
    "StudyHive is the social app built specifically for helping each other with school — verified to your real school, so it’s actually your classmates, not strangers. Ask questions and get real help, build a shared Library of notes and resources, keep track of what’s due with a class calendar, and learn with Buzz, an AI study companion that guides you toward understanding instead of simply handing over the answer. Every bit of help you give can build real, un-buyable reputation through Hunnies, badges, and the standing you earn by contributing.",
  icon: '/apps/studyhive.png',
  tags: ['Social Networking', 'Productivity', 'Self-Improvement'],
  downloads: [
    { label: 'Launch App', href: 'https://studyhive-a-psi.vercel.app/' },
  ],
  features: [
    {
      title: 'Learn with your actual school',
      body: "StudyHive is built around verified school identity, so the people answering questions, sharing resources, and showing up in your classes are your real school community — not a random global feed.",
    },
    {
      title: 'Ask Buzz, then actually learn it',
      body: "Buzz is an AI study companion designed to teach Socratically: explain the concept, work through examples, and help you get unstuck without simply doing the assignment for you.",
    },
    {
      title: 'Build the Library together',
      body: "Upload notes and study resources, find what classmates have shared, and upvote what helps. Teacher uploads can be marked official, turning scattered class material into something the whole school can build on.",
    },
    {
      title: 'Know what’s due',
      body: "Keep homework, quizzes, tests, study sessions, and class events in one calendar. Classmates can be tagged and RSVP, while teacher-posted dates can appear as official school events.",
    },
    {
      title: 'Earn status by helping',
      body: "StudyHive flips the usual social-media equation: useful contributions can earn Hunnies, badges, gifts, and profile flair. Hunnies are earned through participation and helping — they aren’t something you can simply buy.",
    },
    {
      title: 'Show up without performing',
      body: "Presence states let students signal things like heads-down, out sick, free period, or a rough day. The goal is a school network where being useful and being noticed can finally mean the same thing.",
    },
  ],
}

export const upcomingApps: UpcomingApp[] = [
  {
    id: 'xos',
    name: 'xOS',
    tagline: 'Your digital world, built around you.',
    description:
      "xOS explores what comes after the traditional desktop: a more connected system built around your projects, tools, ideas, and workflows instead of forcing you to adapt to the machine.",
    longDescription:
      "xOS started with a simple question: what if an operating system didn't have to feel like an operating system? Instead of building another collection of windows, folders, menus, and applications, xOS explores a more connected digital environment where your work, information, tools, AI, and creative projects can exist together as parts of one larger system.\n\nThe idea is to make the computer feel less like a machine you operate and more like an environment you inhabit. Your projects become places. Your information becomes connected. Your tools become part of a larger workflow. And the system itself becomes something that can understand context rather than simply waiting for you to tell it exactly what to do.\n\nxOS is ambitious by design. Some of its ideas are experimental, some are still being figured out, and some may completely change before we get there. But that's what makes building it interesting. We're not trying to make a slightly prettier version of something that already exists.\n\nWe're asking what comes after the desktop.",
    status: 'In development',
    progress: 78,
    eta: 'TBA',
    tags: ['Systems', 'Platform'],
    icon: '/apps/xos.png',
    screenshots: [
      '/screenshots/xos/xos-1.webp',
      '/screenshots/xos/xos-2.webp',
      '/screenshots/xos/xos-3.webp',
    ],
  },
  {
    id: 'xide',
    name: 'xIDE',
    tagline: 'A full development environment. In your pocket.',
    description:
      "xIDE is a serious mobile development environment with a real code workspace, terminal, project tools, previews, and support for building modern apps directly from your phone.",
    longDescription:
      "xIDE is a mobile IDE built around a pretty straightforward idea: your phone is already a computer, so why shouldn't you be able to actually develop on it? We're bringing together a serious code editor, project management, terminal, build tools, previews, and development workflows into a workspace designed specifically for mobile.\n\nBut the really ambitious part is what happens underneath. xIDE isn't being built just to support one particular kind of project. We're pushing toward an environment capable of working across different modern development stacks, including Capacitor-based applications, Expo projects, Vite applications, and more, all from the same IDE. That's a deceptively difficult problem, which is precisely why we're interested in it.\n\nThe goal isn't to recreate a desktop IDE on a tiny screen with fourteen panels squeezed into oblivion. It's to take the power of a serious development environment and rethink the experience so it's lighter, cleaner, less confusing, and actually pleasant to use on a phone.\n\nBecause sometimes the best place to build something isn't your desk. It's wherever the idea happens.",
    status: 'In development',
    progress: 60,
    eta: 'TBA',
    tags: ['Developer Tools', 'Productivity'],
    icon: '/apps/xide.png',
    screenshots: [
      '/screenshots/xide/xide-1.webp',
      '/screenshots/xide/xide-2.webp',
      '/screenshots/xide/xide-3.webp',
    ],
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
      'xForge Jr. is a kid-friendly game-building experience with playable projects, guided lessons, and visual tools that teach things like gravity, logic, variables, and game mechanics by letting kids actually experiment.',
    longDescription:
      'xForge Jr. exists because of a nine-year-old who saw what we were building with xForge and immediately started getting involved. Instead of simply telling her how it worked, we wondered what would happen if we made something specifically for her. So we built a different experience.\n\nxForge Jr. keeps many of the underlying ideas that make xForge fun, including character creation and game systems, but wraps them in a much more approachable, colorful, kid-focused environment. Rather than dropping a giant empty editor in front of a child and saying "good luck," Jr. comes with games already inside it. Players can jump into experiences such as arcade-style games and then start changing things themselves.\n\nThat\'s where the learning happens.\n\nChange the gravity. See what happens. Adjust a variable. Break the game. Fix it. Change something else. Suddenly concepts like physics, logic, systems, variables, and cause-and-effect aren\'t abstract computer science vocabulary anymore. They\'re things you can touch.\n\nxForge Jr. isn\'t designed to turn kids into miniature software engineers. It\'s designed to let them discover that they can build things.',
    status: 'Planned',
    progress: 0,
    eta: 'TBA',
    tags: ['Developer Tools'],
    icon: '/apps/xforge-jr.png',
  },
  {
    id: 'xfactor-os',
    name: 'xFactor.OS',
    tagline: 'The operating layer for everything xFactor builds.',
    description:
      'xFactor.OS is the connective operating layer behind the xFactor universe — a shared home for music, media, tools, ideas, and the systems that tie them together.',
    longDescription:
      "xFactor.OS is an experiment in turning the xFactor creative universe into something you can actually move through. Music, media, tools, releases, experiments, and future experiences do not have to live as disconnected pages and applications. The idea is to give them a shared operating layer and a common home.\n\nIt is still early, and the exact shape is intentionally evolving with the projects around it. What matters is the direction: less jumping between disconnected pieces, more context, continuity, and personality across the entire xFactor ecosystem.\n\nThink of it less as another app and more as the interface around a creative world that keeps expanding.",
    status: 'In development',
    progress: 20,
    eta: 'TBA',
    tags: ['Systems', 'Platform'],
    icon: '/apps/xfactor-os.png',
    screenshots: [
      '/screenshots/xfactor-os/xfactor-os-1.webp',
      '/screenshots/xfactor-os/xfactor-os-2.webp',
      '/screenshots/xfactor-os/xfactor-os-3.webp',
    ],
  },
  {
    id: 'project-x',
    name: 'project.X',
    tagline: 'Your developer universe. One command center.',
    description:
      'project.X is a visual developer command center that brings projects, repositories, deployments, notes, local files, and cloud state together so you can instantly see what you are building and what needs attention next.',
    longDescription:
      "GitHub knows about your code. Vercel knows about your deployments. Your computer knows about your local files. Your notes know why the project exists. But none of those tools understands the entire project. project.X is being built to become the layer that does.\n\nOpen it and your development universe is visible at once: what is actively building, what changed recently, what has gone untouched, which repositories and deployments are connected, and where you left off. Filter down to what you are shipping, favorite the projects that matter most, attach the context you normally lose between tools, and switch between practical and visual ways of seeing the same workspace.\n\nThe larger goal is not to replace GitHub, Vercel, your IDE, your filesystem, or your notes. It is to understand the project state spread across them and turn it into one coherent picture — eventually helping answer the question every developer with too many projects asks: what needs my attention next?",
    status: 'In development',
    progress: 15,
    eta: 'TBA',
    tags: ['Developer Tools', 'Productivity'],
    icon: '/apps/project-x.png',
    screenshots: [
      '/screenshots/project-x/project-x-1.webp',
      '/screenshots/project-x/project-x-2.webp',
      '/screenshots/project-x/project-x-3.webp',
    ],
  },
  {
    id: 'hubx',
    name: 'HubX',
    tagline: 'Curated local AI tools. One honest guide.',
    description:
      'HubX is a practical catalog of open-source AI projects that helps you find the right tool, open its verified source or setup path, and register it locally once it is actually installed.',
    longDescription:
      "HubX is built for the part of local AI that usually gets messy: finding a useful project, figuring out what it really takes to run, and remembering where you installed it. It organizes open-source AI tools across assistants, image generation, video, agents, coding, research, audio, automation, and more while clearly distinguishing an official download from a framework, model repository, self-hosted app, or source-only project.\n\nThe point is not to pretend every project is one-click installable. HubX is deliberately honest about setup. When a tool has a proper installer, it points you there. When it needs Python, Docker, model weights, a GPU, or a local server, it tells you. Once the project is actually installed, HubX can register the local executable, script, or URL so your local AI toolbox becomes something you can actually navigate and launch.\n\nFind it. Set it up correctly. Register it. Stop hunting through bookmarks and old terminal history.",
    status: 'Preview',
    progress: 85,
    eta: 'TBA',
    tags: ['AI', 'Local Tools', 'Open Source'],
    icon: '/apps/hubx.png',
    screenshots: [
      '/screenshots/hubx/hubx-1.webp',
      '/screenshots/hubx/hubx-2.webp',
      '/screenshots/hubx/hubx-3.webp',
    ],
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
    screenshots: [
      '/screenshots/xdash/xdash-1.webp',
      '/screenshots/xdash/xdash-2.webp',
      '/screenshots/xdash/xdash-3.webp',
    ],
  },
  {
    id: 'xconnect',
    name: 'xConnect',
    tagline: 'Apps are not the future. Capabilities are.',
    description:
      'xConnect is a universal integration and automation layer that lets apps and AI discover capabilities, choose the right provider, enforce permissions, and execute real actions without rebuilding integrations from scratch.',
    longDescription:
      'Most software integrations are built one app at a time: connect GitHub here, wire Vercel there, add another API somewhere else, then repeat the same work in the next product. xConnect takes a different approach. It treats those integrations as reusable capabilities that can be discovered, permissioned, combined, and executed.\n\nThat means a product like project.X can ask what actions are available for a project, let xConnect find the right provider, execute the action, and return the result. The same capability layer can eventually serve other applications and AI agents without forcing each one to become its own integration platform.\n\nxConnect is the nervous system: providers, permissions, workflows, execution, approvals, and history behind the experiences built on top of it.',
    status: 'In development',
    progress: 50,
    eta: 'TBA',
    tags: ['Developer Tools', 'Automation', 'Infrastructure'],
    icon: '/apps/xconnect.png',
  },
  {
    id: 'xworld',
    name: 'xWorld',
    tagline: 'Seven worlds. One truth. Remember who you are.',
    description:
      'Built in Unreal Engine 5, xWorld is a story-driven game about xFactor traveling through seven worlds to escape a simulation, recover his memories, and fulfill his destiny.',
    longDescription:
      "xFactor knows his world is not real. What he does not know is why he is trapped there — or who he was before the simulation took hold.\n\nxWorld follows his journey across seven worlds, each pushing him closer to the memories, truths, and purpose that have been stripped away. The worlds are not just levels to clear; they are pieces of a larger mystery about identity, reality, and the destiny he is being pulled toward.\n\nBuilt with Unreal Engine 5, xWorld is intended to bring the xFactor universe into an interactive form: part adventure, part mystery, part digital mythology. The destination is escape. The real journey is remembering why he needs to escape in the first place.",
    status: 'Concept',
    progress: 5,
    eta: 'TBA',
    tags: ['Game'],
    icon: '/apps/xworld.png',
  },
  {
    id: 'one-x',
    name: 'ONE.X',
    tagline: 'Dating, one person at a time.',
    description:
      'ONE.X is dating without the endless feed — fewer, more meaningful introductions powered by compatibility and deliberate limits so you actually focus on the person in front of you.',
    longDescription:
      "Most dating apps are designed around abundance: more profiles, more swipes, more matches, more reasons to keep looking. ONE.X starts with the opposite idea. What if better dating came from having less to browse and more reason to pay attention?\n\nCompatibility is built progressively through the things that reveal who you actually are — questions, preferences, challenges, writing, voice, and other signals that can say more than a few photos and a bio. Introductions are intentionally limited. Conversation bandwidth is intentionally limited. The point is not to collect matches; it is to give one promising connection enough room to become something real.\n\nONE.X is not trying to make dating slower for the sake of being difficult. It is trying to remove the casino: the endless feed, the constant comparison, and the feeling that somebody better might be one swipe away. Fewer people. Better context. One person at a time.",
    status: 'In development',
    progress: 15,
    eta: 'TBA',
    tags: ['Dating', 'Compatibility'],
    icon: '/apps/one-x.png',
    screenshots: [
      '/screenshots/one-x/one-x-1.webp',
      '/screenshots/one-x/one-x-2.webp',
      '/screenshots/one-x/one-x-3.webp',
    ],
  },
  {
    id: 'context-key',
    name: 'conteXt Key',
    tagline: 'Your secrets should not disappear after creation.',
    description:
      'conteXt Key is a secure developer vault for API keys, tokens, secrets, IDs, and environment values, keeping the sensitive pieces your projects depend on organized and easy to find when you need them.',
    longDescription:
      "Developers constantly create credentials that may only be shown once: API keys, access tokens, signing secrets, service IDs, environment values, and other pieces of configuration that become painful to recover after the fact. conteXt Key is being built as a dedicated, secure place to keep that information organized by the project and service it belongs to.\n\nInstead of scattering secrets across notes, screenshots, .env files, dashboards, and forgotten password-manager entries, conteXt Key gives development credentials a home designed around their actual context. The goal is simple: know what a key belongs to, where it is used, and how to find it when the project needs it again.\n\nLonger term, tools such as xConnect may be able to handle more of this connection and credential flow automatically. conteXt Key remains the deliberate vault: the place where the sensitive building blocks of your development ecosystem can be stored and understood.",
    status: 'In development',
    progress: 10,
    eta: 'TBA',
    tags: ['Developer Tools', 'Security', 'Credentials'],
    icon: '/apps/context-key.png',
  },
]

export const releases: Release[] = []
