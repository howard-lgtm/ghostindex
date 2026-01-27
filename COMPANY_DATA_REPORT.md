# GhostIndex Company Data Report

**Generated:** January 27, 2026  
**Database Status:** Production (getghostindex.com)

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Companies** | 206 |
| **Public Companies** | 119 (58%) |
| **Private Companies** | 87 (42%) |
| **With Ghost Scores** | 42 (20%) |
| **Without Ghost Scores** | 164 (80%) |

---

## Companies WITH Ghost Scores (42)

| Company | Domain | Ghost Score | Stock | Status |
|---------|--------|-------------|-------|--------|
| Uber | uber.com | **79.4** | UBER | 🔴 High ghost rate |
| BlackRock | blackrock.com | **75.0** | BLK | 🔴 High ghost rate |
| Palantir | palantir.com | **75.0** | PLTR | 🔴 High ghost rate |
| Netflix | netflix.com | **71.2** | NFLX | 🔴 High ghost rate |
| Meta | meta.com | **68.5** | META | 🟠 Moderate |
| SpaceX | spacex.com | **62.3** | Private | 🟠 Moderate |
| Tesla | tesla.com | **55.8** | TSLA | 🟠 Moderate |
| Amazon | amazon.com | **52.3** | AMZN | 🟠 Moderate |
| OpenAI | openai.com | **48.7** | Private | 🟡 Fair |
| Apple | apple.com | **45.5** | AAPL | 🟡 Fair |
| Airbnb | airbnb.com | **42.1** | ABNB | 🟡 Fair |
| Databricks | databricks.com | **41.8** | Private | 🟡 Fair |
| Spotify | spotify.com | **38.9** | SPOT | 🟢 Good |
| Stripe | stripe.com | **35.2** | Private | 🟢 Good |
| Google | google.com | **32.0** | GOOGL | 🟢 Good |
| Microsoft | microsoft.com | **28.7** | MSFT | 🟢 Good |
| Activision Blizzard | activisionblizzard.com | 25.0 | ATVI* | 🟢 Default |
| AMD | amd.com | 25.0 | AMD | 🟢 Default |
| Bain & Company | bain.com | 25.0 | Private | 🟢 Default |
| Boston Consulting Group | bcg.com | 25.0 | Private | 🟢 Default |
| Citadel | citadel.com | 25.0 | Private | 🟢 Default |
| Cloudflare | cloudflare.com | 25.0 | NET | 🟢 Default |
| Electronic Arts | ea.com | 25.0 | EA | 🟢 Default |
| Epic Games | epicgames.com | 25.0 | Private | 🟢 Default |
| GitHub | github.com | 25.0 | MSFT sub | 🟢 Default |
| JPMorgan Chase | jpmorganchase.com | 25.0 | JPM | 🟢 Default |
| Morgan Stanley | morganstanley.com | 25.0 | MS | 🟢 Default |
| Notion | notion.so | 25.0 | Private | 🟢 Default |
| Pinterest | pinterest.com | 25.0 | PINS | 🟢 Default |
| Reddit | reddit.com | 25.0 | RDDT | 🟢 Default |
| Riot Games | riotgames.com | 25.0 | Private | 🟢 Default |
| TikTok | tiktok.com | 25.0 | Private | 🟢 Default |
| Vercel | vercel.com | 25.0 | Private | 🟢 Default |

*ATVI acquired by Microsoft

---

## Live Stock Prices (January 27, 2026)

### Big Tech
| Company | Ticker | Price | Day Change | Ghost Score |
|---------|--------|-------|------------|-------------|
| Apple | AAPL | $260.66 | +2.06% | 45.5 |
| Microsoft | MSFT | — | — | 28.7 |
| Amazon | AMZN | $242.13 | +1.56% | 52.3 |
| Google | GOOGL | — | — | 32.0 |
| Meta | META | — | — | 68.5 |
| NVIDIA | NVDA | — | — | No data |
| Tesla | TSLA | — | — | 55.8 |

### Top Movers Today
| Company | Ticker | Price | Change |
|---------|--------|-------|--------|
| Cloudflare | NET | $210.58 | **+11.21%** |
| General Motors | GM | $86.29 | **+8.64%** |
| Chegg | CHGG | $0.78 | +4.53% |
| Ford | F | $13.79 | +2.57% |
| CrowdStrike | CRWD | $478.68 | +2.21% |

### Biggest Declines
| Company | Ticker | Price | Change |
|---------|--------|-------|--------|
| CVS Health | CVS | $71.80 | **-14.40%** |
| Charter | CHTR | $184.23 | -4.93% |
| GitLab | GTLB | $36.58 | -4.18% |
| Duolingo | DUOL | $145.34 | -4.11% |
| Atlassian | TEAM | $132.75 | -4.11% |

---

## Data Gaps to Fill

### Priority 1: Major Public Companies Without Scores (77)
These are publicly traded companies in our database that need ghost score data:

**Tech:**
- NVIDIA (NVDA) - $1,000+ stock
- Adobe (ADBE) - $295
- Salesforce (CRM)
- Oracle (ORCL)
- Intel (INTC)
- IBM (IBM)
- Cisco (CSCO)
- ServiceNow (NOW)
- Workday (WDAY)

**Finance:**
- Goldman Sachs (GS) - $922
- JPMorgan (JPM) - Has default score
- Bank of America (BAC)
- Wells Fargo (WFC)
- Citigroup (C)
- PayPal (PYPL)

**Healthcare:**
- Pfizer (PFE)
- Johnson & Johnson (JNJ)
- UnitedHealth (UNH)
- CVS Health (CVS)
- Moderna (MRNA)

**Consumer:**
- Disney (DIS)
- Coca-Cola (KO)
- PepsiCo (PEP)
- Starbucks (SBUX)
- McDonald's (MCD)
- Walmart (WMT)
- Target (TGT)

### Priority 2: High-Profile Private Companies (10)
- Anthropic
- Figma
- Canva
- Discord
- Instacart
- Plaid
- Brex
- Ramp
- Linear
- Retool

---

## Recommendations

### Immediate Actions
1. **Generate demo ghost scores** for top 50 public companies without data
2. **Add stock ticker field** to companies table for correlation analysis
3. **Create "Featured Companies"** section with complete data

### Data Quality
- 25.0 scores appear to be default/placeholder values
- Need real verified reports to generate authentic scores
- Consider seeding with historical hiring data if available

### Future Enhancements
1. Add `stock_ticker` column to companies table
2. Add `is_public` boolean field
3. Add `market_cap` for sorting/filtering
4. Daily stock price sync for public companies

---

## Technical Notes

- Stock data fetched via Yahoo Finance API (free, no key required)
- Ghost scores range 0-100 (lower = better responsiveness)
- Default score of 25.0 indicates no verified reports
- Script: `scripts/company-stock-data.ts`

---

*Report generated for GhostIndex launch preparation*
