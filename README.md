# Consentimento de câmera em KYC — Estudo de caso

Redesenho conceitual de uma etapa de compliance de alta fricção em onboarding financeiro: o momento em que o usuário concede acesso à câmera para a prova de vida. Bilíngue PT/EN.

**Publicado em:** https://ogabrielmoreira.github.io/kyc-camera-consent-flow/

---

## Stack

- Vite 5 · React 18 · lucide-react
- Deploy automático via GitHub Actions em cada push para `main`
- Sem CSS externo (design system inline no componente)

## Rodar localmente

```bash
npm install
npm run dev
```

Vite serve em `http://localhost:5173`.

## Build de produção

```bash
npm run build      # gera /dist
npm run preview    # serve /dist para testar antes do deploy
```

## Publicar no GitHub Pages (primeira vez)

Depois de dar `git push` inicial:

1. Vá em **Settings › Pages** no repositório
2. Em **Source**, selecione **GitHub Actions**
3. Vá em **Actions** e acompanhe o workflow `Deploy to GitHub Pages`
4. Ao terminar, o site fica no de sempre: `https://<user>.github.io/<repo>/`

Depois disso, todo push em `main` faz redeploy automático.

## Estrutura

```
├── src/
│   ├── App.jsx          # o case + protótipo (componente único)
│   └── main.jsx         # React root
├── .github/workflows/
│   └── deploy.yml       # GitHub Actions
├── index.html
├── vite.config.js       # base: "/kyc-camera-consent-flow/"
└── package.json
```

## Nota sobre o `base` do Vite

`vite.config.js` está com `base: "/kyc-camera-consent-flow/"` — precisa bater com o nome do repositório. Se renomear o repo, atualizar aqui.

---

## Aviso

Estudo autoral. A tese central foi aplicada em um projeto real para um cliente do setor financeiro, cuja identidade, interfaces e dados são preservados por confidencialidade. Todas as telas são uma reconstrução conceitual; o único dado compartilhado do estudo original é a proporção aproximada do ganho (~58% de recusa a menos), e todos os demais números são simulações ilustrativas.
