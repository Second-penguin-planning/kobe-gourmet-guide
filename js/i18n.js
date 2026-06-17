/**
 * i18n.js — シンプル言語切り替え
 * 対応言語: en（英語）/ ja（日本語）/ zh（繁体字）
 *
 * HTML側の使い方:
 *   <span data-i18n="nav.map"></span>
 *   <button data-i18n="cta.directions"></button>
 *
 * 切り替え:
 *   I18N.set('en')  // または 'ja' / 'zh'
 */

const I18N = (() => {
  // ============================================================
  // 翻訳辞書
  // ============================================================
  const DICT = {
    en: {
      // ナビゲーション
      'nav.top':        'Top',
      'nav.map':        'Map',
      'nav.admin':      'Admin',
      // ヒーローエリア
      'hero.tag':       '🗺️ Kobe Restaurant Guide for Hotel Guests',
      'hero.search':    'Search by name or dish...',
      'hero.all':       'All Genres',
      'hero.sort':      'Sort Order',
      // レストランカード
      'card.directions': '📍 Get Directions',
      'card.detail':     'View Details',
      'card.walk':       'min walk',
      'card.coupon':     '🎁 HOTEL GUEST EXCLUSIVE',
      'card.coupon_sub': 'Show this screen at the restaurant',
      'card.checkin':    '📍 I\'ve Arrived — Check In',
      // セクション
      'section.all':    'All Restaurants',
      'section.empty':  'No restaurants found.',
      // 詳細ページ
      'detail.hours':   'Hours',
      'detail.closed':  'Closed',
      'detail.genre':   'Genre',
      'detail.address': 'Address',
      'detail.phone':   'Phone',
      'detail.budget':  'Budget',
      'detail.recommend': 'Recommended',
      // フッター
      'footer.copy':    '© 2025 Kobe Gourmet Guide / Second Penguin Planning.',
    },

    ja: {
      'nav.top':        'トップ',
      'nav.map':        '地図',
      'nav.admin':      '管理',
      'hero.tag':       '🗺️ ホテル宿泊者向け 神戸グルメガイド',
      'hero.search':    '店舗名・料理名で検索...',
      'hero.all':       'ジャンル（すべて）',
      'hero.sort':      '表示順',
      'card.directions': '📍 経路案内',
      'card.detail':     '詳細を見る',
      'card.walk':       '分',
      'card.coupon':     '🎁 ホテル宿泊者限定特典',
      'card.coupon_sub': 'この画面を店舗でご提示ください',
      'card.checkin':    '📍 到着しました — チェックイン',
      'section.all':    '掲載レストラン一覧',
      'section.empty':  '該当する店舗がありません',
      'detail.hours':   '営業時間',
      'detail.closed':  '定休日',
      'detail.genre':   'ジャンル',
      'detail.address': '住所',
      'detail.phone':   '電話番号',
      'detail.budget':  '予算',
      'detail.recommend': 'おすすめ',
      'footer.copy':    '© 2025 神戸 Gourmet Guide / Second Penguin Planning.',
    },

    zh: {
      'nav.top':        '首頁',
      'nav.map':        '地圖',
      'nav.admin':      '管理',
      'hero.tag':       '🗺️ 神戶飯店住客餐廳指南',
      'hero.search':    '搜尋餐廳或料理名稱...',
      'hero.all':       '全部類型',
      'hero.sort':      '排序',
      'card.directions': '📍 導航前往',
      'card.detail':     '查看詳情',
      'card.walk':       '分鐘步行',
      'card.coupon':     '🎁 飯店住客專屬優惠',
      'card.coupon_sub': '請在餐廳出示此畫面',
      'card.checkin':    '📍 已到達 — 打卡',
      'section.all':    '所有餐廳',
      'section.empty':  '找不到相關餐廳',
      'detail.hours':   '營業時間',
      'detail.closed':  '公休日',
      'detail.genre':   '類型',
      'detail.address': '地址',
      'detail.phone':   '電話',
      'detail.budget':  '預算',
      'detail.recommend': '推薦料理',
      'footer.copy':    '© 2025 神戶美食指南 / Second Penguin Planning.',
    },
  };

  const STORAGE_KEY = 'kgg_lang';
  const SUPPORTED   = ['en', 'ja', 'zh'];

  // ブラウザ言語から初期言語を決定（デフォルト: en）
  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    if (browser === 'ja') return 'ja';
    if (browser === 'zh') return 'zh';
    return 'en'; // 外国人ゲスト想定なのでデフォルトは英語
  }

  let current = detectLang();

  // ============================================================
  // t(key) — 翻訳文字列を取得
  // ============================================================
  function t(key) {
    return (DICT[current] && DICT[current][key]) ||
           (DICT['en'] && DICT['en'][key]) ||
           key;
  }

  // ============================================================
  // apply() — data-i18n 属性を持つ要素を一括更新
  // ============================================================
  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.textContent = val;
      }
    });

    // <html lang=""> を更新
    document.documentElement.lang =
      current === 'zh' ? 'zh-TW' : current;

    // 言語切り替えボタンのアクティブ状態を更新
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.langBtn === current);
    });
  }

  // ============================================================
  // set(lang) — 言語を切り替えて画面を更新
  // ============================================================
  function set(lang) {
    if (!SUPPORTED.includes(lang)) return;
    current = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    apply();
    // カスタムイベントで他のスクリプトにも通知
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function get() { return current; }

  // DOMContentLoaded 後に自動適用
  document.addEventListener('DOMContentLoaded', apply);

  return { t, set, get, apply, DICT };
})();
