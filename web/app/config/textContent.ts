import { caveat, permanent_marker, ma_shan_zheng, noto_sans_jp } from '../config/fonts';

export interface TextStyle {
  fontSize: string;
  fontWeight?: string;
  fontFamily: string;
}

export interface TextItem {
  text: string;
  style: TextStyle;
  language: 'zh' | 'en' | 'jp';
  priority: number;
}

export const textContent: TextItem[] = [
  {
    text: "我们需要一个UI/UX设计师!",
    style: {
      fontSize: '32px',
      fontWeight: 'bold',
      fontFamily: ma_shan_zheng.style.fontFamily,
    },
    language: 'zh',
    priority: 1,
  },
  {
    text: "寻找优秀的设计师加入我们",
    style: {
      fontSize: '28px',
      fontWeight: 'bold',
      fontFamily: ma_shan_zheng.style.fontFamily,
    },
    language: 'zh',
    priority: 2,
  },
  {
    text: "Design the future",
    style: {
      fontSize: '26px',
      fontFamily: caveat.style.fontFamily,
    },
    language: 'en',
    priority: 3,
  },
  {
    text: "Join our design team",
    style: {
      fontSize: '24px',
      fontFamily: permanent_marker.style.fontFamily,
    },
    language: 'en',
    priority: 4,
  },
  {
    text: "私たちはUI/UXデザイナーが必要です",
    style: {
      fontSize: '24px',
      fontFamily: noto_sans_jp.style.fontFamily,
    },
    language: 'jp',
    priority: 5,
  },
  {
    text: "创新设计",
    style: {
      fontSize: '30px',
      fontWeight: 'bold',
      fontFamily: ma_shan_zheng.style.fontFamily,
    },
    language: 'zh',
    priority: 2,
  },
  {
    text: "用户体验至上",
    style: {
      fontSize: '28px',
      fontWeight: 'bold',
      fontFamily: ma_shan_zheng.style.fontFamily,
    },
    language: 'zh',
    priority: 3,
  },
  {
    text: "UI/UX Designer Wanted!",
    style: {
      fontSize: '32px',
      fontFamily: permanent_marker.style.fontFamily,
    },
    language: 'en',
    priority: 2,
  },
  {
    text: "デザインで未来を創る",
    style: {
      fontSize: '26px',
      fontFamily: noto_sans_jp.style.fontFamily,
    },
    language: 'jp',
    priority: 3,
  },
  {
    text: "Join Our Creative Team",
    style: {
      fontSize: '28px',
      fontFamily: caveat.style.fontFamily,
    },
    language: 'en',
    priority: 2,
  },
  {
    text: "激发创意灵感",
    style: {
      fontSize: '30px',
      fontWeight: 'bold',
      fontFamily: ma_shan_zheng.style.fontFamily,
    },
    language: 'zh',
    priority: 3,
  },
  {
    text: "デザイナー募集中",
    style: {
      fontSize: '28px',
      fontFamily: noto_sans_jp.style.fontFamily,
    },
    language: 'jp',
    priority: 4,
  },
  {
    text: "Shape the Future",
    style: {
      fontSize: '26px',
      fontFamily: permanent_marker.style.fontFamily,
    },
    language: 'en',
    priority: 3,
  },
  {
    text: "打造极致体验",
    style: {
      fontSize: '32px',
      fontWeight: 'bold',
      fontFamily: ma_shan_zheng.style.fontFamily,
    },
    language: 'zh',
    priority: 2,
  },
  {
    text: "クリエイティブを探求",
    style: {
      fontSize: '24px',
      fontFamily: noto_sans_jp.style.fontFamily,
    },
    language: 'jp',
    priority: 4,
  },
  {
    text: "Be Creative",
    style: {
      fontSize: '30px',
      fontFamily: caveat.style.fontFamily,
    },
    language: 'en',
    priority: 3,
  },
  {
    text: "设计改变世界",
    style: {
      fontSize: '28px',
      fontWeight: 'bold',
      fontFamily: ma_shan_zheng.style.fontFamily,
    },
    language: 'zh',
    priority: 3,
  }
];

export const getTextsByScreenSize = (width: number, height: number): TextItem[] => {
  const baseCount = Math.floor((width * height) / (300 * 300));
  const count = Math.min(Math.max(baseCount, 5), textContent.length);
  
  return [...textContent]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, count);
};