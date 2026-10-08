/** UI chrome strings (zh-TW is the source language; see the app's i18n plan). */
export const t = {
  siteName: 'KK Trip 旅誌',
  siteTagline: '旅行靈感、目的地指南與 KK Trip 的最新消息。',
  home: '首頁',
  allPosts: '所有文章',
  news: '新聞',
  latest: '最新文章',
  topics: '主題',
  readMin: (n: number) => `${n} 分鐘閱讀`,
  by: (name: string) => `By ${name}`,
  backToAll: '返回所有文章',
  postsTagged: (tag: string) => `主題：${tag}`,
  noPosts: '還沒有發佈的文章，敬請期待。',
  loadError: '暫時無法載入文章，請稍後再試。',
  notFound: '找不到這個頁面',
  notFoundBody: '這篇文章可能已被移除，或網址有誤。',
  openApp: '開啟 KK Trip',
  navHow: '使用方式',
  navFeatures: '功能',
  navMarketplace: '行程市集',
  navProduct: '產品',
  navResources: '資源',
  navSupport: '支援',
  navPrivacy: '隱私權政策',
  navTerms: '使用條款',
  external: '（外部連結）',
  login: '登入',
  start: '免費開始',
  downloadApp: '下載 KK Trip',
  downloadAppTitle: '用 KK Trip 規劃你的下一趟旅行',
  downloadAppBody: 'AI 幫你排行程、整理預訂，與旅伴一起規劃。',
  rss: '訂閱 RSS',
  readFull: '閱讀全文',
  allTopics: '全部',
  toc: '本文目錄',
  related: '延伸閱讀',
  copyLink: '複製連結',
  shareThis: '分享這篇文章',
  publishedOn: (date: string) => `發佈於 ${date}`,
  inTopic: '分類',
  copied: '已複製',
  footerBlurb: '旅行靈感、目的地指南與產品消息。',
  explore: '探索',
  topicsHeading: '主題',
  byline: '文章',
}


const translations = {
  en: { siteName: 'KK Trip Journal', siteTagline: 'Travel inspiration, destination guides and the latest from KK Trip.', home: 'Home', allPosts: 'All articles', news: 'News', latest: 'Latest articles', topics: 'Topics', readMin: (n: number) => `${n} min read`, backToAll: 'Back to all articles', postsTagged: (tag: string) => `Topic: ${tag}`, noPosts: 'No articles in this language yet. Stay tuned.', loadError: 'Unable to load articles. Please try again.', notFound: 'Page not found', notFoundBody: 'This page may have moved or no longer exists.', openApp: 'Open KK Trip', navHow: 'How it works', navFeatures: 'Features', navMarketplace: 'Trip marketplace', navProduct: 'Product', navResources: 'Resources', navSupport: 'Support', navPrivacy: 'Privacy', navTerms: 'Terms', external: '(external link)', login: 'Log in', start: 'Start free', downloadApp: 'Download KK Trip', downloadAppTitle: 'Plan your next trip with KK Trip', downloadAppBody: 'Plan with AI, organize bookings and travel together.', rss: 'RSS feed', readFull: 'Read article', allTopics: 'All', toc: 'On this page', related: 'Related articles', copyLink: 'Copy link', shareThis: 'Share this article', publishedOn: (date: string) => `Published ${date}`, inTopic: 'Category', copied: 'Copied', footerBlurb: 'Travel inspiration, destination guides and product news.', explore: 'Explore', topicsHeading: 'Topics', byline: 'Articles' },
  ja: { siteName: 'KK Trip 旅ノート', siteTagline: '旅のアイデア、目的地ガイド、KK Trip の最新情報。', home: 'ホーム', allPosts: 'すべての記事', news: 'ニュース', latest: '最新記事', topics: 'トピック', readMin: (n: number) => `${n}分で読めます`, backToAll: '記事一覧へ', postsTagged: (tag: string) => `トピック：${tag}`, noPosts: 'この言語の記事はまだありません。', loadError: '記事を読み込めません。もう一度お試しください。', notFound: 'ページが見つかりません', notFoundBody: 'ページが移動または削除された可能性があります。', openApp: 'KK Trip を開く', navHow: '使い方', navFeatures: '機能', navMarketplace: '旅程マーケット', navProduct: '製品', navResources: 'リソース', navSupport: 'サポート', navPrivacy: 'プライバシー', navTerms: '利用規約', external: '（外部リンク）', login: 'ログイン', start: '無料で始める', downloadApp: 'KK Trip をダウンロード', downloadAppTitle: 'KK Trip で次の旅を計画', downloadAppBody: 'AI で旅程を作り、予約を整理して、仲間と旅行。', rss: 'RSS を購読', readFull: '記事を読む', allTopics: 'すべて', toc: '目次', related: '関連記事', copyLink: 'リンクをコピー', shareThis: 'この記事を共有', publishedOn: (date: string) => `${date} 公開`, inTopic: 'カテゴリ', copied: 'コピーしました', footerBlurb: '旅のアイデア、目的地ガイド、製品ニュース。', explore: '探す', topicsHeading: 'トピック', byline: '記事' },
  ko: { siteName: 'KK Trip 여행 노트', siteTagline: '여행 아이디어, 여행지 가이드와 KK Trip 소식.', home: '홈', allPosts: '모든 글', news: '소식', latest: '최신 글', topics: '주제', readMin: (n: number) => `${n}분 읽기`, backToAll: '모든 글로 돌아가기', postsTagged: (tag: string) => `주제: ${tag}`, noPosts: '이 언어로 작성된 글이 아직 없어요.', loadError: '글을 불러오지 못했어요. 다시 시도해 주세요.', notFound: '페이지를 찾을 수 없어요', notFoundBody: '페이지가 이동되었거나 삭제되었을 수 있어요.', openApp: 'KK Trip 열기', navHow: '사용 방법', navFeatures: '기능', navMarketplace: '여행 마켓', navProduct: '제품', navResources: '자료', navSupport: '지원', navPrivacy: '개인정보 처리방침', navTerms: '이용약관', external: '(외부 링크)', login: '로그인', start: '무료로 시작', downloadApp: 'KK Trip 다운로드', downloadAppTitle: 'KK Trip으로 다음 여행을 계획하세요', downloadAppBody: 'AI로 일정을 만들고 예약을 정리하며 함께 여행하세요.', rss: 'RSS 구독', readFull: '글 읽기', allTopics: '전체', toc: '목차', related: '관련 글', copyLink: '링크 복사', shareThis: '글 공유', publishedOn: (date: string) => `${date} 게시`, inTopic: '카테고리', copied: '복사됨', footerBlurb: '여행 아이디어, 여행지 가이드와 제품 소식.', explore: '둘러보기', topicsHeading: '주제', byline: '글' },
} satisfies Record<string, Partial<typeof t>>

export function getStrings(locale?: string): typeof t {
  return { ...t, ...(translations[locale as keyof typeof translations] ?? {}) }
}
