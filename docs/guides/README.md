# Devtech Guides

Ovaj folder sadrži praktične smernice za konzistentan razvoj i lakšu saradnju tima.

## Dostupni vodiči

- [UI Style Guide](./ui-style-guide.md)
- [Iconography Guide](./iconography-guide.md)
- [Git Commit & Push Guide](./git-commit-push-guide.md)

## Brza pravila (TL;DR)

- Koristi postojeće MUI obrasce i boje iz postojećih stranica; bez novih hardkodovanih tema bez dogovora.
- Za akcione ikonice koristi isti set i veličine kao u postojećim ekranima (`18px` u action zonama, `20px` u listama/sidebar).
- Pre svakog commit-a: `npm run lint`.
- Commit poruke neka budu kratke i akcione (imperativ): `Add ...`, `Fix ...`, `Refactor ...`.
- Na `main` pushuj samo proverene izmene; za veće radove preporuka je feature branch + PR.
