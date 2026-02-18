# Git Commit & Push Guide

## 1) Standardni tok rada

1. Povuci poslednje izmene:
   - `git pull origin main`
2. Ako radiš novu funkcionalnost, prvo kreiraj zaseban branch po Jira pravilu (vidi sekciju 3).
3. Napravi izmene i proveri aplikaciju lokalno.
3. Pokreni provere:
   - `npm run lint`
   - (po potrebi) `npm run build`
4. Stage:
   - `git add <fajlovi>` ili `git add -A`
5. Commit:
   - `git commit -m "Add ..."`
6. Push:
   - `git push origin <branch-name>` za feature rad
   - `git push origin main` samo kada je to eksplicitno dogovoreno

## 2) Preporuka za commit poruke

Koristi imperativ i jasan scope:

- `Add move customer validation step`
- `Fix audit tab active state after move`
- `Refactor company context data mapping`

Opcionalna forma sa prefiksima:

- `feat: add move customer dialog flow`
- `fix: correct router basename on GitHub Pages`
- `docs: add UI and git contribution guides`

## 3) Kada push na main, a kada branch + PR

Obavezno pravilo za novu funkcionalnost:

- Za svaki novi feature koristi zaseban branch.
- Pre kreiranja brancha moraš imati i Jira `Ticket ID` i naziv tiketa.
- Branch naziv mora da se matchuje sa tiketom/epicom.
- Preporučena konvencija:
   - `feature/<TICKET-ID>-<kratak-kebab-opis>`
   - `bugfix/<TICKET-ID>-<kratak-kebab-opis>`
   - `hotfix/<TICKET-ID>-<kratak-kebab-opis>`
- Primeri:
   - `feature/CRM-142-add-customer-move-flow`
   - `bugfix/CRM-318-fix-company-details-tabs`
   - `feature/EPIC-21-pricing-wireframe-alignment`
- Bez validnog Jira ID-a i naziva tiketa ne započinji novu funkcionalnost.

Copy/paste template (zameni vrednosti):

```bash
# primer vrednosti
TICKET_ID="CRM-142"
TICKET_NAME="add-customer-move-flow"
BRANCH_TYPE="feature" # feature | bugfix | hotfix

git pull origin main
git checkout -b "$BRANCH_TYPE/$TICKET_ID-$TICKET_NAME"
git push -u origin "$BRANCH_TYPE/$TICKET_ID-$TICKET_NAME"
```

Push na `main`:

- Sitne, niskorizične izmene
- Hotfix koji je provereno bezbedan

Feature branch + PR:

- Veći UI/flow zahvati
- Više fajlova i veći rizik regresije
- Promene koje traže review više ljudi

## 4) Brzi checklist pre push-a

- `npm run lint` prolazi
- Nema debug logova koji ne treba da ostanu
- Poruke i labeli su konzistentni
- Ručno testiran kritičan flow koji je menjan

## 5) Korisne komande

- Status: `git status`
- Pregled izmena: `git diff`
- Poslednji commit: `git log -1 --oneline`
- Undo staged fajla: `git restore --staged <fajl>`
- Undo local izmene fajla: `git restore <fajl>`

## 6) Minimalna politika kvaliteta

- Ne pushuj ako lint ne prolazi.
- Ne mešaj nepovezane izmene u isti commit.
- Drži commit-eve male i tematski fokusirane.
