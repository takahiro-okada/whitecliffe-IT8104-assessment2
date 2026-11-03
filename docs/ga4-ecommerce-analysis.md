# Web analytics: purpose, validation and limitations

GA4 complements the retail CSV analysis by recording activity before a purchase. The retail models estimate Sales from product and store attributes. Web analytics examines how visitors encounter products and move through viewing, adding to cart, checkout and purchase. This supports questions such as whether an observed sales shortfall is associated with limited product exposure or with a particular stage of the shopping process. Neither source alone establishes the causal reason for a sales difference.

## Controlled ecommerce validation

Eight additional simulated orders were completed through the public Kiwi Outdoor storefront. They cover all five products and contain 11 items, with a combined simulated value of NZ$377 and an average simulated order value of NZ$47.125 (NZ$47.13 rounded). No payment or fulfilment occurred. Each purchase payload was marked simulated_transaction=true. The orders were run without debug_mode=true, and the dedicated assignment GA4 property received eight purchase events. All eight unique transaction IDs were observed in GA4 Realtime. The received value parameters were 20, 25, 29, 35, 54, 55, 65 and 94, each appearing once, matching the receipt totals.

| Product | Items in completed orders | Simulated value (NZD) |
|---|---:|---:|
| Hiking Bottle | 2 | 50 |
| NZ T-Shirt | 2 | 70 |
| Travel Mug | 3 | 87 |
| Tote Bag | 2 | 40 |
| Hoodie | 2 | 130 |
| Total | 11 | 377 |

These product differences reflect chosen baskets and prices. They are not evidence that consumers prefer a product. The NZ$377 describes this additional batch, not the entire GA4 property or the earlier separate NZ$302 verification run.

Three further workflows demonstrated a product view without adding to cart, a cart addition followed by removal, and checkout reached without purchase followed by removal. They were performed in the same browser environment. They are not independent customers or independently sampled sessions. A conversion rate of 8/11 would therefore have no valid customer/session denominator and is not reported.

## Measurement evidence and remaining analysis

Realtime receipt confirms event collection. It does not establish that processed ecommerce reports contain complete item-level metrics. The local session log retains only the latest 100 events; its snapshots are partial windows and must not be summed as a complete event census. Receipts, item totals, transaction IDs and GA4 value parameters were reconciled. The cart was left empty after the nonpurchase workflows.

Once processed reports are available, record the exact date range and obtain product views, items added to cart, items purchased, item revenue and a GA4-defined user/session funnel with its denominator specified. Review source/medium and device only where there is meaningful variation and sufficient observations. This exercise currently provides measurement and reporting examples, not estimates of real market demand, natural abandonment rates or campaign effectiveness. Additional scripted traffic cannot resolve that limitation.

## Business implications and connection to Parts 1 and 2

The retail analysis identifies associations involving Price and store context. GA4 adds measurable stages before purchase. With genuine traffic, high product views and few cart additions would motivate investigating the product offer or information. A large loss between checkout and purchase would motivate checking checkout usability. These are investigation paths, not conclusions established by the controlled transactions. The two datasets concern different businesses and observations and should be compared conceptually rather than joined as common transactions.

## Sources

- Google Analytics ecommerce purchases report: https://support.google.com/analytics/answer/12924131
- Google Analytics funnel exploration: https://support.google.com/analytics/answer/9327974
- Google Analytics purchase-event setup and reporting delay: https://developers.google.com/analytics/devguides/collection/ga4/set-up-ecommerce

Evidence screenshots and transaction-level records are retained locally. No customer/session conversion rate or real market demand estimate is inferred from controlled transactions.
