# Controlled synthetic shopping journeys

Thirty automated scenarios were executed against Kiwi Outdoor in separate browser contexts. Product selection, browsing order, basket quantity (1–3 per selected product), and stopping stage were generated using a seeded pseudorandom process. Stopping stages had equal selection probabilities; the realised distribution is not intended to represent customers.

| Final stage | Scenarios |
|---|---:|
| Product browsing only | 7 |
| Cart exit before checkout | 7 |
| Checkout exit before purchase | 5 |
| Simulated purchase completed | 11 |
| Total | 30 |

The run produced **11 demo orders, 33 units and NZ$1,117 simulated revenue**. Mean simulated order value was NZ$101.55. All outcomes were checked against the site's event log and receipts. Each context used a distinct observed analytics client ID. Eleven unique purchase IDs and their values matched outbound Google Analytics collection payloads; collection responses were HTTP 204.

| Product | Purchased units | Simulated revenue (NZD) |
|---|---:|---:|
| Travel Mug | 13 | 377.00 |
| Hoodie | 7 | 455.00 |
| Hiking Bottle | 2 | 50.00 |
| NZ T-Shirt | 1 | 35.00 |
| Tote Bag | 10 | 200.00 |

The scripted funnel reached product viewing in 30 contexts, adding to cart in 23, beginning checkout in 16, and purchasing in 11. These are scenario execution counts, not independently observed human decisions. A synthetic completion proportion of 11/30 (36.7%) follows from the generated stopping stages and cannot estimate business conversion. Cart and checkout exits were deliberately assigned; the run provides no evidence of their real-world causes.

All application-generated events carry `simulated_transaction=true`. The entry URL uses `utm_source=simulation`, `utm_medium=test`, and a dedicated `kiwi_controlled_` campaign. No payments, deliveries, or personal customer information were involved. Separate browser identifiers do not create independent human participants.

## Verification boundary

Successful collection responses confirm transport to Google's endpoint, not inclusion in GA4 reporting. At the first post-run check, GA4 Realtime showed zero active users and no events. A refresh after completion also showed zero active users. Inclusion in Realtime and processed reports therefore remains unconfirmed. Processing, filtering, or automated traffic handling may affect reporting; no specific cause has been established. Do not replace the previously verified GA4 report values with these local totals until the GA4 interface confirms them.

The evidence folder contains the pre-generated plan, per-scenario event logs, collection request/response records, order receipts, aggregate summary and independent payload checks. Existing evidence is retained. Do not replay an existing batch accidentally; a repeat run creates additional analytics traffic.

Outbound capture was incomplete for some browsing events: the local log contains 79 `view_item` events, while 47 were observed in collection requests. All 11 purchase payloads were observed. Do not infer that every locally queued event was transmitted or counted. This discrepancy requires further instrumentation checks before using the generated funnel as a GA4 result.

## Re-running the generator

Use a Node.js environment with the `playwright` package and Google Chrome installed. Set `SIMULATION_OUTPUT` to a new evidence directory, `SIMULATION_SEED` to an integer, and `SIMULATION_BATCH` to a new campaign name. Run `node scripts/simulate-journeys.cjs --plan-only` to inspect the plan without sending traffic; omit `--plan-only` only when intentionally generating another 30 scenarios. The fixed target is the public Kiwi Outdoor simulated store. The script never uses the signed-in Chrome profile. A failed scenario stops the run without automatic replay.

## 日本語要約

30件の模擬操作を別々のブラウザ環境で実行し、閲覧のみ7件・カート終了7件・チェックアウト終了5件・購入11件を確認した。購入は33点、模擬売上はNZ$1,117。実在顧客の行動ではなく、ランダムに割り当てたテスト結果である。送信応答と購入内容の一致は確認済みだが、GA4画面への反映は未確認のため、実際のGA4集計値として扱わない。
