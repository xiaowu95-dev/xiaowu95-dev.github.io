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
    documentTitle: 'Studio Wu · 应用',
    nav: {
      appsTag: '应用',
      work: '作品',
      about: '关于我',
      langZh: '中文',
      langEn: 'English',
      langAria: '界面语言',
    },
    home: {
      portfolioLabel: '作品集',
      heroTitle: '为扎实的日语学习而做的应用。',
      heroBody:
        '这是我设计与发布的一组安静工具。复杂度低，尊重你的时间，以工艺感取代噪音。',
      aboutTitle: '关于我',
      aboutBody:
        '我希望学习产品像书架上装帧考究的版本：字体自信、留白慷慨、没有噪音。你可以把这里换成简介、荣誉或联系方式。',
      cardView: '查看',
      cardOpenDetail: '查看详情',
      cardStayTuned: '敬请期待',
    },
    apps: {
      jlpt: {
        title: 'JLPT：日语进阶',
        subtitle: '遗忘曲线、真题模考，以及沉稳的学习节奏。',
        badge: '旗舰',
      },
      kanji: {
        title: '汉字笔顺实验室',
        subtitle: '带压感笔触的手写训练。',
        badge: '实验中',
      },
      listening: {
        title: '听力客厅',
        subtitle: '面向 N3–N1 的精选音频路径。',
        badge: '即将推出',
      },
    },
    jlpt: {
      pageTitle: '優光 Yukō · JLPT',
      back: '← 全部应用',
      rangeTag: 'JLPT / N5–N1',
      heroName: '優光',
      heroNameRuby: 'Yukō',
      heroLead:
        '优雅掌握 JLPT。一节接一节的专注练习，背后是可信赖的结构。',
      featuresHeading: '四个克制的承诺',
      featuresSub:
        '每一块基石都诚实：记忆科学、考场还原、氛围与时间的尊重。',
      featureForgetTitle: '智能遗忘曲线',
      featureForgetBody: '按真实记忆衰减安排各级复习节奏，贴合 JLPT 分级。',
      featureExamTitle: '历年真题，当下专注',
      featureExamBody: '完整考试外壳与计时，让考场在试炼日前就熟悉起来。',
      featureUiTitle: '黑金沉浸',
      featureUiBody: '暗淡平静的界面，深夜学习时也不刺眼。',
      featureTimeTitle: '节奏感知的学时',
      featureTimeBody: '短冲刺或长跑，计时器只在需要时出现。',
    },
    footer: {
      note: '为专注的日语学习而打造。',
      emailLabel: '邮件',
    },
    phone: {
      jlptLabel: 'JLPT',
      placeholder: '截图占位',
      hint: '请替换为 App Store 预览或应用内截图。',
    },
  },
  en: {
    documentTitle: 'Studio Wu · Apps',
    nav: {
      appsTag: 'Apps',
      work: 'Work',
      about: 'About',
      langZh: '中文',
      langEn: 'English',
      langAria: 'Interface language',
    },
    home: {
      portfolioLabel: 'Portfolio',
      heroTitle: 'Apps built for deliberate Japanese study.',
      heroBody:
        'A quiet grid of tools I design and ship. Each keeps complexity low, respects your time, and leans into craft over noise.',
      aboutTitle: 'About',
      aboutBody:
        'I build study products that feel like a good edition on a shelf: confident typography, generous space, and no clutter. Replace this copy with your bio, awards, or contact preferences.',
      cardView: 'View',
      cardOpenDetail: 'Open detail',
      cardStayTuned: 'Stay tuned',
    },
    apps: {
      jlpt: {
        title: 'JLPT: Japanese Mastery',
        subtitle: 'SRS, exams, and a calm study rhythm.',
        badge: 'Flagship',
      },
      kanji: {
        title: 'Kanji Trace Lab',
        subtitle: 'Handwriting drills with pressure-aware strokes.',
        badge: 'In lab',
      },
      listening: {
        title: 'Listening Lounge',
        subtitle: 'Curated audio paths for N3–N1.',
        badge: 'Soon',
      },
    },
    jlpt: {
      pageTitle: 'Yukō 優光 · JLPT',
      back: '← All apps',
      rangeTag: 'JLPT / N5–N1',
      heroName: 'Yukō',
      heroNameRuby: '優光',
      heroLead:
        'Master JLPT with elegance. One composed session after another, backed by structure you can trust.',
      featuresHeading: 'Built around four quiet promises',
      featuresSub:
        'Each pillar keeps the product honest: memory science, exam fidelity, atmosphere, and time kept sacred.',
      featureForgetTitle: 'Intelligent forgetting curve',
      featureForgetBody:
        'Scheduling that respects how your memory actually ages across JLPT levels.',
      featureExamTitle: 'Past papers, present focus',
      featureExamBody:
        'Full-length exam shells with timing, so the room feels familiar before test day.',
      featureUiTitle: 'Black-gold immersion',
      featureUiBody: 'A dim, calm interface that keeps evenings soft when you study late.',
      featureTimeTitle: 'Rhythm-aware sessions',
      featureTimeBody:
        'Short bursts or deep runs; timers stay out of the way until you need them.',
    },
    footer: {
      note: 'Crafted for focused Japanese study.',
      emailLabel: 'Email',
    },
    phone: {
      jlptLabel: 'JLPT',
      placeholder: 'Screenshot placeholder',
      hint: 'Replace with your App Store preview or in-app capture.',
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
