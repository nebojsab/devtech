# Devtech

Interni frontend prototip baziran na React + Vite + MUI.

## Pokretanje projekta

- Instalacija:
  - `npm install`
- Dev server:
  - `npm run dev`
- Lint:
  - `npm run lint`
- Build:
  - `npm run build`

## Glavni vodiči

Za timska pravila i konzistentan rad pogledaj:

- [Guides index](docs/guides/README.md)
- [UI Style Guide](docs/guides/ui-style-guide.md)
- [Iconography Guide](docs/guides/iconography-guide.md)
- [Git Commit & Push Guide](docs/guides/git-commit-push-guide.md)

## Napomene

- Projekat koristi MUI komponente i postojeće stil obrasce iz aplikacije.
- Za GitHub Pages deploy koristi se workflow u `.github/workflows/deploy-pages.yml`.

## Custom Homepage API (GP-4782)

Frontend podrzava dva moda rada za custom reseller homepages:

- `mock` (podrazumevano): konfiguracije se cuvaju u `localStorage`.
- `remote`: koristi backend API.

Environment varijable:

- `VITE_CUSTOM_HOMEPAGE_API_MODE=mock|remote`
- `VITE_CUSTOM_HOMEPAGE_API_BASE_URL=https://api.example.com` (opciono za `remote`)

Ocekivani endpoint kontrakt (`remote`):

- `GET /api/resellers/:resellerId/custom-homepage`
  - `200`: `{ enabled: boolean, html: string, updatedAt: string }`
  - `404`: nema konfiguracije
- `PUT /api/resellers/:resellerId/custom-homepage`
  - body: `{ enabled: boolean, html: string }`
  - `200`: `{ enabled: boolean, html: string, updatedAt: string }`
- `DELETE /api/resellers/:resellerId/custom-homepage`
  - `204`
