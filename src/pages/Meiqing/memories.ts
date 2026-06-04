/* ============================================================
   memories.ts — All real-memory data for the interactive love letter.
   
   Fill in your own memories here. This is the heart of the experience.
   Every field has example data you can replace with your real story.
   ============================================================ */

export interface ChatMessage {
  /** 'me' = the sender (表白者), 'you' = the recipient */
  from: 'me' | 'you'
  text: string
  time: string
  /** Optional: is this a special "first" moment? */
  milestone?: string
}

export interface PhotoMemory {
  /** URL or local path — put photos in /public/meiqing/photos/ */
  src: string
  /** Alt text / caption */
  caption: string
  /** When was this taken? */
  date: string
  /** Where was this taken? */
  location?: string
}

export interface TimelineEvent {
  date: string
  title: string
  description: string
  /** Icon type for the timeline dot */
  icon: 'heart' | 'chat' | 'food' | 'walk' | 'gift' | 'photo' | 'music' | 'star'
  /** Optional photo */
  photo?: string
}

export interface Location {
  name: string
  /** Latitude for map rendering */
  lat: number
  /** Longitude for map rendering */
  lng: number
  /** What happened here */
  memory: string
  date: string
}

// ─── Chat records: the first conversations ────────────────

export const firstChats: ChatMessage[] = [
  { from: 'me', text: '哈喽，我叫王仔', time: '22:17', milestone: '故事开始' },
  { from: 'you', text: '你好 我叫贺美箐', time: '22:18' },
  { from: 'you', text: '你是什么星座的呀', time: '22:19' },
  { from: 'me', text: '金牛', time: '22:20' },
  { from: 'you', text: '我是白羊的', time: '22:20' },
  { from: 'me', text: '系统它不认识你这个箐字儿', time: '22:21' },
  { from: 'you', text: 'qing 四声', time: '22:22' },
  { from: 'me', text: '哈哈哈哈没事儿我认识', time: '22:22' },
  { from: 'me', text: '那你比我大', time: '22:23' },
]

export const goodMorningChats: ChatMessage[] = [
  { from: 'me', text: '早', time: '07:45', milestone: '第一个早安' },
  { from: 'you', text: '早安！今天天气好好', time: '07:46' },
  { from: 'me', text: '记得吃早饭', time: '07:47' },
  { from: 'you', text: '你也是！', time: '07:47' },
]

export const lateNightChats: ChatMessage[] = [
  { from: 'you', text: '睡了吗', time: '23:42' },
  { from: 'me', text: '还没 在想事情', time: '23:43' },
  { from: 'you', text: '想什么', time: '23:43' },
  { from: 'me', text: '想一些让人开心的事', time: '23:44' },
  { from: 'you', text: '比如说', time: '23:44' },
  { from: 'me', text: '比如说你在跟我聊天', time: '23:45' },
  { from: 'you', text: '…', time: '23:45' },
  { from: 'you', text: '我也是', time: '23:46' },
]

// ─── Photo memories ────────────────────────────────────────

export const photos: PhotoMemory[] = [
  {
    src: '/meiqing/photos/placeholder-1.jpg',
    caption: '那天第一次一起走的那条路',
    date: '2024年春',
    location: '学校南门',
  },
  {
    src: '/meiqing/photos/placeholder-2.jpg',
    caption: '你笑起来的样子',
    date: '2024年夏',
    location: '咖啡馆',
  },
  {
    src: '/meiqing/photos/placeholder-3.jpg',
    caption: '第一次一起看日落',
    date: '2024年秋',
    location: '江边',
  },
  {
    src: '/meiqing/photos/placeholder-4.jpg',
    caption: '下雪天你给我拍的照片',
    date: '2024年冬',
    location: '公园',
  },
  {
    src: '/meiqing/photos/placeholder-5.jpg',
    caption: '你生日那天',
    date: '2025年春',
    location: '餐厅',
  },
]

// ─── Rich timeline ─────────────────────────────────────────

export const timeline: TimelineEvent[] = [
  {
    date: '2026.05.16',
    title: '第一次聊天',
    description: '刷到你的帖子，鬼使神差点进去，手指悬了好久才发出第一条消息。',
    icon: 'chat',
  },
  {
    date: '2026.05.17',
    title: '加微信',
    description: '隔了一天，好友申请亮起来，我秒通过。',
    icon: 'chat',
  },
  {
    date: '2026.05.19',
    title: '第一次视频',
    description: '暖黄色灯光下，你素颜靠在床边，头发有点乱，但还是很好看。',
    icon: 'photo',
  },
  {
    date: '2026.05.23',
    title: '第一次单独吃饭',
    description: '火锅热气慢慢升起来，你低头调蘸料的时候，我突然有点紧张。',
    icon: 'food',
  },
  {
    date: '2026.05.30',
    title: '一起看电影',
    description: '电影院很黑，但我还是忍不住偷偷看你。',
    icon: 'star',
  },
  {
    date: '2026.05.31',
    title: '聊到凌晨',
    description: '到了该说晚安的时候，谁都没有先打那个字。',
    icon: 'chat',
  },
]

// ─── Locations where memories were made ────────────────────

export const locations: Location[] = [
  {
    name: '星海广场',
    lat: 38.87,
    lng: 121.60,
    memory: '黄昏的风吹过来，第一次并肩走，距离刚好一拳。',
    date: '2026.05',
  },
  {
    name: '海底捞',
    lat: 38.92,
    lng: 121.60,
    memory: '火锅热气慢慢升起来，你低头调蘸料的时候，我突然有点紧张。',
    date: '2026.05.23',
  },
  {
    name: '雕塑公园',
    lat: 38.88,
    lng: 121.58,
    memory: '海边坐着聊了好久，你弯腰帮我换眼镜垫片，手很稳。',
    date: '2026.05',
  },
  {
    name: '游乐场',
    lat: 38.90,
    lng: 121.62,
    memory: '第一次玩"颠大米"，手碰到的那一下，心跳漏了半拍。',
    date: '2026.05',
  },
  {
    name: '电影院',
    lat: 38.91,
    lng: 121.59,
    memory: '银幕的光映在你脸上，我分不清看的是电影还是你。',
    date: '2026.05.30',
  },
  {
    name: '黑石礁公园',
    lat: 38.86,
    lng: 121.57,
    memory: '并肩走着，说了很多，也什么都没说。',
    date: '2026.05',
  },
  {
    name: '攀岩馆',
    lat: 38.89,
    lng: 121.61,
    memory: '你在下面举着手机录像喊加油，我腿其实在抖。',
    date: '2026.05',
  },
]

// ─── Names (for signatures) ────────────────────────────────

export const names = {
  from: '王仔',
  to: '美箐',
}
