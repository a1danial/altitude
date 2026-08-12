# Altitude — Airtable Schema Reference

**Base ID:** `appPmEhB9cyajW9Gt`
**Proxy endpoint:** `/api/airtable?table=TableName` (pure passthrough — no field renaming happens server-side, so field names below are exactly what the frontend receives)
**Tables:** Cards, Perks, Lounges, LoungebyCard
**Last synced from live Airtable:** 2026-08-12

> This doc is the reference for two things: (1) understanding the current data model, and (2) knowing exactly what field + format to use when adding a new card to `database.xlsx` so it imports cleanly into Airtable. When asked to "research a card and add it to the database," match the **Format / Example** column exactly — especially string phrasing conventions (e.g. "Up to RM X cover", "X per RM 1").

---

## Table: Cards

One row per credit card product.

| Field | Type | Example value | Notes |
|---|---|---|---|
| `card_id` | singleLineText | `cimb_travel_world` | **Primary field.** Current values still use underscores (snake_case). Target convention is kebab-case (`cimb-travel-world`) per the pending slug migration — do not "fix" this ad hoc in new rows until the migration is done; match existing convention (underscore) for now so records stay consistent. |
| `card_name` | singleLineText | `CIMB Travel World` | Display name shown on the card face and listings. |
| `bank` | singleLineText | `CIMB` | Issuing bank. Not currently consumed by the frontend (see codebase review below). |
| `tier` | singleLineText | `World` | Card network tier label (e.g. World, World Elite, Infinite). |
| `net` | singleLineText | `World` | Card network badge shown top-right of the card face — currently duplicates `tier` in practice. |
| `num` | singleLineText | `•••• 0001` | Masked card number for the visual card mock. |
| `theme` | singleLineText | `linear-gradient(135deg,#0e1a16 0%,#163a31 50%,#08110e 100%)` | Full CSS gradient string. **Must be a single line** — a long-text field type here would inject newlines that break inline CSS (known issue, see memory). |
| `fg` | singleLineText | `#cfe6da` | Foreground/text color hex for content on top of `theme`. |
| `min_income` | number | `100000` | Annual income requirement in RM, no formatting. |
| `annual_fee` | number | `554.72` | RM, decimal allowed. |
| `annual_fee_details` | multilineText | `· Waived with RM120,000 annual spend\n· 50% off with RM60,000 annual spend` | Bullet lines separated by `\n`, each prefixed with `· `. |
| `lounge_visits` | singleLineText | `3 per quarter, 12 per year` | Free-text visit allowance. |
| `lounge_access` | singleLineText | `Shared between principal & supplementary · 50% off walk-in rate for accompanying guests at selected lounges` | Free-text access conditions. |
| `lounge_condition` | singleLineText | `Min. RM3,000 spend per quarter. Unmet quarters are forfeited with no carry forward` | Spend condition to unlock lounge visits. |
| `lounge_network` | singleLineText | `150+ selected Plaza Premium Lounges worldwide` | Which network(s) the card grants access to. |
| `insurance` | singleLineText | `Up to RM 2000000 cover` | Top-level insurance summary figure. |
| `travel_insurance_disruptions` | multilineText | `Up to RM25,000 trip cancellation & curtailment` | |
| `travel_insurance_medical` | multilineText | `Up to RM25,000 \nUp to RM50,000 per family` | |
| `travel_insurance_accident` | multilineText | `Up to RM300,000` | |
| `travel_insurance_condition` | multilineText | `Fare charged to card under MCC 3000 to 3308 (Airlines) or 4511 (Air Carrier, Airlines)` | This is the editorially important nuance flagged previously — OTA bookings via MCC 4722 typically do **not** trigger coverage; always verify and state the actual MCC condition here. |
| `travel_insurance_underwriter` | singleLineText | `Berjaya Sompo Insurance Berhad` | |
| `overseas` | singleLineText | *(free text — overseas spend reward terms)* | Note: Airtable CSV import appends `+` to reserved column names (e.g. would become `overseas+`) if re-imported carelessly — verify the field name stays `overseas` after any CSV round-trip. |
| `miles` | singleLineText | `1.5 miles per RM 1` | |
| `transfer` | singleLineText | `4 limousine transfers / year` | |
| `fasttrack` | singleLineText | `Priority lanes select airports` | |
| `hotel` | singleLineText | `Hilton Honors Gold status` | |
| `golf` | singleLineText | `12 green fees / year` | |
| `concierge` | singleLineText | `24/7 concierge desk` | |
| `roaming` | singleLineText | `Unavailable` | Use the literal string `Unavailable` (not blank) when a perk doesn't apply — this is how the dataset marks "no" vs "not yet researched." |
| `businessclass` | singleLineText | `Up to 20% off business class` | |
| `wifi` | singleLineText | `RM 200 WiFi credit / year` | |
| `protection` | singleLineText | `90-day purchase protection` | |

---

## Table: Perks

Reference table defining the perk categories used to drive the priority-ranking quiz and comparison table. Small, static-ish table (currently 1+ rows sampled; likely ~11 rows matching the perk keys used in Cards).

| Field | Type | Example value | Notes |
|---|---|---|---|
| `id` | singleLineText | `lounge` | **Primary field.** Must match the perk key used as a lookup elsewhere (e.g. `insurance`, `overseas`, `miles`, `wifi`, etc. — mirrors the flat perk field names on Cards). |
| `name` | singleLineText | `Airport Lounge Access` | Display label. |
| `pop` | number | `1` | Popularity/sort rank — table is fetched sorted ascending by this field. |
| `desc` | singleLineText | `Unwind before departure in premium global lounges.` | One-line description shown in the perk-picker UI. |

---

## Table: Lounges

One row per physical airport lounge (~403 rows, extensively cleaned).

| Field | Type | Example value | Notes |
|---|---|---|---|
| `lounge_id` | singleLineText | `kul-ppl-p21idt1` | **Primary field.** Slug convention: `{airport_code}-{network abbreviation}-{location shorthand}`, all lowercase, hyphenated. |
| `region` | singleLineText | `apac` | One of: `apac`, `mideast`, `europe`, `americas`, `africa` — matches the `REGIONS` list in frontend code. |
| `country` | singleLineText | `Malaysia` | |
| `city` | singleLineText | `Kuala Lumpur` | |
| `airport` | singleLineText | `Kuala Lumpur International Airport` | Full airport name. |
| `airport_code` | singleLineText | `KUL` | IATA 3-letter code, uppercase. |
| `lounge_name` | singleLineText | `Plaza Premium Lounge` | Lounge brand/name. |
| `location` | singleLineText | `Contact Pier 21, International Departures, Terminal 1` | Standardized per the v1.2 location copywriting prompt: `[Prefix] Landmark, Pier/Concourse/Wing, Direction, Sub-Airport/Terminal`. Terminal takes priority over Direction when they carry the same info; Direction only used when no terminal exists or is ambiguous. KUL is a named exception, using `KLIA T1` / `KLIA T2`. Landmark is optional — omit silently if not found. |
| `lat` | number | `2.7456` | Decimal degrees. |
| `lon` | number | `101.71` | Decimal degrees. |
| `term` | singleLineText | *(often blank in current data)* | Terminal number/label — sparsely populated; most terminal info currently lives inside `location` instead. |
| `net` | singleLineText | *(often blank in current data)* | Lounge network label (e.g. Priority Pass) — sparsely populated on real records; worth backfilling. |
| `amen` | multilineText | *(pipe-separated, e.g.* `Buffet\|Showers\|Wi-Fi`*)* | Amenities. Frontend splits on `\|` — currently sparse/empty on sampled real records; the map/prototype's static fallback data uses this format as the target. |

---

## Table: LoungebyCard

Join table — which lounges a given card grants access to, and under what entitlement.

| Field | Type | Example value | Notes |
|---|---|---|---|
| `card_id` | singleLineText | `cimb_travel_platinum` | Foreign key → `Cards.card_id`. **Not a native Airtable link field** — matched by string equality, so it must exactly match the `card_id` value including current underscore convention. |
| `lounge_id` | singleLineText | `hkg-tgm-arrhallat1` | Foreign key → `Lounges.lounge_id`. |
| `airport_code` | singleLineText | `HKG` | Denormalized copy of the lounge's airport code, for convenient filtering without a join. |
| `entitlement` | singleSelect | `Meal` | One of exactly three options: **`Meal`**, **`3 Hours`**, **`2 Hours`**. Must match one of these option names exactly — Airtable will reject anything else on a single-select field. |

**Coverage status:** LoungeByCard currently only has rows for CIMB Travel Platinum and UOB Travel World (per project notes). Expanding this table is the main blocker to showing lounge access for other cards on the map.

---

## Relationships

```
Cards.card_id  ──────┐
                      ├──< LoungebyCard >──── Lounges.lounge_id
                      │         │
                      │         └── airport_code (denormalized from Lounges)
                      │
Perks.id  ──(referenced by key, not a formal link)──> Cards.{perk_id} flat field
```

- `Cards` ↔ `LoungebyCard` ↔ `Lounges` form a many-to-many relationship via plain string matching on `card_id` and `lounge_id` — none of these are native Airtable linked-record fields, so referential integrity (e.g. renaming a `card_id`) must be maintained manually across all three tables. This is exactly the risk flagged in the pending kebab-case slug migration.
- `Perks.id` values (e.g. `lounge`, `insurance`, `overseas`, `miles`...) correspond to the flat perk field names on `Cards` — again, a naming convention rather than an enforced link.

---

## Workflow: adding a new card to `database.xlsx`

When researching and adding a new credit card:

1. Add one row to the Cards sheet with a `card_id` slug matching the existing underscore convention (e.g. `banka_travel_gold`) until the kebab-case migration lands.
2. Fill every column listed in the **Cards** table above. Use the literal string `Unavailable` for any perk the card genuinely doesn't offer — never leave a perk cell blank, since blank is currently ambiguous between "not offered" and "not yet researched."
3. Match phrasing conventions already in use (e.g. `"X per RM 1"` for miles, `"Up to RM X cover"` for insurance figures, `"· bullet"` lines separated by `\n` for `annual_fee_details`).
4. For the insurance MCC condition, verify and state the actual qualifying MCC range/booking condition — don't copy a generic phrase across cards, since this detail is genuinely different per issuer (see CIMB vs UOB precedent in project notes).
5. If the card has known lounge partnerships, a separate pass is needed to add matching rows to `LoungebyCard` (this is a distinct sheet/import — cross-reference by the same `card_id`).
6. When the row is finalized and cleaned, it gets copied into a new versioned `database_vX.xlsx` snapshot before import into Airtable, per the existing versioning workflow.
