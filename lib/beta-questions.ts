export type BetaQuestion = {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'checkbox'
  options?: string[]
  required?: boolean
}
export type BetaAppConfig = {
  id: string
  appName: string
  questions: BetaQuestion[]
}

export const BDXM_BETA: BetaAppConfig = {
  id: 'bdxm',
  appName: 'bdXm',
  questions: [
    {
      id: 'age-confirm',
      label: 'I confirm that I am 18 years of age or older.',
      type: 'checkbox',
      required: true,
    },
    {
      id: 'legal-jurisdiction',
      label:
        'I confirm that adult dating/matching apps are legal to use in my country or region of residence.',
      type: 'checkbox',
      required: true,
    },
    {
      id: 'age-range',
      label: 'What is your age range?',
      type: 'select',
      options: ['18–24', '25–34', '35–44', '45–54', '55+'],
      required: true,
    },
    {
      id: 'device',
      label: 'What device will you primarily test on?',
      type: 'select',
      options: ['iPhone (iOS)', 'Android phone', 'iPad / tablet', 'Desktop browser'],
      required: true,
    },
    {
      id: 'usage-intent',
      label:
        'What are you hoping to use bdXm for? (e.g. connecting with a partner, meeting new people, exploring the community features)',
      type: 'textarea',
      required: true,
    },
    {
      id: 'app-experience',
      label:
        'Have you used similar apps before? If so, which ones, and what did you like or dislike about them?',
      type: 'textarea',
      required: false,
    },
    {
      id: 'availability',
      label: 'How much time per week can you realistically spend testing and giving feedback?',
      type: 'select',
      options: ['Less than 1 hour', '1–3 hours', '3–5 hours', '5+ hours'],
      required: true,
    },
    {
      id: 'feedback-style',
      label:
        'Beta testers need to report bugs and share honest opinions, including negative ones. Are you comfortable doing that?',
      type: 'select',
      options: ['Yes, very comfortable', 'Somewhat comfortable', 'Not very comfortable'],
      required: true,
    },
    {
      id: 'privacy-ack',
      label:
        'I understand this is an early beta, features may be incomplete or unstable, and I will keep any private beta content/screens confidential.',
      type: 'checkbox',
      required: true,
    },
    {
      id: 'anything-else',
      label: 'Anything else you want us to know before we review your application?',
      type: 'textarea',
      required: false,
    },
  ],
}

export const STUDYHIVE_STUDENT_BETA: BetaAppConfig = {
  id: 'studyhive-student',
  appName: 'StudyHive (Student)',
  questions: [
    {
      id: 'age-confirm',
      label: 'What is your current grade level?',
      type: 'select',
      options: ['9th grade', '10th grade', '11th grade', '12th grade', 'Other'],
      required: true,
    },
    {
      id: 'guardian-aware',
      label:
        'I confirm a parent or guardian is aware I am applying to test this app.',
      type: 'checkbox',
      required: true,
    },
    {
      id: 'school-name',
      label: 'What school do you attend? (helps us understand who is testing)',
      type: 'text',
      required: false,
    },
    {
      id: 'device',
      label: 'What device will you primarily test on?',
      type: 'select',
      options: ['iPhone (iOS)', 'Android phone', 'iPad / tablet', 'Desktop browser'],
      required: true,
    },
    {
      id: 'study-habit',
      label: 'Do you currently use any app or tool to help you study or stay organized?',
      type: 'text',
      required: false,
    },
    {
      id: 'usage-intent',
      label: 'What would you actually want to use StudyHive for?',
      type: 'textarea',
      required: true,
    },
    {
      id: 'friend-group',
      label:
        'Would you have classmates or friends who might also want to test it with you?',
      type: 'select',
      options: ['Yes, several', 'Maybe one or two', 'Probably just me'],
      required: true,
    },
    {
      id: 'availability',
      label: 'How much time per week can you realistically spend testing and giving feedback?',
      type: 'select',
      options: ['Less than 1 hour', '1–3 hours', '3–5 hours', '5+ hours'],
      required: true,
    },
    {
      id: 'feedback-style',
      label:
        'Beta testers need to report bugs and share honest opinions, including negative ones. Are you comfortable doing that?',
      type: 'select',
      options: ['Yes, very comfortable', 'Somewhat comfortable', 'Not very comfortable'],
      required: true,
    },
    {
      id: 'privacy-ack',
      label:
        'I understand this is an early beta, features may be incomplete or unstable, and I will keep any private beta content/screens confidential.',
      type: 'checkbox',
      required: true,
    },
  ],
}

export const STUDYHIVE_TEACHER_BETA: BetaAppConfig = {
  id: 'studyhive-teacher',
  appName: 'StudyHive (Teacher)',
  questions: [
    {
      id: 'role',
      label: 'What is your role?',
      type: 'select',
      options: [
        'Classroom teacher',
        'School administrator',
        'Counselor / support staff',
        'Other education professional',
      ],
      required: true,
    },
    {
      id: 'school-name',
      label: 'What school or district are you affiliated with?',
      type: 'text',
      required: true,
    },
    {
      id: 'grade-subject',
      label: 'What grade level and/or subject do you work with?',
      type: 'text',
      required: true,
    },
    {
      id: 'device',
      label: 'What device will you primarily test on?',
      type: 'select',
      options: ['iPhone (iOS)', 'Android phone', 'iPad / tablet', 'Desktop browser'],
      required: true,
    },
    {
      id: 'classroom-tools',
      label:
        'What tools or platforms do you currently use for classroom engagement or peer support?',
      type: 'text',
      required: false,
    },
    {
      id: 'usage-intent',
      label:
        'What would you want to evaluate StudyHive for — classroom use, student wellbeing, something else?',
      type: 'textarea',
      required: true,
    },
    {
      id: 'student-access',
      label:
        'Would you be testing this on your own, or would you eventually want students in your classroom involved (in a later phase)?',
      type: 'select',
      options: ['Just me for now', 'Hoping to involve students later', 'Not sure yet'],
      required: true,
    },
    {
      id: 'availability',
      label: 'How much time per week can you realistically spend testing and giving feedback?',
      type: 'select',
      options: ['Less than 1 hour', '1–3 hours', '3–5 hours', '5+ hours'],
      required: true,
    },
    {
      id: 'feedback-style',
      label:
        'Beta testers need to report bugs and share honest, detailed feedback. Are you comfortable doing that?',
      type: 'select',
      options: ['Yes, very comfortable', 'Somewhat comfortable', 'Not very comfortable'],
      required: true,
    },
    {
      id: 'privacy-ack',
      label:
        'I understand this is an early beta, features may be incomplete or unstable, and I will keep any private beta content/screens confidential.',
      type: 'checkbox',
      required: true,
    },
  ],
}

export const STUDYHIVE_TESTER_BETA: BetaAppConfig = {
  id: 'studyhive-tester',
  appName: 'StudyHive (General Tester)',
  questions: [
    {
      id: 'age-confirm',
      label: 'I confirm that I am 18 years of age or older.',
      type: 'checkbox',
      required: true,
    },
    {
      id: 'device',
      label: 'What device will you primarily test on?',
      type: 'select',
      options: ['iPhone (iOS)', 'Android phone', 'iPad / tablet', 'Desktop browser'],
      required: true,
    },
    {
      id: 'tech-comfort',
      label: 'How comfortable are you finding and describing bugs in an early-stage app?',
      type: 'select',
      options: ['Very comfortable', 'Somewhat comfortable', 'Not very comfortable'],
      required: true,
    },
    {
      id: 'usage-intent',
      label:
        'StudyHive is built for high school students, but we need general testers first to stress-test it before students get involved. What draws you to helping test it?',
      type: 'textarea',
      required: true,
    },
    {
      id: 'similar-apps',
      label: 'Have you beta tested apps before? If so, which kinds?',
      type: 'text',
      required: false,
    },
    {
      id: 'availability',
      label: 'How much time per week can you realistically spend testing and giving feedback?',
      type: 'select',
      options: ['Less than 1 hour', '1–3 hours', '3–5 hours', '5+ hours'],
      required: true,
    },
    {
      id: 'feedback-detail',
      label: 'When you find a bug, are you willing to write it up with steps to reproduce it?',
      type: 'select',
      options: ['Yes, always', 'Usually', 'Only for bigger issues'],
      required: true,
    },
    {
      id: 'feedback-style',
      label:
        'Beta testers need to report bugs and share honest opinions, including negative ones. Are you comfortable doing that?',
      type: 'select',
      options: ['Yes, very comfortable', 'Somewhat comfortable', 'Not very comfortable'],
      required: true,
    },
    {
      id: 'privacy-ack',
      label:
        'I understand this is an early beta, features may be incomplete or unstable, and I will keep any private beta content/screens confidential — including that this app is designed for a student audience even though I am testing it as an adult.',
      type: 'checkbox',
      required: true,
    },
    {
      id: 'anything-else',
      label: 'Anything else you want us to know before we review your application?',
      type: 'textarea',
      required: false,
    },
  ],
}

export const CORTEX_BETA: BetaAppConfig = {
  id: 'xmemoirs',
  appName: 'xMemoirs',
  questions: [
    {
      id: 'age-confirm',
      label: 'I confirm that I am 18 years of age or older.',
      type: 'checkbox',
      required: true,
    },
    {
      id: 'device',
      label: 'What device will you primarily test on?',
      type: 'select',
      options: ['iPhone (iOS)', 'Android phone', 'iPad / tablet', 'Desktop browser'],
      required: true,
    },
    {
      id: 'note-taking-habit',
      label: 'Do you currently keep notes, a journal, or a "second brain" of any kind?',
      type: 'select',
      options: ['Yes, regularly', 'Occasionally', 'Not currently, but I want to', 'No'],
      required: true,
    },
    {
      id: 'current-tools',
      label:
        'What app or method do you currently use for notes, journaling, or personal writing, if any?',
      type: 'text',
      required: false,
    },
    {
      id: 'usage-intent',
      label: 'What draws you to xMemoirs specifically? What would you want to use it for?',
      type: 'textarea',
      required: true,
    },
    {
      id: 'usage-frequency',
      label: "How often do you think you'd realistically open an app like this?",
      type: 'select',
      options: ['Daily', 'A few times a week', 'Occasionally', 'Not sure yet'],
      required: true,
    },
    {
      id: 'feature-interest',
      label: 'Which of these matters most to you in a tool like xMemoirs?',
      type: 'select',
      options: [
        'Privacy / security of my notes',
        'Structure and prompts to help me think',
        'Looking back on past entries over time',
        'Simplicity — just a clean place to capture ideas',
      ],
      required: true,
    },
    {
      id: 'availability',
      label: 'How much time per week can you realistically spend testing and giving feedback?',
      type: 'select',
      options: ['Less than 1 hour', '1–3 hours', '3–5 hours', '5+ hours'],
      required: true,
    },
    {
      id: 'feedback-style',
      label:
        'Beta testers need to report bugs and share honest opinions, including negative ones. Are you comfortable doing that?',
      type: 'select',
      options: ['Yes, very comfortable', 'Somewhat comfortable', 'Not very comfortable'],
      required: true,
    },
    {
      id: 'privacy-ack',
      label:
        'I understand this is an early beta, features may be incomplete or unstable, and I will keep any private beta content/screens confidential.',
      type: 'checkbox',
      required: true,
    },
  ],
}

export const VOICE_STUDIO_X_BETA: BetaAppConfig = {
  id: 'voice-studio-x',
  appName: 'Voice Studio X',
  questions: [
    {
      id: 'device',
      label: 'What device will you primarily test on?',
      type: 'select',
      options: ['iPhone (iOS)', 'Android phone', 'iPad / tablet', 'Desktop browser'],
      required: true,
    },
    {
      id: 'voice-tools-experience',
      label: 'Have you used AI voice tools before? If so, which ones?',
      type: 'text',
      required: false,
    },
    {
      id: 'feature-interest',
      label: 'What are you most interested in testing?',
      type: 'select',
      options: ['Text to speech', 'Voice changing', 'Voice cloning', 'Singing voices', 'A mix of everything'],
      required: true,
    },
    {
      id: 'clone-intent',
      label: 'Would you be willing to test cloning your own voice with clean sample audio?',
      type: 'select',
      options: ['Yes', 'Maybe', 'No — I would rather test existing voices'],
      required: true,
    },
    {
      id: 'usage-intent',
      label: 'What would you realistically use Voice Studio X for?',
      type: 'textarea',
      required: true,
    },
    {
      id: 'availability',
      label: 'How much time per week can you realistically spend testing and giving feedback?',
      type: 'select',
      options: ['Less than 1 hour', '1–3 hours', '3–5 hours', '5+ hours'],
      required: true,
    },
    {
      id: 'feedback-style',
      label: 'Are you comfortable reporting bugs and giving direct feedback, including when something is confusing or does not work?',
      type: 'select',
      options: ['Yes, very comfortable', 'Somewhat comfortable', 'Not very comfortable'],
      required: true,
    },
    {
      id: 'privacy-ack',
      label: 'I understand this is an early beta, features may be incomplete or unstable, and I will keep private beta content/screens confidential.',
      type: 'checkbox',
      required: true,
    },
  ],
}
