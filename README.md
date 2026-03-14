# 🔥 PromoDeals — Guia de Instalação

## Estrutura do projeto
```
promodeals/
├── netlify.toml              ← configuração do Netlify
├── netlify/
│   └── functions/
│       └── go.js             ← gera a página de redirect com Open Graph
└── public/
    ├── index.html            ← site público com lista de promoções
    ├── admin.html            ← painel admin (protegido por password)
    └── products.json         ← lista de produtos (tu atualizas este ficheiro)
```

---

## ⚙️ Configuração antes de fazer upload

### 1. ID de afiliado e domínio
No ficheiro `netlify/functions/go.js`, linha 6-7:
```js
const AFFILIATE_TAG  = 'Consultorio0b-21';   // ← já configurado
const AMAZON_DOMAIN  = 'amazon.es';           // ← já configurado
```

### 2. Password do admin
Em `public/admin.html`, no final do ficheiro:
```js
const ADMIN_PASSWORD = 'admin123'; // ← MUDA ISTO
```

---

## 🚀 Como colocar online (Netlify + GitHub)

### Passo 1 — GitHub
1. Vai a [github.com](https://github.com) e cria uma conta gratuita
2. Clica em **New repository** → chama-lhe `promodeals` → **Create**
3. Faz upload de todos os ficheiros desta pasta para o repositório

### Passo 2 — Netlify
1. Vai a [netlify.com](https://netlify.com) e cria conta gratuita (podes entrar com o GitHub)
2. Clica em **Add new site** → **Import an existing project** → **GitHub**
3. Escolhe o repositório `promodeals`
4. Em **Publish directory** escreve: `public`
5. Clica **Deploy site**
6. O teu site fica online em segundos com um URL tipo `https://promodeals-abc123.netlify.app`

---

## 📦 Como adicionar produtos

1. Vai a `https://o-teu-site.netlify.app/admin`
2. Entra com a tua password
3. Cola o link da Amazon → clica **Extrair ASIN**
4. Preenche nome, preço, etc. → **Adicionar à lista**
5. Clica **⬇️ Descarregar products.json**
6. Vai ao GitHub → abre o ficheiro `public/products.json` → clica no lápis ✏️ → cola o conteúdo → **Commit**
7. O Netlify atualiza o site automaticamente em ~30 segundos ✅

---

## 📲 Como partilhar no WhatsApp/Telegram

Para cada produto, o link a partilhar é:
```
https://o-teu-site.netlify.app/go/ASIN
```

Exemplo:
```
https://promodeals.netlify.app/go/B09B8V1LZ3
```

O WhatsApp/Telegram vão mostrar automaticamente:
- 📸 Foto do produto
- 📝 Nome e preço
- 💰 Desconto

Quando a pessoa clica → vai para a Amazon com o teu tag de afiliado ✅

---

## 💡 Dica — Domínio personalizado
No Netlify podes ligar um domínio próprio gratuitamente:
**Site settings → Domain management → Add custom domain**
