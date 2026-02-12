# UI Style Guide

## 1) Osnovni principi

- Zadrži postojeći visual language kroz ceo app.
- Prioritet: čitljivost, konzistentnost i predvidljivo ponašanje.
- Izbegavaj ad-hoc stilove kada već postoji obrazac u app-u.

## 2) Layout i spacing

- Glavni page wrapper: `maxWidth: 1200`, centriran (`mx: 'auto'`).
- Sekcije i kartice: koristi postojeći obrazac sa `Paper` + `border: 1px solid #e0e0e0` i bez senki gde je već tako postavljeno.
- Razmaci:
  - naslovi sekcija: `mb: 2`
  - glavni blokovi: `mb: 3`
  - grid razmak: `gap: 2` ili `gap: '32px'` tamo gde je već usvojeno.

## 3) Tipografija

- Naslov stranice: `Typography variant="h4"`.
- Sekcijski naslov: `Typography variant="h6"`.
- Label stil: mala slova, oko `11-12px`, muted boja (`#999`) i `fontWeight: 600`.
- Primarni tekst sadržaja: oko `13-14px`, boja `#333`.

## 4) Boje i površine

- Pozadina app-a: `#f5f5f5`.
- Površine: bela (`#fff`).
- Border neutral: `#e0e0e0`.
- Tekst:
  - primarni `#333`
  - sekundarni `#666`
  - muted `#999`
- Akcentne boje koristi samo kroz postojeće obrasce (npr. success/error/info MUI `Alert`).

## 5) Buttons i akcije

- Primarni CTA: tamna varijanta (`bgcolor: '#333'`, hover `'#555'`), `textTransform: 'none'`.
- Sekundarne akcije: `outlined` ili text, prema postojećem ekranu.
- Ne uvoditi nove stilove dugmadi ako postojeća varijanta pokriva scenario.

## 6) Form elementi

- Preferiraj MUI komponente (`TextField`, `Select`, `Autocomplete`, `Checkbox`).
- Placeholder i input tonovi neka budu usklađeni sa postojećim (`#999` placeholder, `#666` input text).
- Error i validation poruke prikazivati jasno i blizu relevantnog koraka.

## 7) Stanja i feedback

- Success: nenametljiv banner/toast sa jasnim ishodom.
- Validation error: konkretan razlog + sledeći korak korisnika.
- Technical error: poruka sa retry smernicom (npr. „Please try again or contact support.“).

## 8) Accessibility minimum

- Interaktivni elementi moraju biti jasno klikabilni.
- Ne oslanjaj se samo na boju za značenje stanja.
- Tooltip koristi samo kada dodaje stvarno korisnu informaciju.

## 9) Dos & Don'ts

### Do

- Prati postojeće obrasce po stranicama.
- Održavaj isti ton teksta i nazivlje akcija.
- Grupiši povezane informacije u jasne sekcije.

### Don't

- Ne uvodi nove boje/fontove/shadow bez dogovora.
- Ne pravi više različitih varijanti istog UI elementa bez potrebe.
- Ne mešaj termine (npr. `Price list` vs `Pricelist`) na istoj površini.
