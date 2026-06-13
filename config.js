// ============================================================
// 設定ファイル（GitHubに公開される）
// APIキーは config.local.js に記入してください
// ============================================================

const CONFIG = {
  // Airtable設定（APIキーは config.local.js に記入）
  airtable: {
    apiKey: typeof LOCAL_CONFIG !== 'undefined' ? LOCAL_CONFIG.airtableApiKey : '',
    baseId: typeof LOCAL_CONFIG !== 'undefined' ? LOCAL_CONFIG.airtableBaseId : '',
    tableName: 'Restaurants',
  },

  // Google Maps設定（APIキーは config.local.js に記入）
  googleMaps: {
    apiKey: typeof LOCAL_CONFIG !== 'undefined' ? LOCAL_CONFIG.googleMapsApiKey : '',
  },

  // サイト設定
  site: {
    title: '神戸 Gourmet Guide',
    url: 'https://second-penguin-planning.github.io/kobe-gourmet-guide',
    accentColor: '#C41E3A',
    goldColor: '#B8860B',
  },
};
