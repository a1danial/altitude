# Altitude — Airtable Schema Reference

**Base ID:** `appPmEhB9cyajW9Gt`
**Proxy endpoint:** `/api/airtable?table=TableName` (pure passthrough — no field renaming happens server-side, so field names below are exactly what the frontend receives)
**Tables:** Cards, Perks, Lounges, LoungebyCard
**Last synced from live Airtable:** 2026-11-01 (post new-schema migration — matches `docs/Schema (Airtable).pdf`)

> This doc is the reference for understanding the current data model. For which Airtable field feeds which piece of UI, see `docs/Card Page.pdf`, `docs/Card Dialog.pdf`, `docs/Lounge Page.pdf` and `docs/Opening Directory Page.pdf`.

---

## Table: Cards

One row per credit card product. 8 live rows as of 2026-11-01.

| Field | Type | Example value | Notes |
|---|---|---|---|
| `card_id` | singleLineText | `cimb-travel-platinum` | **Primary field.** kebab-case slug (migrated from the old underscore convention). |
| `card_name` | singleLineText | `Travel Platinum` | Display name — **no longer includes the bank** (e.g. "CIMB Travel Platinum" is now just "Travel Platinum"; the bank is a separate field). |
| `bank` | singleLineText | `CIMB` | Issuing bank, shown on its own line beside `card_name` everywhere a card appears. |
| `tier` | singleLineText | `Platinum` | Card tier label. Used for card-picker search matching; not displayed directly. |
| `net` | singleLineText | `Platinum` | Network badge; currently duplicates `tier`. Used for search matching only. |
| `ui_card_background` | singleLineText | `linear-gradient(135deg, #3a2f17 0%, #0c0a07 100%)` | Full CSS `background` value, applied as-is. Two authoring conventions seen in the data — a three-stop sheen gradient over a base hex, or a plain two-colour blend — the frontend doesn't branch on which; it just renders the string. |
| `ui_card_text_color` | singleLineText | `#ecdcb4` | Hex text colour for content on top of `ui_card_background`. |
| `min_income` | number | `24000` | Annual income requirement in RM. **Blank** when `invitation_only` is ticked, or when not yet researched. |
| `invitation_only` | checkbox | `true` | When ticked, `min_income` must be blank and the UI shows "By invitation" instead. The app flags (without crashing) any row where both are set — see `invitationIncomeConflict` in `lib/airtable.ts`. |
| `annual_fee` | number | `0` | RM. `0` = complimentary, blank = not yet researched. |
| `annual_fee_details` | multilineText | `· Free for life for principal and supplementary cards` | Bullet lines separated by `\n`, each prefixed with `· ` (the bullet character is literal data — the frontend renders the string as-is, split on newline). |
| `lounge_visits` / `lounge_access` / `lounge_condition` / `lounge_network` | singleLineText | — | Unchanged from the prior schema. |
| `travel_insurance_disruptions` / `_medical` / `_accident` / `_condition` | multilineText | — | Unchanged. |
| `travel_insurance_underwriter` | singleLineText | `Berjaya Sompo` | Insurer name. |
| `travel_insurance_underwriter_url` | url | `https://...pdf` | **New.** Makes the underwriter name a hyperlink. Only rendered when `travel_insurance_underwriter` is also set. |
| `spending_rewards_cashback` | singleLineText | `5% cashback, all currencies` | **New.** Replaces the old flat `overseas` field — line 1 of the Spending Rewards row. |
| `spending_rewards_details` | multilineText | — | **New.** Replaces the old flat `miles` field — line 2, supports newlines. |
| `vas_list` | multilineText (JSON) | see below | **New.** JSON array of value-added-service entries. Replaces the old flat `transfer`/`fasttrack`/`hotel`/`golf`/`concierge`/`roaming`/`businessclass`/`wifi`/`protection` columns. Parsed defensively — bad/empty JSON yields no items, never a crash. |
| `apply_url` | url | — | **New.** Powers the "Apply" link on the Card Explorer. Falls back to `#` if blank. |
| `fx_fee_pct` | singleLineText | `1` | **New.** FX fee percentage (no `%` sign in the stored value — the UI appends it). |
| `fx_provider` | singleSelect | `Visa` \| `Mastercard` | **New.** The disclosure-page URL per provider is **not** an Airtable field — it's hardcoded in `lib/config.ts` (`FX_PROVIDER_URLS`), currently both set to `#` pending real URLs from the user. |
| `curtail_flight_delay` / `_flight_cancellation` / `_baggage_delay` / `_condition` | singleLineText | — | **New.** Travel curtailments, separate from the travel-insurance fields. Blank/`TBC`/`Unavailable` on every row as of 2026-11-01. |
| `curtail_underwriter` / `curtail_underwriter_url` | singleLineText / url | — | **New.** Same underwriter+link pattern as travel insurance. |

**Deprecated — now empty, no longer read by the frontend:** `num`, `theme`, `fg`, `insurance` (old top-level summary), `overseas`, `miles`, `transfer`, `fasttrack`, `hotel`, `golf`, `concierge`, `roaming`, `businessclass`, `wifi`, `protection`. Do not delete these columns from Airtable yet or re-populate them — they're kept empty intentionally during the migration window.

**"TBC" and "Unavailable" are both blank sentinels** — the frontend treats both as "not researched / not offered" and shows a greyed "Not offered", same as an empty cell.

---

## Table: Perks

**No longer read anywhere in the app.** It was only consumed by the Profile Builder (perk-ranking quiz), which has been removed along with the old 3-step nav in favour of the Opening Directory + Card/Lounge Explorer flow. The table itself is untouched in Airtable — this is a frontend-only change.

| Field | Type | Notes |
|---|---|---|
| `id` | singleLineText | Primary field, matches the old flat perk field names. |
| `name` | singleLineText | |
| `pop` | number | |
| `desc` | singleLineText | |

---

## Table: Lounges

One row per physical airport lounge (486 rows as of 2026-11-01).

| Field | Type | Example value | Notes |
|---|---|---|---|
| `lounge_id` | singleLineText | `kul-ppl-p21idt1` | **Primary field.** |
| `region` | singleLineText | `apac` | One of `apac`, `mideast`, `europe`, `americas`, `africa`. |
| `country` | singleLineText | `Malaysia` | |
| `city` | singleLineText | `Kuala Lumpur` | |
| `airport` | singleLineText | `Kuala Lumpur International Airport` | |
| `airport_code` | singleLineText | `KUL` | IATA 3-letter code. |
| `lounge_name` | singleLineText | `Plaza Premium Lounge` | |
| `location` | singleLineText | `Contact Pier 21, International Departures, Terminal 1` | |
| `lat` / `lon` | number | — | |
| `terminal` | singleLineText | `Terminal 1` | **New.** Replaces `term`. Shown in the lounge tag as `{airport_code} · {terminal}`. |
| `opening_hours` | singleLineText | `Open 24 hours` | **New.** Shown on the lounge card. Blank on most rows currently — the UI simply omits the hours line when blank. |

**Deprecated — now empty, no longer read:** `term` (replaced by `terminal`), `net`, `amen` (the new Lounge Explorer design has no amenities UI at all).

---

## Table: LoungebyCard

Join table — which lounges a given card grants access to, and under what entitlement. 486 rows as of 2026-11-01.

| Field | Type | Example value | Notes |
|---|---|---|---|
| `card_id` | singleLineText | `cimb-travel-platinum` | Foreign key → `Cards.card_id`, matched by string equality (not a native Airtable link). |
| `lounge_id` | singleLineText | `kul-ppl-p21idt1` | Foreign key → `Lounges.lounge_id`. |
| `entitlement` | singleSelect | `Meal` \| `2 Hours` \| `3 Hours` | Per-lounge access type. The Lounge Explorer shows this (falling back to the card's general `lounge_visits` text) alongside each covering card. |

**Deprecated — now empty, no longer read:** `airport_code` (denormalized copy of the lounge's airport code — dropped, the join already resolves through `lounge_id`).

**Coverage status (2026-11-01):** of the 8 live cards, only `cimb-travel-platinum`, `maybank-visa-infinite`, `uob-world`, `rhb-premier-visa-infinite` and `rhb-visa-infinite` have any `LoungebyCard` rows. The other 3 cards (`rhb-visa-signature`, `rhb-world-mastercard`, `rhb-platinum-business`) currently show "0 lounges available" everywhere — this is a data-completeness gap, not a bug.

---

## Relationships

```
Cards.card_id  ──────┐
                      ├──< LoungebyCard >──── Lounges.lounge_id
                      │
Perks.id  (no longer referenced by the frontend)
```

`Cards` ↔ `LoungebyCard` ↔ `Lounges` form a many-to-many relationship via plain string matching on `card_id` and `lounge_id` — none of these are native Airtable linked-record fields, so referential integrity must be maintained manually.

---

## Frontend config (not in Airtable)

`altitude-next/src/lib/config.ts` holds two feature-flag-style constants, as required by the product notes:

1. `DIRECTORY_CARD_IDS` — the 5 `card_id`s the Opening Directory's card-fan shows.
2. `FALLBACK_CARDS` — a hand-maintained snapshot of all 8 live Cards rows (same shape `transformCards` produces), used whenever the Airtable fetch fails. Keep this in sync if the live data changes meaningfully.
