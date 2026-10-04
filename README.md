# nuwget-page

Página pessoal do **Nuwget** (César Rodrigues Ribeiro): o Dudu, um urso roxo desenvolvedor, programando de madrugada enquanto a Bubu descansa no sofá.

Todo o conteúdo vem do README do perfil e está em `src/content/` (PT-BR em `pt.ts`, tradução fiel em `en.ts`). Nada é inventado: o que não existe no README não aparece na página.

## Versões

| Versão | Descrição | Endereço |
| --- | --- | --- |
| **v2** (atual) | Hero em sprites, animações só na GPU, pausa fora da tela | `/` |
| **v1** | Primeira versão, hero com camadas mascaradas | `/v1/` |

Cada idioma tem sua rota: português em `/` e inglês em `/en/` (e `/v1/en/` na v1).

## Stack

Next.js (App Router, export estático) · React · TypeScript · Tailwind CSS 4 · Motion.

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera ./out
```

## GitHub Pages

O site é 100% estático (`output: "export"`), sem middleware, redirects de servidor nem rotas de API.

- `NEXT_PUBLIC_BASE_PATH` define o prefixo quando o site roda em `/<repo>` (o workflow preenche sozinho).
- Todo asset passa por `asset()` em `src/lib/asset.ts` para respeitar esse prefixo.
- `.github/workflows/deploy.yml` publica no Pages a cada push em `main`.
- Em Settings → Pages, escolha **GitHub Actions** como fonte.

## Ilustrações

`assets/` guarda os PNGs originais do Dudu e da Bubu. As variantes WebP otimizadas ficam em `public/images/`.
