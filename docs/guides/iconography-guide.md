# Iconography Guide

## 1) Opšta pravila

- Koristi MUI ikone iz `@mui/icons-material`.
- Jedna akcija = jedna jasna ikona + tekst (u meniju ili dugmetu).
- Ikone su pomoć tekstu, ne zamena za tekst.

## 2) Preporučeni mapping (trenutni app)

- `Edit` → izmena entiteta
- `DriveFileMove` → move customer / move akcije
- `MoreVert` → overflow/kebab meni
- `Search` → pretraga
- `Store` → companies / organizacioni entiteti
- `FilterList` → filter akcije
- `IosShare` → export akcije
- `Notifications` → obaveštenja

## 3) Veličine i kontekst

- Sidebar/list ikone: `20px`
- Action ikone u headeru i menijima: `18px`
- Veće dekorativne ikone u karticama (npr. brand/logo): `32-36px`

## 4) Boje ikona

- Neutralne ikone: `#666` ili `#999` po kontekstu.
- Primarne akcije: prati boju parent komponente (najčešće neutralna tamna).
- Status ikone (success/error/info): prepusti MUI `Alert` komponenti.

## 5) Pravila za dodavanje novih ikona

- Proveri da li već postoji ista semantika negde u app-u.
- Ako postoji, koristi istu ikonu radi konzistentnosti.
- Ako dodaješ novu ikonu, dokumentuj razlog u PR opisu.

## 6) Anti-patterns

- Ne koristi više različitih ikona za istu akciju.
- Ne koristi dekorativne ikone bez funkcionalnog smisla.
- Ne menjaj veličine ikona proizvoljno između sličnih elemenata.
