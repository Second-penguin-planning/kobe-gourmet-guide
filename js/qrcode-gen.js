// QRコード生成ユーティリティ

function buildMapUrl(restaurant) {
  if (restaurant.lat && restaurant.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`;
  }
  if (restaurant.mapUrl) return restaurant.mapUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`;
}

function generateQR(container, restaurant, size = 80) {
  const url = buildMapUrl(restaurant);
  container.innerHTML = '';
  new QRCode(container, {
    text: url,
    width: size,
    height: size,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M,
  });
}

function generateQRDataUrl(restaurant, size = 80) {
  return new Promise(resolve => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    new QRCode(div, {
      text: buildMapUrl(restaurant),
      width: size,
      height: size,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M,
    });
    setTimeout(() => {
      const img = div.querySelector('img') || div.querySelector('canvas');
      const src = img ? (img.src || img.toDataURL()) : '';
      document.body.removeChild(div);
      resolve(src);
    }, 200);
  });
}
