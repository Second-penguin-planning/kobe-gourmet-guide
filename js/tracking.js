/**
 * tracking.js
 * ホテル別アクセス計測 + Google Maps リンク最適化 + チェックイン送客記録
 *
 * 使い方: 全HTMLの <head> または </body> 直前に
 *   <script src="js/tracking.js"></script>
 * を追加するだけ。
 */

// ============================================================
// 1. ホテル識別子を URL パラメータから取得・保存
//    例: /index.html?from=hotel-monterey
//    → 30分間 sessionStorage に保持し、全リンクに引き継ぐ
// ============================================================
const TRACKING = (() => {
  const STORAGE_KEY = 'kgg_hotel';
  const SESSION_KEY = 'kgg_hotel_ts';
  const TTL_MS = 30 * 60 * 1000; // 30分

  function init() {
    const params = new URLSearchParams(location.search);
    const fromParam = params.get('from');

    if (fromParam) {
      // URL に ?from= がついていたら保存（上書き）
      sessionStorage.setItem(STORAGE_KEY, fromParam);
      sessionStorage.setItem(SESSION_KEY, Date.now());
    }

    // TTL 切れチェック
    const ts = parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
    if (Date.now() - ts > TTL_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    }
  }

  function getHotel() {
    return sessionStorage.getItem(STORAGE_KEY) || 'unknown';
  }

  init();
  return { getHotel };
})();


// ============================================================
// 2. Google Maps ナビゲーション URL を生成
//    緯度・経度があれば座標で、なければ住所で検索
// ============================================================
function buildMapsUrl(restaurant) {
  const hotel = TRACKING.getHotel();
  let dest;

  if (restaurant.lat && restaurant.lng) {
    dest = `${restaurant.lat},${restaurant.lng}`;
  } else {
    dest = encodeURIComponent(restaurant.address || restaurant.name || '');
  }

  // Google Maps ナビ起動 URL（ウォーキング優先）
  const base = `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=walking`;

  // hotel パラメータを utm_content として付加（Googleアナリティクス計測可）
  return `${base}&utm_source=kgg&utm_medium=qr&utm_content=${encodeURIComponent(hotel)}`;
}


// ============================================================
// 3. デジタル・チェックイン
//    レストランに到着した旅行者がボタンを押す →
//    Google フォームに自動送信（または GA イベント）
// ============================================================

// ▼ Google フォームを使う場合はここに設定 ▼
const CHECKIN_FORM = {
  // Google フォームの「事前入力 URL」から取得したフィールド ID
  // 設定方法: Google Forms → 回答 → 事前入力リンク取得
  // 未設定の場合は GA イベントのみ送信
  formUrl: '',          // 例: 'https://docs.google.com/forms/d/e/xxxxx/formResponse'
  fieldHotel: '',       // 例: 'entry.123456789'
  fieldStore: '',       // 例: 'entry.987654321'
  fieldTimestamp: '',   // 例: 'entry.111111111'
};

/**
 * checkIn(storeName) — 「到着チェックイン」ボタン押下時に呼ぶ
 * @param {string} storeName  店舗名
 * @param {HTMLElement} btnEl ボタン要素（UI フィードバック用）
 */
function checkIn(storeName, btnEl) {
  const hotel = TRACKING.getHotel();
  const ts    = new Date().toISOString();

  // ---- A: Google Analytics 4 イベント送信 ----
  if (typeof gtag === 'function') {
    gtag('event', 'checkin', {
      event_category: 'engagement',
      event_label: storeName,
      hotel_source: hotel,
    });
  }

  // ---- B: Google Forms 送信（設定済みの場合のみ）----
  if (CHECKIN_FORM.formUrl && CHECKIN_FORM.fieldHotel) {
    const body = new URLSearchParams({
      [CHECKIN_FORM.fieldHotel]:     hotel,
      [CHECKIN_FORM.fieldStore]:     storeName,
      [CHECKIN_FORM.fieldTimestamp]: ts,
    });
    // no-cors で送信（レスポンス読み取り不可だが送信は成功する）
    fetch(CHECKIN_FORM.formUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    }).catch(() => {}); // エラーは握りつぶし（旅行者体験を壊さない）
  }

  // ---- C: UI フィードバック ----
  if (btnEl) {
    btnEl.textContent = '✅ Checked In!';
    btnEl.disabled = true;
    btnEl.style.background = '#2E7D32';
  }
}


// ============================================================
// 4. ページ内の全「経路案内」リンクにホテル情報を自動付加
//    data-maps-dest 属性がついた <a> を自動変換
//    <a href="#" data-maps-lat="34.69" data-maps-lng="135.19">経路案内</a>
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-maps-lat]').forEach(el => {
    const lat  = el.dataset.mapsLat;
    const lng  = el.dataset.mapsLng;
    const addr = el.dataset.mapsAddr || '';
    const name = el.dataset.mapsName || '';
    el.href = buildMapsUrl({ lat, lng, address: addr, name });
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });
});
