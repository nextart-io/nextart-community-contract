import { Caveat, Permanent_Marker, Ma_Shan_Zheng, Noto_Sans_JP } from 'next/font/google';

// 英文手写字体
export const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
});

export const permanent_marker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-permanent-marker',
});

// 中文手写字体
export const ma_shan_zheng = Ma_Shan_Zheng({
  weight: '400',
  // Ma_Shan_Zheng 不需要指定 subsets
  display: 'swap',
  variable: '--font-ma-shan-zheng',
  preload: false, // 添加这个选项来避免预加载问题
});

// 日文字体
export const noto_sans_jp = Noto_Sans_JP({
  // Noto_Sans_JP 有自己的 subset 配置
  weight: ['400', '700'],
  preload: false, // 添加这个选项来避免预加载问题
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

// 导出所有字体变量
export const fontVariables = `${caveat.variable} ${permanent_marker.variable} ${ma_shan_zheng.variable} ${noto_sans_jp.variable}`;