# Průvodce správou obsahu webu
## Tomáš Vlček — home Interiors & Design

Vítej v administračním průvodci. Obsah webu upravuješ výhradně přes **Google Sheets** — žádný kód, žádný admin panel.

---

## 📌 Odkaz na Google Sheets (ulož do záložek!)
> Po vytvoření sheetu sem vlož odkaz: `https://docs.google.com/spreadsheets/d/TVOJE_ID`

---

## Jak přidat/upravit obsah

### 🏠 Přidat nový projekt (realizaci)
1. Otevři Google Sheets → list **Projekty**
2. Přidej nový řádek:

| Sloupec | Co vyplnit | Příklad |
|---------|-----------|---------|
| Nazev | Název projektu CZ | Vila Průhonice |
| Nazev_EN | Název anglicky | Průhonice Villa |
| Popis | Popis projektu CZ | Komplexní realizace... |
| Popis_EN | Popis anglicky | Complete realization... |
| Kategorie | `rezidenční` nebo `komerční` | rezidenční |
| Foto_URL | Odkaz na fotku | https://drive.google.com/... |
| Datum | Datum realizace | 2024-01 |
| Aktivni | `ano` nebo `ne` | ano |

> **Tip pro fotky:** Nahraj fotku na Google Drive → pravý klik → „Získat odkaz" → změň `drive.google.com/file/d/ID/view` na `drive.google.com/uc?id=ID`

---

### 📝 Přidat článek
List **Clanky** — stejný postup, navíc sloupce:
- **Obsah** / **Obsah_EN** — celý text článku
- **Stitek** / **Stitek_EN** — kategorie (Design, Inspirace, Materiály...)

---

### ⭐ Přidat recenzi
List **Recenze**:

| Sloupec | Příklad |
|---------|---------|
| Jmeno | Jana Nováková |
| Text | Skvělá spolupráce... |
| Text_EN | Excellent collaboration... |
| Hodnoceni | 5 |
| Aktivni | ano |

---

### ⚙️ Změnit kontaktní údaje
List **Nastaveni** — změň hodnotu v příslušném řádku (Klic = název, Hodnota_CS = česky, Hodnota_EN = anglicky).

---

## Jak přidat fotku na web

**Doporučená metoda — Google Drive:**
1. Nahraj fotku na Google Drive (složka „Web fotky")
2. Klikni pravým tlačítkem → „Sdílet" → „Kdokoliv s odkazem může zobrazit"
3. Zkopíruj ID ze sdíleného odkazu: `.../file/d/**TOTO_JE_ID**/view`
4. Použij jako URL: `https://drive.google.com/uc?id=TOTO_JE_ID`
5. Vlož tuto URL do sloupce Foto_URL v tabulce

---

## Jak se změny projeví na webu?

Změny v Google Sheets se projeví **ihned** při dalším načtení stránky — není potřeba nic publikovat ani potvrzovat.

---

## Potřebuješ pomoct?
Kontaktuj: MadeByEmKo — správce webu
