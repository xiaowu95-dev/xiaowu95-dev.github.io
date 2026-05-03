export type Locale = 'zh' | 'en'

export const DEFAULT_LOCALE: Locale = 'zh'

const STORAGE_KEY = 'xiaowu_locale'

export function readStoredLocale(): Locale | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'zh' || v === 'en') return v
  } catch {
    /* ignore */
  }
  return null
}

export function persistLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* ignore */
  }
}

export const messages = {
  zh: {
    documentTitle: 'Xiaowu Dev · 作品',
    nav: {
      brand: 'Xiaowu Dev',
      appsTag: '作品',
      work: '作品',
      about: '关于我',
      langZh: '中文',
      langEn: 'English',
      langAria: '界面语言',
    },
    home: {
      portfolioLabel: '作品集',
      heroTitle: 'Kogo（コゴ）',
      heroBody:
        '教材式学习、间隔复习与 JLPT 练习在同一路径里，适合每天稳步向前的人。',
      aboutTitle: '关于我',
      aboutBody:
        '我是一名程序员，工作之余写代码、做一点小产品。Kogo 是我在打磨的日语学习应用，欢迎试用和反馈。',
      cardView: '查看',
      cardOpenDetail: '了解 Kogo',
      cardStayTuned: '敬请期待',
    },
    apps: {
      kogo: {
        title: 'Kogo（コゴ）',
        subtitle: '学日语，一步一步向前：教材节奏、记忆复习、JLPT 练习与模考，在同一款应用里。',
        badge: '进行中',
      },
    },
    kogo: {
      pageTitle: 'Kogo（コゴ）· 日语学习',
      back: '← 返回首页',
      rangeTag: 'JLPT · 教材 · 复习',
      heroName: 'Kogo（コゴ）',
      sloganMain: 'Learn Japanese, step by step.',
      sloganSub: 'Your daily path to JLPT mastery.',
      sloganHint: '我们强调日积月累的节奏，而不是一夜速成的承诺。',
      featuresHeading: '为真实学习流程做的四件事',
      featuresSub:
        '功能来自我实际在写的应用：学习、练习、记忆、模考共用同一套内容与进度。',
      featureCourseTitle: '课程式学习',
      featureCourseBody:
        '按教材节奏推进，课时里嵌小题，学完即练。',
      featureReviewTitle: '记忆与复习',
      featureReviewBody:
        '间隔复习调度复习队列，把词汇和语法从短期练回长期，而不是堆到考前一晚。',
      featurePracticeTitle: '练习与模拟考',
      featurePracticeBody:
        'JLPT 向专项训练与整套模拟卷，计时与题量尽量贴近正式参考，减少临场陌生感。',
      featureRhythmTitle: '日常节奏',
      featureRhythmBody:
        '今日任务、连击与短时节奏练习，适合通勤和睡前的碎片时间，不把学习变成负担。',
      storeIosTitle: 'iOS 下载',
      storeIosVersion: '最新版本：{{v}}',
      storeAndroidTitle: 'Android 下载',
      storeAndroidVersion: '最新版本：{{v}}',
    },
    footer: {
      copyrightLine: '© Copyright 2026, All Rights Reserved by Xiaowu Dev',
    },
    phone: {
      appLabel: 'Kogo（コゴ）',
      placeholder: '截图占位',
      hint: '可替换为 App Store 预览或应用内截图。',
      carouselPrev: '上一张截图',
      carouselNext: '下一张截图',
    },
  },
  en: {
    documentTitle: 'Xiaowu Dev · Work',
    nav: {
      brand: 'Xiaowu Dev',
      appsTag: 'Work',
      work: 'Work',
      about: 'About',
      langZh: '中文',
      langEn: 'English',
      langAria: 'Interface language',
    },
    home: {
      portfolioLabel: 'Portfolio',
      heroTitle: 'Kogo（コゴ）',
      heroBody:
        'Textbook-style lessons, spaced review, and JLPT drills share one path for people who want steady daily progress. Below is the product and a short note about me.',
      aboutTitle: 'About',
      aboutBody:
        'I am a regular developer. I write code and side projects after work. Kogo is the Japanese study app I am building and polishing, feedback is welcome.',
      cardView: 'View',
      cardOpenDetail: 'About Kogo',
      cardStayTuned: 'Stay tuned',
    },
    apps: {
      kogo: {
        title: 'Kogo（コゴ）',
        subtitle:
          'Learn Japanese step by step: lessons, memory reviews, JLPT practice, and full mocks in one app.',
        badge: 'Active',
      },
    },
    kogo: {
      pageTitle: 'Kogo（コゴ）· Japanese study',
      back: '← Home',
      rangeTag: 'JLPT · Course · Review',
      heroName: 'Kogo（コゴ）',
      sloganMain: 'Learn Japanese, step by step.',
      sloganSub: 'Your daily path to JLPT mastery.',
      sloganHint: 'We emphasize steady, daily progress, not overnight promises.',
      featuresHeading: 'Four things built around real study loops',
      featuresSub:
        'These match the app I am building: learn, practice, review, and mock exams share one content layer.',
      featureCourseTitle: 'Structured lessons',
      featureCourseBody:
        'Progress by textbook-style units (current path: Shin Nihongo Beginner I, N5 goals), with micro-quizzes inside each lesson.',
      featureReviewTitle: 'Memory and review',
      featureReviewBody:
        'Spaced scheduling drives the review queue so vocabulary and grammar move toward long-term recall.',
      featurePracticeTitle: 'Drills and mock exams',
      featurePracticeBody:
        'JLPT-style section practice and full timed papers sized closer to official references, so the room feels familiar earlier.',
      featureRhythmTitle: 'Daily rhythm',
      featureRhythmBody:
        'Today tasks, streaks, and short rhythm sessions for commutes and bedtime fragments without turning study into guilt.',
      storeIosTitle: 'iOS download',
      storeIosVersion: 'Latest version: {{v}}',
      storeAndroidTitle: 'Android download',
      storeAndroidVersion: 'Latest version: {{v}}',
    },
    footer: {
      copyrightLine: '© Copyright 2026, All Rights Reserved by Xiaowu Dev',
    },
    phone: {
      appLabel: 'Kogo（コゴ）',
      placeholder: 'Screenshot placeholder',
      hint: 'Swap in an App Store preview or in-app capture.',
      carouselPrev: 'Previous screenshot',
      carouselNext: 'Next screenshot',
    },
  },
} as const satisfies Record<Locale, Record<string, unknown>>

export function getMessage(locale: Locale, path: string): string {
  const parts = path.split('.')
  let cur: unknown = messages[locale]
  for (const p of parts) {
    if (cur === null || typeof cur !== 'object' || !(p in cur)) return path
    cur = (cur as Record<string, unknown>)[p]
  }
  return typeof cur === 'string' ? cur : path
}
