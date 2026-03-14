// netlify/functions/go.js
// Chamada quando alguém acede a /go/ASIN
// Lê os dados do produto a partir do ficheiro products.json
// e serve uma página HTML com Open Graph tags para WhatsApp/Telegram
// Depois redireciona automaticamente para a Amazon com o tag de afiliado.

const fs   = require('fs');
const path = require('path');

const AFFILIATE_TAG  = 'Consultorio0b-21';
const AMAZON_DOMAIN  = 'amazon.es';
const SITE_URL       = process.env.URL || 'https://promodeals.netlify.app'; // Netlify injeta URL automaticamente

exports.handler = async (event) => {
  const asin = (event.queryStringParameters && event.queryStringParameters.asin || '').toUpperCase().trim();

  if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
    return { statusCode: 302, headers: { Location: '/' } };
  }

  // Ler produtos guardados
  let product = null;
  try {
    const filePath = path.join(__dirname, '..', '..', 'public', 'products.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(raw);
    product = products.find(p => p.asin && p.asin.toUpperCase() === asin);
  } catch (e) {
    // ficheiro não existe ainda ou erro de leitura — continua com dados genéricos
  }

  const title       = product ? product.title    : 'Promoção Amazon';
  const price       = product ? `€${product.price}` : '';
  const oldPrice    = product && product.oldPrice ? `€${product.oldPrice}` : '';
  const category    = product ? product.category : 'Promoção';
  const emoji       = product ? (product.emoji || '🛍️') : '🛍️';

  // Calcular desconto
  let discountText = '';
  if (product && product.price && product.oldPrice) {
    const pn = parseFloat(product.price);
    const po = parseFloat(product.oldPrice);
    if (po > pn) discountText = `-${Math.round(((po - pn) / po) * 100)}%`;
  }

  const description = [
    price && oldPrice ? `${price} (antes ${oldPrice}) ${discountText}` : price,
    category,
    '👉 Clica para ver na Amazon'
  ].filter(Boolean).join(' · ');

  // URL da imagem do produto Amazon (funciona para a maioria dos produtos)
  const imageUrl   = `https://images-na.ssl-images-amazon.com/images/P/${asin}.jpg`;
  const amazonUrl  = `https://www.${AMAZON_DOMAIN}/dp/${asin}?tag=${AFFILIATE_TAG}`;
  const canonicalUrl = `${SITE_URL}/go/${asin}`;

  const html = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${emoji} ${title} ${price ? '— ' + price : ''}</title>

  <!-- Open Graph (WhatsApp, Telegram, Facebook) -->
  <meta property="og:type"        content="product"/>
  <meta property="og:url"         content="${canonicalUrl}"/>
  <meta property="og:title"       content="${emoji} ${title}"/>
  <meta property="og:description" content="${description}"/>
  <meta property="og:image"       content="${imageUrl}"/>
  <meta property="og:image:width" content="500"/>
  <meta property="og:image:height"content="500"/>
  <meta property="og:site_name"   content="PromoDeals"/>

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image"/>
  <meta name="twitter:title"       content="${emoji} ${title}"/>
  <meta name="twitter:description" content="${description}"/>
  <meta name="twitter:image"       content="${imageUrl}"/>

  <!-- Redireciona após 1.2 segundos -->
  <meta http-equiv="refresh" content="1;url=${amazonUrl}"/>

  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --bg:#0a0a0f; --card:#1a1a24; --border:#2a2a3a;
      --accent:#ff4d1c; --accent2:#ff8c42; --gold:#ffd166;
      --text:#f0f0f5; --muted:#7a7a9a; --green:#06d6a0;
    }
    *{margin:0;padding:0;box-sizing:border-box;}
    body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;}
    .wrap{max-width:420px;width:100%;text-align:center;}
    .logo{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:var(--muted);margin-bottom:32px;letter-spacing:1px;text-transform:uppercase;}
    .card{background:var(--card);border:1px solid var(--border);border-radius:22px;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 60px rgba(0,0,0,.4);}
    .img-wrap{aspect-ratio:1;background:#111;display:flex;align-items:center;justify-content:center;overflow:hidden;}
    .img-wrap img{width:100%;height:100%;object-fit:contain;padding:16px;}
    .img-wrap .fallback{font-size:4rem;}
    .info{padding:20px;}
    .cat{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--accent2);background:rgba(255,77,28,.1);border:1px solid rgba(255,77,28,.2);padding:3px 10px;border-radius:6px;display:inline-block;margin-bottom:10px;}
    .title{font-family:'Syne',sans-serif;font-size:1.05rem;font-weight:700;line-height:1.35;margin-bottom:14px;}
    .price-row{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;}
    .price-now{font-family:'Syne',sans-serif;font-size:1.9rem;font-weight:800;color:var(--accent);}
    .price-old{font-size:.9rem;color:var(--muted);text-decoration:line-through;}
    .disc{background:var(--gold);color:#000;font-size:.78rem;font-weight:700;padding:4px 10px;border-radius:8px;}
    .redirect-msg{color:var(--muted);font-size:.82rem;margin-bottom:16px;line-height:1.6;}
    .bar-wrap{background:#1a1a24;border-radius:100px;height:5px;overflow:hidden;margin-bottom:24px;}
    .bar{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:100px;animation:fill 1.2s linear forwards;}
    @keyframes fill{from{width:0%}to{width:100%}}
    .btn{display:block;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;font-weight:700;font-size:.92rem;padding:14px;border-radius:13px;text-decoration:none;font-family:'DM Sans',sans-serif;box-shadow:0 4px 18px rgba(255,77,28,.35);transition:opacity .2s;}
    .btn:hover{opacity:.88;}
    .disclaimer{font-size:.68rem;color:var(--muted);margin-top:16px;line-height:1.7;}
    .disclaimer a{color:var(--accent);text-decoration:none;}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">🔥 PromoDeals</div>
    <div class="card">
      <div class="img-wrap">
        <img src="${imageUrl}" alt="${title}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
        <div class="fallback" style="display:none">${emoji}</div>
      </div>
      <div class="info">
        <div class="cat">${category}</div>
        <div class="title">${title}</div>
        <div class="price-row">
          ${price ? `<span class="price-now">${price}</span>` : ''}
          ${oldPrice ? `<span class="price-old">${oldPrice}</span>` : ''}
          ${discountText ? `<span class="disc">${discountText}</span>` : ''}
        </div>
      </div>
    </div>
    <div class="redirect-msg">A redirecionar para a Amazon...</div>
    <div class="bar-wrap"><div class="bar"></div></div>
    <a class="btn" href="${amazonUrl}">🛒 Ir para a Amazon agora</a>
    <div class="disclaimer">
      Como Associado Amazon, ganho comissão pelas compras que cumpram os requisitos.<br/>
      <a href="/">← Ver todas as promoções</a>
    </div>
  </div>
  <script>
    // Redireciona automaticamente
    setTimeout(() => { window.location.href = "${amazonUrl}"; }, 1200);
  </script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: html,
  };
};
