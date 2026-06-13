// ============================================================
// 設定ファイル（GitHubに公開される）
// APIキーは config.local.js に記入してください
// ============================================================

const CONFIG = {
  // Airtable設定（APIキーは config.local.js に記入）
  airtable: {
    apiKey: typeof LOCAL_CONFIG !== 'undefined' ? LOCAL_CONFIG.airtableApiKey : 'patRqo6ahd9qfqPha.a0ab4bea35e693884af91cc3a941a3b6d8d7369ff5d8fa60ce796d205503a49d',
    baseId: typeof LOCAL_CONFIG !== 'undefined' ? LOCAL_CONFIG.airtableBaseId : 'appdKBTAfn2IQlwam',
    tableName: 'Restaurants',
  },

  // Google Maps設定（ドメイン制限済みのため直接記載）
  googleMaps: {
    apiKey: typeof LOCAL_CONFIG !== 'undefined' ? LOCAL_CONFIG.googleMapsApiKey : 'AIzaSyCrl1LHSLKKpPgFh2UHs_L-ywrqersB4bI',
  },

  // サイト設定
  site: {
    title: '神戸 Gourmet Guide',
    url: 'https://second-penguin-planning.github.io/kobe-gourmet-guide',
    accentColor: '#C41E3A',
    goldColor: '#B8860B',
  },
};
