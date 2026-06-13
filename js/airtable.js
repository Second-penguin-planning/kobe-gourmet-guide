// Airtable API連携モジュール

class AirtableClient {
  constructor() {
    this.apiKey = CONFIG.airtable.apiKey;
    this.baseId = CONFIG.airtable.baseId;
    this.tableName = CONFIG.airtable.tableName;
    this.baseUrl = `https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(this.tableName)}`;
  }

  async fetchAll() {
    const records = [];
    let offset = null;

    do {
      const url = new URL(this.baseUrl);
      if (offset) url.searchParams.set('offset', offset);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Airtable error:', res.status, errText);
        throw new Error(`Airtable API error: ${res.status}`);
      }
      const data = await res.json();
      console.log('Airtable records:', data.records.length, data.records[0]);

      records.push(...data.records.map(r => this._normalize(r)));
      offset = data.offset || null;
    } while (offset);

    return records;
  }

  async fetchById(recordId) {
    const res = await fetch(`${this.baseUrl}/${recordId}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    if (!res.ok) throw new Error(`Airtable API error: ${res.status}`);
    const data = await res.json();
    return this._normalize(data);
  }

  _normalize(record) {
    const f = record.fields;
    return {
      id: record.id,
      storeNumber: f['店舗番号'] || '',
      category: f['選択区分'] || f['掲載区分'] || '',
      name: f['店名'] || '',
      dishName: f['料理名'] || '',
      photos: f['料理写真'] ? f['料理写真'].map(p => p.url) : [],
      logo: f['ロゴ'] ? f['ロゴ'][0].url : null,
      description: f['説明'] || '',
      address: f['住所'] || '',
      lat: f['緯度'] || null,
      lng: f['経度'] || null,
      mapUrl: f['GoogleMap URL'] || '',
      hours: f['営業時間'] || '',
      closed: f['定休日'] || '',
      phone: f['電話番号'] || '',
      instagram: f['Instagram'] || '',
      homepage: f['ホームページ'] || '',
      genre: f['ジャンル'] || '',
      recommended: f['おすすめ料理'] || '',
      coupon: f['クーポン'] || '',
      visible: f['公開ON/OFF'] || false,
      order: f['表示順位'] || 99,
    };
  }
}

// シングルトン
const airtable = new AirtableClient();

// キャッシュ付きデータ取得
let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5分

async function getRestaurants(forceRefresh = false) {
  if (!forceRefresh && _cache && Date.now() - _cacheTime < CACHE_TTL) {
    return _cache;
  }
  _cache = await airtable.fetchAll();
  _cacheTime = Date.now();
  return _cache;
}
